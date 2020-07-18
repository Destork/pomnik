'use strict';

/* пути к исходным файлам (src), к готовым файлам (build), а также к тем, за изменениями которых нужно наблюдать (watch) */
var path = {
    build: {
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/',
        data: 'src/html/',
        pages: 'src/html/data/'
    },
    src: {
        html: 'src/html/pages/**/*.html',
        js: 'src/js/main.js',
        style: 'src/style/main.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*',
        data: 'src/html/data/*.json',
        pages: 'src/html/data/pages/*.json'
    },
    watch: {
        html: 'src/html/**/*.html',
        js: 'src/js/**/*.js',
        css: 'src/style/**/*.scss',
        img: 'src/img/**/*.*',
        fonts: 'srs/fonts/**/*.*',
        data: 'src/html/data/**/*.json',
        pages: '!src/html/data/pages.json'
    },
    clean: './build/*'
};

/* настройки сервера */
var config = {
    webserver: {
        server: {
            baseDir: './build'
        },
        notify: false
    },
    html: {
        path: 'src/'
    },
    html_minify: {
        collapseBooleanAttributes: true,
        collapseInlineTagWhitespace: true,
        collapseWhitespace: true,
        sortAttributes: true,
        sortClassName: true
    },
    data: {
        fileName: 'data.json'
    },
    pages: {
        fileName: 'pages.json'
    }
};

/* подключаем gulp и плагины */
var gulp = require('gulp'),  // подключаем Gulp
    webserver = require('browser-sync'), // сервер для работы и автоматического обновления страниц
    plumber = require('gulp-plumber'), // модуль для отслеживания ошибок
    template = require('gulp-nunjucks-render'), // модуль для импорта содержимого одного файла в другой
    sourcemaps = require('gulp-sourcemaps'), // модуль для генерации карты исходных файлов
    sass = require('gulp-sass'), // модуль для компиляции SASS (SCSS) в CSS
    autoprefixer = require('gulp-autoprefixer'), // модуль для автоматической установки автопрефиксов
    cleanCSS = require('gulp-clean-css'), // плагин для минимизации CSS
    cache = require('gulp-cache'), // модуль для кэширования
    imagemin = require('gulp-imagemin'), // плагин для сжатия PNG, JPEG, GIF и SVG изображений
    jpegrecompress = require('imagemin-jpeg-recompress'), // плагин для сжатия jpeg
    pngquant = require('imagemin-pngquant'), // плагин для сжатия png
    rimraf = require('gulp-rimraf'), // плагин для удаления файлов и каталогов
    json_config = require('gulp-json-config'),
    data = require('gulp-data'),
    fs = require('fs'),
    include = require('gulp-include'),
    eslint = require('gulp-eslint'),
    html_minify = require('gulp-htmlmin'),
    rename = require('gulp-rename');

/* задачи */

// запуск сервера
gulp.task('webserver', function () {
    webserver(config.webserver);
});

gulp.task('data:pages:build', function () {
    return gulp.src(path.src.pages)
        .pipe(plumber())
        .pipe(json_config(config.pages))
        .pipe(gulp.dest(path.build.pages));
});

gulp.task('data:build',
    gulp.series(
        'data:pages:build',
        function () {
            return gulp.src(path.src.data)
                .pipe(plumber())
                .pipe(json_config(config.data))
                .pipe(gulp.dest(path.build.data));
        }
    )
);

// сбор html
gulp.task('html:build',
    gulp.series(
        'data:build',
        function () {
            return gulp.src(path.src.html) // выбор всех html файлов по указанному пути
                .pipe(plumber()) // отслеживание ошибок
                .pipe(data(function () {
                    return JSON.parse(fs.readFileSync('./' + path.build.data + config.data.fileName))
                }))
                .pipe(template(config.html)) // импорт вложений
                .pipe(html_minify(config.html_minify))
                .pipe(gulp.dest(path.build.html)) // выкладывание готовых файлов
                .pipe(webserver.reload({stream: true})); // перезагрузка сервера
        }
    )
);

// сбор стилей
gulp.task('css:build', function () {
    return gulp.src(path.src.style) // получим main.scss
        .pipe(plumber()) // для отслеживания ошибок
        .pipe(sourcemaps.init()) // инициализируем sourcemap
        .pipe(sass()) // scss -> css
        .pipe(autoprefixer()) // добавим префиксы
        .pipe(gulp.dest(path.build.css))
        .pipe(rename({suffix: '.min'}))
        .pipe(cleanCSS({ level: 2 })) // минимизируем CSS
        .pipe(sourcemaps.write('./')) // записываем sourcemap
        .pipe(gulp.dest(path.build.css)) // выгружаем в build
        .pipe(webserver.reload({stream: true})); // перезагрузим сервер
});

// сбор js
gulp.task('js:build', function () {
    return gulp.src(path.src.js) // получим файл main.js
        .pipe(plumber()) // для отслеживания ошибок
        .pipe(sourcemaps.init()) //инициализируем sourcemap
        .pipe(include()) // импортируем все указанные файлы в main.js
        .pipe(eslint())
        // .pipe(eslint.format())
        .pipe(gulp.dest(path.build.js))
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('./')) //  записываем sourcemap
        .pipe(gulp.dest(path.build.js)) // положим готовый файл
        .pipe(webserver.reload({stream: true})); // перезагрузим сервер
});

// перенос шрифтов
gulp.task('fonts:build', function () {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts));
});

// обработка картинок
gulp.task('image:build', function () {
    return gulp.src(path.src.img) // путь с исходниками картинок
        .pipe(cache(imagemin([ // сжатие изображений
            imagemin.gifsicle({interlaced: true}),
            jpegrecompress({
                progressive: true,
                max: 90,
                min: 80
            }),
            pngquant(),
            imagemin.svgo({plugins: [{removeViewBox: false}]})
        ])))
        .pipe(gulp.dest(path.build.img)); // выгрузка готовых файлов
});

// удаление каталога build
gulp.task('clean:build', function () {
    return gulp.src(path.clean, {read: false})
        .pipe(rimraf());
});

// очистка кэша
gulp.task('cache:clear', function () {
    cache.clearAll();
});

// сборка
gulp.task('build',
    gulp.series('clean:build',
        gulp.parallel(
            'html:build',
            'css:build',
            'js:build',
            'fonts:build',
            'image:build'
        )
    )
);

// запуск задач при изменении файлов
gulp.task('watch', function () {
    gulp.watch([path.watch.html, path.watch.data, path.watch.pages], gulp.series('html:build'));
    gulp.watch(path.watch.css, gulp.series('css:build'));
    gulp.watch(path.watch.js, gulp.series('js:build'));
    gulp.watch(path.watch.img, gulp.series('image:build'));
    gulp.watch(path.watch.fonts, gulp.series('fonts:build'));
});

// задача по умолчанию
gulp.task('default', gulp.series(
    'build',
    gulp.parallel('webserver', 'watch')
));
