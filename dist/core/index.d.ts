/**
 * use loader Option to remove some module we don`t want to import in final static file
 * @param source webpack chunk content
 * @author chrislee
 * @since 2020/7/11
 */
declare function moudleRemover(this: any, source: string): string;
export default moudleRemover;
