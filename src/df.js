'use strict';

let {
    isFunction
} = require('basetype');

let {
    getTypeChecker
} = require('./type');

let {
    getParamsDSL, getReturnDSL
} = require('./dsl');

let df = (fun, funDes, options = {}) => {
    let {
        recursion = false, checktype = true, typeMap = {}
    } = options;

    if (!isFunction(fun)) {
        throw new Error(`expect function in tf but got ${fun}`);
    }

    let paramsDes = getParamsDSL(funDes);
    let returnDes = getReturnDSL(funDes);

    let paramChecker = checktype && paramsDes ? getTypeChecker(paramsDes, typeMap) : null;

    let returnChecker = checktype && returnDes ? getTypeChecker(returnDes, typeMap) : null;

    let newFun = function(...args) {
        // TODO if some args are functions consider to check it
        if (paramChecker) {
            paramChecker(args);
        }

        let ret = fun.apply(this, args);

        if (returnChecker) {
            returnChecker(ret);
        }

        // check response
        if (isFunction(ret) && recursion) {
            return df(ret, returnDes, options);
        }

        return ret;
    };

    newFun.__description = funDes;

    return newFun;
};

// compose

module.exports = {
    df
};
