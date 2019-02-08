var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var del = require('del');
var path = require('path');

const outputPath = 'build';

/*HTML Minify & move*/
gulp.task('html', function(){
    return gulp.src(['src/app/*.html'])
    .pipe( htmlmin({collapseWhitespace: true}) )
    .pipe( gulp.dest(`${outputPath}/app`) );
});

/*JSON*/
gulp.task('json', function(){
    return gulp.src(['src/package.json']).pipe( gulp.dest(outputPath) );
});

/*Clean*/
gulp.task('clean:build', function(){
    return del([
        path.resolve(__dirname, 'build')
    ]);
});

gulp.task('clean:dist', function(){
    return del([
        path.resolve(__dirname, 'dist')
    ]);
});

gulp.task('assets', gulp.series('html','json'));
gulp.task('clean', gulp.series('clean:build','clean:dist'));
