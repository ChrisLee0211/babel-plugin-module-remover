import {Options,optionValidate} from "../src/core/validate";

describe("测试参数格式化模块",() => {
    it("validata the babel plugin option without prop  'type'",() => {
        const options = {target:[]} as any;
        expect(optionValidate(options)).toEqual({type:"esm",target:[]});
    });
    it("validata the babel plugin option with a wrong prop 'type'",() => {
        const options:Options = {type: "amd",target:[]} as any;
        expect(()=>{optionValidate(options);}).toThrow();
    });
    it("validata the babel plugin option with a wrong prop 'type'",() => {
        const options_1:Options = {type: "cjs"} as any;
        const options_2:Options = {type: "esm",target:{}} as any;
        expect(()=>{optionValidate(options_1);}).toThrow();
        expect(()=>{optionValidate(options_2);}).toThrow();
    });
});
