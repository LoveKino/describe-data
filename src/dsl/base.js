'use strict';

let {
    isString, isObject
} = require('basetype');

/**
 * define a simple dsl used to describe data
 *
 * data's factors
 *
 * - name
 *
 * - type
 *
 * - description
 *
 * - structure
 *
 * - examples
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
        patterns = [args[1]];
    } else {
        name = args[0];
        detail = args[1];
        patterns = args.slice(2);
    }
    // check parameters
    if (!isString(name)) {
        throw new Error(`name is not string but ${name} in data definition.\n${EXAMPLE_FOR_D}`);
    }
    if (!isString(detail)) {
        throw new Error(`detail is not string but ${detail} in data definition.\n${EXAMPLE_FOR_D}`);
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
