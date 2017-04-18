'use strict';

let {
    isNumber, isArray, likeArray, isString, isObject, isFunction, isBool, isPromise, isNull, isUndefined, isFalsy, isRegExp, isReadableStream, isWritableStream
} = require('basetype');

let {
    mergeMap
} = require('bolzano');

let {
    isDataObject
} = require('./dsl');

/**
 * type definition {
 *   checker,
 *   getChildren [optional], // return an array or map (key: child)
 *   mock [optional]
 * }
 */

const defaultTypeMap = {
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

// generate a type check according to data dsl
let getTypeChecker = (dsl, typeMap = {}) => {
    let types = mergeMap(typeMap, defaultTypeMap);
    checkDSLTypeDefinition(dsl, types);

    if (!isDataObject(dsl)) {
        throw new Error('dsl is not data object');
    }
    // TODO check dsl type, avoid missing type error

    return (data) => {
        let {
            patterns
        } = dsl;

        checkPatterns(patterns, data, types);
    };
};

let checkDSLTypeDefinition = (dsl, types) => {
    let {
        patterns
    } = dsl;

    for (let i = 0; i < patterns.length; i++) {
        let {
            type, nexts
        } = patterns[i];

        if (!types[type]) {
            throw new Error(`missing type definition of ${type}`);
        }

        for (let i = 0; i < nexts.length; i++) {
            checkDSLTypeDefinition(nexts[i], types);
        }
    }
};

let checkPatterns = (patterns, data, types) => {
    if (!patterns.length) return true;

    // data just need to satisfy one pattern
    for (let i = 0; i < patterns.length; i++) {
        let pattern = patterns[i];
        let {
            type, nexts
        } = pattern;

        if (!pattern.findChildDsl) {
            pattern.findChildDsl = nextsToFindChildDsl(nexts);
        }

        let {
            checker, getChildren
        } = types[type];

        if (!checker(data)) {
            throw new Error(`type checking fail. Expect type is ${type}, data is ${data}.`);
        }

        // check children
        if (getChildren) {
            let childs = getChildren(data);
            if (isArray(childs)) {
                for (let j = 0; j < childs.length; j++) {
                    let child = childs[j];
                    let childDsl = pattern.findChildDsl(j);
                    if (childDsl) {
                        checkPatterns(childDsl.patterns, child, types);
                    }
                }
            } else if (isObject(childs)) {
                for (let name in childs) {
                    let child = childs[name];
                    let childDsl = pattern.findChildDsl(name);
                    if (childDsl) {
                        checkPatterns(childDsl.patterns, child, types);
                    }
                }
            }
        }
    }
};

/**
 * build map from nexts by name
 */
let nextsToFindChildDsl = (nexts) => {
    let map = {},
        fullPattern = null;

    for (let i = 0; i < nexts.length; i++) {
        let next = nexts[i];
        if (next.name === '*') {
            fullPattern = next;
        } else {
            map[next.name] = next;
        }
    }

    return (name) => {
        let high = map[name];
        if (high) return high;
        if (fullPattern) return fullPattern;
    };
};

module.exports = {
    getTypeChecker
};
