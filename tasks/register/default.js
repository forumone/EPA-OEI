module.exports = function (grunt) {
	grunt.registerTask('default', ['clean:dev', 'bower', 'compileAssets', 'linkAssets',  'simple-watch']);
};
