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
    .state('about', {
      url : '/about',
      templateUrl : 'states/page/index.html',
      controller : 'PageController',
      params : {
        page : {
          value : 'about'
        },
        tabIndex : {
          value : 1
        }
      }
    })
    .state('data', {
      url : '/data',
      templateUrl : 'states/page/index.html',
      controller : 'PageController',
      params : {
        page : {
          value : 'data'
        },
        tabIndex : {
          value : 2
        }
      }
    });
});
