
// Gulpfile.mjs - ES Module version
import gulp from 'gulp';
import gulpSass from 'gulp-sass';
import * as sass from 'sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import pug from 'gulp-pug';
import uglify from 'gulp-uglify';
import jshint from 'gulp-jshint';
import svgstore from 'gulp-svgstore';
import browserSyncLib from 'browser-sync';
import { deleteAsync } from 'del';
import path from 'path';
import sourcemaps from 'gulp-sourcemaps';

const browserSync = browserSyncLib.create();
const sassCompiler = gulpSass(sass);
let imagemin;

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

async function clean() {
  return deleteAsync([paths.build]);
}

function styles() {
  return gulp.src('app/assets/scss/style.scss')
    .pipe(sourcemaps.init())
    .pipe(sassCompiler().on('error', sassCompiler.logError))
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


function copyFonts() {
  return gulp.src(paths.fonts)
    .pipe(gulp.dest('build/assets/fonts'));
}

function copyImages() {
  return gulp.src(paths.images)
    .pipe(gulp.dest('build/assets/images'));
}

async function images() {
  if (!imagemin) {
    imagemin = (await import('gulp-imagemin')).default;
  }
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

export const build = gulp.series(
  clean,
  gulp.parallel(styles, scripts, copyFonts, gulp.series(copyImages, images, svgSprite), views)
);

export default gulp.series(build, serve);
