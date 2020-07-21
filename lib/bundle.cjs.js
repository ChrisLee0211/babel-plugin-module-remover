'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var loaderUtils = _interopDefault(require('loader-utils'));
var generator = _interopDefault(require('@babel/generator'));
var traverse = _interopDefault(require('@babel/traverse'));
var parser = require('@babel/parser');

var typeEnum;
(function (typeEnum) {
    typeEnum["string"] = "[object String]";
    typeEnum["number"] = "[object Number]";
    typeEnum["boolean"] = "[object Boolean]";
    typeEnum["undefined"] = "object Undefined]";
    typeEnum["null"] = "object Null]";
    typeEnum["object"] = "[object Object]";
    typeEnum["function"] = "[object Function]";
    typeEnum["array"] = "[object Array]";
    typeEnum["date"] = "[object Date]";
    typeEnum["reg"] = "[object RegExp]";
})(typeEnum || (typeEnum = {}));
/**
 * Verify that a value is an object
 * @param {any} obj
 * @returns {boolean}
 * @author  chrislee
 * @Time 2020/7/12
 */
const isObject = (obj) => {
    let res = true;
    if (Object.prototype.toString.call(obj) === '[object Object]') {
        res = true;
    }
    else {
        res = false;
    }
    return res;
};
/**
 * Verify that a value is an array
 * @param {any} obj
 * @returns {boolean}
 * @author chrislee
 * @Time 2020/7/12
 */
const isArray = (obj) => {
    let res;
    if (obj instanceof Array || Object.prototype.toString.call(obj) === typeEnum["array"]) {
        res = true;
    }
    else {
        res = false;
    }
    return res;
};
const typeValidate = (obj, type, constant = `The value of target`) => {
    let res;
    if (Object.prototype.toString.call(obj) === typeEnum[type]) {
        res = true;
    }
    else {
        let currentType = `undefined`;
        for (const key in typeEnum) {
            if (typeEnum[key] === Object.prototype.toString.call(obj)) {
                currentType = key;
            }
        }
        throw Error(`TypeError:${constant} expect a ${type},but got ${currentType}`);
    }
    return res;
};

/**
 * validate the option and normalize it
 * @param opt loader option
 */
const optionValidate = (opt) => {
    const { target, type } = opt;
    const typeExpect = ["esm", "cjs"];
    if (typeValidate(type, "string", `The type param in module-remover's option`)) {
        if (typeExpect.includes(type) === false) {
            throw Error(`The type param in module-remover's option only recieve keyword 'esm' or 'cjs'`);
        }
    }
    const isArray$1 = isArray(target);
    const isObj = isObject(target);
    const targetObject = Object.create(null);
    if (isArray$1) {
        if (target.length < 1)
            return {};
        for (const item of target) {
            if (typeValidate(item, "string", `The value of target array in the module-remover's option`)) {
                targetObject[item] = true;
            }
        }
    }
    else if (isObj) {
        const keys = Object.keys(target);
        for (const item of keys) {
            if (typeValidate(target[item], "boolean", `The value of target object in the module-remover's option`)) {
                targetObject[item] = target[item];
            }
        }
    }
    return targetObject;
};

/**
 * Transform a ast tree for removing the module
 * @param ast The AST object, it usually come from @babel/praser's return
 * @param type The module type ,only support EsModule and commonJs
 * @param moduleList The list of modules that user want to remove or keep it
 * @author chrislee
 * @Time 2020/7/18
 */
const transform = (ast, type, moduleList) => {
    const targetModules = Object.keys(moduleList).filter((v) => moduleList[v] === true);
    const visitor = type === "esm" ? esmTransformer(targetModules) : cjsTransformer(targetModules);
    traverse(ast, visitor);
};
/**
 * The traverse's rule about Esmodule
 * @param targetModules The list of modules that user want to remove or keep it
 * @returns {visiter} a rule of traverse
 * @author chrislee
 * @Time 2020/7/18
 */
function esmTransformer(targetModules) {
    const visitor = {
        ImportDeclaration(path) {
            const { source } = path.node;
            if (targetModules.includes(source.value)) {
                path.remove();
            }
        }
    };
    return visitor;
}
/**
 * The traverse's rule about commonJs
 * @param targetModules The list of modules that user want to remove or keep it
 * @returns {visiter} a rule of traverse
 * @author chrislee
 * @Time 2020/7/18
 */
function cjsTransformer(targetModules) {
    const visitor = {
        VariableDeclaration(path) {
            const { declarations } = path.node;
            Array.from(declarations).forEach(declarator => {
                const { init } = declarator;
                if ((init === null || init === void 0 ? void 0 : init.type) === "CallExpression") {
                    const callee = init.callee;
                    if (callee.name && callee.name === "require") {
                        const { arguments: args } = init;
                        const isTarget = args.some((v) => {
                            if (v.type === "StringLiteral" && targetModules.includes(v.value) === true) {
                                return true;
                            }
                            else {
                                return false;
                            }
                        });
                        if (isTarget) {
                            path.remove();
                        }
                    }
                }
            });
        },
        ExpressionStatement(path) {
            const { expression } = path.node;
            if (expression.type === "CallExpression") {
                const callee = expression.callee;
                if (callee.name && callee.name === "require") {
                    const { arguments: args } = expression;
                    const isTarget = args.some((v) => {
                        if (v.type === "StringLiteral" && targetModules.includes(v.value) === true) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    });
                    if (isTarget) {
                        path.remove();
                    }
                }
            }
        }
    };
    return visitor;
}

/**
 * Use '@babel/parser' to prase the code
 * @param code the code that need to transform to AST
 * @author chrislee
 * @Time 2020/7/14
 */
const prase = (code) => {
    const ast = parser.parse(code);
    return ast;
};

/**
 * use loader Option to remove some module we don`t want to import in final static file
 * @param source webpack chunk content
 * @author chrislee
 * @since 2020/7/11
 */
function moudleRemover(source) {
    const opt = loaderUtils.getOptions(this);
    const normalizeOpt = optionValidate(opt);
    const ast = prase(source);
    transform(ast, opt.type, normalizeOpt);
    const result = generator(ast);
    return result.code;
}

module.exports = moudleRemover;
//# sourceMappingURL=bundle.cjs.js.map
