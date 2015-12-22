angular.module('nciMaps').service('cdcWonderCancerIncidenceState', function($templateCache, $interpolate, $q, cartoDbLayers, mapColors, legends, $filter) {
  var template = $interpolate($templateCache.get('cdcWonder/cancerIncidenceState/infowindow/popup.html'));
 
  function sql(opts) {
    var site = opts.site || '0';
    return $q.when("SELECT s.*, c.age_adjusted_rate, c.cancer_sites, c.count, c.age_adjusted_rate_standard_error FROM f1cartodb.ne_50m_admin_1_states AS s INNER JOIN f1cartodb.cdc_cancer_incidence_state AS c ON c.state = s.name WHERE c.cancer_sites_code = '" + site + "'");
  }
  
  function getBins(opts, bins) {
    return cartoDbLayers.getBins(service, opts, bins); 
  }
  
  function getAggregates(opts, aggregate) {
    return cartoDbLayers.getAggregates(service, opts, aggregate);
  }
  
  function css(opts) {
    return getBins(opts, 5)
      .then(function(results) {
        var binColors = results.colors;

        var colors = _.chain(results.counts)
          .reverse()
          .map(function(count, idx) {
            return '#cdc_cancer_incidence_state [ age_adjusted_rate <= ' + count + '] { polygon-fill: ' + binColors[idx] + '; }';
          })
          .join("\n")
          .value();
        
        return $templateCache.get('cdcWonder/cancerIncidenceState/layer/styles.css') + "\n" + colors;
      });
  }
  
  function formatValue(val) {
    return val;
  }
  
  function getName(opts) {
    return 'Cancer Incidence';
  }
 
  function createLayer(opts, map) {
    var colors = mapColors.allocate(service.scaleType),
        options = _.extend({}, opts, {
          $$colors: colors,
        });

    return cartoDbLayers.createLayer(service.serviceName, options, map)
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
            return template(data);
          },
        });
        cartoDbLayers.showLayer(info);
        return info;
      });
  }

  var service = {
    serviceName : 'cdcWonderCancerIncidenceState',
    scaleType : 'seq',
    interactivity : [ 'age_adjusted_rate' ],
    geometry : 's.the_geom',
    legendType : legends.CHOROPLETH,
    formatValue : formatValue,
    
    sql: sql,
    css: css,
    createLayer: createLayer,
    getName : getName
  };
  
  return service;
});
