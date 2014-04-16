var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')(),
    stylish = require('jshint-stylish'),
    runSequence = require('run-sequence');

var paths = {
  dest_dir: 'cla_frontend/assets/',
  src_dir: 'cla_frontend/assets-src/',
  styles: 'cla_frontend/assets-src/stylesheets/**/*.scss',
  templates: 'cla_frontend/assets-src/javascripts/templates/*.hbs',
  scripts: [
    // vendor scripts
    'cla_frontend/assets-src/vendor/lodash/dist/lodash.min.js',
    'cla_frontend/assets-src/vendor/jquery-details/jquery.details.js',
    'cla_frontend/assets-src/vendor/handlebars/handlebars.js',
    // templates
    'cla_frontend/assets-src/javascripts/templates.js',
    // CLA
    'cla_frontend/assets-src/javascripts/moj.Helpers.js',
    'cla_frontend/assets-src/javascripts/modules/*'
  ],
  vendor_scripts: 'cla_frontend/assets-src/javascripts/vendor/*',
  images: 'cla_frontend/assets-src/images/**/*'
};

// clean out assets folder
gulp.task('clean', function() {
  return gulp
    .src(paths.dest_dir, {read: false})
    .pipe(plugins.clean());
});

// compile scss
gulp.task('sass', function() {
  gulp
    .src(paths.styles)
    .pipe(plugins.rubySass())
    .pipe(gulp.dest(paths.dest_dir + 'stylesheets'));
});

// js templates
gulp.task('templates', function(){
  gulp.src(paths.templates)
    .pipe(plugins.handlebars())
    .pipe(plugins.defineModule('plain'))
    .pipe(plugins.declare({
      namespace: 'CLA.templates'
    }))
    .pipe(plugins.concat('templates.js'))
    .pipe(gulp.dest(paths.src_dir + 'javascripts'));
});

// default js task
gulp.task('js', ['templates'], function() {
  var prod = paths.scripts.slice(0);

  // ignore debug files
  prod.push('!' + paths.src_dir + '**/*debug*');
  // create concatinated js file
  gulp
    .src(prod)
    .pipe(plugins.concat('cla.main.js'))
    .pipe(gulp.dest(paths.dest_dir + 'javascripts'));
  // copy static vendor files
  gulp
    .src(paths.vendor_scripts)
    .pipe(gulp.dest(paths.dest_dir + 'javascripts/vendor'));
  // create debug js file
  gulp
    .src(paths.src_dir + 'javascripts/**/*debug*')
    .pipe(plugins.concat('cla.debug.js'))
    .pipe(gulp.dest(paths.dest_dir + 'javascripts/'));
});

// jshint js code
gulp.task('lint', function() {
  var files = paths.scripts.slice(0);

  // files to ignore from linting
  files.push('!cla_frontend/assets-src/vendor/**');
  files.push('!cla_frontend/assets-src/javascripts/vendor/**');
  files.push('!cla_frontend/assets-src/javascripts/templates.js');

  gulp
    .src(files)
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter(stylish));
});

// optimise images
gulp.task('images', function() {
  gulp
    .src(paths.images)
    .pipe(plugins.imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest(paths.dest_dir + 'images'));
});

// setup watches
gulp.task('watch', function() {
  gulp.watch(paths.styles, ['sass']);
  gulp.watch(paths.src_dir + 'javascripts/**/*', ['lint', 'js']);
  gulp.watch(paths.images, ['images']);
});

// setup default tasks
gulp.task('default', ['build']);
// run build
gulp.task('build', function() {
  runSequence('clean', ['lint', 'templates', 'js', 'images', 'sass']);
});