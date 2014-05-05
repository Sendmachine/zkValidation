/**
 * Gulp build file
 */
var gulp = require('gulp');

/**
 * Load plugins
 */
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

/**
 * Define paths.
 * Files will be read in the order found here.
 * So for example, classes.js will be read before controllers.js because
 * the controllers depend on classes.
 */
var paths = {
  scripts: [
    'src/services.js',
    'src/directives.js',
    'src/config.js'
  ]
};

/**
 * Build scripts
 */
gulp.task('scripts', function() {
  return gulp.src(paths.scripts)
    .pipe(uglify())
    .pipe(concat('zkValidation.min.js'))
    .pipe(gulp.dest('build'));
});

/** 
 * Build production app
 */
gulp.task('default', ['scripts']);
