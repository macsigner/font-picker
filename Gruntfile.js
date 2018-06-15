module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			scripts: {
				files: ['js/main.js'],
				tasks: ['jshint'],
				options: {
					spawn: false,
				}
			},
			css_prefix: {
				files: ['css/base.css'],
				tasks: ['pleeease'],
			},
			scss: {
				files: ['scss/*', 'scss/imports/*'],
				tasks: ['sass'],
			},
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			build: {
				src: 'js/main.js',
				dest: 'js/main.min.js'
			}
		},
		jshint: {
			all: ['js/*.js'],
		},
		pleeease: {
			custom: {
				options: {
					autoprefixer: {'browsers': ['last 4 versions', 'ios 6']},
					filters: {'oldIE': false},
					rem: ['10px'],
					minifier: false,
				},
				files: {
					'css/base.min.css': 'css/base.css'
				}
			},
		},
		sass: {
			dist: {
				options: {
					style: 'expanded'
				},
				files: {
					'css/base.css': 'scss/base.scss',
				}
			}
		}
	});

	// Load plugins
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-pleeease');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Default task(s).
	grunt.registerTask('default', ['uglify']);
	grunt.registerTask('prefix', ['pleeease']);

};