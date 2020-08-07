import core from "./core";
import { Visitor } from "@babel/core";
import {isArray} from "./utils";
import { Identifier } from "@babel/types";
interface Options {
    type: "esm" | "cjs",
    target:string[]
}

const optionValidate = (opt:Options): Options => {
    const optionsKeys:string[] = Object.keys(opt);
    const opts:Options = Object.create({});
    if(optionsKeys.includes("type")){
        opts["type"] = opt["type"];
    }else{
        opts["type"] = "esm";
    }
    if(optionsKeys.includes("target")){
        if(isArray(opt["target"])){
            opts["target"] = opt["target"];
        }
    }else{
        throw Error(`the prop of option in @babel/module-remover expect a Array, but got undefined `);
    }
    return opts;
};

export default function({type:t}){
    const visitor:Visitor<{opt:Options}> = {
        ImportDeclaration(path,state){
            const {target:targetModules} = optionValidate(state.opt);
            const {source} = path.node;
            if(targetModules.includes(source.value)){
                path.remove();
            }
        },
        VariableDeclaration(path,state){
            const {declarations} = path.node;
            const {target:targetModules} = optionValidate(state.opt);
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
            const {target:targetModules} = optionValidate(state.opt);
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