angular.module('epaOei').controller('MapsController', function($scope, $stateParams, $state, leafletData, $injector, cartoDbLayers, $mdDialog, $mdMedia) {
  $scope.maps = [];
  
  $scope.addMap = function(evt) {
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
  };
});