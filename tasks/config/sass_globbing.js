module.exports = function(grunt) {

  grunt.config.set('sass_globbing', {
    theme : {
      files : {
        '.tmp/public/sass/partials/_variables.scss' : '.tmp/public/sass/partials/global/variables/**/*.scss',
        '.tmp/public/sass/partials/_helpers.scss' : '.tmp/public/sass/partials/global/helpers/**/*.scss',
        '.tmp/public/sass/partials/_extendables.scss' : '.tmp/public/sass/partials/global/extendables/**/*.scss',
        '.tmp/public/sass/partials/_helper-classes.scss' : '.tmp/public/sass/partials/helper-classes/**/*.scss',
        '.tmp/public/sass/partials/_layout.scss' : '.tmp/public/sass/partials/layout/**/*.scss',
        '.tmp/public/sass/partials/_components.scss' : '.tmp/public/sass/partials/components/**/*.scss',
        '.tmp/public/sass/partials/components/nav/_nav.scss' : '.tmp/public/sass/partials/components/nav/**/*.scss'
      }
    }
  });
  
  grunt.loadNpmTasks('grunt-sass-globbing');
}