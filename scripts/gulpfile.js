const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const ts = require('gulp-typescript');
const merge = require('merge2');
const { join } = require('path');

const type = process.env.BABEL_TYPE;

module.exports = (importModules = []) => {
  const babelPlugins = importModules.length > 0 ? [[
    'import', importModules]] : [];

  const plugins = [
    'transform-es2015-modules-commonjs',
  ];

  if (babelPlugins.length > 0) {
    plugins.push(...babelPlugins);
  }
  gulp.task('default', ['js', 'ts', 'css', 'font', 'interface', 'meta']);
  gulp.task('ts', () => {
    const cwd = process.cwd();
    const tsProject = ts.createProject(join(cwd, 'tsconfig.json'));
    const tsResult = gulp.src([`src/${type}/**/*.ts`, `src/${type}/**/*.tsx`]).pipe(tsProject());
    return merge([
      tsResult.dts.pipe(gulp.dest('dist')),
      tsResult.js
        .pipe(
          babel({
            presets: ['react-app'],
            plugins,
          })
        )
        .pipe(uglify())
        .pipe(gulp.dest('dist')),
    ]);
  });
  gulp.task('js', () => {
    return gulp
      .src([`src/${type}/**/*.[js]`])
      .pipe(
        babel({
          presets: ['react-app'],
          plugins,
        })
      )
      .pipe(uglify())
      .pipe(gulp.dest('dist'));
  });
  gulp.task('css', () => {
    return gulp.src(`src/${type}/**/*.css`).pipe(gulp.dest('dist'));
  });
  gulp.task('meta', () => {
    return gulp.src(`src/${type}/**/*.json`).pipe(gulp.dest('dist'));
  });
  gulp.task('font', () => {
    return gulp
      .src([
        `src/${type}/**/*.ttf`,
        `src/${type}/**/*.eot`,
        `src/${type}/**/*.svg`,
        `src/${type}/**/*.png`,
        `src/${type}/**/*.woff`,
        `src/${type}/**/*.woff2`,
      ])
      .pipe(gulp.dest('dist'));
  });
  gulp.task('interface', () => {
    return gulp.src(['src/interface/*.js', 'src/interface/*.json']).pipe(gulp.dest('interface'));
  });
}
