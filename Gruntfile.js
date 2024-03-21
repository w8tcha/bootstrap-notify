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
		},
		devUpdate: {
            main: {
                options: {
                    reportUpdated: true,
					updateType: "force",
					semver: false
                }
            }
        }
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks("@w8tcha/grunt-dev-update");
	
	grunt.registerTask('default', ['uglify']);
};
