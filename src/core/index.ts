import loaderUtils from "loader-utils";
import generator from "@babel/generator";
import parser from "@babel/parser";
import traverse from "@babel/traverse";
import types from "@babel/types";
import optionValidate from "./validate";

/**
 * use loader Option to remove some module we don`t want to import in final static file
 * @param source webpack chunk content 
 * @author chrislee
 * @since 2020/7/11
 */
function moudleRemover<T>(this: any, source:T):T{
    const opt = loaderUtils.getOptions(this);
    const normalizeOpt = optionValidate(opt);
    return source
}

export default moudleRemover