angular.module('nciMaps').directive('epaTrinetInfoWindow', function() {
  return {
    templateUrl : 'epa/trinet/infowindow/index.html',
    restrict : 'E',
    scope : {
      options : '=?',
      opactiy : '=?',
      shortName : '@'
    },
    controller : function($scope, epaTrinetLayer) {
      $scope.name = epaTrinetLayer.getName();
      
      var active = true;
      $scope.$on('$destroy', function () {
        active = false;
      });
      
      epaTrinetLayer.createLayer({}).then(function (info) {
        if (!active) {
          info.detach();
          return;
        }
        info.attach();
        
        $scope.$on('$destroy', function() {
          info.detach();
        });
      })
    }
  }

});