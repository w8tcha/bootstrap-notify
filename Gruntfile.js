module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				compress: {
					drop_console: true
				},
				preserveComments: 'some'
			},
			default: {
				files: {
					'bootstrap-notify.min.js': ['bootstrap-notify.js']
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.registerTask('default', ['uglify']);
};
