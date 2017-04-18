'use strict';

let {
    d,
    p
} = require('./base');

const PARAM_NAME = '@param';
const RETURN_NAME = '@return';

// arguments data
let arg = (...args) => {
    return p('Array', ...args);
};

// return data
let ret = (...retPatterns) => {
    return d(RETURN_NAME, ...retPatterns);
};

// function data
let f = (...args) => {
    if (args.length < 3) {
        throw new Error(`When construct function data dsl with f, the argument length should not be less than 3, but the length is ${args.length}`);
    }
    let name = args[0];
    let returnDataDSL = args[args.length - 1];
    let paramPatterns = args.slice(1, -1);

    // check params
    for (let i = 0; i < paramPatterns.length; i++) {
        let {
            type
        } = paramPatterns[i];

        if (type !== 'Array') {
            throw new Error(`param type must be Array, but got ${type}`);
        }
    }

    if (returnDataDSL.name !== RETURN_NAME) {
        throw new Error('return data dsl name must be @return. Plearge use ret function');
    }

    let params = d(PARAM_NAME, paramPatterns);

    return d(name, p('Function', params, returnDataDSL));
};

module.exports = {
    f,
    arg,
    ret,
    fun: f
};
