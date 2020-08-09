const typeEnum = {
    "string": "[object String]",
    "number": "[object Number]",
    "boolean": "[object Boolean]",
    "undefined": "object Undefined]",
    "null": "object Null]",
    "object": "[object Object]",
    "function": "[object Function]",
    "array": "[object Array]",
    "date": "[object Date]",
    "reg": "[object RegExp]"
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

const optionValidate = (opt) => {
    const optionsKeys = Object.keys(opt);
    const opts = Object.create({});
    if (optionsKeys.includes("type")) {
        if (["esm", "cjs"].includes(opt["type"]) === false) {
            throw Error(`the prop 'type' of option in @babel/module-remover only revicive param 'cjs' or 'esm'`);
        }
        opts["type"] = opt["type"];
    }
    else {
        opts["type"] = "esm";
    }
    if (optionsKeys.includes("target")) {
        if (isArray(opt["target"])) {
            opts["target"] = opt["target"];
        }
        else {
            throw Error(`the prop 'target' of option in @babel/module-remover expect a Array, but got another type `);
        }
    }
    else {
        throw Error(`the prop 'target' of option in @babel/module-remover expect a Array, but got undefined `);
    }
    return opts;
};

function core ({ type: t }) {
    const visitor = {
        ImportDeclaration(path, state) {
            const { target: targetModules } = optionValidate(state.opt);
            const { source } = path.node;
            if (targetModules.includes(source.value)) {
                path.remove();
            }
        },
        VariableDeclaration(path, state) {
            const { declarations } = path.node;
            const { target: targetModules } = optionValidate(state.opt);
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
        ExpressionStatement(path, state) {
            const { expression } = path.node;
            const { target: targetModules } = optionValidate(state.opt);
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
    return {
        visitor
    };
}

export default core;
//# sourceMappingURL=bundle.esm.js.map
