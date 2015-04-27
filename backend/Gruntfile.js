
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
  },
  mochaTest: {
    subscriber: {
      options: {
        reporter: 'spec'
      },
      src: ['src/subscriber/test/**/*.js']
    }
  },
  shell: {
    launch_test_env: {
      command: 'cd test && ./run.sh',
      stdout: false,
      stdin: false
    }
  }
});

grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-jsdoc');
grunt.loadNpmTasks('grunt-contrib-clean');
grunt.loadNpmTasks('grunt-mocha-test');
grunt.loadNpmTasks('grunt-shell');

grunt.registerTask('default', ['jshint']);
grunt.registerTask('doc', ['jsdoc']);
grunt.registerTask('test', ['shell:launch_test_env', 'mochaTest:subscriber']);

};

