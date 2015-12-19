angular.module('epaOei').controller('MapsController', function($scope, $stateParams, $state, leafletData, $injector, cartoDbLayers) {
  $scope.maps = [];
  
  $scope.addMap = function() {
    console.log('foo');
    
    
    $scope.maps.push({ id : 'foo' });
  }
});