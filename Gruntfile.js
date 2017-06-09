module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            app: {
                files: {
                    './min-safe/services.js': ['./public/scripts/services.js'],
                    './min-safe/controllers.js': ['./public/scripts/controllers.js'],
                    './min-safe/app.js': ['./public/scripts/app.js']
                }
            }
        },
        uglify: {
            options: {
                mangle: true
            },
            js: { //target
                src: ['./min-safe/*.js'],
                dest: './public/scripts/app.min.js'
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.registerTask('default', ['ngAnnotate', 'uglify']);
};