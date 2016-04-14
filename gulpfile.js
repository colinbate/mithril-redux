const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
//var concat = require("gulp-concat");
//var umd = require('gulp-umd');

const paths = {
  js: ['index.js']
};

gulp.task('default', ['js', 'watch']);

gulp.task('js', function () {
  return gulp.src(paths.js)
    .pipe(sourcemaps.init())
    .pipe(babel())
    //.pipe(umd())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function () {
  gulp.watch(paths.js, ['js']);
});

gulp.task('js:prod', function () {
  return gulp.src(paths.js)
    .pipe(babel())
    //.pipe(umd())
    .pipe(gulp.dest('dist'));
});
