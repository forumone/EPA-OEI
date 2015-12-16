angular.module('nciMaps').directive('epaNataInfoWindow', function(defaultOpacity, $location) {
  // FIXME copypasta
  function parseOptions() {
    var layers = $location.search().layers || [];
    if (angular.isString(layers)) {
      layers = [layers];
    }
    
    var allOptions = _.map(layers, angular.fromJson);
    var options = _.findWhere(allOptions, { $service: 'epaNataLayer' });
    
    return options ? _.omit(options, '$service') : {};
  }
  
  return {
    templateUrl : 'epa/nata/infowindow/index.html',
    restrict : 'E',
    scope : {
      options : '=?',
      opacity : '=?',
      shortName : '@'
    },
    controller: function($scope, epaNataLayer, defaultOpacity) {
      var active = true;
      
      _.defaults($scope, { opacity: defaultOpacity });
      $scope.options = _.extend($scope.options || {}, parseOptions());
      $scope.name = epaNataLayer.getName();
      
      $scope.$on('$destroy', function () {
        active = false;
      });

      epaNataLayer.createLayer({}).then(function (info) {
        if (!active) {
          info.detach();
          return;
        }

        info.attach();

        $scope.$on('$destroy', function() {
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
    }
  }

});