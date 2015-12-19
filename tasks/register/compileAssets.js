module.exports = function (grunt) {
	grunt.registerTask('compileAssets', [
		'jst:dev',
		'copy:dev',
		'compileStyles',
		'ngtemplates',
		'ngAnnotate',
	]);
};
