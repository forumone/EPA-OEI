angular.module('nciMaps').service('nciCountyCancerRateLayer', function($templateCache, $interpolate, $q, cartoDbLayers, mapColors, legends, $filter) {
  var template = $interpolate($templateCache.get('nci/county-cancer-rate/infowindow/popup.html'));
  var layerNames = {
    all_b_all : 'Cancer Rate: All cancers',
    bla_b_all : 'Cancer Rate: Bladder cancer',
    brs_f_all : 'Cancer Rate: Breast cancer',
    col_b_all : 'Cancer Rate: Colon and rectal cancer',
    ute_f_all : 'Cancer Rate: Endometrial cancer',
    krp_b_all : 'Cancer Rate: Kidney cancer',
    leu_b_all : 'Cancer Rate: Leukemia (all types)',
    lng_b_all : 'Cancer Rate: Lung cancer',
    mel_b_all : 'Cancer Rate: Melanoma',
    nhl_b_all : 'Cancer Rate: Non-Hodgkin\'s lymphoma',
    c19_b_all : 'Cancer Rate: Pancreatic cancer',
    pro_m_all : 'Cancer Rate: Prostate cancer',
    thy_b_all : 'Cancer Rate: Thyroid cancer'
  };
  
  function sql(opts) {
    var site = opts.site || 'all_b_all',
        state = opts.state || '0';

    var request = new cartodb.SQL({ user: 'f1cartodb' });
    
    // Get the age adjusted cancer rate
    return $q(function (resolve, reject) {
      request.execute("SELECT age_adjusted_rate FROM f1cartodb.us_cancer_incidence WHERE cancer_sites_code = '" + state + "'")
        .done(resolve)
        .error(reject);
    }).then(function(result) {
      var field = 'n.' + site;
      var divisor = 1;
      
      // If we're set to compare to national use the age adjusted rate, otherwise the raw field
      if (1 == result.rows.length && (!angular.isDefined(opts.type) || opts.type == 'compare')) {
        var row = result.rows.pop();
        divisor = row.age_adjusted_rate;
        
        field = '(n.' + site + ' / ' + divisor + ')'
      }
      
      var sql = "SELECT c.*, " + field + " AS " + site + ", n.cntystatename, s.age_adjusted_rate, (coalesce(n." + site + ", s.age_adjusted_rate) / " + divisor + ") AS overall_rate FROM cb_2013_us_county_500k AS c LEFT OUTER JOIN f1cartodb.nci_county AS n ON c.countyfp = n.countyfp AND c.statefp = n.statefips LEFT OUTER JOIN f1cartodb.cdc_cancer_incidence_state AS s ON c.statefp::int = s.state_code AND s.cancer_sites_code = '" + state + "'";
      return sql;
    });
  }
  
  function css(opts) {
    return cartoDbLayers.getBins(service, opts, 5)
      .then(function(results) {
        var binColors = results.colors;
  
        var colors = _.chain(results.counts)
          .reverse()
          .map(function(count, idx) {
            return '#nci_county [ overall_rate <= ' + count + '] { polygon-fill: ' + binColors[idx] + '; }';
          })
          .join("\n")
          .value();
        
        return $templateCache.get('nci/county-cancer-rate/layer/styles.css') + "\n" + colors;
      });
  }
  
  function formatValue(val, opts) {
    return ('compare' == opts.type) ? $filter('number')((val * 100), 2) + '%' : $filter('number')(val, 2);
  }
  
  function getName(opts) {
    opts = opts || {};
    var site = opts.site || 'all_b_all';
    
    var name = _.has(layerNames, site) ? layerNames[site] : 'Cancer Rate';
    
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
            data.value = formatValue(data.overall_rate, options);
            data.location = data.cntystatename;
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
    serviceName : 'nciCountyCancerRateLayer',
    scaleType : 'seq',
    interactivity : [ 'overall_rate', 'cntystatename' ],
    geometry : 'c.the_geom',
    legendType : legends.CHOROPLETH,
    formatValue : formatValue,

    sql: sql,
    css: css,
    createLayer: createLayer,
    getName : getName
  };
  
  return service;
});
