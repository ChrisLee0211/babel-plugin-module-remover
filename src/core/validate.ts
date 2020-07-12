import * as utils from "../utils";
interface OptionType {
    [key:string]:boolean
}

/**
 * validate the option and normalize it 
 * @param opt loader option
 */
const optionValidate = (opt):OptionType => {
    const {target} = opt;
    const isArray = utils.isArray(target);
    const isObj = utils.isObject(target);
    let targetObject = Object.create(null);
    if(isArray){
        if(target.length <1) return {}
        for(let item of target){
           if(utils.typeValidate(item,"string",`The value of target array in the module-remover's option`)){
            targetObject[item] =true
           } 
        };
    }else if(isObj){
        const keys:string[] = Object.keys(target);
        for(let item of keys){
            if(utils.typeValidate(target[item],"boolean",`The value of target object in the module-remover's option`)){
                targetObject[item] = target[item]
            }
        };
    }
    return targetObject
}

export default optionValidate