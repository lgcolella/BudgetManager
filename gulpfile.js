var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var clean = require('gulp-clean');

const outputPath = 'build';

/*HTML Minify & move*/
gulp.task('html', function(){
    return gulp.src(['src/app/*.html'])
    .pipe( htmlmin({collapseWhitespace: true}) )
    .pipe( gulp.dest(`${outputPath}/app`) );
});

/*JSON*/
gulp.task('json', function(){
    gulp.src(['src/package.json']).pipe( gulp.dest(outputPath) );
});

/*NODE_MODULES*/
gulp.task('node_modules', function(){
    gulp.src(['src/node_modules/*']).pipe( gulp.dest(outputPath+'/node_modules') );
});

/*CSS*/

/*gulp.task('vendor-css', function(){
    gulp.src('src/app/style/vendor-font/**').pipe(gulp.dest(`${outputPath}/app/style/vendor-font`));
    gulp.src('src/app/style/vendor-css/**').pipe(gulp.dest(`${outputPath}/app/style/vendor-css`));
});*/

/*FONTS*/
/*gulp.task('fonts', function(){
    gulp.src('src/app/vendor/font/*').pipe(gulp.dest(`${outputPath}/app/vendor/font`));
});*/

/*SASS*/
gulp.task('sass', function(){
    gulp.src('./src/app/style/sass/*.scss')
    .pipe( sass().on('error', sass.logError) )
    .pipe( gulp.dest('./src/app/style/css') )
});

gulp.task('sass-watch', ['sass'], function(){
    gulp.watch('./src/app/style/sass/*.scss', ['sass']);
});

/*Clean*/
gulp.task('clean:build', function(){
    gulp.src('build').pipe(clean());
});

gulp.task('clean:dist', function(){
    gulp.src('dist').pipe(clean());
});

gulp.task('assets', ['html','json','node_modules']);
gulp.task('clean', ['clean:build','clean:dist']);
