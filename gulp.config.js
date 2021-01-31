module.exports = function() {
  const pngquant = require("imagemin-pngquant");

  return {
    build: {
      html: "./build/",
      css: "./build/assets/css/",
      images: "./build/assets/images/"
    },
    src: {
      html: "./src/html/index.html",
      scss: "./src/scss/styles.scss",
      images: "./src/images/**/*.*"
    },
    watch: {
      html: "./src/html/**/*.html",
      scss: "./src/scss/**/*.scss",
      images: "./src/images/**/*.*"
    },
    clean: "./build/*",
    browserSyncConfig: {
      server: {
        baseDir: "./build/"
      },
      host: "localhost",
      port: 9000,
      open: true,
      debug: true
    },
    extender: {
      annotations: true,
      verbose: false
    },
    imagemin: {
      progressive: true,
      svgoPlugins: [
        {
          removeViewBox: false
        }
      ],
      use: [pngquant()],
      interlaced: true
    }
  };
};
