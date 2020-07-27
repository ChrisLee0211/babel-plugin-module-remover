import optionValidate,{OptionType} from "../src/core/validate";
import {transform} from "../src/core/transform";
import {parser} from "../src/core/parse";
import generator from "@babel/generator";

describe("测试参数格式化模块",() => {
    it("validate pass by array target",()=>{
        const opt:OptionType = {
            type:"cjs",
            target:["./iconfont","react"]
        };
        expect(optionValidate(opt)).toEqual({"./iconfont":true,"react":true});
    });
    it("validate pass by object target",() => {
        const opt:OptionType = {
            type:"esm",
            target:{
                "vue":true,
                "react":false
            }
        };
        expect(optionValidate(opt)).toEqual({"react":false,"vue":true});
    });
    it("validate pass by wrong type",() => {
        const opt:any = {
            type:"tsm",
            target:{
                "vue":true,
                "react":false
            }
        };
        expect(()=>{optionValidate(opt);}).toThrowError();
    });
});


describe("测试代码转换模块",() => {
    it("transform success",() => {
        const testcode = `import React from "react";require('./iconfont');function test(){console.log}
        `;
        const opt:OptionType = {type:"cjs",target:["./iconfont"]};
        const test = ()=>{
            const normalizeOpt = optionValidate(opt as any); 
                const ast = parser(testcode);
                transform(ast,opt.type,normalizeOpt);
                const result = generator(ast).code;
                return result;
        };
        expect(test()).toEqual(`import React from "react";\n\nfunction test() {\n  console.log;\n}`);
    });
});