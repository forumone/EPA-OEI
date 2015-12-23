angular.module('epaOei').controller('HomeController', function($scope, $stateParams, $state, mapLayers) {
  $scope.place;
  
  $scope.$watch('place', function(newValue) {
    $scope.addressSelected = angular.isDefined(newValue);
  });
  
  $scope.showMap = function() {
    var layers = mapLayers.getLayers();
    
    params = {
      zoom : 10,
      layers : [angular.toJson(layers.trinet), angular.toJson(layers.nata)],
    };
    
    if ($scope.place && $scope.place.geometry.location) {
      var latlng = $scope.place.geometry.location;
      params.lat = latlng.lat();
      params.lng = latlng.lng();
      params.f = $scope.place.formatted_address;
    }
    
    console.log(params);
    
    $state.go('maps', params, {
      location: true,
    });
  };
});