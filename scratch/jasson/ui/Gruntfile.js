
module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {},
      files: ['Gruntfile.js', 'widgets/*.js', 'packet/*.js', '*.js']
    },
    concat: {
    },
    uglify: {
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
};

