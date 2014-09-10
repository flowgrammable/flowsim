
var ejs = require('ejs');

var removePath = function(fileList) {
  return fileList.map(function(item) {
    var tmp = item.split('/');
    return tmp[tmp.length-1];
  });
};

var chopHead = function(file) {
  var tmp = file.split('/').filter(function(item) { return item.length > 0; });
  tmp.splice(0, 1);
  return tmp.join('/');
};

var replaceHead = function(dest, src) {
  var tsrc = src.split('/').filter(function(item) { return item.length > 0; });
  tsrc.splice(0, 1);
  var tdest = dest.split('/').filter(function(item) { return item.length > 0; });
  return tdest.concat(tsrc).join('/');
};

function endsWith(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    deps: grunt.file.readJSON('deps.json'),
    jshint: {
      files: ['gruntfile.js', 'src/**/*.js']
    },
    concat: {
      release: {
        src: ['src/**/*.js'],
        dest: 'release/js/<%= pkg.name %>.js'
      }
    },
    uglify: {
      release: {
        files: {
          'release/js/<%= pkg.name %>.min.js': ['<%= concat.release.dest %>']
        }
      }
    },
    copy: {
      debug: {
        files: [
          { expand: true, flatten: true, src: '<%= deps.debug_css %>', 
            dest: 'debug/css'},
          { expand: true, flatten: true, src: '<%= deps.debug_js %>', 
            dest: 'debug/js'},
          { expand: true, src: ['src/*.js', 'src/**/*.js'], dest: 'debug/', 
            rename: replaceHead },
          { expand: true, src: ['src/*.html', 'src/**/*.html'], dest: 'debug/',
            rename: replaceHead }
        ]
      },
      release: {
        files: [
          { expand: true, flatten: true, src: '<%= deps.release_css %>', 
            dest: 'release/css'},
          { expand: true, flatten: true, src: '<%= deps.release_js %>', 
            dest: 'release/js'},
          { expand: true, flatten: true, src: '<%= deps.release_js.map(function(i) { console.log(i+".map");return i+".map";}) %>', 
            dest: 'release/js'},
          { expand: true, src: ['src/*.html', 'src/**/*.html'], dest: 'release/',
            rename: replaceHead }
        ]
      }
    },
    indexgen: {
      options: {
        title: '<%= pkg.name %>',
        body: grunt.file.read('src/main.thtml'),
        deps: grunt.file.readJSON('deps.json'),
        jssrc: 'src/**/*.js'
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
      release: ['release']
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
  grunt.registerTask('release', ['jshint', 'concat:release', 'uglify:release', 
    'copy:release', 'indexgen:release']);

  grunt.registerMultiTask('indexgen', 'Generate an index.html', function() {
    var options = this.options();

    // set the includes based on mode
    if(this.target == 'debug' ) {
      options.styles = removePath(options.deps.debug_css).map(function(s) { return 'css/' + s; });
      options.scripts = removePath(options.deps.debug_js).map(function(s) { return 'js/' + s; });
      grunt.file.recurse('src/', function(f){
        if(endsWith(f, '.js')) {
          options.scripts.push(chopHead(f));
        }
      });
      //options.scripts.concat();
    } else if(this.target == 'release') {
      options.styles = removePath(options.deps.release_css).map(function(s) { return 'css/' + s; });
      options.scripts = removePath(options.deps.release_js).map(function(s) { return 'js/' + s; });
      options.scripts.push('js/' + options.title + '.min.js');
    }

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

