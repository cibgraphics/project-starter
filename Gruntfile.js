module.exports = function(grunt) {
  
  // Make sure when installing plugins to use 'npm install <module> --save-dev' to have it add automatically to package.json
  // When installing from a already setup project, use 'npm install' to install dependencies 

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    watch: {
      options: {
        livereload: true
      },
      scripts: {
        files: ['app/assets/js/**/*.js'],
        tasks: ['jshint', 'uglify'],
        options: {
          spawn: false
        }
      },
      app: {
        files: ['app/assets/js/app.js'],
        tasks: ['jshint', 'copy:appjs'],
        options: {
          spawn: false
        }
      },
      css: {
        files: ['app/assets/scss/**/*.scss'],
        tasks: ['dart-sass', 'postcss'],
        options: {
          spawn: false
        }
      },
      htmlnewer:{
        files: ['app/views/pages/**/*.pug'],
        tasks: ['newer:pug'],
        options: {
            spawn: false
        }
      },
      html:{
        files: ['app/views/partials/**/*.pug', 'app/views/layouts/**/*.pug'],
        tasks: ['pug'],
        options: {
            spawn: false
        }
      },
      fonts:{
        files: ['app/assets/fonts/**'],
        tasks: ['copy:fonts'],
        options: {
            spawn: false
        }
      },
      images:{
        files: ['app/assets/images/**'],
        tasks: ['copy:images', 'imagemin', 'svgstore'],
        options: {
            spawn: false
        }
      },
      svg: {
        files: ['app/assets/images/svg-icons/*.svg'],
        tasks: ['svgstore'],
      },
    },

    //SVG Store
    svgstore: {
      options: {
        prefix : 'icon-',
        svg: {
          viewBox : '0 0 100 100',
          xmlns: 'http://www.w3.org/2000/svg',
          style: "display: none;"
        },
        cleanup: ['fill', 'style', "class"],
      },
      default: {
        files: {
          'build/assets/images/svg-sprite.svg' : ['app/assets/images/svg-icons/*.svg']
        }
      },
    },

    // Image Minification
    imagemin: {
      dynamic: {
        files: [{
          expand: true,
          cwd: 'build/assets/images/',
          src: ['**/*.{png,jpg,gif,svg}'],
          dest: 'build/assets/images/'
        }]
      }
    },

    // JS Linting
    jshint: {
      all: ['app/assets/js/app.js'],
      options: {
        curly: true,
        eqnull: true,
        browser: true
      },
    },

    connect: {
      server: {
        options: {
          port: 8000,
          livereload: true,
          base: 'build',
          hostname: '0.0.0.0'
        }
      }
    },

    // JS Uglify


    uglify: {
      options: {
      },
      my_target: {
        files: {
          'build/assets/js/app.min.js':
               ['app/assets/js/lib/*.js', 
               'app/assets/js/app.js']
        }
      }
    },


    // SCSS
    'dart-sass': {
      target: {
        options: {
          sourceMap: false
        },
        files: {
          'build/assets/css/style.css': 'app/assets/scss/style.scss'
        }
      }
    },

    postcss: {
      options: {
        map: false,
        processors: [
          require('autoprefixer')({overrideBrowserslist: 'last 2 versions'}),
          //require('cssnano')()
        ]
      },
      dist: {
        src: 'build/assets/css/*.css'
      }
    },


    pug: {
      compile: {
        options: {
          data: {
            debug: false
          },
          pretty: true
        },
        files: [{
          expand: true,
          cwd: 'app/views/pages/',
          src: ['**/*.pug'],
          dest: "build/",
          ext: '.html'
        }],
      }
    },

    copy: {
      images: {
        files: [
          {
            expand: true,
            cwd:'app/assets/images/',
            src: ['**'],
            dest: 'build/assets/images/'
          },
        ],
      },
      fonts: {
        files: [
          {
            expand: true,
            cwd:'app/assets/fonts/',
            src: ['**'],
            dest: 'build/assets/fonts/'
          },
        ],
      },
      js: {
        files: [
          {
            expand: true,
            cwd:'app/assets/js/',

            src: ['**'],
            dest: 'build/assets/js/'
          },
        ],
      },
      appjs: {
        files: [
          {
            expand: true,
            cwd:'app/assets/js/',

            src: ['app.js'],
            dest: 'build/assets/js/'
          },
        ],
      },
    },

    
    
  });

  // Load the plugin
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('@lodder/grunt-postcss');
  grunt.loadNpmTasks('grunt-dart-sass');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-pug');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-svgstore');
  grunt.loadNpmTasks('grunt-newer');
  grunt.loadNpmTasks('grunt-contrib-connect');
  

  // Default task(s).
  grunt.registerTask('default', ['connect', 'watch']);

};