
var path = require('path');
var _ = require('underscore');
var ejs = require('ejs');

module.exports = function(grunt) {

  function baseAndPrepend(prefix) {
    return function(filepath) {
      return [prefix, path.basename(filepath)].join(path.sep);
    };
  }

  function dropHead(filepath) {
    return _.rest(path.normalize(filepath).split(path.sep));
  }

  function replaceHead(dst, src) {
    var result = dropHead(src);
    result.splice(0, 0, path.normalize(dst));
    return result.join(path.sep);
  }

  function fileHelper(ex, fl, sr, ds, rn) {
    return {
      expand: ex, flatten: fl,
      src: sr, dest: ds, rename: rn
    };
  }

  function getLocalsByExt(dir, ext) {
    var locals = [];
    grunt.file.recurse(dir, function(abspath, rootdir, subdir, filename) {
      if (path.extname(filename) == ext) {
        if(subdir !== undefined) {
          locals.push([subdir, filename].join(path.sep));
        } else {
          locals.push(filename);
        }
      }
    });
    return locals;
  }

  // load the application package file
  var pkg = grunt.file.readJSON('package.json');
  // load the application dependency file
  var dep = grunt.file.readJSON('dependencies.json');

  // Provide grunt module input/output guidance
  grunt.initConfig({
    shell: {
      // Provide initialization hooks for any external dependencies
      init: {
        command: dep.init.join('&&')
      }
    },
    jshint: {
      debug_pre: {
        src: ['Gruntfile.js', 'src/**/*.js']
      },
      debug_post: {
        src: []
      },
      release_pre: {
        src: ['Gruntfile.js', 'src/**/*.js']
      },
      release_post: {
        src: []
      }
    },
    copy: {
      debug: {
        files: [
          fileHelper(true, true, dep.debug.css, 'debug/css'),
          fileHelper(true, true, dep.debug.js, 'debug/js'),
          fileHelper(true, true, dep.debug.fonts, 'debug/fonts'),
          fileHelper(true, false, 'img/**', 'debug'),
          fileHelper(true, false, 'src/**/*.html', 'debug', replaceHead),
          fileHelper(true, false, 'src/**/*.css', 'debug', replaceHead),
          fileHelper(true, false, 'src/**/*.js', 'debug', replaceHead)
        ]
      },
      release: {
        files: [
          fileHelper(true, true, dep.release.css, 'release/css'),
          fileHelper(true, true, dep.release.js, 'release/js'),
          fileHelper(true, true, dep.release.fonts, 'release/fonts'),
          fileHelper(true, false, 'img/**', 'release'),
          fileHelper(true, false, 'src/**/*.html', 'release', replaceHead)
        ]
      }
    },
    indexgen: {
      options: {
        title: pkg.name,
        body: grunt.file.read('src/main.thtml'),
        dependencies: dep
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
    // Provide basic debug|release|tmp removal
    clean: {
      debug: ['debug', 'tmp'],
      release: ['release', 'tmp']
    }
  });

  // Load external grunt modules
  grunt.loadNpmTasks('grunt-contrib-jshint');   // analyze all javascript
  grunt.loadNpmTasks('grunt-contrib-concat');   // concat local js and css
  grunt.loadNpmTasks('grunt-contrib-uglify');   // minify local js
  grunt.loadNpmTasks('grunt-contrib-cssmin');   // minify local css
  grunt.loadNpmTasks('grunt-contrib-copy');     // move dirs/files
  grunt.loadNpmTasks('grunt-contrib-clean');    // remove tmp/debug/release
  grunt.loadNpmTasks('grunt-ng-annotate');      // angularjs js preprocessing
  grunt.loadNpmTasks('grunt-shell');            // use the shell

  grunt.registerTask('init', ['shell:init']);
  grunt.registerTask('default', ['debug']);

  // Debug build process
  grunt.registerTask('debug', [
    'jshint:debug_pre',
    'copy:debug',
    'indexgen:debug',
    'jshint:debug_post'
  ]);

  // Release build process
  grunt.registerTask('release', [
    'jshint:release_pre', 
    'copy:release',
    'indexgen:release',
    'jshint:release_post'
  ]);

  grunt.registerMultiTask('indexgen', 'Generate the index.html', function() {
    var options = this.options();

    // Set the debug indexgen options
    if(this.target == 'debug') {
      options.styles = _.map(dep.debug.css, baseAndPrepend('css'));
      options.scripts = _.map(dep.debug.js, baseAndPrepend('js'));
      options.styles = options.styles.concat(getLocalsByExt('src/', '.css'));
      options.scripts = options.scripts.concat(getLocalsByExt('src/', '.js'));
    } 
    // Set the release indexgen options
    else if(this.target == 'release') {
      options.styles = _.map(dep.release.css, baseAndPrepend('css'));
      options.scripts = _.map(dep.release.js, baseAndPrepend('js'));
      options.styles.push('css/' + options.title + '.min.css');
      options.scripts.push('js/' + options.title + '.min.js');
    }

    // For each input render the result
    this.files.forEach(function(file) {
      var contents = file.src.filter(function(filepath) {
        if (!grunt.file.exists(filepath)) {
          console.log('Bad index template: ' + filepath);
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        return grunt.file.read(filepath);
      });
      grunt.file.write(file.dest, ejs.render(contents[0], options));
    });
  });

};

