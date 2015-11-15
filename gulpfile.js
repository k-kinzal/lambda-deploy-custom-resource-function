'use strict';

var gulp = require('gulp');
var zip  = require('gulp-zip');
var packageJson = require('./package.json');

gulp.task('archive', function () {
  var nodeModulePaths = Object.keys(packageJson['dependencies']).map(function(name) {
    return 'node_modules/' + name + '/**';
  });

  return gulp.src(['src/**'].concat(nodeModulePaths), {base: "."})
             .pipe(zip(packageJson.version + '.zip'))
             .pipe(gulp.dest('dist'));
});