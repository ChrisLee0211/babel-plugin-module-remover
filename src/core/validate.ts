import {isArray} from "../utils";
export interface Options {
    type: "esm" | "cjs",
    target:string[]
}

export const optionValidate = (opt:Options): Options => {
    const optionsKeys:string[] = Object.keys(opt);
    const opts:Options = Object.create({});
    if(optionsKeys.includes("type")){
        if(["esm","cjs"].includes(opt["type"])===false){
            throw Error(`the prop 'type' of option in @babel/module-remover only revicive param 'cjs' or 'esm'`);
        }
        opts["type"] = opt["type"];
    }else{
        opts["type"] = "esm";
    }
    if(optionsKeys.includes("target")){
        if(isArray(opt["target"])){
            opts["target"] = opt["target"];
        }else{
            throw Error(`the prop 'target' of option in @babel/module-remover expect a Array, but got another type `);
        }
    }else{
        throw Error(`the prop 'target' of option in @babel/module-remover expect a Array, but got undefined `);
    }
    return opts;
};