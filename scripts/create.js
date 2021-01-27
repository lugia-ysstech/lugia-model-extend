/**
 *
 * create by guorg
 *
 * @flow
 */
const path = require('path');
const fs = require('fs');
const gulp = require('gulp');
const ensureFileSync = require('fs-extra').ensureFileSync;
const writeJsonSync = require('fs-extra').writeJsonSync;
const readFileSync = require('fs-extra').readFileSync;
const readJsonSync = require('fs-extra').readJsonSync;
const { format } = require("date-fns");
const LugiaxBabelPlugin = require('./buildPlugin');
const buildTask = require("./gulpfile");

const fileRelativePath = '../src/models';

function getTargetPath(targetPath) {
  const url = targetPath || fileRelativePath;
  return path.join(__dirname, url);
}

async function getFolderNames(
  targetPath,
  Invalid,
) {
  return fs
    .readdirSync(getTargetPath(targetPath))
    .filter(
      (folderName) =>
        Invalid.indexOf(folderName) === -1 && folderName.indexOf('.') === -1,
    );
}

async function getModelsMeta(folder) {
  const modelsMeta = {};
  await Promise.all(
    folder.map(async folderItem =>  {
      const folderPath = path.join(__dirname, fileRelativePath, folderItem);
      const meta = readFileSync(path.join(folderPath, 'index.ts'), 'utf-8');
      const nodeModuleName = await LugiaxBabelPlugin(meta, path.join(__dirname, fileRelativePath));
      const target = eval(nodeModuleName);
      const { mutations } = target;
      const newMutations = Object.keys(mutations).reduce((result, next) => {
        // eslint-disable-next-line no-param-reassign
        result[next] = '';
        return result;
      }, {});
      const modelMeta = readJsonSync(path.join(folderPath, `${folderItem}.zh-CN.json`));
      const updateDate = format(new Date(), "yyyy-MM-dd");
      const targetName = `__LUGIAX_MODEL__${folderItem}`;
      modelsMeta[folderItem] = {
        ...modelMeta,
        targetName,
        updateDate,
        module: {
          ...target,
          state: target.getState().toJS(),
          mutations: newMutations
        },
        source: meta
      }
    })
  )

  return modelsMeta;
}

async function create(param) {
  const {importModules} = param;
  const folder = await getFolderNames(fileRelativePath, []);
  const modelsMeta = await getModelsMeta(folder);
  const targetPath = path.join(__dirname, fileRelativePath, 'modelInfos.json');
  ensureFileSync(targetPath);
  writeJsonSync(targetPath, modelsMeta);
  buildTask(importModules);
  gulp.run('default', () => {});
}
create({importModules: []})




