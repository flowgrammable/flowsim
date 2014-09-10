
var ejs = require('ejs');

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
    },
    indexgen: {
      options: {
        title: '<%= pkg.name %>',
        body: grunt.file.read('src/main.html'),
        deps: grunt.file.readJSON('deps.json')
      },
      debug: {
        files: {
          'src/index.html': ['src/index.ejs']
        }
      },
      dist: {
        files: {
          'dist/index.html': ['src/index.ejs']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-html2js');


  grunt.registerTask('default', ['jshint', 'copy', 'concat']);
  grunt.registerTask('dist', ['jshint', 'concat', 'uglify']);

  grunt.registerMultiTask('indexgen', 'Generate an index.html', function() {
    var options = this.options();
    if(this.target == 'debug' ) {
      options.styles = options.deps.debug_css;
      options.scripts = options.deps.debug_js;
    } else if(this.target == 'dist') {
      options.styles = options.deps.css;
      options.scripts = options.deps.js;
    }
    this.files.forEach(function(file) {
      var contents = file.src.filter(function(filepath) {
        if (!grunt.file.exists(filepath)) {
          console.log('Bad source template: ' + filepath);
          return false;
        }
        return true;
      }).map(function(filepath) {
        return grunt.file.read(filepath);
      });

      grunt.file.write(file.dest, ejs.render(contents[0], options));
    });
  });
};

