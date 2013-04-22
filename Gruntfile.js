module.exports = function(grunt) {
    grunt.initConfig({
        uglify: {
            application: {
                options: {
                    mangle: false,
                    compress: false,
                    sourceMap: 'javascripts/application/source-map.js',
                    sourceMapRoot: '/-assets/',
                    sourceMappingURL: '/-assets/javascripts/application/source-map.js'
                },
                files: {
                    'javascripts/application.js' : [

                        // Include
                        'javascripts/application/application.js',
                        'javascripts/application/helpers/*.js',
                        'javascripts/application/models/*.js',
                        'javascripts/application/collections/*.js',
                        'javascripts/application/views/*.js',
                        'javascripts/application/views/**/timeline.js',
                        'javascripts/application/views/**/*.js',
                        'javascripts/application/routers/*.js',

                        // Exclude
                        '!javascripts/application/source-map.js'
                    ]
                }
            },
            vendor: {
                options: {
                    mangle: false,
                    compress: false,
                    sourceMap: 'javascripts/vendor/source-map.js',
                    sourceMapRoot: '/-assets/',
                    sourceMappingURL: '/-assets/javascripts/vendor/source-map.js'
                },
                files: {
                    'javascripts/vendor.js' : [
                        // Include
                        'javascripts/vendor/underscore.js',
                        'javascripts/vendor/jquery.js',
                        'javascripts/vendor/*.js',
                        'javascripts/vendor/**/*.js',

                        // Exclude
                        '!javascripts/vendor/modernizr.js',
                        '!javascripts/vendor/source-map.js'
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
                    noLineComments: true
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
                    'javascripts/application/**/*.js',
                    '!javascripts/application/source-map.js'
                ],
                tasks: ['uglify:application']
            },
            javascriptVendor: {
                files: [
                    'javascripts/vendor/**/*.js',
                    'javascripts/vendor/*.js',
                    '!javascripts/vendor/source-map.js'
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