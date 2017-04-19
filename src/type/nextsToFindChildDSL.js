'use strict';

/**
 * build map from nexts by name
 */
module.exports = (nexts) => {
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


