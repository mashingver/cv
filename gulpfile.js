var gulp = require('gulp'),
	config = require('./gulp.config')(),
	del = require('del'),
	browserSync = require("browser-sync"),
	reload = browserSync.reload,
	extender = require('gulp-html-extend'),
	mainBowerFiles = require("main-bower-files"),
	$ = require('gulp-load-plugins')({lazy:true});


// Compile HTML
gulp.task('html', function () {
	log('Compiling HTML');
	return gulp.src(config.src.html)
		.pipe($.plumber())
		.pipe(extender(config.extender))
		.pipe($.if(config.env === 'production', $.htmlmin()))
		.on('error', $.util.log)
		.pipe(gulp.dest(config.build.html))
		.pipe(reload({stream: true}));
});

// Compile SCSS
gulp.task('scss', function() {
	log('Compiling SCSS --> CSS');
	return gulp.src(config.src.scss)
		.pipe($.plumber())
		.pipe($.if(config.env == 'development', $.sourcemaps.init()))
		.pipe($.sass())
		.pipe($.cssimport(config.cssimport))
		.pipe($.autoprefixer(config.autoprefixer))
		.pipe($.if(config.env == 'development', $.sourcemaps.write()))
		.pipe($.if(config.env == 'production', $.cssnano()))
		.pipe(gulp.dest(config.build.css))
		.pipe(reload({stream: true}));
});

// Compile JS
gulp.task('js', function () {
	log('Compiling JS');
	return gulp.src(config.src.js)
		.pipe($.plumber())
		.pipe($.rigger())
		.pipe($.if(config.env === 'production', $.uglify()))
		.on('error', $.util.log)
		.pipe(gulp.dest(config.build.js))
		.pipe(reload({stream: true}));
});

// Compile Images
gulp.task('images', function () {
	log('Compiling Images');
	return gulp.src(config.src.img)
		.pipe($.plumber())
		.pipe($.if(config.env === 'production', $.imagemin(config.imagemin)))
		.pipe(gulp.dest(config.build.img))
		.pipe(reload({stream: true}));
});

// Compile vendors CSS
gulp.task("vendors:css", function () {
	log('Compiling vendors css files');
	return gulp.src(mainBowerFiles({
			filter: /.*\.css$/
		}))
		.pipe($.plumber())
		.pipe($.concat('vendors.min.css'))
		.pipe($.cssnano())
		.pipe(gulp.dest(config.build.css));
});

// Compile vendors JS
gulp.task("vendors:js", function () {
	log('Compiling vendors javascript files');
	return gulp.src(mainBowerFiles({
			filter: /.*\.js$/
		}))
		.pipe($.plumber())
		.pipe($.concat('vendors.min.js'))
		.pipe($.uglify())
		.pipe(gulp.dest(config.build.js));
});

// Compile vendors
gulp.task('vendors', function() {
	log('Compiling vendors files');
	gulp.start('vendors:css');
	gulp.start('vendors:js');
});

// Compile build
gulp.task('build', function() {
	log('Compiling build');
	gulp.start('html');
	gulp.start('scss');
	gulp.start('js');
	gulp.start('images');
});

// Server
gulp.task('server', function () {
	log('Starting a server');
	browserSync(config.browserSyncConfig);
});

// Watch files changes
gulp.task('watch', function () {
	log('Watching html, scss, js and image files');
	$.watch([config.watch.html], function (event, cb) {
		gulp.start('html');
	});
	$.watch([config.watch.scss], function (event, cb) {
		gulp.start('scss');
	});
	$.watch([config.watch.js], function (event, cb) {
		gulp.start('js');
	});
	$.watch([config.watch.img], function (event, cb) {
		gulp.start('images');
	});
});

// Clean build folder
gulp.task('clean', function() {
	var files = config.clean;
	log('Cleaning: ' + $.util.colors.blue(files));
	del(files);
});

// Gulp default
gulp.task('default', ['build', 'server', 'watch']);

//Helpers
function log(msg) {
	if (typeof(msg) === 'object') {
		for (var item in msg) {
			if (msg.hasOwnProperty(item)) {
				$.util.log($.util.colors.blue(msg[item]));
			}
		}
	} else {
		$.util.log($.util.colors.blue(msg));
	}
}