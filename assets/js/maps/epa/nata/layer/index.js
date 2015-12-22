angular.module('nciMaps').service('epaNataLayer', function($templateCache, $interpolate, $q, cartoDbLayers, mapColors, legends, $filter) {
  var template = $interpolate($templateCache.get('epa/nata/infowindow/popup.html'));
  
  function sql(opts) {
    var field = 'r.total_cancer_risk';
    
    // If we're set to compare to national use the AVG, otherwise the raw field
    if ((!angular.isDefined(opts.type) || opts.type == 'compare')) {
      // FIXME: The national average cancer risk is 50 in 1M -- but this should be not be hard-coded here
      field = '(r.total_cancer_risk / 0.00005) AS total_cancer_risk';
    }
    
    return $q.when('SELECT t.*, ' + field + ', r.state, r.county FROM f1cartodb.tl_2014_census_tracts  AS t LEFT OUTER JOIN f1cartodb.nata_cancer_risks_2005 AS r ON t.geoid = r.fips || r.tract ');
  }
  
  function css(opts) {
    return cartoDbLayers.getBins(service, opts, 5)
      .then(function(results) {
        var binColors = results.colors;

        var colors = _.chain(results.counts)
          .reverse()
          .map(function(count, idx) {
            return '#nata_cancer_risks [ total_cancer_risk <= ' + count + '] { polygon-fill: ' + binColors[idx] + '; }';
          })
          .join("\n")
          .value();
        
        return $templateCache.get('epa/nata/layer/styles.css') + "\n" + colors;
      });
  }
  
  function formatValue(val, opts) {
    return ('compare' == opts.type) ? $filter('number')((val * 100), 2) + '%' : $filter('number')((val * 100), 6) + '%';
  }
  
  function getName(opts) {
    var name = 'Total Cancer Risk';
    
    if (opts && 'compare' == opts.type) {
      name += ' (compared to national average)';
    }
    return name;
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
            data.hasData = angular.isDefined(data.total_cancer_risk);
            data.value = (data.hasData) ? formatValue(data.total_cancer_risk, options) : 'No data available';
            data.location = (data.hasData) ? data.county + ", " + data.state : '';
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
    serviceName : 'epaNataLayer',
    scaleType : 'seq',
    interactivity : [ 'total_cancer_risk', 'county', 'state' ],
    geometry : 't.the_geom',
    legendType : legends.CHOROPLETH,
    formatValue : formatValue,
    
    sql: sql,
    css: css,
    createLayer: createLayer,
    getName : getName
  };
  
  return service;
});
