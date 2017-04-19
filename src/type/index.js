'use strict';

let {
    mergeMap, any, find
} = require('bolzano');

let {
    isDataObject
} = require('../dsl');

let defaultTypeMap = require('./defaultTypeMap');

let nextsToFindChildDSL = require('./nextsToFindChildDSL');

let checkDSLTypeDefinition = require('./checkDSLTypeDefinition');

// generate a type check according to data dsl
let getTypeChecker = (dsl, typeMap = {}) => {
    let types = mergeMap(typeMap, defaultTypeMap);
    // check type definition first, avoid missing type error
    checkDSLTypeDefinition(dsl, types);

    if (!isDataObject(dsl)) {
        throw new Error('dsl is not data object');
    }

    return (data) => {
        let matchedPattern = testPatterns(dsl, data, {
            types
        });
        if (!matchedPattern) {
            throw new Error('type checking fail, fail to find pattern to match data');
        }

        return matchedPattern;
    };
};

let testPatterns = (dsl, data, {
    types, path = []
}) => {
    let {
        patterns
    } = dsl;
    if (!patterns.length) return true;

    return find(patterns, (pattern) => {
        let {
            type, nexts
        } = pattern;
        if (!pattern.findChildDSL) {
            pattern.findChildDSL = nextsToFindChildDSL(nexts);
        }
        let {
            checker, getChildren
        } = types[type];

        if (!checker(data)) return false;

        if (!getChildren) return true;

        // check children
        let childs = getChildren(data); // for structured type, through getChildren method to go through next datas

        // if no data, any will return true
        return any(childs, (child, index) => {
            let childDsl = pattern.findChildDSL(index);
            if (childDsl) {
                return testPatterns(childDsl, child, {
                    types, path: path.concat([index])
                });
            } else { // do not find any child DSL filtered by name
                return true;
            }
        });
    });
};

module.exports = {
    getTypeChecker,
    testPatterns
};
