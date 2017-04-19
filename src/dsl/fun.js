'use strict';

let {
    d,
    p
} = require('./base');

const PARAM_NAME = '@param';

// arguments data
let arg = (...args) => {
    return p('Array', ...args);
};

// function data
let f = (...args) => {
    if (args.length < 2) {
        throw new Error(`When construct function data dsl with f, the argument length should not be less than 2, but the length is ${args.length}`);
    }
    let name = args[0];

    let returnDataDSL = args[args.length - 1]; // the last one

    let paramPatterns = args.slice(1, -1); // rest

    // check params
    for (let i = 0; i < paramPatterns.length; i++) {
        let {
            type
        } = paramPatterns[i];

        if (type !== 'Array') {
            throw new Error(`param type must be Array, but got ${type}`);
        }
    }

    let params = d(PARAM_NAME, ...paramPatterns);

    return d(name, p('Function', params, returnDataDSL));
};

let getParamsDSL = (funDataDSL) => {
    let {
        nexts
    } = funDataDSL.patterns[0];
    return nexts[0];
};

let getReturnDSL = (funDataDSL) => {
    let {
        nexts
    } = funDataDSL.patterns[0];
    return nexts[1];
};

module.exports = {
    f,
    arg,
    getParamsDSL,
    getReturnDSL,
    fun: f
};
