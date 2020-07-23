import {parse} from "@babel/parser";
import { File } from "@babel/types";

/**
 * Use '@babel/parser' to prase the code
 * @param code the code that need to transform to AST
 * @author chrislee
 * @Time 2020/7/14
 */
export const prase = (code:string):File => {
    const ast = parse(code,{sourceType:"module"});
    return ast;
};