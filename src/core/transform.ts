import traverse,{Visitor} from "@babel/traverse";
import {ModuleListType} from "./validate";
import { File, Identifier } from "@babel/types";

export const transform = (ast:File,type:"esm"|"cjs",moduleList:ModuleListType):void => {
    const targetModules:string[] = Object.keys(moduleList).filter((v:string)=>moduleList[v]===true);
    const visiter:Visitor = type==="esm"?esmTransformer(targetModules):cjsTransformer(targetModules);
    traverse(ast,visiter);
};

function esmTransformer(targetModules:string[]):Visitor {
    const visiter:Visitor = {
        ImportDeclaration(path){
            const {source} = path.node;
            if(targetModules.includes(source.value)){
                path.remove();
            }
        }
    };
    return visiter;
}

function cjsTransformer(targetModules:string[]):Visitor {
    const visiter:Visitor = {
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
        }
    };
    return visiter;
}