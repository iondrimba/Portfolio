﻿var gulp = require('gulp');
var requirejsOptimize = require('gulp-requirejs-optimize');
var gulpSequence = require('gulp-sequence')
var path = require('path');
var swPrecache = require('sw-precache');
var bump = require('gulp-bump');
var semver = require('semver');
var renameMe = require('rename-me');
var injectMe = require('injectme');
var pckg = require('./package.json');
var patch = semver.inc(pckg.version, 'patch');
var minor = semver.inc(pckg.version, 'minor');
var major = semver.inc(pckg.version, 'major');

var requirePaths = {
  noJquery: 'node_modules/nojquery/nojquery',
  TweenLite: 'src/scripts/vendors/TweenLite',
  handlebars: 'node_modules/handlebars/dist/handlebars',
  notifyCss: 'src/scripts/app/core/notifyCss',
  page: 'node_modules/page/page',
  models: 'src/scripts/app/models',
  views: 'src/scripts/app/views',
  vendors: 'src/scripts/vendors',
  core: 'src/scripts/app/core'
};

function bumpPackageJson(type) {
  return gulp.src(['./package.json'])
    .pipe(bump({
      version: type
    }))
    .pipe(gulp.dest('./'));
}

function bumpAppFiles(version) {
  var options = {};
  options.version = version;
  options.indexFile = './public/index.html';

  options.filePath = ['./public/scripts/main.js'];
  options.outputfolder = ['./public/scripts/'];

  renameMe(options);
}


function injectFiles() {
  var options = {};

  options.cssPath = './public/css/main.css';
  options.jsPath = './public/sw-setup.js';
  options.indexFile = './public/index.html';

  var injectedHtml = injectMe(options);
}

//PATCH
gulp.task('patch', function () {
  return bumpPackageJson(patch);
});

//MINOR
gulp.task('minor', function () {
  return bumpPackageJson(minor);
});

//MAJOR
gulp.task('major', function () {
  return bumpPackageJson(major);
});

//clean public files
gulp.task('clean', require('./tasks/clean.js'));

//scss - lint
gulp.task('scss-lint', require('./tasks/scss-lint.js'));

//sass/scss
gulp.task('sass', require('./tasks/sass.js'));

//copy  files
gulp.task('copy', require('./tasks/copy.js'));

//css min
gulp.task('cssmin', require('./tasks/cssmin.js'));

//eslint
gulp.task('eslint', require('./tasks/eslint.js'));

//js min
gulp.task('minifyjs', require('./tasks/minifyjs.js'));

//require dev
gulp.task('requirejs:dev', function () {
  return require('./tasks/requirejs.js')(requirePaths, 'none');
});

//require production
gulp.task('requirejs:prod', function () {
  return require('./tasks/requirejs.js')(requirePaths, 'none');
});

//browsersync task
gulp.task('browser-sync', require('./tasks/browser-sync.js'));

//offline support
gulp.task('service-worker', function (callback) {
  var rootDir = 'public';
  swPrecache.write(path.join(rootDir, 'service-worker.js'), {
    staticFileGlobs: [
      rootDir + '/**/*.{html,json}',
      rootDir + '/**/require.js',
      rootDir + '/**/main.1.40.0.{js,css}',
      rootDir + '/*.{png,jpg,gif}',
      rootDir + '/**/*.{png,jpg,gif}',
      rootDir + '/**/*.{svg,eot,ttf,woff,woff2}'
    ],
    stripPrefix: rootDir,
    cacheId: pckg.version,
    runtimeCaching: [{
      urlPattern: '(.*)',
      handler: 'cacheFirst'
    }]
  }, callback);
});

gulp.task('bump-patch', ['patch', 'service-worker'], function renamePatch() {
  bumpAppFiles(patch);
});

gulp.task('bump-minor', ['minor', 'service-worker'], function renameMinor() {
  bumpAppFiles(minor);
});

gulp.task('bump-major', ['major', 'service-worker'], function renameMajor() {
  bumpAppFiles(major);
});

gulp.task('inject', function inject() {
  injectFiles();
});

//watch task
gulp.task('watch', require('./tasks/watch.js'));

gulp.task('default', gulpSequence(['sass', 'copy', 'requirejs:dev'], 'inject', 'browser-sync', 'watch'));

gulp.task('prod', gulpSequence(['sass', 'cssmin', 'requirejs:prod', 'clean'], 'copy', 'minifyjs', 'bump-minor', 'inject'));

