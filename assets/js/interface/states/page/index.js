angular.module('epaOei').controller('PageController', function ($scope, $stateParams) {
  $scope.uri = '/api/content/' + $stateParams.page;
});