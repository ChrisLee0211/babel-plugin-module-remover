declare enum typeEnum {
    "string" = "[object String]",
    "number" = "[object Number]",
    "boolean" = "[object Boolean]",
    "undefined" = "object Undefined]",
    "null" = "object Null]",
    "object" = "[object Object]",
    "function" = "[object Function]",
    "array" = "[object Array]",
    "date" = "[object Date]",
    "reg" = "[object RegExp]"
}
/**
 * Verify that a value is an object
 * @param {any} obj
 * @returns {boolean}
 * @author  chrislee
 * @Time 2020/7/12
 */
export declare const isObject: (obj: any) => boolean;
/**
 * Verify that a value is undefined
 * @param {any} obj
 * @returns {boolean}
 * @author chrislee
 * @Time 2020/7/12
 */
export declare const isUndefined: (obj: any) => boolean;
/**
 * Verify that a value is an array
 * @param {any} obj
 * @returns {boolean}
 * @author chrislee
 * @Time 2020/7/12
 */
export declare const isArray: (obj: any) => boolean;
/**
 * Verify that a value is an boolean
 * @param {any} obj
 * @returns {boolean}
 * @author chrislee
 * @Time 2020/7/12
 */
export declare const isBoolean: (obj: any) => boolean;
export declare const typeValidate: (obj: any, type: keyof typeof typeEnum, constant: string) => boolean;
export {};
