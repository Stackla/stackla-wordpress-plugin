var gulp = require('gulp');
var livereload = require('gulp-livereload');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var minify = require('gulp-minify-css');
var order = require('gulp-order');
var react = require('gulp-react');
var autoprefixer = require('gulp-autoprefixer');

var pluginName = 'stackla-wp';
var pluginAdminDirectory = '../admin';
var pluginPublicDirectory = '../public';

var paths = {
    'reactComponents': {
        src:'js/components/**/*.jsx',
        dest:'js/compiled/',
        watch:'js/components/**/*.jsx'
    },
    'reactViews': {
        src:'js/views/*.jsx',
        dest:'js/compiled/'
    },
    'css': {
        'admin': {
            'watch':[pluginAdminDirectory + '/css/*.css']
        },
        'public': {
            'watch':[pluginPublicDirectory + '/css/*.css']
        }
    },
    'scss': {
        'admin': {
            'watch':['scss/*.scss'],
            'src':['scss/admin.scss'],
            'dest':pluginAdminDirectory + '/css/'
        },
        'public': {
            'watch':['scss/*.scss'],
            'src':['scss/public.scss'],
            'dest':pluginPublicDirectory + '/css/'
        }
    },
    'js': {
        'admin': {
            'src':['js/**/*.js', '!**/public/**'],
            'dest':pluginAdminDirectory + '/js/'
        },
        'public': {
            'src':['js/app.js', 'js/public/**/*.js'],
            'dest':pluginPublicDirectory + '/js/'
        }
    },
};

gulp.task('reactComponents' , function() {
    return gulp.src(paths.reactComponents.src)
    .pipe(concat('components.js'))
    .pipe(react())
    .pipe(gulp.dest(paths.reactComponents.dest));
});

gulp.task('reactViews' , function() {
    return gulp.src(paths.reactViews.src)
    .pipe(concat('views.js'))
    .pipe(react())
    .pipe(gulp.dest(paths.reactViews.dest));
});

gulp.task('adminScss' , function() {
    return gulp.src(paths.scss.admin.src)
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(concat(pluginName + '-admin.css'))
    .pipe(minify())
    .pipe(gulp.dest(paths.scss.admin.dest));
});

gulp.task('publicScss' , function() {
    return gulp.src(paths.scss.public.src)
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(concat(pluginName + '-public.css'))
    .pipe(minify())
    .pipe(gulp.dest(paths.scss.public.dest));
});

gulp.task('adminJs' , function() {
    return gulp.src(paths.js.admin.src)
    .pipe(order([
        'lib/lodash.js',
        'lib/jquery.cookie.js',
        'lib/react.js',
        'app.js',
        'admin/polyfills.js',
        'admin/config.js',
        'compiled/components.js',
        'compiled/views.js',
        'admin/metabox.js',
        'admin/settings.js',
        'admin/ready.js'
    ]))
    .pipe(concat(pluginName + '-admin.js'))
    //.pipe(uglify())
    .pipe(gulp.dest(paths.js.admin.dest));
});

gulp.task('publicJs' , function() {
    return gulp.src(paths.js.public.src)
    .pipe(concat(pluginName + '-public.js'))
    //.pipe(uglify())
    .pipe(gulp.dest(paths.js.public.dest));
});

gulp.task('watch' , function() {
    livereload.listen();
    gulp.watch(
    [
        paths.scss.admin.watch,
        paths.js.admin.src,
        paths.reactComponents.watch,
        paths.reactViews.src,
        paths.js.public.src
    ],
    [
        'reactComponents',
        'reactViews',
        'adminScss',
        'adminJs',
        'publicJs'
    ]);
    gulp.watch(paths.css.admin.watch).on('change', livereload.changed);
    gulp.watch(paths.css.public.watch).on('change', livereload.changed);
});

gulp.task('default' , ['watch' , 'reactComponents' , 'reactViews',  'adminScss' , 'adminJs']);
