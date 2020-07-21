export interface ModuleListType {
    [key: string]: boolean;
}
export interface OptionType {
    type: "esm" | "cjs";
    target: ModuleListType | undefined | string[];
}
/**
 * validate the option and normalize it
 * @param opt loader option
 */
declare const optionValidate: (opt: OptionType) => ModuleListType;
export default optionValidate;
