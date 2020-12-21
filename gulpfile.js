const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const ts = require('gulp-typescript');
const merge = require('merge2');

const tsProject = ts.createProject('tsconfig.json');
gulp.task('default', ['js', 'ts', 'css', 'font', 'interface', 'meta']);
gulp.task('ts', () => {
  const tsResult = gulp.src(['src/models/**/*.ts', 'src/models/**/*.tsx']).pipe(tsProject());
  return merge([
    tsResult.dts.pipe(gulp.dest('dist')),
    tsResult.js
      .pipe(
        babel({
          presets: ['react-app'],
          plugins: [
            'transform-es2015-modules-commonjs',
            [
              'import',
              [
                {
                  libraryName: '@lugia/lugia-web',
                  libraryDirectory: 'dist',
                }
              ],
            ],
          ],
        })
      )
      .pipe(uglify())
      .pipe(gulp.dest('dist')),
  ]);
});
gulp.task('js', () => {
  return gulp
    .src(['src/models/**/*.js'])
    .pipe(
      babel({
        presets: ['react-app'],
        plugins: [
          'transform-es2015-modules-commonjs',
          [
            'import',
            [
              {
                libraryName: '@lugia/lugia-web',
                libraryDirectory: 'dist',
              },
            ],
          ],
        ],
      })
    )
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});
gulp.task('css', () => {
  return gulp.src('src/models/**/*.css').pipe(gulp.dest('dist'));
});
gulp.task('meta', () => {
  return gulp.src('src/models/**/*.json').pipe(gulp.dest('dist'));
});
gulp.task('font', () => {
  return gulp
    .src([
      'src/models/**/*.ttf',
      'src/models/**/*.eot',
      'src/models/**/*.svg',
      'src/models/**/*.png',
      'src/models/**/*.woff',
      'src/models/**/*.woff2',
    ])
    .pipe(gulp.dest('dist'));
});
gulp.task('interface', () => {
  return gulp.src(['src/interface/*.js', 'src/interface/*.json']).pipe(gulp.dest('interface'));
});
