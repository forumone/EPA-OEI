angular.module('epaOei').directive('mapsMap', function($mdDialog, $mdMedia, $stateParams) {
  return {
    restrict : 'E',
    templateUrl : 'states/maps/components/map/index.html',
    scope : {
    },
    link : function(scope, element, attrs) {
      scope.baselayer = {
        url : 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        options : {
          attribution : '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }
      };
      
      function parseCenter() {
        var zoom = +$stateParams.zoom,
            lat = +$stateParams.lat,
            lng = +$stateParams.lng;

        if (!(isFinite(zoom) && 1 <= zoom && zoom <= 18)) {
          zoom = 7;
        }

        if (!(isFinite(lat) && isFinite(lng))) {
            lat = 38.2678127;
            lng = -79.2138202;
        }

        return {
          zoom: zoom,
          lat: lat,
          lng: lng,
        };
      }
      
      scope.center = parseCenter();
    },
    controller : function($scope) {
      $scope.editLayer = function(evt) {
        $mdDialog.show({
          controller : 'MapsSelectMap',
          templateUrl : 'states/maps/components/selectMap/index.html',
          parent : angular.element(document.body),
          targetEvent : evt,
          clickOutsideToClose : true,
          fullscreen : $mdMedia('sm'),
          locals : {
            currentLayer : null
          }
        })
        .then(function(layer) {
          $scope.maps.push({ id : 'foo' });
        });
      }
      
      $scope.deleteLayer = function() {
        
      }
    }
  };
});