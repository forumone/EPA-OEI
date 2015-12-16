angular.module('nciMaps').service('hsaAccessToCareLayer', function($templateCache, $interpolate, $q, cartoDbLayers, mapColors, legends, $filter) {
  var template = $interpolate($templateCache.get('hsa/access-to-care/infowindow/popup.html'));

  function sql(opts) {
    var request = new cartodb.SQL({ user: 'f1cartodb' });
    
    // Get the AVG total_physicians_per_100_000_residents_2011 from HSA data
    return $q(function (resolve, reject) {
      request.execute('SELECT avg(total_physicians_per_100_000_residents_2011) FROM f1cartodb.table_2011_phys_hsa')
        .done(resolve)
        .error(reject);
    }).then(function(result) {
      var field = 'hsd.total_physicians_per_100_000_residents_2011';
      
      // If we're set to compare to national use the AVG, otherwise the raw field
      if (1 == result.rows.length && (!angular.isDefined(opts.type) || opts.type == 'compare')) {
        var row = result.rows.pop();
        field = '(hsd.total_physicians_per_100_000_residents_2011 / ' + row.avg + ') AS total_physicians_per_100_000_residents_2011';
      }
      
      var sql = 'SELECT hs.*, ' + field + ', hsd.hsa_city FROM hsa_boundaries_2011 AS hs LEFT OUTER JOIN table_2011_phys_hsa AS hsd ON hsd.hsa__ = hs.hsa93';
      
      if (_.has(opts, 'min') && isFinite(opts.min)) {
        sql += ' WHERE hsd.total_physicians_per_100_000_residents_2011 >= ' + Number(opts.min);
      }
      
      return sql;
    });
  }
  
  function css(opts) {
    return cartoDbLayers.getBins(service, opts, 5).then(function(results) {
      var binColors = results.colors;

      var colors = _.chain(results.counts)
        .reverse()
        .map(function(count, idx) {
          return '#table_2011_phys_hsa [ total_physicians_per_100_000_residents_2011 <= ' + count + '] { polygon-fill: ' + binColors[idx] + '; }';
        })
        .join("\n")
        .value();
      
      return $templateCache.get('hsa/access-to-care/layer/styles.css') + "\n" + colors;
    });
  }
  
  function formatValue(val, opts) {
    return ('compare' == opts.type) ? $filter('number')((val * 100), 2) + '%' : $filter('number')(val, 2);
  }
  
  function getName(opts) {
    var name = 'Physicians per capita';
    
    if (opts && 'compare' == opts.type) {
      name += ' (compared to national average)';
    }
    
    return name;
  }
  
  function createLayer(opts) {
    var colors = mapColors.allocate(service.scaleType),
        options = _.extend({}, opts, {
          $$colors: colors,
        });
    
    return cartoDbLayers.createLayer(service.serviceName, options)
      .then(function (info) {
        info = _.extend(info, {
          setOptions: function (opts) {
            _.extend(options, opts);
          },
          attach: function () {
            cartoDbLayers.showLayer(info);
          },
          detach: function () {
            cartoDbLayers.hideLayer(info);
            colors.release();
          },
          pointInfo: function (latlng, data) {
            data.value = formatValue(data.total_physicians_per_100_000_residents_2011, options);
            data.location = data.first_hsaname;
            data.title = getName(options);
            
            return template(data);
          },
          toJSON: function () {
            return options;
          },
          reset: function () {
            $q.all({
              sql: sql(options),
              cartocss: css(options),
              interactivity : service.interactivity
            }).then(function(result) {
              info.layer.getSubLayer(0).set(result);
              return cartoDbLayers.makeLegend(service, options);
            }).then(function(legend) {
              info.legend = legend;
              cartoDbLayers.updateLayer(info);
            });
          }
        });
        cartoDbLayers.showLayer(info);
        return info;
      });
  }

  var service = {
    serviceName : 'hsaAccessToCareLayer',
    scaleType : 'seq',
    interactivity : [ 'total_physicians_per_100_000_residents_2011', 'first_hsaname' ],
    geometry : 'hs.the_geom',
    legendType : legends.CHOROPLETH,
    formatValue : formatValue, 
    
    sql: sql,
    css: css,
    createLayer: createLayer,
    getName : getName
  };
  
  return service;
});
