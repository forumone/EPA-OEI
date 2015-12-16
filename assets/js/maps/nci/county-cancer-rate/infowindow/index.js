angular.module('nciMaps').directive('nciCountyCancerRateInfoWindow', function(defaultOpacity) {
  return {
    templateUrl : 'nci/county-cancer-rate/infowindow/index.html',
    restrict : 'E',
    scope : {
      options : '=?',
      opacity : '=?',
      shortName : '@'
    },
    link : function(scope, element, attrs) {
      if (!angular.isDefined(attrs.opacity)) {
        scope.opacity = defaultOpacity;
      }

      if (!angular.isDefined(attrs.options)) {
        scope.options = {};
      }
    },
    controller : function($scope, nciCountyCancerRateLayer) {
      var active = true;

      $scope.$on('$destroy', function() {
        active = false;
      });

      nciCountyCancerRateLayer.createLayer({
        site : $scope.$eval('options.site'),
        state : $scope.$eval('options.state'),
      }).then(function(info) {
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
          }

          $scope.name = nciCountyCancerRateLayer.getName({
            site : $scope.options.site,
            state : $scope.options.state
          });

          info.setOptions($scope.options);
          info.reset();
        });
      });
    }
  };
});