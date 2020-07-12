enum typeEnum {
    "string"="[object String]",
    "number"="[object Number]",
    "boolean"="[object Boolean]",
    "undefined"="object Undefined]",
    "null"="object Null]",
    "object"="[object Object]",
    "function"="[object Function]",
    "array"="[object Array]",
    "date"="[object Date]",
    "reg"="[object RegExp]"
}

/**
 * Verify that a value is an object
 * @param {any} obj 
 * @returns {boolean}
 * @author  chrislee
 * @Time 2020/7/12
 */
export const isObject:(obj:any)=>boolean = (obj) =>{
    let res:boolean = true;
    if(Object.prototype.toString.call(obj) === '[object Object]'){
        res = true;
    }else{
        res = false;
    }
    return res
}

/**
 * Verify that a value is undefined
 * @param {any} obj
 * @returns {boolean}
 * @author chrislee
 * @Time 2020/7/12
 */
export const isUndefined:(obj:any)=>boolean = (obj) => {
    let res: boolean;
    if(obj === undefined||Object.prototype.toString.call(obj)===typeEnum["undefined"]){
        res = true
    }else{
        res = false
    }
    return res
}

/**
 * Verify that a value is an array
 * @param {any} obj
 * @returns {boolean}
 * @author chrislee
 * @Time 2020/7/12
 */
export const isArray:(obj:any)=>boolean = (obj) =>{
    let res:boolean;
    if(obj instanceof Array || Object.prototype.toString.call(obj)===typeEnum["array"]){
        res = true;
    }else{
        res = false
    }
    return res
}

/**
 * Verify that a value is an boolean
 * @param {any} obj
 * @returns {boolean}
 * @author chrislee
 * @Time 2020/7/12
 */
export const isBoolean:(obj:any) => boolean = (obj) => {
    let res:boolean;
    if(obj instanceof Array || Object.prototype.toString.call(obj)===typeEnum["boolean"]){
        res = true;
    }else{
        res = false
    }
    return res
}

export const typeValidate:(obj:any,type:keyof typeof typeEnum,constant:string)=>boolean = (obj,type,constant=`The value of target`) =>{
    let res:boolean;
    if(Object.prototype.toString.call(obj)=== typeEnum[type]){
        res = true
    }else{
        let currentType:string = `undefined`;
        for(let key in typeEnum){
            if(typeEnum[key] === Object.prototype.toString.call(obj)){
                currentType = key;
            }
        }
        throw Error(`TypeError:${constant} expect a ${type},but got ${currentType}`)
    }
    return res
}