var gulp = require('gulp');
var browserify = require('browserify');
var clean = require('gulp-clean');
var es6 = require('gulp-es6-transpiler');
var nodemon = require('gulp-nodemon');
var rename = require('gulp-rename');
var transform = require('vinyl-transform');
var watch = require('gulp-watch');

gulp.task('browserify', ['transpile-lib', 'transpile-app', 'clean'], function() {
  return gulp.src(['src/**/index.js', '!src/server/index.js'])
    .pipe(transform(function(filename) {
      return browserify(filename).bundle();
    }))
    .pipe(rename(function(path) {
      path.basename = path.dirname;
      path.dirname = "";
    }))
    .pipe(gulp.dest('public/javascripts'));
});

gulp.task('clean', function() {
  return gulp.src('public/javascripts', { read: false })
    .pipe(clean());
});

gulp.task('transpile-app', function() {
  return gulp.src('src/*/*.es6.js')
    .pipe(es6({
      disallowUnknownReferences: false
    }))
    .pipe(rename(function(path) {
      path.basename = path.basename.replace('.es6', '');
    }))
    .pipe(gulp.dest('src/'));
});

gulp.task('transpile-lib', function() {
  return gulp.src('../../lib/*/*.es6.js')
    .pipe(es6({
      disallowUnknownReferences: false
    }))
    .pipe(rename(function(path) {
      path.basename = path.basename.replace('.es6', '');
    }))
    .pipe(gulp.dest('../../lib/'));
});

gulp.task('watch', function() {
  return gulp.watch(['../../lib/**/*.es6.js', 'src/**/*.es6.js'], ['browserify']);
});

gulp.task('serve', function() {
  return nodemon({
    script: './src/server/index.js',
    ext: 'js html',
    env: {
      'NODE_ENV': 'development'
    },
    nodeArgs: ['--harmony']
  });
});