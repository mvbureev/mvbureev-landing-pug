const browserSync = require('browser-sync').create();
const gulp = require('gulp');
const pug = require('gulp-pug');
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const rename = require("gulp-rename");
const sourcemaps = require('gulp-sourcemaps');
const rimraf = require('rimraf');
const gulpSass = require('gulp-sass');
const dartSass = require('sass');

const sass = gulpSass( dartSass );

const isProd = process.env.NODE_ENV = 'production';

/* Static server */
if (isProd) {
  gulp.task('server', function() {
    browserSync.init({
      server: {
        port: 3000,
        baseDir: "build"
      }
    });
    gulp.watch('build/**/*').on('change',browserSync.reload)
  });
}

gulp.task('templates:compile', function buildHTML() {
  return gulp.src('src/template/index.pug')
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('build'))
});

gulp.task('sass', function () {
  return gulp.src('src/styles/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle:'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(rename('main.min.css'))
    .pipe(gulp.dest('build/css'));
});

gulp.task('clean', function del(cb) {
  return rimraf('build',cb);
});

gulp.task('copy:fonts', function () {
  return gulp.src('src/fonts/**')
    .pipe(gulp.dest('build/fonts'));
});

gulp.task('copy:images', function () {
  return gulp.src('src/images/**')
    .pipe(imagemin())
    .pipe(gulp.dest('build/images'))
});

gulp.task('copy:public', function () {
  return gulp.src('src/public/**')
    .pipe(imagemin())
    .pipe(gulp.dest('build/public'))
});

gulp.task('copy',gulp.parallel(
  'copy:fonts',
  'copy:images',
  'copy:public'
));

gulp.task('watch',function () {
  gulp.watch('src/template/**/*.pug',gulp.series('templates:compile'));
  gulp.watch('src/styles/**/*.scss',gulp.series('sass'));
  gulp.watch('src/images/**',gulp.series('copy:images'));
  gulp.watch('src/public/**',gulp.series('copy:public'));
  gulp.watch('src/fonts/**',gulp.series('copy:fonts'));
});

gulp.task('default',gulp.series(
  'clean',
  gulp.parallel(
    'sass',
    'templates:compile',
    'copy'
  ),
  gulp.parallel('watch','server')
));
