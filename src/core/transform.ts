import traverse,{Visitor} from "@babel/traverse";
import {ModuleListType} from "./validate";
import { File } from "@babel/types";

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
    const visiter:Visitor = {};
    return visiter;
}