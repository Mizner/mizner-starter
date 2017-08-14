const path = require("path");

const PROJECT = "client-name";
const TEST_SITE = "http://starter.dev";
const THEME_NAME = "mizner-starter";

const src = path.resolve("src");
const dist = path.resolve("content/themes/" + THEME_NAME + "/dist/");

const JS_FILES = [
    // 1st file loads first, 2nd, ect.
    "polyfills/promise.min.js",
    "polyfills/modernizr-custom.js",
    "polyfills/object-fit-polyfill.js",
    "skip-link-focus-fix.js",
    "header/fixed-header.js",
    "header/navigation/navigation.js",
    "header/navigation/navigation-mobile.js",
    "header/navigation/navigation-mobile-hide-button-on-scroll.js",
    "popup-base.js",
    "popup-login.js",
    // "visible-in-browser.js",
    "header/navigation/prevent-empty-nav-redirect.js",
    "call-to-action-form-popup.js",
    // jQuery Add-ons
    "vendors/jquery-smooth-scroll.js", /* @todo: rewrite this in vanilla */
];

const FILE_ARRAY = JS_FILES.map((file) => {
    return path.join(src, "/scripts/") + file;
});

const gulp = require("gulp"),
    bs = require("browser-sync").create(),
    autoprefixer = require("gulp-autoprefixer"),
    cssnano = require("gulp-cssnano"),
    uglify = require("gulp-uglify"),
    rename = require("gulp-rename"),
    concat = require("gulp-concat"),
    sass = require("gulp-sass"),
    sourcemaps = require("gulp-sourcemaps"),
    babel = require("gulp-babel"),
    plumber = require("gulp-plumber"),
    del = require('del');

gulp.task("sass", () => {
    gulp.src(path.join(src, "/styles/**/*.scss"))
        .pipe(sourcemaps.init())
        .pipe(sass().on("error", sass.logError))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write())
        .pipe(rename(PROJECT + ".min.css"))
        .pipe(gulp.dest(dist))
        .pipe(bs.stream())
});

gulp.task("js", () => {
    gulp.src(FILE_ARRAY)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(concat("output.js")) // concat pulls all our files together before minifying them
        .pipe(sourcemaps.write())
        .pipe(babel({
            presets: ["es2015"]
        }))
        .pipe(uglify())
        .pipe(rename(PROJECT + ".min.js"))
        .pipe(gulp.dest(dist))
        .pipe(bs.stream())
});

gulp.task("production-sass", () => {
    gulp.src(path.join(src, "/styles/**/*.scss"))
        .pipe(sass().on("error", sass.logError))
        .pipe(autoprefixer())
        .pipe(cssnano())
        .pipe(rename(PROJECT + ".min.css"))
        .pipe(gulp.dest(dist));
});

gulp.task("browser-sync", () => {
    bs.init(["*"], {
        proxy: TEST_SITE,
        root: path.resolve(),
        open: {
            file: "index.php"
        }
    });
});

console.log(path.resolve());

gulp.task("clean:dist", () => {
    return del([
        path.join(dist, "**/*") // here we use a globbing pattern to match everything inside the `dist` folder
    ]);
});

gulp.task("watch", ["browser-sync"], () => {
    gulp.watch(path.join(src, "/styles/**/*.scss"), ["sass"]);
    gulp.watch(path.join(src, "/scripts/**/*.js"), ["js"]);
    gulp.watch("**/*.php", bs.reload);
    gulp.watch("gulpfile.js").on("change", () => {
        process.exit(0)
    })
});

gulp.task("production", [
    "clean:dist",
    "production-sass",
    "js"
]);

gulp.task("default", [
    "clean:dist",
    "sass",
    "js"
]);