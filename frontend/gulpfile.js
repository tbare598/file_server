const gulp = require('gulp');
const del = require('del');
const url = require('url');
const fs = require('fs');
const path = require('path');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const sourceStream = require("vinyl-source-stream");
const tsify = require('tsify');
const util = require('gulp-util');
const gutil = require('gutil');
const notifier = require('node-notifier');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const tslint = require('gulp-tslint');
const rename = require('gulp-rename');
const bs = require('browser-sync').create();
const env = require('./env_configs/config.env').config.env;

//Checking if an environment variable has been set
var envVar = process.env.FILE_SERVER;
if(envVar){
  var envVar = JSON.parse(process.env.FILE_SERVER);
  if(envVar.env != null) env = envVar.env;
}

// Standard handler
function standardHandler(err) {
    // Notification
    notifier.notify({ message: 'Error: ' + err.message });
    // Log to console
    gutil.log(util.colors.red('Error'), err.message);
    this.emit('end');
}
 
// clean the contents of the distribution directory
gulp.task('clean', function(){
  return del('dist/**/*');
});

// copy static assets - i.e. non TypeScript compiled source
gulp.task('copy:assets', ['clean'], function(){
  return gulp.src(['app/**/*', 'libs/**/*.css', 'index.html', '!app/**/*.ts'], { base : './' })
    .pipe(gulp.dest('dist'));
});

// Environment Setup
gulp.task('env-setup', function(){
  return gulp
    .src('env_configs/config.'+env+'.ts')
    .pipe(rename('config.ts'))
    .pipe(gulp.dest('./app/config'));
});

gulp.task('build-bundle:debug', ['clean', 'build-bundle:vendor', 'build-bundle:app:debug'])
gulp.task('build-bundle', ['clean', 'build-bundle:vendor', 'build-bundle:app'])

gulp.task('build-bundle:vendor', ['clean'], function(){
  return gulp.src([
    'node_modules/core-js/client/shim.min.js',
    'node_modules/reflect-metadata/Reflect.js',
    'node_modules/systemjs/dist/system.src.js',
    'node_modules/zone.js/dist/zone.js',
    'systemjs.config.js',
    'libs/**/*.js'
  ])
    .pipe(concat('vendor.bundle.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'))
});

gulp.task('build-bundle:app:debug', ['clean'], function(){
  return browserify({
      basedir: '.',
      debug: true,
      entries: ['app/main.ts'],
      cache: {},
      packageCache: {}
    })
    .plugin(tsify)
    .bundle()
      .on('error', standardHandler)
    .pipe(sourceStream('app.bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps:true}))
    //.pipe(uglify())
    //  .on('error', standardHandler)
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('build-bundle:app', ['clean', 'env-setup'], function(){
  return browserify({
      basedir: '.',
      debug: false,
      entries: ['app/main.ts'],
      cache: {},
      packageCache: {}
    })
    .plugin(tsify)
    .bundle()
      .on('error', standardHandler)
    .pipe(sourceStream('app.bundle.js'))
    .pipe(buffer())
    .pipe(uglify())
      .on('error', standardHandler)
    .pipe(gulp.dest('./dist'));
});

// linting
gulp.task('tslint', function(){
  return gulp.src('app/**/*.ts')
    .pipe(tslint())
    .pipe(tslint.report('verbose'))
      .on('error', standardHandler);
});

gulp.task('serve-build', ['tslint', 'clean', 'copy:assets', 'build-bundle:debug']);

// Run browsersync for development
gulp.task('serve', ['serve-build'], function(){
  bs.init({
    files: ['./**/*', '!.vscode/**/*'],
    server: {
      baseDir: './dist',
      middleware: function(req, res, next) {
          var fileName = url.parse(req.url);
          fileName = fileName.href.split(fileName.search).join("");
          folder = path.resolve(__dirname, 'dist');
          var fileExists = fs.existsSync(folder + fileName);
          if (!fileExists && fileName.indexOf("browser-sync-client") < 0) {
              req.url = '/index.html';
          }
          return next();
      }
    },
    port: "3030"
  });

  gulp.watch(['app/**/*', 'index.html', 'styles.css', 'config.ts' ], ['buildAndReload']);
});

gulp.task('buildAndReload', ['serve-build'], function(done){
  return (function(){
    try {
      bs.reload();
      done();
    } catch (e){
      console.log(e);
    }
  })();
});


gulp.task('build', ['clean', 'build-bundle', 'copy:assets']);
gulp.task('default', ['build']);
