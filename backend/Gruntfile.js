
module.exports = function(grunt) {

grunt.initConfig({
  pkg: grunt.file.readJSON('package.json'),
  jshint: {
    files: ['Gruntfile.js', 'src/**/*.js']
  },
  jsdoc : {
    dist : {
      src: ['src/**/*.js', 'src/*.js'], 
      options: {
        destination: 'doc'
      }
    }
  },
  clean: {
    doc: ['doc']
  }
});

grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-jsdoc');
grunt.loadNpmTasks('grunt-contrib-clean');

grunt.registerTask('default', ['jshint']);
grunt.registerTask('doc', ['jsdoc']);

};

