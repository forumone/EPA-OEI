module.exports = function (grunt) {
	grunt.registerTask('compileStyles', [
		'sass_globbing',
		'sass'
	]);
};
