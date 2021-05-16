
// -----------------
// Project Variables
// -----------------

const { src, dest, series, parallel, watch } = require('gulp');

const sass         = require('gulp-sass'),
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
      source     = base_path + '_dev',
      dist       = base_path + 'docs',
      paths      = {
        vendor_js:   [
          'node_modules/jquery/dist/jquery.min.js',
          'node_modules/magnific-popup/dist/jquery.magnific-popup.min.js',
          'node_modules/plyr/dist/plyr.min.js',
          'node_modules/sal.js/dist/sal.js',
        ],
        vendor_css:  [
          'node_modules/normalize.css/normalize.css',
          'node_modules/milligram/dist/milligram.min.css',

          'node_modules/magnific-popup/dist/magnific-popup.css',
          'node_modules/plyr/dist/plyr.css',
          'node_modules/sal.js/dist/sal.css',
        ],
        js:   [
          source + '/js/'   + theme_name + theme_suffix + '.js'
        ],
        sass: [
          source + '/sass/' + theme_name + theme_suffix + '.scss'
        ],
        sass_fonts: [
          source + '/sass/' + theme_name + theme_suffix + '-fonts' + '.scss'
        ]
      };

// -------------
// Project Tasks
// -------------

// -- LOCAL SERVER --
function connectServer() {
  connect.server({
    root: dist,
    livereload: true
  });
};

// -- CLEAN  --
function clean() {
  return del( dist + '/*' );
};

// -- ASSETS --
function assets() {
  return src( source + '/assets/**/**/**/*' )
    .pipe( dest( dist + '/assets' ) );
};

// -- HTML    --
function html() {
  return src( source + '/html/**/**/*' )
    .pipe( htmlmin({
      collapseWhitespace: true
    }))
    .pipe( dest( dist ) )
    .pipe( connect.reload() );
};

// -- FONT AWESOME   --
function fontAwesome() {
  return src( 'node_modules/@fortawesome/fontawesome-free/webfonts/*' )
    .pipe( dest( dist + '/assets/fonts/font-awesome/' ) );
};

// -- JS     --
function js() {
  return src( paths.js )
    .pipe( concat( theme_name + theme_suffix + '.js' ) )
    .pipe(uglify())
    .pipe( dest( dist + '/assets/js' ) )
    .pipe( connect.reload() );
};

// -- SASS   --
function sassStyles() {
  return src( paths.sass )
    .pipe( sass())
    .pipe( minifyCSS({
        level: {1: {specialComments: 0}}
      }))
    .pipe( rename( theme_name + theme_suffix + '.css' ) )
    .pipe( dest( dist + '/assets/css' ) )
    .pipe( connect.reload() );
};

// -- SASS FONTS   --
function sassFonts() {
  return src( paths.sass_fonts )
    .pipe( sass())
    .pipe( minifyCSS({
        level: {1: {specialComments: 0}}
      }))
    .pipe( rename( theme_name + theme_suffix + '-fonts' + '.css' ) )
    .pipe( dest( dist + '/assets/css' ) )
};


// -- Vendor JS    --
function vendorJs() {
  return src( paths.vendor_js )
    .pipe( concat( theme_name + theme_suffix + '-vendor' + '.js' ) )
    .pipe( uglify())
    .pipe( dest( dist + '/assets/js' ) );
};

// -- Vendor JS AFrame
function vendorAframeJs() {
  return src([
    'node_modules/aframe/dist/aframe-master.js'
  ])
   .pipe( concat( theme_name + theme_suffix + '-vendor-aframe' + '.js'))
   .pipe( uglify())
   .pipe( dest( dist + '/assets/js'));
};

// -- Vendor CSS   --
function vendorCss() {
  return src( paths.vendor_css )
    .pipe( concat( theme_name + theme_suffix + '-vendor' + '.css' ) )
    .pipe( minifyCSS({
      level: {1: {specialComments: 0}}
    }))
    .pipe( dest( dist + '/assets/css' ) );
};


// -- WATCH          --
function watchFiles() {
  watch( source + '/html/**/**/*', html       );
  watch( source + '/js/*',         js         );
  watch( source + '/sass/*',       sassStyles );
};


// ------------------------------
// -- Project `default` Gulp Task
// ------------------------------

exports.default = series(
  clean,
  assets,
  fontAwesome,
  html,
  js,
  sassStyles,
  sassFonts,
  vendorJs,
  vendorAframeJs,
  vendorCss,
  parallel(
    watchFiles,
    connectServer,
  ),
);