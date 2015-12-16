angular.module('nciMaps').service('locationData', function($location, $injector, $rootScope) {
  var mapping = {
    nciCountyCancerRateLayer : function(opts) {
      return 'county-cancer-rate-' + (opts.site || 'all_b_all');
    },
    epaSldMapD3Bpo3Layer : _.constant('d3bpo3'),
    epaSldMapRpctLowWaLayer : _.constant('rpctlow'),
    epaNataLayer : _.constant('nata'),
    epaTrinetLayer : _.constant('trinet'),
    hsaAccessToCareLayer : _.constant('access-to-care'),
  };

  function readLayers() {
    var layers = $location.search().layers;

    if (angular.isString(layers)) {
      layers = [ layers ];
    }

    layers = _.map(layers || [], function(str) {
      var opts = angular.fromJson(str), service = opts.$service;
      opts = _.omit(opts, '$service');

      return mapping[service](opts);
    });

    return layers;
  }

  function readServices() {
    var layers = $location.search().layers;

    if (angular.isString(layers)) {
      layers = [ layers ];
    }

    layers = _.map(layers || [], function(str) {
      var opts = angular.fromJson(str), service = opts.$service;
      opts = _.omit(opts, '$service');

      return {
        service : $injector.get(service),
        opts : opts
      };
    });

    return layers;
  }

  var layers = readLayers();
  var services = readServices();

  function toggleLayer(name) {
    var idx = _.indexOf(layers, name);

    if (-1 !== idx) {
      _.pullAt(layers, idx);
    } else {
      layers.push(name);
    }
  }
  
  return {
    layers : layers,
    services : services,
    toggleLayer : toggleLayer,
    readServices : readServices
  }
});