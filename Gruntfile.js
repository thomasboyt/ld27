/* jshint node: true */

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  var dropboxPath = process.env["DROPBOX_PATH"];

  grunt.initConfig({
    transpile: {
      main: {
        type: 'amd',
        moduleName: function(path) {
          return grunt.config.process('ld27') + path;
        },
        files: [{
          expand: true,
          cwd: 'src',
          src: '**/*.js',
          dest: 'tmp/transpiled/'
        }]
      }
    },
    concat_sourcemap: {
      main: {
        src: 'tmp/transpiled/**/*.js',
        dest: 'tmp/game.js',
        options: {
          sourceRoot: ".."
        }
      }
    },
    watch: {
      main: {
        files: ["src/**/*.js"],
        tasks: ["default"]
      }
    },
    connect: {
      server: {
        options: {
          port: process.env.PORT || 8000,
          hostname: '0.0.0.0',
          base: '.'
        }
      }
    },
    copy: {
      dist: {
        src: "index.html",
        dest: "dist/index.html"
      },
      deployDropbox: {
        files: [{
          cwd: "dist/",
          src: ["**"],
          dest: dropboxPath + "/Public/ld27/",
          expand: true
        }]
      }
    },
    useminPrepare: {
      html: "index.html",
      options: {
        dest: "dist/"
      }
    },
    usemin: {
      html: ["dist/index.html"],
    }
  });

  grunt.registerTask("default", ["transpile", "concat_sourcemap"]);
  grunt.registerTask("dev", ["default", "connect", "watch"]);
  grunt.registerTask("dist", ["default",
                              "useminPrepare",
                              "copy:dist",
                              "concat",
                              "uglify",
                              "usemin"]);
  grunt.registerTask("deploy", ["dist", "copy:deployDropbox"]);
};
