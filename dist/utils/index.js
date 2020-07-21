var typeEnum;
(function (typeEnum) {
    typeEnum["string"] = "[object String]";
    typeEnum["number"] = "[object Number]";
    typeEnum["boolean"] = "[object Boolean]";
    typeEnum["undefined"] = "object Undefined]";
    typeEnum["null"] = "object Null]";
    typeEnum["object"] = "[object Object]";
    typeEnum["function"] = "[object Function]";
    typeEnum["array"] = "[object Array]";
    typeEnum["date"] = "[object Date]";
    typeEnum["reg"] = "[object RegExp]";
})(typeEnum || (typeEnum = {}));
/**
 * Verify that a value is an object
 * @param {any} obj
 * @returns {boolean}
 * @author  chrislee
 * @Time 2020/7/12
 */
export const isObject = (obj) => {
    let res = true;
    if (Object.prototype.toString.call(obj) === '[object Object]') {
        res = true;
    }
    else {
        res = false;
    }
    return res;
};
/**
 * Verify that a value is undefined
 * @param {any} obj
 * @returns {boolean}
 * @author chrislee
 * @Time 2020/7/12
 */
export const isUndefined = (obj) => {
    let res;
    if (obj === undefined || Object.prototype.toString.call(obj) === typeEnum["undefined"]) {
        res = true;
    }
    else {
        res = false;
    }
    return res;
};
/**
 * Verify that a value is an array
 * @param {any} obj
 * @returns {boolean}
 * @author chrislee
 * @Time 2020/7/12
 */
export const isArray = (obj) => {
    let res;
    if (obj instanceof Array || Object.prototype.toString.call(obj) === typeEnum["array"]) {
        res = true;
    }
    else {
        res = false;
    }
    return res;
};
/**
 * Verify that a value is an boolean
 * @param {any} obj
 * @returns {boolean}
 * @author chrislee
 * @Time 2020/7/12
 */
export const isBoolean = (obj) => {
    let res;
    if (obj instanceof Array || Object.prototype.toString.call(obj) === typeEnum["boolean"]) {
        res = true;
    }
    else {
        res = false;
    }
    return res;
};
export const typeValidate = (obj, type, constant = `The value of target`) => {
    let res;
    if (Object.prototype.toString.call(obj) === typeEnum[type]) {
        res = true;
    }
    else {
        let currentType = `undefined`;
        for (const key in typeEnum) {
            if (typeEnum[key] === Object.prototype.toString.call(obj)) {
                currentType = key;
            }
        }
        throw Error(`TypeError:${constant} expect a ${type},but got ${currentType}`);
    }
    return res;
};
//# sourceMappingURL=index.js.map