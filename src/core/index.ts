const utils = require("loader-utils") ;

/**
 * use loader Option to remove some module we don`t want to import in final static file
 * @param source webpack chunk content 
 * @author chrislee
 * @since 2020/7/11
 */
function moudleRemover<T>(source:T):T{

    return source
}

export default moudleRemover