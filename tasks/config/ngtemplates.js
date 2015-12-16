module.exports = function(grunt) {

  grunt.config.set('ngtemplates', {
    epaOei : {
      cwd : 'assets/js/interface',
      src : '**/**.html',
      dest : '.tmp/public/js/templates.js',
      options : {
        htmlmin : '<%= htmlmin.epaOei %>'
      }
    },
    nciCartoCss : {
      cwd : 'assets/js/maps',
      src : '**/**.css',
      dest : '.tmp/public/js/cartocss.js',
      options : {
        htmlmin : '<%= htmlmin.cartoCss %>'
      }
    },
    nciMaps : {
      cwd : 'assets/js/maps',
      src : '**/**.html',
      dest : '.tmp/public/js/templates-map.js',
      options : {
        htmlmin : '<%= htmlmin.epaOei %>'
      }
    }
  });
  
  grunt.loadNpmTasks('grunt-angular-templates');
}