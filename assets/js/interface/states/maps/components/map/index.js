angular.module('epaOei').directive('mapsMap', function($mdDialog, $mdMedia, $stateParams, $injector, mapLayers, $q, $exceptionHandler, mapColors, leafletData, cartoDbLayers) {
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
          
          scope.colors = mapColors.allocate(scope.service.scaleType),
          scope.options = _.extend(scope.layerData, {
            $$colors: scope.colors,
          });

          scope.name = scope.service.getName(scope.options);
          
          scope.sublayer = {
            sql: scope.service.sql(scope.options),
            cartocss: scope.service.css(scope.options),
            interactivity: scope.service.interactivity,
          };
          
          scope.mapOptions = {
            zoom : $stateParams.zoom,
            center : [$stateParams.lat, $stateParams.lng]
          };
          
          wrap(cartodb.createVis($('div.map__map', element[0]), 'https://forumone.cartodb.com/u/f1cartodb/api/v2/viz/ada5f74c-a7f7-11e5-b776-0e5db1731f59/viz.json', scope.mapOptions))
          .then(function(cartoMap) {
            scope.leafletMap = cartoMap;
            
            return $q.all(scope.sublayer)
          })
          .then(function (sublayer) {
            var promise = cartodb.createLayer(scope.leafletMap.getNativeMap(), {
              user_name: 'f1cartodb',
              type: 'cartodb',
              legends: true,
              sublayers: [sublayer],
            });
            
            return wrap(promise);
          })
          .then(function(layer) {
            return $q.all({
              name: scope.name,
              layer: layer,
              service: scope.service,
              legend: cartoDbLayers.makeLegend(scope.service, scope.options),
            })
          })
          .then(function(info) {
            scope.leafletMap.getNativeMap().addLayer(info.layer);
            
            info.layer.setInteraction(true);
            info.layer.setOpacity(0.5);
            info.layer.on('featureClick', function () {
              popupInfo.push([info].concat(_.toArray(arguments)));
              showPopup();
            });
            scope.legend = new cdb.geo.ui.Legend
            .Stacked({
              legends: [ info.legend ],
            })
            .render()
            .$el
            .wrap('<div>')
            .parent()
            .html();
          })
          .catch(function(err) {
            console.log(err);
          });
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
            currentLayer : null
          }
        })
        .then(function(layer) {
          $scope.maps.push({ id : 'foo' });
        });
      }
      
      $scope.deleteLayer = function() {
        
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