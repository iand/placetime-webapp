module.exports = function(grunt) {
    grunt.initConfig({
        uglify: {
            application: {
                options: {
                    mangle: false,
                    compress: false,
                    sourceMap: 'javascripts/application.map',
                    sourceMapRoot: '/-assets/',
                    sourceMappingURL: '/-assets/javascripts/application.map'
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
                        'javascripts/application/views/**/timeline-item.js',
                        'javascripts/application/views/**/timeline-profile.js',
                        'javascripts/application/views/**/user.js',
                        'javascripts/application/views/**/*.js',
                        'javascripts/application/routers/*.js'
                    ]
                }
            },
            vendor: {
                options: {
                    mangle: false,
                    compress: false,
                    sourceMap: 'javascripts/vendor.map',
                    sourceMapRoot: '/-assets/',
                    sourceMappingURL: '/-assets/javascripts/vendor.map'
                },
                files: {
                    'javascripts/vendor.js' : [
                        // Include
                        'javascripts/vendor/underscore.js',
                        'javascripts/vendor/jquery.js',
                        'javascripts/vendor/*.js',
                        'javascripts/vendor/jquery/ui.js',
                        'javascripts/vendor/**/*.js',

                        // Exclude
                        '!javascripts/vendor/modernizr.js',
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
                    noLineComments: true,
                    bundleExec: true
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
                    noLineComments: true,
                    bundleExec: true
                }
            }
        },


        watch: {
            javascriptApplication: {
                files: [
                    'javascripts/application/**/**/**/*.js',
                    'javascripts/application/**/**/*.js',
                    'javascripts/application/**/*.js'
                ],
                tasks: ['uglify:application'],
                options: {
                    livereload: true
                }
            },
            javascriptVendor: {
                files: [
                    'javascripts/vendor/**/*.js',
                    'javascripts/vendor/*.js'
                ],
                tasks: ['uglify:vendor'],
                options: {
                    livereload: true
                }
            },
            stylesheets: {
                files: [
                    'stylesheets/scss/*.scss',
                    'stylesheets/scss/**/*.scss',

                    'stylesheets/vendor/*.css',
                    'stylesheets/vendor/**/*.css'
                ],
                tasks: ['compass:dev', 'concat'],
                options: {
                    livereload: true
                }
            }
        }
    });


    grunt.registerTask('default', ['uglify', 'concat', 'compass:dev']);

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-compass');
};
