var epaOei = angular.module('epaOei', [ 'ngRoute', 'ngMaterial', 'ui.router', 'ngSanitize', 'leaflet-directive', 'nciMaps', 'ngMdIcons' ]);
epaOei.config(function($urlRouterProvider, $locationProvider, $stateProvider, $mdThemingProvider) {
  $mdThemingProvider.theme('default').primaryPalette('indigo').accentPalette('light-blue');
  
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
    .state('maps', {
      url: '/maps',
      templateUrl : 'states/maps/index.html',
      controller : 'MapsController',
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
          value : 2
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
          value : 1
        }
      }
    });
})
.run(function($rootScope, $state) {
  $rootScope.goState = function(state) {
    console.log($state);
    //$state.go(state);
  }
});
