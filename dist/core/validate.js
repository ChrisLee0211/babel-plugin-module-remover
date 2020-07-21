import * as utils from "../utils";
/**
 * validate the option and normalize it
 * @param opt loader option
 */
const optionValidate = (opt) => {
    const { target, type } = opt;
    const typeExpect = ["esm", "cjs"];
    if (utils.typeValidate(type, "string", `The type param in module-remover's option`)) {
        if (typeExpect.includes(type) === false) {
            throw Error(`The type param in module-remover's option only recieve keyword 'esm' or 'cjs'`);
        }
    }
    const isArray = utils.isArray(target);
    const isObj = utils.isObject(target);
    const targetObject = Object.create(null);
    if (isArray) {
        if (target.length < 1)
            return {};
        for (const item of target) {
            if (utils.typeValidate(item, "string", `The value of target array in the module-remover's option`)) {
                targetObject[item] = true;
            }
        }
    }
    else if (isObj) {
        const keys = Object.keys(target);
        for (const item of keys) {
            if (utils.typeValidate(target[item], "boolean", `The value of target object in the module-remover's option`)) {
                targetObject[item] = target[item];
            }
        }
    }
    return targetObject;
};
export default optionValidate;
//# sourceMappingURL=validate.js.map