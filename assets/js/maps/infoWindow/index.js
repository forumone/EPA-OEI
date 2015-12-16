angular.module('nciMaps').directive('infoWindow', function(locationData) {
  return {
    templateUrl : 'infoWindow/index.html',
    restrict : 'E',
    transclude : true,
    scope : {
      title : '@',
      shortName : '@'
    },
    compile : function(tElement, tAttrs, transclude) {
      return function(scope, elem, attrs) {
        // Forcing transclusion to use parent scope to allow $watch
        transclude(scope.$parent, function(clone) {
          elem.find('.layer-controls__group').append(clone);
        });
        
        elem.find('legend').click(function() {
          var legend = angular.element(this);
          elem.find('.layer-controls__group').slideToggle({
            done : function() {
              legend.toggleClass('is-collapsed');
            }
          });
        });
      };
    },
    controller : function($scope) {
      $scope.removeLayer = function() {
        locationData.toggleLayer($scope.shortName);
      };
    }
  };
});
