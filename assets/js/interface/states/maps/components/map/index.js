angular.module('epaOei').directive('mapsMap', function($mdDialog, $mdMedia, $stateParams, $injector, mapLayers, $q, $exceptionHandler, mapColors, leafletData, cartoDbLayers, $sce, locationData) {
  return {
    restrict : 'E',
    templateUrl : 'states/maps/components/map/index.html',
    scope : {
      map : '='
    },
    link : function(scope, element, attrs) {
      function wrap(cartoPromise) {
        return $q(function (resolve, reject) {
          cartoPromise
            .done(resolve)
            .error(reject);
        });
      }
      
      scope.layers = mapLayers.getLayers();
      scope.$watch('map', function() {
        if (angular.isDefined(scope.map)) {
          scope.layerData = scope.layers[scope.map.layer];
          scope.service = $injector.get(scope.layerData.$service);
          
          scope.mapOptions = {
            zoom : $stateParams.zoom,
            center : [$stateParams.lat, $stateParams.lng]
          };
              
          scope.name = scope.service.getName(scope.layerData);
          
          var promise = angular.isDefined(scope.leafletMap) ? $q.when(scope.leafletMap) : wrap(cartodb.createVis($('div.map__map', element[0]), 'https://forumone.cartodb.com/u/f1cartodb/api/v2/viz/ada5f74c-a7f7-11e5-b776-0e5db1731f59/viz.json', scope.mapOptions));
          
          promise
          .then(function(cartoMap) {
            scope.leafletMap = cartoMap;
            
            scope.service.createLayer(scope.layerData, scope.leafletMap.getNativeMap())
            .then(function(info) {
              scope.info = info;
              var content = new cdb.geo.ui.Legend
                .Stacked({
                  legends: [info.legend],
                })
                .render()
                .$el
                .wrap('<div>')
                .parent()
                .html();
              
              scope.legend = $sce.trustAsHtml(content);
            });
          })
        }
      });
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
            currentLayer : $scope.map.layer
          }
        })
        .then(function(layer) {
          $scope.info.detach();
          $scope.map = _.clone(_.extend($scope.map, { layer : layer }));
        });
      }
      
      $scope.deleteLayer = function() {
        $scope.info.detach();
        $scope.$emit('deleteMap', $scope.map);
      }
      
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
      
      $scope.center = parseCenter();
    }
  };
});