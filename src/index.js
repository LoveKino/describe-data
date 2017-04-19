'use strict';

let {
    d,
    p,
    isDataObject,
    isPatternObject,
    data,
    pattern,
    f,
    arg,
    fun,
    getParamsDSL,
    getReturnDSL
} = require('./dsl');

let {
    getTypeChecker
} = require('./type');

let {
    df
} = require('./df');

module.exports = {
    d,
    p,
    isDataObject,
    isPatternObject,
    data,
    pattern,
    f,
    arg,
    fun,
    getParamsDSL,
    getReturnDSL,

    df,

    getTypeChecker
};
