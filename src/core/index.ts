import { Visitor } from "@babel/core";
import { Identifier } from "@babel/types";
import {optionValidate, Options} from "./validate";

export default function({type:t}){
    const visitor:Visitor<{opts:Options}> = {
        ImportDeclaration(path,state){
            const {target:targetModules} = optionValidate(state.opts);
            const {source} = path.node;
            if(targetModules.includes(source.value)){
                path.remove();
            }
        },
        VariableDeclaration(path,state){
            const {declarations} = path.node;
            const {target:targetModules} = optionValidate(state.opts);
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
        ExpressionStatement(path,state){
            const {expression} = path.node;
            const {target:targetModules,type} = optionValidate(state.opts);
            if(expression.type === "CallExpression"){
                const callee = expression.callee;
                if((callee as Identifier).name&&(callee as Identifier).name === "require"&&["cjs","all"].includes(type)) {
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
                if(callee.type&&callee.type === "Import"&&["esm","all"].includes(type)) {
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
                if(callee.type === "MemberExpression"&&callee.object.type==="CallExpression"){
                    const deepCallee = callee.object.callee;
                    if(deepCallee.type === "Import"&&["esm","all"].includes(type)){
                        const {arguments:deepArgs} = callee.object;
                        const isTarget:boolean = deepArgs.some((v) => {
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
        }
    };
    return {
        visitor
    };
}