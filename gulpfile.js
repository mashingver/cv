const gulp = require("gulp");
const del = require("del");
const browserSync = require("browser-sync").create();
const extender = require("gulp-html-extend");
const $ = require("gulp-load-plugins")({lazy: true});
const config = require('./gulp.config')();

// Compile HTML
function html() {
  log("Compiling HTML");
  return gulp
    .src(config.src.html)
    .pipe($.plumber())
    .pipe(extender(config.extender))
    .pipe($.htmlmin())
    .on("error", $.util.log)
    .pipe(gulp.dest(config.build.html))
    .pipe(browserSync.stream());
}

// Compile SCSS
function scss() {
  log("Compiling SCSS --> CSS");
  return gulp
    .src(config.src.scss)
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass())
    .pipe($.cssimport(config.cssimport))
    .pipe($.autoprefixer(config.autoprefixer))
    .pipe($.cssnano())
    .pipe($.rename({extname: ".min.css"}))
    .pipe($.sourcemaps.write("./"))
    .on("error", $.util.log)
    .pipe(gulp.dest(config.build.css))
    .pipe(browserSync.stream());
}

function images() {
  log("Optimizing Images");
  return gulp
    .src(config.src.images)
    .pipe($.plumber())
    .pipe($.imagemin(config.imagemin))
    .pipe(gulp.dest(config.build.images))
    .pipe(browserSync.stream());
}

// Compile build
function build(done) {
  log("Compiling build");
  gulp.series(clean, images, html, scss)(done);
}

// BrowserSyncServer
function browserSyncServer(done) {
  log('Starting a server');
  browserSync.init(config.browserSyncConfig);
  done();
}

// Watch files changes
function watchFiles() {
  log("Watching html, scss and image files");
  gulp.watch(config.watch.html, html);
  gulp.watch(config.watch.scss, scss);
  gulp.watch(config.watch.images, images);
}

// Clean build folder
function clean(done) {
  const files = config.clean;
  log("Cleaning: " + $.util.colors.blue(files));
  del(files);
  done();
}

exports.default = gulp.series(clean, build, gulp.parallel(watchFiles, browserSyncServer));
exports.html = html;
exports.scss = scss;
exports.images = images;

// Helpers
function log(msg) {
  if (typeof msg === "object") {
    for (let item in msg) {
      if (msg.hasOwnProperty(item)) {
        $.util.log($.util.colors.blue(msg[item]));
      }
    }
  } else {
    $.util.log($.util.colors.blue(msg));
  }
}
