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
                        'javascripts/application/models/*.js',
                        'javascripts/application/helpers/*.js',
                        'javascripts/application/collections/*.js',
                        'javascripts/application/views/*.js',

                        'javascripts/application/views/user/timeline.js',
                        'javascripts/application/views/user/timeline-item.js',
                        'javascripts/application/views/user/timeline-profile.js',
                        'javascripts/application/views/user/user.js',

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
                        'javascripts/vendor/jquery.js',
                        'javascripts/vendor/underscore.js',
                        'javascripts/vendor/backbone.js',
                        'javascripts/vendor/handlebars.js',
                        'javascripts/vendor/*.js',
                        'javascripts/vendor/jquery/ui.js',
                        'javascripts/vendor/backbone/marionette.js',
                        'javascripts/vendor/backbone/marionette.handlebars.js',
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
            application: {
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
            }
        },


        handlebars: {
            compile: {
                options: {
                    namespace: 'JST',
                    processName: function(filename) {
                        return filename.replace(/^templates\/(?:user|admin)\/(.*)\.hbs$/, '$1').toLowerCase();
                    },
                    partialRegex: /.*/,
                    partialsPathRegex: /partials\//
                },
                files: {
                    'templates/user.js': [
                        'templates/user/*.hbs',
                        'templates/user/partials/*.hbs'
                    ],
                    'templates/admin.js': [
                        'templates/admin/*.hbs',
                        'templates/admin/partials/*.hbs'
                    ]
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
            stylesheetApplication: {
                files: [
                    'stylesheets/scss/*.scss',
                    'stylesheets/scss/**/*.scss'
                ],
                tasks: ['compass:application'],
                options: {
                    livereload: true
                }
            },
            stylesheetVendor: {
                files: [
                    'stylesheets/vendor/*.css',
                    'stylesheets/vendor/**/*.css'
                ],
                tasks: ['concat'],
                options: {
                    livereload: true
                }
            },
            templates: {
                files: [
                    'templates/*.hbs',
                    'templates/**/*.hbs'
                ],
                tasks: ['handlebars'],
                options: {
                    livereload: true
                }
            }
        }
    });


    grunt.registerTask('default', ['uglify', 'concat', 'compass:application', 'handlebars']);

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-handlebars');
};
