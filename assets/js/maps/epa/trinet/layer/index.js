angular.module('nciMaps').service('epaTrinetLayer', function($templateCache, $interpolate, $q, cartoDbLayers, mapColors, legends, $filter) {
  var template = $interpolate($templateCache.get('epa/trinet/infowindow/popup.html'));
  
  function sql(opts) {
    return $q.when('SELECT tif.trif_id, tif.name, tif.address, tif.city, tif.county, tif.state, tif.state_postal_code, tif.zip, tif.fips, tif.tract, tif.latitude, tif.longitude, tif.the_geom_webmercator, tif.cartodb_id,  SUM(tie.total_on_site_releases_toxicity_x_pounds) AS total_on_site_releases_toxicity_x_pounds, SUM(tie.total_on_site_releases) AS total_on_site_releases FROM f1cartodb.tri_net_emissions_2013 AS tie INNER JOIN f1cartodb.tri_net_facilities_2013 AS tif ON tif.trif_id = tie.trif_id GROUP BY tif.trif_id, tif.name, tif.address, tif.city, tif.county, tif.state, tif.state_postal_code, tif.zip, tif.fips, tif.tract, tif.latitude, tif.longitude, tif.the_geom_webmercator, tif.cartodb_id');
  }
  
  function css(opts) {
    return cartoDbLayers.getBins(service, opts, 5)
      .then(function(results) {
        var colors = _.chain(results.counts)
          .reverse()
          .map(function(count, idx) {
            return '#tri_net_emissions_2013 [ total_on_site_releases_toxicity_x_pounds <= ' + count + '] { marker-width: ' + (25 - (idx * 3)) + '; }';
          })
          .join("\n")
          .value();
        
        return $templateCache.get('epa/trinet/layer/styles.css') + "\n" + colors;
      });
  }
  
  function formatValue(val) {
    return val;
  }
  
  function getName(opts) {
    return 'Toxic release inventory';
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
          toJSON: function () {
            return options;
          },
          pointInfo: function (latlng, data) {
            data.title = getName(options);
            data.value = formatValue(data.total_on_site_releases_toxicity_x_pounds);
            data.location = data.name + ", " + data.county;
            
            return template(data);
          },
        });
        cartoDbLayers.showLayer(info);
        return info;
      });
  }

  var service = {
    serviceName : 'epaTrinetLayer',
    scaleType : 'seq',
    interactivity : [ 'total_on_site_releases_toxicity_x_pounds', 'name', 'county' ],
    geometry : 'tif.the_geom',
    legendType : legends.BUBBLE,
    formatValue : formatValue,
    
    sql: sql,
    css: css,
    createLayer: createLayer,
    getName : getName
  }
  
  return service;
});
