import { ModuleListType } from "./validate";
import { File } from "@babel/types";
/**
 * Transform a ast tree for removing the module
 * @param ast The AST object, it usually come from @babel/praser's return
 * @param type The module type ,only support EsModule and commonJs
 * @param moduleList The list of modules that user want to remove or keep it
 * @author chrislee
 * @Time 2020/7/18
 */
export declare const transform: (ast: File, type: "esm" | "cjs", moduleList: ModuleListType) => void;
