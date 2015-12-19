angular.module('epaOei').directive('mapsMap', function($mdDialog, $mdMedia) {
  return {
    restrict : 'E',
    templateUrl : 'states/maps/components/map/index.html',
    scope : {
    },
    link : function(scope, element, attrs) {
      
    },
    controller : function($scope) {
      $scope.editLayer = function(evt) {
        $mdDialog.show({
          controller : 'MapsSelectMap',
          templateUrl : 'states/maps/components/selectMap/index.html',
          parent : angular.element(document.body),
          targetEvent : evt,
          clickOutsideToClose : true,
          fullscreen : $mdMedia('sm'),
          locals : {
            currentLayer : null
          }
        })
        .then(function(layer) {
          $scope.maps.push({ id : 'foo' });
        });
      }
      
      $scope.deleteLayer = function() {
        
      }
    }
  };
});