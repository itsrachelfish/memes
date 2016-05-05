var gulp = require('gulp');
var sass = require('gulp-sass');
var webpack = require('gulp-webpack');

var scripts =
{
    compile: function()
    {
        return gulp.src('./src/js/main')
            .pipe(webpack(require('./webpack-config')))
            .pipe(gulp.dest('./public/js/'));
    }
}

var scss =
{
    // Compile SCSS into CSS
    compile: function()
    {
        gulp.src('./src/scss/main.scss')
            .pipe(sass().on('error', sass.logError))
            .pipe(gulp.dest('./public/css'));
    },

    // Watch SCSS for changes
    watch: function()
    {
        gulp.watch('./src/scss/**/**/*.scss', ['scss']);
    }
}

gulp.task('default', ['scripts', 'scss', 'scss:watch']);
gulp.task('scripts', scripts.compile);
gulp.task('scss', scss.compile);
gulp.task('scss:watch', scss.watch);
