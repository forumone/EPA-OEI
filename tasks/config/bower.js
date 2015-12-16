module.exports = function(grunt) {

  grunt.config.set('bower', {
    install: {
      options: {
        targetDir: '.tmp/public/vendor',
        layout: 'byComponent',
        install: true,
        verbose: false,
        cleanTargetDir: true,
        cleanBowerDir: false,
        bowerOptions: {}
      }
    }
  });
  
  grunt.loadNpmTasks('grunt-bower-task');
};