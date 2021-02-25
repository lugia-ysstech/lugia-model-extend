/**
 *
 * create by likunru
 *
 * @flow
 */

const babel = require("@babel/core");
const commonjs = require("@babel/plugin-transform-modules-commonjs");
const destructuring = require("@babel/plugin-transform-destructuring");
const spread = require("@babel/plugin-transform-spread");
const objectSpread = require("@babel/plugin-proposal-object-rest-spread");
const types = require("@babel/types");
const ts = require("@babel/plugin-transform-typescript");

class LugiaxModelBabelPlugin {
  moduleName;
  isFoundRegisterFound;
  constructor() {
    this.moduleName = "";
    this.isFoundRegisterFound = false;
  }

  isLugiaxImport(node) {
    return node.source.value === "@lugia/lugiax";
  }

  updateLugiaxModuleName(moduleName) {
    if (this.moduleName) {
      throw new Error("模型不符合规范，重复引入@lugia/lugiax");
    }
    this.moduleName = moduleName;
  }

  processModuleName(path) {
    const { node } = path;
    if (!this.isLugiaxImport(node)) {
      path.remove();
      return;
    }
    path.traverse({
      ImportDefaultSpecifier: (p) => {
        this.updateLugiaxModuleName(p.node.local.name);
      }
    });
  }

  processLugiaCallExpression(lugiaRegisterPath) {
    const { callee } = lugiaRegisterPath.node;

    if (types.isMemberExpression(callee)) {
      if (
        types.isIdentifier(callee.object, {
          name: "lugiax"
        }) &&
        types.isIdentifier(callee.property, {
          name: "register"
        })
      ) {
        const args = lugiaRegisterPath.node.arguments;
        if (args.length !== 1) {
          throw new Error("注册模型参数数量错误,仅能有一个参数");
        }
        if (this.isFoundRegisterFound) {
          throw new Error("一个文件仅能注册一个模型");
        }
        this.isFoundRegisterFound = true;
      }
    }
  }
}

async function LugiaxBabelPlugin(file) {
  const pluginHandler = new LugiaxModelBabelPlugin();
  const plugin = () => {
    return {
      visitor: {
        ImportDeclaration(path) {
          pluginHandler.processModuleName(path);
        },

        CallExpression(path) {
          pluginHandler.processLugiaCallExpression(path);
        }
      }
    };
  };

  const message = await babel.transformAsync(file, {
    presets: [],
    plugins: [plugin, ts, commonjs, destructuring, spread, objectSpread]
  });
  return message ? message.code : "";
}

module.exports = LugiaxBabelPlugin;
