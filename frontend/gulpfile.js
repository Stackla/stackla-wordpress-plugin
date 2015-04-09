var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var minify = require('gulp-minify-css');
var order = require('gulp-order');

var pluginName = 'stackla-wp';
var pluginAdminDirectory = '../app/wp-content/plugins/' + pluginName + '/admin';
var pluginPublicDirectory = '../app/wp-content/plugins/' + pluginName + '/public';

var paths =
{
    'scss':
    {
        'admin':
        {
            'watch':['scss/*.scss'],
            'src':['scss/admin.scss'],
            'dest':pluginAdminDirectory + '/css/'
        },
        'public':
        {
            'watch':['scss/*.scss'],
            'src':['scss/public.scss'],
            'dest':pluginPublicDirectory + '/css/'
        }
    },
    'js':
    {
        'admin':
        {
            'src':['js/lib/*.js' , 'js/*.js' , 'js/admin/**/*.js'],
            'dest':pluginAdminDirectory + '/js/'
        },
        'public':
        {
            'src':['js/lib/*.js' , 'js/*.js' , 'js/public/**/*.js'],
            'dest':pluginPublicDirectory + '/js/'
        }
    },
};

gulp.task('adminScss' , function()
{
    return gulp.src(paths.scss.admin.src)
    .pipe(sass())
    .pipe(concat(pluginName + '-admin.css'))
    .pipe(minify())
    .pipe(gulp.dest(paths.scss.admin.dest));
});

gulp.task('publicScss' , function()
{
    return gulp.src(paths.scss.public.src)
    .pipe(sass())
    .pipe(concat(pluginName + '-public.css'))
    .pipe(minify())
    .pipe(gulp.dest(paths.scss.public.dest));
});

gulp.task('adminJs' , function()
{
    return gulp.src(paths.js.admin.src)
    .pipe(concat(pluginName + '-admin.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.js.admin.dest));
});


gulp.task('watch' , function()
{
    gulp.watch([paths.scss.admin.watch , paths.js.admin.src] , ['adminScss' , 'adminJs']);
});

gulp.task('default' , ['watch' , 'adminScss' , 'adminJs']);