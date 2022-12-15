const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const minifyCSS = require('gulp-csso');
const minifyImg = require('gulp-imagemin');
const minifyJS = require('gulp-uglify');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const del = require('del');
const runSequence = require('run-sequence');

gulp.task('browser-sync', () => {
    browserSync.init({
        server: {
            baseDir: "dist"
        }
    });
});

gulp.task('css', () => {
    return gulp.src('src/sass/**/*.scss')
        .pipe(sass({
            outputStyle: 'nested',
            precision: 10,
            includePaths: ['.']
        }).on('error', sass.logError))
        .pipe(minifyCSS())
        .pipe(autoprefixer())
        .pipe(concat('app.min.css'))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream());
});

gulp.task('bootstrapCss', () => {
    return gulp.src('src/libs/components-bootstrap/css/bootstrap.min.css')
        .pipe(minifyCSS())
        .pipe(concat("plugins.min.css"))
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(browserSync.stream());
}
);

gulp.task('js', () => {
    return gulp.src('src/js/**/*.js')
        .pipe(concat('app.min.js'))
        .pipe(minifyJS())
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.stream());
});

gulp.task('bootstrapJs', () => {
    return gulp.src('src/libs/components-bootstrap/js/popper.min.js'),
    gulp.src('src/libs/components-bootstrap/js/bootstrap.min.js')
        .pipe(concat('bootstrap.bundle.min.js'))
        .pipe(minifyJS())
        .pipe(gulp.dest('dist/assets/js'))
        .pipe(browserSync.stream());
});

gulp.task('html', () => {
    gulp.src('src/**/*.html')
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream());
});

gulp.task('img', () => {
    gulp.src('src/img/**/*')
        .pipe(minifyImg())
        .pipe(gulp.dest('dist/img'));
});

gulp.task('watch', () => {
    gulp.watch("src/sass/**/*.scss", ['css']);
    gulp.watch("src/js/**/*.js", ['js']);
    gulp.watch("src/img/**/*", ['img']);
    gulp.watch("src/**/*.html", ['html']);
    gulp.watch("src/libs/components-bootstrap/css/bootstrap.min.css", ['bootstrapCss']);
    gulp.watch("src/libs/components-bootstrap/js/popper.min.js", ['bootstrapJs']);
    gulp.watch("src/libs/components-bootstrap/js/bootstrap.min.js", ['bootstrapJs']);
});

gulp.task('default', () => {
    runSequence(
        'html',
        'css',
        'bootstrapCss',
        'js',
        'bootstrapJs',
        'img',
        'browser-sync',
        'watch'
    );
});