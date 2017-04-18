'use strict';

let {
    d,
    p,
    data,
    pattern
} = require('./dsl');

let {
    getTypeChecker
} = require('./type');

module.exports = {
    d,
    p,
    data, pattern,

    getTypeChecker
};
