angular.module('nciMaps').directive('cdcWonderCanderIncidenceState', function(defaultOpacity) {
  return {
    templateUrl : 'cdcWonder/cancerIncidenceState/infowindow/index.html',
    restrict : 'E',
    scope : {
      options : '=',
      opacity : '=?',
      shortName : '@'
    },
    link : function(scope, element, attrs) {
      if (!angular.isDefined(attrs.opacity)) {
        scope.opacity = defaultOpacity;
      }
    },
    controller : function($scope, cdcWonderCancerIncidenceState) {
      var active = true;
      $scope.name = cdcWonderCancerIncidenceState.getName();
      
      $scope.$on('$destroy', function () {
        active = false;
      });

      cdcWonderCancerIncidenceState
        .createLayer({
          site: $scope.$eval('options.site')
        })
        .then(function (info) {
          if (!active) {
            info.detach();
            return;
          }
          
          info.attach();

          $scope.$on('$destroy', function() {
            info.detach();
          });

          $scope.$watch('opacity', function () {
            info.layer.setOpacity($scope.opacity / 100);
          });
        });
    }
  };

});