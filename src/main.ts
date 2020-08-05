import core from "./core";
import { Visitor } from "@babel/core";

export default function({type:t}){
    const visitor:Visitor<{opt:Array<number>}> = {
        ImportDeclaration(path,state={opt}){
            const {source} = path.node;
            if(targetModules.includes(source.value)){
                path.remove();
            }
        },
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
    return {
        visitor
    };
}