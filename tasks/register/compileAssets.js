module.exports = function (grunt) {
	grunt.registerTask('compileAssets', [
		'clean:dev',
		'bower',
		'jst:dev',
		'copy:dev',
		'compileStyles',
		'ngtemplates',
		'ngAnnotate',
	]);
};
