angular.module('epaOei').directive('geocode', function() {
  function validPlace(place) {
    for ( var k in place) {
      if (Object.prototype.hasOwnProperty.call(place, k) && k !== 'name') {
        return true;
      }
    }

    return false;
  }

  return {
    restrict : 'A',
    scope : {
      geocode : '&',
    },
    link : function(scope, element, attrs) {
      var autocomplete = new google.maps.places.Autocomplete(element[0], {
        componentRestrictions : {
          country : 'us',
        },
      });

      google.maps.event.addListener(autocomplete, 'place_changed', function() {
        var place = autocomplete.getPlace();
        scope.$apply(function() {
          scope.geocode({
            $place : validPlace(place) ? place : null
          });
        });
      });
    }
  };
});