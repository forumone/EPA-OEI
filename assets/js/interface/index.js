var epaOei = angular.module('epaOei', [ 'ngRoute', 'ui.router', 'ngSanitize', 'leaflet-directive', 'nciMaps' ]);
epaOei.config(function($urlRouterProvider, $locationProvider, $stateProvider) {
  // $locationProvider.html5Mode(true);

  $urlRouterProvider.otherwise('/');

  $stateProvider
    // Home page
    .state('home', {
      url: '/',
      views: {
        '': {
          templateUrl: 'states/home/index.html',
          controller: 'HomeController',
        }
      }
    })
}).run(function ($rootScope) {
  
});
