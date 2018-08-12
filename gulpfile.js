var gulp        = require('gulp'); // gulp
var sass        = require('gulp-sass'); // compile scss to css
var imageop     = require('gulp-image-optimization'); // image optimization
var include     = require('gulp-include'); //
var browserSync = require('browser-sync'); // live reload browser
var imagemin    = require('gulp-imagemin'); // Подключаем библиотеку для работы с изображениями
var pngquant    = require('imagemin-pngquant'); // Подключаем библиотеку для работы с png
var debug       = require('gulp-debug');
var del         = require('del');

gulp.task('img', function() {
  return gulp.src('./src/images/**/*') // Берем все изображения из app
      .pipe(imagemin({ // Сжимаем их с наилучшими настройками
          optimizationLevel: 5,
          interlaced: true,
          progressive: true,
          svgoPlugins: [{removeViewBox: false}],
          use: [pngquant()]
      }))
      .pipe(gulp.dest('./dist/images')); // Выгружаем на продакшен
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
      server: {
          baseDir: './dist'
      },
      notify: false
  });
});

gulp.task('html', function() {
  return gulp.src('./src/index.html')
  .pipe(gulp.dest('./dist'))
  .pipe(browserSync.reload({stream: true})); // Обновляем
});

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
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist/styles')) // Выгружаем результата в папку app/css
    .pipe(browserSync.reload({stream: true})); // Обновляем CSS на странице при изменении
});

gulp.task('clean', function(){
  return del.sync('dist');
});

gulp.task('build', ['clean', 'sass', 'fonts', 'scripts', 'html', 'img'], function(){
  console.log('building of project done');
});

gulp.task('watch', ['browser-sync', 'build'], function () {
  gulp.watch('./src/index.html', ['html']);
  gulp.watch('./src/styles/**/*.{scss, sass}', ['sass']);
  gulp.watch('.src/js/**/*.js', ['js']);
})
