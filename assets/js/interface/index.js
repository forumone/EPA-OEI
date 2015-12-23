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
      url : '/maps?zoom&lat&lng&layers&f',
      reloadOnSearch: false,
      templateUrl : 'states/maps/index.html',
      controller : 'MapsController',
      params: {
        lat: {
          value: '38.2678127',
        },
        lng: {
          value: '-79.2138202',
        },
        zoom: {
          value: '7',
        },
        layers: {
          array : true,
          value: []
        },
        f: {
          value: ''
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
          value : 0
        }
      }
    });
})
.run(function($rootScope, $state, $stateParams) {
  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    $rootScope.selectedTab = (_.has(toState.params, 'tabIndex')) ? toState.params.tabIndex.value : -1;
  });
  
  $rootScope.goState = function(state) {
    $state.go(state);
  }
});
