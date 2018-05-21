var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
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

/*Clean*/
gulp.task('clean:build', function(){
    gulp.src('build').pipe(clean());
});

gulp.task('clean:dist', function(){
    gulp.src('dist').pipe(clean());
});

gulp.task('assets', ['html','json']);
gulp.task('clean', ['clean:build','clean:dist']);
