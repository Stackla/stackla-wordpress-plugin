var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var minify = require('gulp-minify-css');
var order = require('gulp-order');

var paths =
{
    'scss':
    {
        'watch':['scss/*.scss'],
        'src':['scss/build.scss'],
        'dest':'../app/wp-content/themes/rightmove/css/'
    },
    'js':
    {
        'src':['js/**/*.js'],
        'dest':'../app/wp-content/themes/rightmove/js/'
    },
};

gulp.task('scss' , function()
{
    return gulp.src(paths.scss.src)
    .pipe(sass())
    .pipe(concat('app.css'))
    .pipe(minify())
    .pipe(gulp.dest(paths.scss.dest));
});

gulp.task('js' , function()
{
    return gulp.src(paths.js.src)
    .pipe(order(
        [
            'lib/jquery-1.11.1.js',
            'lib/jquery.form.js',
            'lib/typeahead.bundle.js',
            'app.js',
            'autocomplete.js',
            'form.js',
            'modal.js',
            'ready.js'
        ]
    ))
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.js.dest));
});

gulp.task('watch' , function()
{
    gulp.watch([paths.scss.watch , paths.js.src] , ['scss' , 'js']);
});

gulp.task('default' , ['watch' , 'scss' , 'js']);