'use strict';

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

module.exports = checkDSLTypeDefinition;
