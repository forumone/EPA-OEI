angular.module('nciMaps').service('cartoDbLayers', function($injector, $q, mapColors, $rootScope, $exceptionHandler, legends, cancerScore) {
  var layerCount = 0,
      popupInfo = [],
      showPopup = _.throttle(popup, 125, { leading: false }),
      map = null,
      markers = [];

  function popup() {
    var point = popupInfo[0][2];
    var currentMap = popupInfo[0][6];

    var promises = _.map(popupInfo, _.spread(function(info, event, latlng, pos, data, index) {
      return info.pointInfo(latlng, data);
    }));
    
    var markup = "";
    
    $q.all(promises).then(function(results) {
      markup = results.join('<hr />');
      currentMap.openPopup(markup, point);
      
    }).finally(function() {
      popupInfo = [];
    });
  }

  /**
   * Wraps a promise from the CartoDB api
   */
  function wrap(cartoPromise) {
    return $q(function (resolve, reject) {
      cartoPromise
        .done(resolve)
        .error(reject);
    });
  }

  function query(sql) {
    var request = new cartodb.SQL({ user: 'f1cartodb' });
    return wrap(request.execute(query));
  }
  
  /**
   * Creates the layer / sublayer from CartoDB
   */
  function createLayer(name, opts, currentMap) {
    currentMap = currentMap || map;
    
    var service = $injector.get(name),
        sublayer = {
          sql: service.sql(opts),
          cartocss: service.css(opts),
          interactivity: service.interactivity,
        };

    return $q.all(sublayer)
      .then(function (sublayer) {
        // create carto layer
        var promise = cartodb.createLayer(currentMap, {
          user_name: 'f1cartodb',
          type: 'cartodb',
          legends: true,
          sublayers: [sublayer],
        });
        
        return wrap(promise);
      })
      .then(function (layer) {
        // create layer info object by adding a legend
        return $q.all({
          name: name,
          layer: layer,
          service: service,
          legend: makeLegend(service, opts),
        })
      })
      .then(
        function (info) {
          currentMap.addLayer(info.layer);

          info.layer.setInteraction(true);
          info.layer.setOpacity(0.5);
          info.layer.on('featureClick', function () {
            var popup = [info].concat(_.toArray(arguments), [currentMap]);
            
            popupInfo.push(popup);
            showPopup();
          });
          
          return info;
        },
        $exceptionHandler
      );
  }

  function getAggregates(service, opts, aggregate) {
    var request = new cartodb.SQL({ user: 'f1cartodb' }),
      field = service.interactivity[0];
    
    return service.sql(opts)
    .then(function (q) {
      var query = 'select ' + aggregate + '(distinct((' + field + '::numeric))) as buckets from (' + q + ') _table_sql where ' + field + ' is not null';
      return wrap(request.execute(query));
    })
  }
  
  /**
   * Returns the quantized bins
   */
  function getBins(service, opts, bins) {
    var request = new cartodb.SQL({ user: 'f1cartodb' }),
        field = service.interactivity[0];

    return service.sql(opts)
      .then(function (q) {
        var query = 'select unnest(CDB_QuantileBins(array_agg(distinct((' + field + '::numeric))), ' + bins + ')) as buckets from (' + q + ') _table_sql where ' + field + ' is not null';
        return wrap(request.execute(query))
      })
      .then(function (results) {
        var counts = _.chain(results.rows)
                      .pluck('buckets')
                      .uniq()
                      .value(),
            colors = opts.$$colors[Math.max(3, counts.length)];

        return {
          counts: counts,
          colors: _.clone(colors).reverse(),
        };
      });
  }

  /**
   * Creates a bubble legend
   */
  function makeBubbleLegend(service, results, opts) {
    return new cdb.geo.ui.Legend.Bubble({
      title: service.getName(opts),
      min: _.min(results.counts), max: _.max(results.counts), color: "#FF5C00"
    });
  }
  
  /**
   * Creates a choropleth legend
   */
  function makeChoroplethLegend(service, results, opts) {
    var colors = _.take(results.colors, results.counts.length).reverse();

    return new cdb.geo.ui.Legend.Choropleth({
      title: service.getName(opts),
      left: '< ' + service.formatValue(_.min(results.counts), opts),
      right: service.formatValue(_.max(results.counts), opts),
      colors: colors,
    });
  }
  /**
   * Creates a legend
   */
  function makeLegend(service, opts) {
    return getBins(service, opts, 5)
      .then(function (results) {
        switch (service.legendType) {
          case legends.BUBBLE :
            return makeBubbleLegend(service, results, opts);
            break;
            
          default :
            return makeChoroplethLegend(service, results, opts);
            break;
        }
      });
  }

  /**
   * Shows a layer then triggers the layerAdded event
   */
  function showLayer(info) {
    if (!info.active) {
      info.layer.show();
      info.active = true;
      $rootScope.$broadcast('layerAdded', info);
    }
  }

  /**
   * Remove a layer then triggers the layerRemoved event
   */
  function hideLayer(info, currentMap) {
    currentMap.removeLayer(info.layer);

    if (info.active) {
      info.active = false;
      $rootScope.$broadcast('layerRemoved', info);
    }

    info.layer.remove();
  }
  
  function updateLayer(info) {
    if (info.active) {
      $rootScope.$broadcast('layerUpdated', info);
    }
  }
  
  /**
   * Sets the Leaflet map
   */
  function setMap(m) {
    map = m;
    
    if (0 < markers.length) {
      angular.forEach(markers, function(marker) {
        marker.addTo(map);
      });
    }
  } 
  
  /**
   * Returns the Leaflet map
   */
  function getMap() {
    return map;
  }
  
  /**
   * Zooms to a location on the map
   */
  function zoomTo(lat, lng) {
    var latLng = L.latLng(lat, lng);
    
    // center the map
    map.panTo(latLng);
    map.setZoom(16);
  }
  
  /**
   * Fits the map to the boundary
   */
  function fitBounds(bounds) {
    map.fitBounds(bounds);
  }

  /**
   * Adds a point to the map
   */
  function addPoint(lat, lng, title) {
    var latLng = L.latLng(lat, lng);
    
    var marker = L.marker(latLng, {
      'title': title
    });
    
    markers.push(marker);
    
    if (map) {
      marker.addTo(map);
    }
  }
  
  function removePoint(marker) {
    if (map) {
      map.removeLayer(marker);
    }
    
    _.pull(markers, marker);
  }
  
  function getGeocodeResultData(place) {
    var zoom = 16;
    var lat = 0;
    var lng = 0;
    
    if (angular.isDefined(place.geometry.viewport)) {
      var viewport = place.geometry.viewport;
      var coordsNE = viewport.getNorthEast();
      var coordsSW = viewport.getSouthWest();
      lng = ((coordsNE.lng() - coordsSW.lng()) / 2) + coordsSW.lng();
      lat = ((coordsNE.lat() - coordsSW.lat()) / 2) + coordsSW.lat();
      zoom = map.getBoundsZoom([ [ coordsSW.lat(), coordsSW.lng() ], [ coordsNE.lat(), coordsNE.lng() ] ]);
    }
    else {
      lat = place.geometry.location.lat();
      lng = place.geometry.location.lng();
    }
    
    return {
      lat : lat,
      lng : lng,
      zoom : zoom
    };
  }
  
  return {
    getBins: getBins,
    getAggregates : getAggregates,
    query : query,
    setMap : setMap,
    getMap : getMap,
    createLayer : createLayer,
    showLayer : showLayer,
    hideLayer : hideLayer,
    updateLayer : updateLayer,
    makeLegend : makeLegend,
    zoomTo : zoomTo,
    addPoint : addPoint,
    removePoint : removePoint,
    fitBounds : fitBounds,
    getGeocodeResultData : getGeocodeResultData,
    markers : markers
  };
});
