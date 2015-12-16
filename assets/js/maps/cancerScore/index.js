angular.module('nciMaps').service('cancerScore', function($interpolate, $templateCache, $http, $q) {
  var template = $interpolate($templateCache.get('cancerScore/popup.html'));
  
  function getScore(lat, lng) {
    var defer = $q.defer();
    
    return $http.get('/api/score', { params : {
      lat : lat, 
      lng : lng
    }});
    
    return defer.promise;
  }
  
  function pointInfo(latlng) {
    return getScore(latlng[0], latlng[1])
    .then(function(result) {
      return template(result.data);
    });
  }
  
  return {
    getScore : getScore,
    pointInfo : pointInfo
  }
});