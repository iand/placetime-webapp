module.exports = function(grunt) {
    grunt.initConfig({
        concat: {
            javascriptApplication: {
                src: [
                    'javascripts/application/application.js',
                    'javascripts/application/helpers/*.js',
                    'javascripts/application/models/*.js',
                    'javascripts/application/collections/*.js',
                    'javascripts/application/views/*.js',
                    'javascripts/application/views/**/*.js',
                    'javascripts/application/routers/*.js'
                ],
                dest: 'javascripts/application.js'
            },

            javascriptVendor: {
                src: [
                    // Include
                    'javascripts/vendor/underscore.js',
                    'javascripts/vendor/jquery.js',
                    'javascripts/vendor/*.js',
                    'javascripts/vendor/**/*.js',

                    // Exclude
                    '!javascripts/vendor/modernizr.js'
                ],
                dest: 'javascripts/vendor.js'
            },

            stylesheetVendor: {
                src: [
                    'stylesheets/vendor/*.css',
                    'stylesheets/vendor/**/*.css'
                ],
                dest: 'stylesheets/vendor.css'
            }
        },


        compass: {
            dev: {
                options: {
                    fontsDir: 'fonts/',
                    imagesDir: 'images/',
                    cssDir: 'stylesheets/',
                    sassDir: 'stylesheets/scss',
                    javascriptsDir: 'javascripts/',
                    outputStyle: 'expanded',
                    relativeAssets: true,
                    noLineComments: false
                }
            },

            dist: {
                options: {
                    fontsDir: 'fonts/',
                    imagesDir: 'images/',
                    cssDir: 'stylesheets/',
                    sassDir: 'stylesheets/scss',
                    javascriptsDir: 'javascripts/',
                    outputStyle: 'compressed',
                    noLineComments: true
                }
            }
        },


        watch: {
            js: {
                files: [
                    'javascripts/application/**/**/*.js',
                    'javascripts/application/**/*.js',
                    'javascripts/vendor/**/*.js',
                    'javascripts/vendor/*.js'
                ],
                tasks: 'concat'
            },
            compass: {
                files: [
                    'stylesheets/scss/*.scss',

                    'stylesheets/vendor/*.css',
                    'stylesheets/vendor/**/*.css'
                ],
                tasks: ['compass', 'concat']
            }
        }
    });


    grunt.registerTask('default', 'concat compass min');

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-compass');
};