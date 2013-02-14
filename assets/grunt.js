/*global module:false*/
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        lint: {
            files: ['js/application.js']
        },

        concat: {
            // Application
            helpers: {
                src: [
                    'js/app/helpers/*.js'
                ],
                dest: 'js/app/helpers.js'
            },
            models: {
                src: [
                    'js/app/models/*.js'
                ],
                dest: 'js/app/models.js'
            },
            collections: {
                src: [
                    'js/app/collections/*.js'
                ],
                dest: 'js/app/collections.js'
            },
            views: {
                src: [
                    'js/app/views/*.js'
                ],
                dest: 'js/app/views.js'
            },
            routers: {
                src: [
                    'js/app/routers/*.js'
                ],
                dest: 'js/app/routers.js'
            },

            application: {
                src: [
                    'js/app/application.js',
                    'js/app/helpers.js',
                    'js/app/models.js',
                    'js/app/collections.js',
                    'js/app/views.js',
                    'js/app/routers.js',
                    'js/app/bootstrap.js',
                ],
                dest: 'js/app.js'
            }
        },


        watch: {
            js: {
                files: [
                    'grunt.js',
                    'js/app/**/*.js'
                ],
                tasks: 'concat'
            }
        }

    });

    // Default task.
    grunt.registerTask('default', 'concat');
};