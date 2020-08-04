import * as traverse from "@babel/traverse";
import {Visitor} from "@babel/traverse";
import {ModuleListType} from "./validate";
import { File, Identifier } from "@babel/types";

/**
 * Transform a ast tree for removing the module 
 * @param ast The AST object, it usually come from @babel/praser's return
 * @param type The module type ,only support EsModule and commonJs
 * @param moduleList The list of modules that user want to remove or keep it
 * @author chrislee
 * @Time 2020/7/18
 */
export const transform = (ast:File,type:"esm"|"cjs",moduleList:ModuleListType):void => {
    const targetModules:string[] = Object.keys(moduleList).filter((v:string)=>moduleList[v]===true);
    const visitor:Visitor = type==="esm"?esmTransformer(targetModules):cjsTransformer(targetModules);
    traverse.default(ast,visitor);
};

/**
 * The traverse's rule about Esmodule
 * @param targetModules The list of modules that user want to remove or keep it
 * @returns {visiter} a rule of traverse
 * @author chrislee
 * @Time 2020/7/18
 */
function esmTransformer(targetModules:string[]):Visitor {
    const visitor:Visitor = {
        ImportDeclaration(path){
            const {source} = path.node;
            if(targetModules.includes(source.value)){
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
function cjsTransformer(targetModules:string[]):Visitor {
    const visitor:Visitor = {
        VariableDeclaration(path){
            const {declarations} = path.node;
            Array.from(declarations).forEach(declarator => {
                const {init} = declarator;
                if(init?.type === "CallExpression"){
                    const callee = init.callee as Identifier;
                    if(callee.name&&callee.name === "require"){
                        const {arguments:args} = init;
                        const isTarget:boolean = args.some((v) => {
                            if(v.type === "StringLiteral"&&targetModules.includes(v.value)===true){
                                return true;
                            }else{
                                return false;
                            }
                        });
                        if(isTarget){
                            path.remove();
                        }
                    }
                }
            });
        },
        ExpressionStatement(path){
            const {expression} = path.node;
            if(expression.type === "CallExpression"){
                const callee = expression.callee as Identifier;
                if(callee.name&&callee.name === "require") {
                    const {arguments:args} = expression;
                        const isTarget:boolean = args.some((v) => {
                            if(v.type === "StringLiteral"&&targetModules.includes(v.value)===true){
                                return true;
                            }else{
                                return false;
                            }
                        });
                        if(isTarget){
                            path.remove();
                        }
                }
            }
        }
    };
    return visitor;
}