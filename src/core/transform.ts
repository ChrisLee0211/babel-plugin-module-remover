import traverse,{Visitor} from "@babel/traverse";
import {OptionType} from "./validate";
import { File } from "@babel/types";

export const transform = (ast:File,opt: OptionType):void => {
    const visiter:Visitor = opt.type==="esm"?esmTransformer(opt):cjsTransformer(opt);
    traverse(ast,visiter);
};

function esmTransformer(opt:OptionType):Visitor {
    const visiter:Visitor = {};
    return visiter;
}

function cjsTransformer(opt:OptionType):Visitor {
    const visiter:Visitor = {};
    return visiter;
}