import * as utils from "../utils";
export interface ModuleListType {
    [key:string]:boolean
}

export interface OptionType {
    type:"esm"|"cjs",
    target:ModuleListType|undefined|string[]
}

/**
 * validate the option and normalize it 
 * @param opt loader option
 */
const optionValidate = (opt:OptionType):ModuleListType => {
    const {target,type} = opt;
    const typeExpect:string[] = ["esm","cjs"];
    if(utils.typeValidate(type,"string",`The type param in module-remover's option`)){
        if(typeExpect.includes(type)===false){
            throw Error(`The type param in module-remover's option only recieve keyword 'esm' or 'cjs'`);
        }
    }
    const isArray = utils.isArray(target);
    const isObj = utils.isObject(target);
    const targetObject = Object.create({});
    if(isArray){
        if((target as string[]).length <1) return {};
        for(const item of (target as string[])){
           if(utils.typeValidate(item,"string",`The value of target array in the module-remover's option`)){
            targetObject[item] =true;
           } 
        }
    }else if(isObj){
        const keys:string[] = Object.keys(target as ModuleListType);
        for(const item of keys){
            if(utils.typeValidate((target as ModuleListType)[item],"boolean",`The value of target object in the module-remover's option`)){
                targetObject[item] = (target as ModuleListType)[item];
            }
        }
    }
    return targetObject;
};

export default optionValidate;