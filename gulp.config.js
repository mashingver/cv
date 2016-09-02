module.exports = function() {

	var pngquant = require('imagemin-pngquant');

	var config =  {
		env: 'development',
		build: {
			html: './build/',
			css: './build/assets/css/',
			js: './build/assets/js/',
			img: './build/assets/images/'
		},
		src: {
			html: './src/html/index.html',
			scss: './src/scss/styles.scss',
			js: './src/js/main.js',
			img: './src/images/**/*.*'
		},
		watch: {
			html: './src/html/**/*.html',
			scss: './src/scss/**/*.scss',
			js: './src/js/**/*.js',
			img: './src/images/**/*.*'
		},
		clean: './build/*',
		autoprefixer: {
			browsers: ['last 10 versions']
		},
		browserSyncConfig: {
			server: {
				baseDir: "./build/"
			},
			host: 'localhost',
			port: 9000,
			open:        true,
			debug:       true
		},
		cssimport: {
			matchPattern: '*.css'
		},
		extender: {
			annotations: true,
			verbose: false
		},
		imagemin: {
			progressive: true,
			svgoPlugins: [{
				removeViewBox: false
			}],
			use: [pngquant()],
			interlaced: true
		}
	};

	return config;
};