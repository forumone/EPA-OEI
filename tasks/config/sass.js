module.exports = function(grunt) {

  grunt.config.set('sass', {
    styles : {
      files : [{
        expand : true,
        cwd : '.tmp/public/sass/',
        src : [ '**/*.scss' ],
        dest : '.tmp/public/styles',
        ext : '.css'
      }],
      options : {
        sourceMap : true,
        outputStyle : 'compressed',
        includePaths : [ 'bower_components' ],
        quiet : true
      }
    }
  });
  
  grunt.loadNpmTasks('grunt-sass');
}