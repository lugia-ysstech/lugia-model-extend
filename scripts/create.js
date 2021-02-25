/**
 *
 * create by guorg
 *
 * @flow
 */

const create = require('@lugia/lugia-package-models').default;
const {join} = require('path');
const LugiaxBabelPlugin = require('./buildPlugin');

const modelFileRelativePath = "./src/models";
const projectPath = join(__dirname, '../');
const MODEL_CACHE_DIR = join(projectPath, './.lugiamega');
const {
  writeJsonSync,
  ensureFileSync,
  existsSync,
  readdirSync,
  readFileSync,
  removeSync
} = require('fs-extra');

function getFolderNames(targetPath, Invalid) {
  return readdirSync(targetPath).filter(
    (folderName) =>
      Invalid.indexOf(folderName) === -1 && folderName.indexOf(".") === -1
  );
}

async function createModeInfosCache (folder, modelPath) {
  const modelsMeta = {};
  await Promise.all(
    folder.map(async (folderItem) => {
      const folderPath = join(modelPath, folderItem);
      let filePath = join(folderPath, "index.ts");
      if (!existsSync(filePath)) {
        filePath = join(folderPath, "index.js");
      }
      const metaPath = join(folderPath, `${folderItem}.zh-CN.json`);
      if (existsSync(filePath) && existsSync(metaPath)) {
        const meta = readFileSync(filePath, "utf-8");
        const nodeModuleName = (await LugiaxBabelPlugin(meta)) || "";
        // tslint:disable-next-line:no-eval
        const target = eval(nodeModuleName);
        const {mutations} = target;
        const newMutations = Object.keys(mutations).reduce(
          (result, next) => {
            // eslint-disable-next-line no-param-reassign
            result[next] = "";
            return result;
          },
          {}
        );
        modelsMeta[folderItem] = {
          module: {
            state: target.getState().toJS(),
            mutations: newMutations,
            model: folderItem
          },
          source: meta
        }
      }
    })
  );
  const cachePath = join(MODEL_CACHE_DIR, './model/modelInfos.json');
  ensureFileSync(cachePath);
  writeJsonSync(cachePath, modelsMeta);
}

async function buildModel () {
  const modelPath = join(projectPath, modelFileRelativePath);
  const folders = getFolderNames(modelPath, []);
  await createModeInfosCache(folders, modelPath);
  await create({importModules: [], projectPath})
  removeSync(MODEL_CACHE_DIR)
}

buildModel();

