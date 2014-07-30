var gulp = require('gulp'),
    path = require('path'),
    plugins = require('gulp-load-plugins')(),
    stylish = require('jshint-stylish'),
    runSequence = require('run-sequence'),
    java_path = path.resolve('node_modules/closurecompiler/jre/bin');
    process.env.PATH = java_path + ':' + process.env.PATH,
    paths = {
      tmp: '.gulptmp/',
      dest: 'cla_frontend/assets/',
      src: 'cla_frontend/assets-src/',
      images: [],
      fonts: [],
      styles: [],
      ng_partials: [],
      vendor_static: [],
      scripts: {}
    };

// styles
paths.styles.push(paths.src + 'stylesheets/**/*.scss');
// fonts
paths.fonts.push(paths.src + 'fonts/**/*');
// images
paths.images.push(paths.src + 'images/**/*');
// partials
paths.ng_partials.push(paths.src + 'javascripts/app/partials/**/*.html');
// partials
paths.vendor_static.push(paths.src + 'javascripts/vendor/**/*');
// scripts
paths.scripts = {
  vendor: [
    paths.src + 'vendor/lodash/dist/lodash.min.js',
    paths.src + 'vendor/jquery/dist/jquery.min.js',
    // angular specific
    paths.src + 'vendor/angular/angular.js',
    paths.src + 'vendor/angular-sanitize/angular-sanitize.js',
    paths.src + 'vendor/angular-animate/angular-animate.js',
    paths.src + 'vendor/angular-sticky/sticky.js',
    paths.src + 'vendor/angular-resource/angular-resource.js',
    paths.src + 'vendor/angular-ui-router/release/angular-ui-router.js',
    paths.src + 'vendor/angular-ui-select/dist/select.js',
    paths.src + 'vendor/angular-i18n/angular-locale_en-gb.js',
    paths.src + 'vendor/moment/moment.js',
    paths.src + 'vendor/angular-moment/angular-moment.js',
    paths.src + 'javascripts/vendor/xeditable.js',
    paths.src + 'javascripts/vendor/ui-bootstrap-custom-tpls-0.10.0.js'
  ],
  app: [
    paths.src + 'javascripts/app/js/app.js',
    paths.tmp + 'javascripts/app/js/constants.js', // dynamically generated by gulp task (ng-constants)
    paths.tmp + 'javascripts/app/partials/**/*', // dynamically generated by gulp task (ng-templates)
    paths.src + 'javascripts/app/js/**/*.js'
  ]
};

// clean out assets folder
gulp.task('clean-pre', function() {
  return gulp
    .src([paths.dest, paths.tmp], {read: false})
    .pipe(plugins.clean());
});
gulp.task('clean-post', function() {
  return gulp
    .src(paths.tmp, {read: false})
    .pipe(plugins.clean());
});

// compile scss
gulp.task('sass', function() {
  gulp
    .src(paths.styles)
    .pipe(gulp.dest(paths.dest + 'scss/'));

  gulp
    .src(paths.styles)
    .pipe(plugins.rubySass({
      sourcemap: true,
      sourcemapPath: '../scss',
      loadPath: 'node_modules/govuk_frontend_toolkit/' // add node module toolkit path
    }))
    .on('error', function (err) { console.log(err.message); })
    .pipe(gulp.dest(paths.dest + 'stylesheets/'));
});

// copy across web fonts
gulp.task('fonts', function() {
  gulp
    .src(paths.fonts)
    .pipe(gulp.dest(paths.dest + 'fonts'));
});

// optimise images
gulp.task('images', function() {
  gulp
    .src(paths.images)
    .pipe(plugins.imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest(paths.dest + 'images'));
});

// static vendor files
gulp.task('vendor', function() {
  gulp
    .src(paths.vendor_static)
    .pipe(gulp.dest(paths.dest + 'javascripts/vendor/'));
});

// convert django cla_common constants into angular constants
gulp.task('ng-constants', function () {
  return gulp
    .src(paths.src + 'javascripts/app/constants.json')
    .pipe(plugins.ngConstant({
      name: 'cla.constants'
    }))
    // Writes config.js to dist folder
    .pipe(gulp.dest(paths.tmp + 'javascripts/app/js/'));
});

// angular partials
gulp.task('ng-templates', function(){
  return gulp.src(paths.ng_partials)
    .pipe(plugins.angularTemplates({module: 'cla.templates'}))
    .pipe(gulp.dest(paths.tmp + 'javascripts/app/partials/'));
});

// concat js files
gulp.task('js-concat', ['ng-constants', 'ng-templates'], function() {
  var concat = paths.scripts.vendor
                  .concat(paths.scripts.app);

  return gulp
    .src(concat)
    .pipe(plugins.concat('cla.main.js'))
    .pipe(gulp.dest(paths.dest + 'javascripts/'));
});

gulp.task('js-compile', ['js-concat'], function(){
  var src_path = paths.dest + 'javascripts/cla.main.js';

  return gulp.src(src_path)
    .pipe(plugins.closureCompiler({
      compilerPath: 'node_modules/closurecompiler/compiler/compiler.jar',
      fileName: 'cla.main.min.js',
      compilerFlags: {
        language_in: 'ECMASCRIPT5',
        warning_level: 'QUIET',
        compilation_level: 'WHITESPACE_ONLY',
      }
    }))
    .pipe(gulp.dest(paths.dest + 'javascripts/'));
});

// jshint js code
gulp.task('lint', function() {
  var lint = paths.scripts.app
                  .concat(['!' + paths.tmp + 'javascripts/app/partials/**/*']);

  gulp
    .src(lint)
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter(stylish));
});

// setup watches
gulp.task('watch', function() {
  var lr = require('gulp-livereload');
  lr.listen();

  gulp.watch(paths.fonts, ['fonts']);
  gulp.watch(paths.styles, ['sass'])
  gulp.watch(paths.images, ['images']);
  gulp.watch(paths.vendor_static, ['vendor']);
  gulp.watch(paths.src + 'javascripts/**/*', ['lint', 'js-concat']);
  // watch built files and send reload event
  gulp.watch([paths.dest + '**/*', '!' + paths.dest + '**/*.scss']).on('change', lr.changed);
});

// setup default task
gulp.task('default', ['build']);
// run build
gulp.task('build', function() {
  runSequence('clean-pre', ['sass', 'fonts', 'images', 'vendor', 'lint', 'js-compile']);
});
