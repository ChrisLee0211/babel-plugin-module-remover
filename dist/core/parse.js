import { parse } from "@babel/parser";
/**
 * Use '@babel/parser' to prase the code
 * @param code the code that need to transform to AST
 * @author chrislee
 * @Time 2020/7/14
 */
export const prase = (code) => {
    const ast = parse(code);
    return ast;
};
//# sourceMappingURL=parse.js.map