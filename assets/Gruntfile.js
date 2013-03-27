module.exports = function(grunt) {
    grunt.initConfig({
        uglify: {
            options: {
                mangle: false,
                compress: false,
                sourceMap: 'javascripts/source-map.js',
                sourceMapRoot: '/-assets/',
                sourceMappingURL: '/-assets/javascripts/source-map.js'
            },
            application: {
                files: {
                    'javascripts/application.js' : [
                        'javascripts/application/application.js',
                        'javascripts/application/helpers/*.js',
                        'javascripts/application/models/*.js',
                        'javascripts/application/collections/*.js',
                        'javascripts/application/views/*.js',
                        'javascripts/application/views/**/*.js',
                        'javascripts/application/routers/*.js'
                    ]
                }
            },
            vendor: {
                files: {
                    'javascripts/vendor.js' : [
                        // Include
                        'javascripts/vendor/underscore.js',
                        'javascripts/vendor/jquery.js',
                        'javascripts/vendor/*.js',
                        'javascripts/vendor/**/*.js',

                        // Exclude
                        '!javascripts/vendor/modernizr.js'
                    ]
                }
            }
        },

        concat: {
            stylesheet: {
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
                    compass: true,
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
            javascriptApplication: {
                files: [
                    'javascripts/application/**/**/*.js',
                    'javascripts/application/**/*.js'
                ],
                tasks: ['uglify:application']
            },
            javascriptVendor: {
                files: [
                    'javascripts/vendor/**/*.js',
                    'javascripts/vendor/*.js'
                ],
                tasks: ['uglify:vendor']
            },
            stylesheets: {
                files: [
                    'stylesheets/scss/*.scss',

                    'stylesheets/vendor/*.css',
                    'stylesheets/vendor/**/*.css'
                ],
                tasks: ['compass:dev', 'concat']
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