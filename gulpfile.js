'use strict';

var gulp         = require('gulp'); // gulp
var sass         = require('gulp-sass'); // compile scss to css
var imageop      = require('gulp-image-optimization'); // image optimization
var include      = require('gulp-include'); //
var browserSync  = require('browser-sync'); // live reload browser
var imagemin     = require('gulp-imagemin'); // Подключаем библиотеку для работы с изображениями
var pngquant     = require('imagemin-pngquant'); // Подключаем библиотеку для работы с png
var debug        = require('gulp-debug');
var del          = require('del');
var sourcemaps   = require('gulp-sourcemaps');
var cleanCSS     = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('img', function() {
  return gulp.src('./src/images/**/*') // Берем все изображения из src
      .pipe(imagemin({ // Сжимаем их с наилучшими настройками
          optimizationLevel: 5,
          interlaced: true,
          progressive: true,
          svgoPlugins: [{removeViewBox: false}],
          use: [pngquant()]
      }))
      .pipe(gulp.dest('./dist/images'));
});

gulp.task('images', function(cb) {
    return gulp.src(['./src/**/*.png','./src/**/*.jpg','./src/**/*.gif','./src/**/*.jpeg']).pipe(imageop({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true
    }))
    .pipe(debug({title:src}))
    .pipe(gulp.dest('./dist/images')).on('end', cb).on('error', cb);
});


gulp.task('browser-sync', function () {
  browserSync({
      server: './',
      directory: true,
      index: "index.html",
      notify: false
  });
});

gulp.task('html', () =>
    gulp.src('./src/*.html')
        .pipe(include({
            prefix: '@@',
            basepath: './src/modules/'
        }))
        .pipe(gulp.dest('./dist/'))
        .pipe(browserSync.reload({stream: true}))
)

gulp.task('fonts', function() {
  return gulp.src('./src/fonts/**/*.*')
  .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('scripts', function() {
  return
  console.log("-- gulp is running task 'scripts'");
   gulp.src("./src/js/main.js")
    .pipe(include())
      .on('error', console.log)
    .pipe(gulp.dest("./dist/js"));
});

gulp.task('sass', function () {
        return gulp.src('./src/styles/**/*.{scss, sass}')
            .pipe(sourcemaps.init())
            .pipe(sass().on('error', sass.logError))
            .pipe(cleanCSS({compatibility: 'ie8'}))
            .pipe(autoprefixer({
                cascade: false
            }))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest('./dist/css'))
            .pipe(browserSync.reload({stream: true}));
    });


gulp.task('clean', function(){
  return del.sync('dist');
});

gulp.task('build', ['clean', 'sass', 'fonts', 'scripts', 'html', 'img'], function(){
});

gulp.task('watch', ['browser-sync', 'build'], function () {
  gulp.watch('./src/**/*.html', ['html']);
  gulp.watch('./src/styles/**/*.{scss, sass}', ['sass']);
  gulp.watch('./src/js/**/*.js', ['js']);
})

gulp.task('default', ['watch']);