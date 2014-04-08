/*******************************************************************************
    DEPENDENCIES
*******************************************************************************/

var gulp = require('gulp');                             // gulp core
    sass = require('gulp-sass'),                        // sass compiler
    uglify = require('gulp-uglify'),                    // uglifies the js
    jshint = require('gulp-jshint'),                    // check if js is ok
    rename = require("gulp-rename");                    // rename files
    concat = require('gulp-concat'),                    // concatinate js
    notify = require('gulp-notify'),                    // send notifications to osx
    plumber = require('gulp-plumber'),                  // disable interuption
    stylish = require('jshint-stylish'),                // make errors look good in shell
    minifycss = require('gulp-minify-css'),             // minify the css files
    browserSync = require('browser-sync'),              // inject code to all devices
    autoprefixer = require('gulp-autoprefixer');        // sets missing browserprefixes
    svgmin = require('gulp-svgmin');


/*******************************************************************************
    FILE DESTINATIONS (RELATIVE TO ASSSETS FOLDER)
*******************************************************************************/

var target = {
    sass_src : 'assets/scss/**/*.scss',                 // all sass files
    css_dest : 'assets/css',                            // where to put minified css
    js_lint_src : [                                     // all js that should be linted
        'assets/js/build/custom.js'
    ],
    js_uglify_src : [                                   // all js files that should not be concatinated
        'assets/js/build/vendor/modernizr-2.7.1.js'
    ],
    js_concat_src : [                                   // all js files that should be concatinated
        'assets/js/build/vendor/jquery-1.11.0.js',
        'assets/js/build/vendor/jquery.waypoints-1.6.2.js',
        'assets/js/build/vendor/jquery.fitvids-1.0.3.js',
        'assets/js/build/vendor/jquery.icheck-1.0.2.js',
        'assets/js/build/vendor/jquery.fancyselect-1.4.0.js',
        'assets/js/build/vendor/jquery.baselinerythm-1.0.js',
        'assets/js/build/custom.js'
    ],
    js_dest : 'assets/js'                               // where to put minified js
};


/*******************************************************************************
    SASS TASK
*******************************************************************************/

gulp.task('sass', function() {
    gulp.src(target.sass_src)                           // get the files
        .pipe(plumber())                                // make sure gulp keeps running on errors
        .pipe(sass())                                   // compile all sass
        .pipe(autoprefixer(                             // complete css with correct vendor prefixes
            'last 2 version',
            '> 1%',
            'ie 8',
            'ie 9',
            'ios 6',
            'android 4'
        ))
        .pipe(minifycss())                              // minify css
        .pipe(gulp.dest(target.css_dest))               // where to put the file
        .pipe(notify({message: 'SCSS processed!'}));    // notify when done
});


/*******************************************************************************
    JS TASKS
*******************************************************************************/

// lint my custom js
gulp.task('js-lint', function() {
    gulp.src(target.js_lint_src)                        // get the files
        .pipe(jshint())                                 // lint the files
        .pipe(jshint.reporter(stylish))                 // present the results in a beautiful way
});

// minify all js files that should not be concatinated
gulp.task('js-uglify', function() {
    gulp.src(target.js_uglify_src)                      // get the files
        .pipe(uglify())                                 // uglify the files
        .pipe(rename(function(dir,base,ext){            // give the files a min suffix
            var trunc = base.split('.')[0];
            return trunc + '.min' + ext;
        }))
        .pipe(gulp.dest(target.js_dest))                // where to put the files
        .pipe(notify({ message: 'JS processed!'}));     // notify when done
});

// minify & concatinate all other js
gulp.task('js-concat', function() {
    gulp.src(target.js_concat_src)                      // get the files
        .pipe(uglify())                                 // uglify the files
        .pipe(concat('scripts.min.js'))                 // concatinate to one file
        .pipe(gulp.dest(target.js_dest))                // where to put the files
        .pipe(notify({message: 'JS processed!'}));      // notify when done
});


/*******************************************************************************
    SVG MINIFICATION
*******************************************************************************/

gulp.task('svg', function() {
    return gulp.src('assets/img/build/*.svg')
        .pipe(svgmin())
        .pipe(gulp.dest('assets/img'));
});


/*******************************************************************************
    BROWSER SYNC
*******************************************************************************/

gulp.task('browser-sync', function() {
    browserSync.init(['assets/css/*.css', 'assets/js/*.js'], {        // files to inject
        server: {
            baseDir: './'
        }
    });
});


/*******************************************************************************
    GULP TASKS
*******************************************************************************/

gulp.task('default', function() {
    gulp.run('sass', 'js-lint', 'js-uglify', 'js-concat', 'browser-sync');
    gulp.watch('assets/scss/**/*.scss', function() {
        gulp.run('sass');
    });
    gulp.watch(target.js_lint_src, function() {
        gulp.run('js-lint');
    });
    gulp.watch(target.js_minify_src, function() {
        gulp.run('js-uglify');
    });
    gulp.watch(target.js_concat_src, function() {
        gulp.run('js-concat');
    });
    gulp.watch('assets/img/**/*.svg', function() {
        gulp.run('svg');
    });
});