angular.module('epaOei').controller('MapsSelectMap', function($scope, $mdDialog, currentLayer) {
  $scope.setLayer = function() {
    $mdDialog.hide($scope.layer);
  }
  
  $scope.cancel = function() {
    $mdDialog.cancel();
  }
});