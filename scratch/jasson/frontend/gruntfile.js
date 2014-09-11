
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

var chopHead2 = function(file) {
  var tmp = file.split('/').filter(function(item) { return item.length > 0; });
  tmp.splice(0, 2);
  return tmp.join('/');
};

var replaceHead = function(dest, src) {
  var tsrc = src.split('/').filter(function(item) { return item.length > 0; });
  tsrc.splice(0, 1);
  var tdest = dest.split('/').filter(function(item) { return item.length > 0; });
  return tdest.concat(tsrc).join('/');
};

var replaceHead2 = function(dest, src) {
  var tsrc = src.split('/').filter(function(item) { return item.length > 0; });
  tsrc.splice(0, 2);
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
        src: ['tmp/**/*.annotated.js'],
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
          { expand: true, flatten: true, src: ['<%= deps.debug.css %>'], 
            dest: 'debug/css'},
          { expand: true, flatten: true, src: ['<%= deps.debug.js %>'], 
            dest: 'debug/js'},
          { expand: true, flatten: true, src: ['<%= deps.debug.fonts %>'], 
            dest: 'debug/fonts'},
          { expand: true, src: ['tmp/*.annotated.js', 'tmp/**/*.annotated.js'], 
            dest: 'debug/', rename: replaceHead2 },
          { expand: true, src: ['src/*.html', 'src/**/*.html'], dest: 'debug/',
            rename: replaceHead }
        ]
      },
      release: {
        files: [
          { expand: true, flatten: true, src: ['<%= deps.release.css %>'], 
            dest: 'release/css'},
          { expand: true, flatten: true, src: ['<%= deps.release.js %>'], 
            dest: 'release/js'},
          { expand: true, flatten: true, src: ['<%= deps.release.fonts %>'], 
            dest: 'release/fonts'},
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
    ngAnnotate: {
      debug: {
        files: [
          { expand: true, src: ['src/**/*.js'], dest: 'tmp/', 
            ext: '.annotated.js'}
        ]
      },
      release: {
        files: [
          { expand: true, src: ['src/**/*.js'], dest: 'tmp/', 
            ext: '.annotated.js'}
        ]
      }
    },
    clean: {
      debug: ['debug', 'tmp'],
      release: ['release'],
      tmp: ['tmp', 'release/js/<%= pkg.name %>.js']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-ng-annotate');
  
  //grunt.loadNpmTasks('grunt-html2js');
  //grunt.loadNpmTasks('grunt-git');

  grunt.registerTask('default', ['jshint', 'ngAnnotate:debug', 'copy:debug',
    'indexgen:debug', 'clean:tmp']);
  grunt.registerTask('debug', ['default']);
  grunt.registerTask('release', ['jshint', 'ngAnnotate:release',
    'concat:release', 'uglify:release', 'copy:release', 'indexgen:release',
    'clean:tmp']);

  grunt.registerMultiTask('indexgen', 'Generate an index.html', function() {
    var options = this.options();

    // set the includes based on mode
    if(this.target == 'debug' ) {
      options.styles = removePath(options.deps.debug.css)
        .filter(function(s) {
          if(endsWith(s, '.map')) return false;
          else return true;
        }).map(function(s) { 
          return 'css/' + s; 
        });
      options.scripts = removePath(options.deps.debug.js)
        .filter(function(s) {
          if(endsWith(s, '.map')) return false;
          else return true;
        })
        .map(function(s) { 
          return 'js/' + s; 
        });
      grunt.file.recurse('tmp/', function(f){
        if(endsWith(f, '.js')) {
          options.scripts.push(chopHead2(f));
        }
      });
      //options.scripts.concat();
    } else if(this.target == 'release') {
      options.styles = removePath(options.deps.release.css)
        .filter(function(s) {
          if(endsWith(s, '.map')) return false;
          else return true;
        })
        .map(function(s) { 
          return 'css/' + s; 
        });
      options.scripts = removePath(options.deps.release.js)
        .filter(function(s) {
          if(endsWith(s, '.map')) return false;
          else return true;
        })
        .map(function(s) { 
          return 'js/' + s; 
        });
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

