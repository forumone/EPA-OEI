angular.module('nciMaps').service('epaSldMapRpctLowWaLayer', function($templateCache, $interpolate, $q, cartoDbLayers, mapColors, legends, $filter) {
  var template = $interpolate($templateCache.get('epa/sld/rPctLowWa/infowindow/popup.html'));
  
  function sql(opts) {
    var request = new cartodb.SQL({ user: 'f1cartodb' });
    
    // Get the AVG r_pctlowwa from EPA SLD
    return $q(function (resolve, reject) {
      request.execute('SELECT avg(r_pctlowwa) FROM f1cartodb.smartlocationdb')
        .done(resolve)
        .error(reject);
    }).then(function(result) {
      var field = 'v.r_pctlowwa';
      
      // If we're set to compare to national use the AVG, otherwise the raw field
      if (1 == result.rows.length && (!angular.isDefined(opts.type) || opts.type == 'compare')) {
        var row = result.rows.pop();
        field = '(v.r_pctlowwa / ' + row.avg + ') AS r_pctlowwa';
      }
      
      var sql = "SELECT t.*, v.d1b, v.d3b, v.d2b_e5mixa, " + field + ", v.cbsa_name, c.name AS county_name, s.name AS state_name, (c.name || ', ' || s.postal) AS name FROM f1cartodb.tl_2014_block_groups AS t INNER JOIN f1cartodb.smartlocationdb AS v ON t.geoid::bigint = v.geoid10 INNER JOIN f1cartodb.ne_50m_admin_1_states AS s ON right(code_local, 2)::int = v.sfips LEFT OUTER JOIN cb_2013_us_county_500k AS c ON c.statefp = t.statefp AND c.countyfp = t.countyfp";
      
      if (_.has(opts, 'min') && isFinite(opts.min)) {
        sql += ' WHERE v.r_pctlowwa >= ' + Number(opts.min);
      }
      
      return sql;
    });
  }
  
  function css(opts) {
    return cartoDbLayers.getBins(service, opts, 5)
      .then(function(results) {
        var binColors = results.colors,
            colors = _.chain(results.counts)
          .reverse()
          .map(function(count, idx) {
            return '#tl_2014_census_tracts [ r_pctlowwa <= ' + count + '] { polygon-fill: ' + binColors[idx] + '; }';
          })
          .join("\n")
          .value();
  
        return $templateCache.get('epa/sld/rPctLowWa/layer/styles.css') + "\n" + colors;
      });
  }
  
  function formatValue(val, opts) {
    return $filter('number')((val * 100), 2) + '%';
  }
  
  function getName(opts) {
    var name = 'Percent of Low Wage Workers';
    
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
            data.value = formatValue(data.r_pctlowwa, options);
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
    serviceName : 'epaSldMapRpctLowWaLayer',
    scaleType : 'seq',
    interactivity : [ 'r_pctlowwa', 'name' ],
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
