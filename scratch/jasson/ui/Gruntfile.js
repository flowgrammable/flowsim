
module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {},
      files: ['Gruntfile.js', 'widgets/*.js', 'protocol/*.js', 'packet/*.js']
    },
    concat: {
    },
    uglify: {
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-html2js');

  grunt.registerTask('default', ['jshint']);
};

