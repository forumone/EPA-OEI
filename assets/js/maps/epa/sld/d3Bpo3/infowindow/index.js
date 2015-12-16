angular.module('nciMaps').directive('epaSldMapThreeLeggedInfoWindow', function($location) {
  // FIXME copypasta
  function parseOptions() {
    var layers = $location.search().layers || [];
    if (angular.isString(layers)) {
      layers = [layers];
    }
    
    var allOptions = _.map(layers, angular.fromJson);
    var options = _.findWhere(allOptions, { $service: 'epaSldMapD3Bpo3Layer' });
    
    return options ? _.omit(options, '$service') : {};
  }
  
  return {
    templateUrl : 'epa/sld/d3Bpo3/infowindow/index.html',
    restrict : 'E',
    scope : {
      options : '=?',
      opacity : '=?',
      shortName : '@'
    },
    controller: function($scope, epaSldMapD3Bpo3Layer, defaultOpacity) {
      _.defaults($scope, { opacity: defaultOpacity });
      $scope.name = epaSldMapD3Bpo3Layer.getName();
      $scope.options = _.extend($scope.options || {}, parseOptions());

      var active = true;
      $scope.$on('$destroy', function () {
        active = false;
      });

      epaSldMapD3Bpo3Layer.createLayer({})
        .then(function (info) {
          $scope.info = info;
          
          if (!active) {
            info.detach();
            return;
          }
          info.attach();
          
          $scope.$on('$destroy', function () {
            info.detach();
          });
          
          $scope.$watch('opacity', function() {
            info.layer.setOpacity($scope.opacity / 100);
          });
          
          $scope.$watchCollection('options', function() {
            if (!angular.isDefined($scope.options.type)) {
              $scope.options.type = 'compare';
              // force new digest loop
              return;
            }
            info.setOptions($scope.options);
            info.reset();
          });
        });
    },
  };
});