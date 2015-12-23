angular.module('epaOei').controller('MapsSelectMap', function($scope, $mdDialog, currentLayer) {
  $scope.currentLayer = currentLayer;
  
  $scope.setLayer = function() {
    $mdDialog.hide($scope.currentLayer);
  }
  
  $scope.cancel = function() {
    $mdDialog.cancel();
  }
});