'use strict';

let {
    isNumber, isArray, likeArray, isString, isObject, isFunction,
    isBool, isPromise, isNull, isUndefined, isFalsy, isRegExp,
    isReadableStream, isWritableStream
} = require('basetype');

/**
 * type definition {
 *   checker,
 *   getChildren [optional], // return an array or map (key: child)
 *   mock [optional]
 * }
 */

module.exports = {
    'Number': {
        checker: isNumber
    },
    'Array': {
        checker: isArray,
        getChildren: (v) => v
    },
    'ArrayLike': {
        checker: likeArray,
        getChildren: (v) => v
    },
    'String': {
        checker: isString
    },
    'Object': {
        checker: isObject,
        getChildren: (v) => v
    },

    'Function': {
        checker: isFunction
    },
    'Boolean': {
        checker: isBool
    },
    'Promise': {
        checker: isPromise
    },
    'Null': {
        checker: isNull
    },
    'Undefined': {
        checker: isUndefined
    },
    'Falsy': {
        checker: isFalsy
    },
    'RegExp': {
        checker: isRegExp
    },

    'readableStream': {
        checker: isReadableStream
    },
    'writableStream': {
        checker: isWritableStream
    }
};
