
var ejs = require('ejs');

var removePath = function(fileList) {
  return fileList.map(function(item) {
    var tmp = item.split('/');
    return tmp[tmp.length-1];
  });
};

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
        dest: 'release/js/<%= pkg.name %>.js'
      }
    },
    uglify: {
      dist: {
        files: {
          'release/js/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    copy: {
      debug: {
        files: [
          {expand: true, src: '{<%= deps.debug_css %>}', dest: 'debug/css'},
          {expand: true, src: '{<%= deps.debug_js %>}', dest: 'debug/js'},
          {expand: true, src: ['src/*.js', 'src/**/*.js'], dest: 'debug/'},
          {expand: true, src: ['src/*.html', 'src/**/*.html'], dest: 'debug/'}
        ]
      },
      release: {
        files: [
          {expand: true, src: ['src/*.html', 'src/**/*.html'], dest: 'release/'}
        ]
      }
    },
    indexgen: {
      options: {
        title: '<%= pkg.name %>',
        body: grunt.file.read('src/main.thtml'),
        deps: grunt.file.readJSON('deps.json')
      },
      debug: {
        files: {
          'debug/index.html': ['src/index.ejs']
        }
      },
      release: {
        files: {
          'release/index.html': ['src/index.ejs']
        }
      }
    },
    clean: {
      debug: ['debug'],
      dist: ['release']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-html2js');


  grunt.registerTask('default', ['jshint', 'copy:debug', 'indexgen:debug']);
  grunt.registerTask('debug', ['default']);
  grunt.registerTask('release', ['jshint', 'concat', 'uglify', 'copy:release', 'indexgen:release']);

  grunt.registerMultiTask('indexgen', 'Generate an index.html', function() {
    var options = this.options();

    // set the includes based on mode
    if(this.target == 'debug' ) {
      options.styles = options.deps.debug_css;
      options.scripts = options.deps.debug_js;
    } else if(this.target == 'release') {
      options.styles = options.deps.release_css;
      options.scripts = options.deps.release_js;
    }

    // remove the prepended path section of each include
    options.styles = removePath(options.styles);
    options.scripts = removePath(options.scripts);

    this.files.forEach(function(file) {
      var contents = file.src.filter(function(filepath) {
        if (!grunt.file.exists(filepath)) {
          console.log('Bad index template: ' + filepath);
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

