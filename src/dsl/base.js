'use strict';

let {
    isString, isObject
} = require('basetype');

/**
 * In data DSL definition, a data DSL can have multiple patterns, but for one data, there should be only one pattern for it.
 */

/**
 * data = {name, alias, patterns}
 * pattern = {type, nexts}
 */

/**
 * a data can have one or more formats
 *
 * d('details', 'all the detail of project')
 *
 * d('results')
 *
 * d('callback', 'callback function')
 */

const EXAMPLE_FOR_D = 'example for data definition: d("results", "result for data", p("Array"))';

let d = (...args) => {
    let name = '',
        detail = '',
        patterns = [];
    if (args.length < 2) {
        name = args[0];
    } else if (args.length === 2) {
        name = args[0];
        if (isString(args[1])) {
            detail = args[1];
        } else {
            patterns = [args[1]];
        }
    } else {
        name = args[0];
        if (isString(args[1])) {
            detail = args[1];
            patterns = args.slice(2);
        } else {
            patterns = args.slice(1);
        }
    }
    // check parameters
    if (!isString(name)) {
        throw new Error(`name is not string but ${name} in data definition.\n${EXAMPLE_FOR_D}`);
    }
    for (let i = 0; i < patterns.length; i++) {
        let pattern = patterns[i];
        if (!isPatternObject(pattern)) {
            throw new Error(`pattern is not pattern object but ${pattern} in data definition.\n${EXAMPLE_FOR_D}`);
        }
    }

    let [newName, alias] = splitNameAndAlias(name);

    return {
        name: newName,
        detail,
        patterns,
        descriptionSide: 'data',
        alias
    };
};

let isDataObject = (v) => {
    return isObject(v) && v.descriptionSide === 'data';
};

/**
 * describe a format of data
 *
 * p('array',
 *     d('*', p('Number'))
 * )
 *
 * p('object',
 *     d('name', p('String')),
 *     d('age', p('Number'))
 * )
 */
let p = (type, ...nexts) => {
    // check parameters
    if (!isString(type)) {
        throw new Error(`type is not string but ${type} in pattern definition.`);
    }
    for (let i = 0; i < nexts.length; i++) {
        let next = nexts[i];
        if (!isDataObject(next)) {
            throw new Error(`next is not data object but ${next} in pattern definition.`);
        }
    }
    return {
        type,
        nexts, descriptionSide: 'pattern'
    };
};

let isPatternObject = (obj) => {
    return isObject(obj) && obj.descriptionSide === 'pattern';
};

/**
 * concat name and alias with ':'
 *
 * eg: '0:filter', 'n:name'
 *
 * name will be used by parent data as index to search this data, alias will be used to read or simplify explain.
 */
let splitNameAndAlias = (name) => {
    let newName = name.split(':')[0];
    let alias = name.substring(newName.length + 1);

    return [newName.trim(), alias.trim()];
};

/**
 * describe an object
 *
 * d('headers',
 *   p('Object', d('*', 'String')),
 *   p('Null')
 * )
 */

module.exports = {
    d,
    p,
    isDataObject,
    isPatternObject,
    data: d, pattern: p
};
