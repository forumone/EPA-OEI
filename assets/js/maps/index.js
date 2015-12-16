angular.module('nciCartoCss', []);
var nciMaps = angular.module('nciMaps', ['nciCartoCss', 'ui.slider']);
nciMaps.constant('defaultOpacity', 70);
nciMaps.constant('legends', {
  'BUBBLE' : 'bubble',
  'CHOROPLETH' : 'choropleth'
});