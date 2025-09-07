// Gulpfile.js - replacement for Gruntfile.js
// Run `npm install --save-dev gulp gulp-sass gulp-postcss autoprefixer gulp-pug gulp-uglify gulp-jshint gulp-imagemin gulp-svgstore browser-sync del` before using

const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const pug = require('gulp-pug');
const uglify = require('gulp-uglify');
const jshint = require('gulp-jshint');
const imagemin = require('gulp-imagemin');
const svgstore = require('gulp-svgstore');
const browserSync = require('browser-sync').create();
const del = require('del');
const path = require('path');
const sourcemaps = require('gulp-sourcemaps');
const stylelint = require('gulp-stylelint');

const paths = {
  js: 'app/assets/js/**/*.js',
  jsApp: 'app/assets/js/app.js',
  scss: 'app/assets/scss/**/*.scss',
  pugPages: 'app/views/pages/**/*.pug',
  pugPartials: ['app/views/partials/**/*.pug', 'app/views/layouts/**/*.pug'],
  fonts: 'app/assets/fonts/**',
  images: 'app/assets/images/**',
  svg: 'app/assets/images/svg-icons/*.svg',
  build: 'build',
};

function clean() {
  return del([paths.build]);
}

function styles() {
  return gulp.src('app/assets/scss/style.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer({ overrideBrowserslist: ['last 2 versions'] })]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/assets/css'))
    .pipe(browserSync.stream());
}

function scripts() {
  return gulp.src(['app/assets/js/lib/*.js', 'app/assets/js/app.js'])
    .pipe(sourcemaps.init())
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/assets/js'))
    .pipe(browserSync.stream());
}
function lintStyles() {
  return gulp.src('app/assets/scss/**/*.scss')
    .pipe(stylelint({
      reporters: [
        { formatter: 'string', console: true }
      ]
    }));
}

function copyFonts() {
  return gulp.src(paths.fonts)
    .pipe(gulp.dest('build/assets/fonts'));
}

function copyImages() {
  return gulp.src(paths.images)
    .pipe(gulp.dest('build/assets/images'));
}

function images() {
  return gulp.src('build/assets/images/**/*.{png,jpg,gif,svg}')
    .pipe(imagemin())
    .pipe(gulp.dest('build/assets/images'));
}

function svgSprite() {
  return gulp.src(paths.svg)
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(gulp.dest('build/assets/images'));
}

function views() {
  return gulp.src(paths.pugPages)
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest('build'))
    .pipe(browserSync.stream());
}

function serve() {
  browserSync.init({
    server: {
      baseDir: 'build',
    },
    port: 8000,
    open: false,
  });

  gulp.watch(paths.scss, styles);
  gulp.watch(paths.js, scripts);
  gulp.watch(paths.pugPages, views);
  gulp.watch(paths.pugPartials, views);
  gulp.watch(paths.fonts, copyFonts);
  gulp.watch(paths.images, gulp.series(copyImages, images, svgSprite));
  gulp.watch(paths.svg, svgSprite);
}


const build = gulp.series(
  clean,
  lintStyles,
  gulp.parallel(styles, scripts, copyFonts, gulp.series(copyImages, images, svgSprite), views)
);

gulp.task('default', gulp.series(build, serve));
gulp.task('build', build);
gulp.task('lint:styles', lintStyles);
