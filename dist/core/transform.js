import traverse from "@babel/traverse";
/**
 * Transform a ast tree for removing the module
 * @param ast The AST object, it usually come from @babel/praser's return
 * @param type The module type ,only support EsModule and commonJs
 * @param moduleList The list of modules that user want to remove or keep it
 * @author chrislee
 * @Time 2020/7/18
 */
export const transform = (ast, type, moduleList) => {
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
//# sourceMappingURL=transform.js.map