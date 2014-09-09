
module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    deps: grunt.file.readJSON('deps.json'),
    jshint: {
      files: ['gruntfile.js', 'src/**/*.js']
    },
    concat: {
      dist: {
        src: ['src/**/*.js'],
        dest: 'dist/js/<%= pkg.name %>.js'
      }
    },
    uglify: {
      dist: {
        files: {
          'dist/js/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.loadNpmTasks('grunt-html2js');


  grunt.registerTask('default', ['jshint', 'concat']);
  grunt.registerTask('build', ['jshint', 'concat', 'uglify']);
};

