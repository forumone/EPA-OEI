angular.module('epaOei').controller('HomeController', function($scope, $stateParams, $state, mapLayers) {
  $scope.showMap = function() {
    var layers = mapLayers.getLayers();
    
    params = {
      zoom : 16,
      layers : [angular.toJson(layers.trinet), angular.toJson(layers.nata)],
    };
    
    $state.go('maps', params, {
      location: true,
    });
  };
});