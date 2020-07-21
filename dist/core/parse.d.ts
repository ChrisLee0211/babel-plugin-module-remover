import { File } from "@babel/types";
/**
 * Use '@babel/parser' to prase the code
 * @param code the code that need to transform to AST
 * @author chrislee
 * @Time 2020/7/14
 */
export declare const prase: (code: string) => File;
