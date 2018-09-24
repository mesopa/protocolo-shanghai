
// -----------------
// Project Variables
// -----------------

const gulp         = require('gulp'),
      sass         = require('gulp-sass'),
      prefixer     = require('gulp-autoprefixer'),
      minifyCSS    = require('gulp-clean-css'),
      rename       = require('gulp-rename'),
      concat       = require('gulp-concat'),
      uglify       = require('gulp-uglify'),
      htmlmin      = require('gulp-htmlmin'),
      del          = require('del')
      
      connect      = require('gulp-connect');

const theme_name   = 'landingpage',
      theme_suffix = '';

const base_path  = '',
      src        = base_path + '_dev',
      dist       = base_path + '_dist',
      paths      = {
        vendor_js:   [
          'node_modules/jquery/dist/jquery.min.js',
          'node_modules/magnific-popup/dist/jquery.magnific-popup.min.js',
          'node_modules/plyr/dist/plyr.min.js',
        ],
        vendor_css:  [
          'node_modules/normalize.css/normalize.css',
          'node_modules/milligram/dist/milligram.min.css',

          'node_modules/magnific-popup/dist/magnific-popup.css',
          'node_modules/plyr/dist/plyr.css'
        ],
        js:   [
          src + '/js/'   + theme_name + theme_suffix + '.js'
        ],
        sass: [
          src + '/sass/' + theme_name + theme_suffix + '.scss'
        ],
        sass_fonts: [
          src + '/sass/' + theme_name + theme_suffix + '-fonts' + '.scss'
        ]
      };

// -------------
// Project Tasks
// -------------

// -- LOCAL SERVER --
gulp.task('connect', () => {
  connect.server({
    root: dist,
    livereload: true
  });
});

// -- CLEAN  --
gulp.task('clean', () => {
  return del( dist + '/*' );
});

// -- ASSETS --
gulp.task('assets', () => {
  return gulp.src( src + '/assets/**/**/**/*' )
    .pipe( gulp.dest( dist + '/assets' ) );
});

// -- HTML    --
gulp.task('html', () => {
  return gulp.src( src + '/html/**/**/*' )
    .pipe( htmlmin({
      collapseWhitespace: true
    }))
    .pipe( gulp.dest( dist ) )
    .pipe( connect.reload() );
});

// -- FONT AWESOME   --
gulp.task('font-awesome', () => {
  return gulp.src( 'node_modules/@fortawesome/fontawesome-free/webfonts/*' )
    .pipe( gulp.dest( dist + '/assets/fonts/font-awesome/' ) );
});

// -- JS     --
gulp.task('js', () => {
  return gulp.src( paths.js )
    .pipe( concat( theme_name + theme_suffix + '.js' ) )
    .pipe(uglify())
    .pipe( gulp.dest( dist + '/assets/js' ) )
    .pipe( connect.reload() );
});

// -- SASS   --
gulp.task('sass', () => {
  return gulp.src( paths.sass )
    .pipe( sass())
    .pipe( prefixer({
      browsers: [
        'last 2 versions',
        '> 1%',
        'opera 12.1',
        'bb 10',
        'android 4'
        ]
      }))
    .pipe( minifyCSS({
        level: {1: {specialComments: 0}}
      }))
    .pipe( rename( theme_name + theme_suffix + '.css' ) )
    .pipe( gulp.dest( dist + '/assets/css' ) )
    .pipe( connect.reload() );
});

// -- SASS FONTS   --
gulp.task('sass-fonts', () => {
  return gulp.src( paths.sass_fonts )
    .pipe( sass())
    .pipe( prefixer({
      browsers: [
        'last 2 versions',
        '> 1%',
        'opera 12.1',
        'bb 10',
        'android 4'
        ]
      }))
    .pipe( minifyCSS({
        level: {1: {specialComments: 0}}
      }))
    .pipe( rename( theme_name + theme_suffix + '-fonts' + '.css' ) )
    .pipe( gulp.dest( dist + '/assets/css' ) )
});


// -- Vendor JS    --
gulp.task('vendor-js', () => {
  return gulp.src( paths.vendor_js )
    .pipe( concat( theme_name + theme_suffix + '-vendor' + '.js' ) )
    .pipe(uglify())
    .pipe( gulp.dest( dist + '/assets/js' ) );
});

// -- Vendor CSS   --
gulp.task('vendor-css', () => {
  return gulp.src( paths.vendor_css )
    .pipe( concat( theme_name + theme_suffix + '-vendor' + '.css' ) )
    .pipe( minifyCSS({
      level: {1: {specialComments: 0}}
    }))
    .pipe( gulp.dest( dist + '/assets/css' ) );
});


// -- WATCH          --
gulp.task('watch', () => {
  gulp.watch( src + '/html/**/**/*', ['html'] );
  gulp.watch( src + '/js/*',         ['js']);
  gulp.watch( src + '/sass/*',       ['sass'] );
});


// ------------------------------
// -- Project `default` Gulp Task
// ------------------------------

gulp.task(
  'default', ['clean'], () => {
    gulp.start(
      'assets',
      'font-awesome',
      'html',
      'js',
      'sass',
      'sass-fonts',
      'vendor-js',
      'vendor-css',
      'connect',
      'watch'
    )
  });