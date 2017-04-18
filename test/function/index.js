'use strict';

let {
    d, p, getTypeChecker
} = require('../../');

let assert = require('assert');

describe('index', () => {
    it('base', () => {
        assert.deepEqual(
            d('headers',
                p('Object',
                    d('*', p('String'))
                )
            ), {
                'name': 'headers',
                'alias': '',
                'detail': '',
                'patterns': [{
                    'type': 'Object',
                    'nexts': [{
                        'name': '*',
                        'alias': '',
                        'detail': '',
                        'patterns': [{
                            'type': 'String',
                            'nexts': [],
                            'descriptionSide': 'pattern'
                        }],
                        'descriptionSide': 'data'
                    }],
                    'descriptionSide': 'pattern'
                }],
                'descriptionSide': 'data'
            });
    });

    it('array example', () => {
        //assert.deepEqual();
        assert.deepEqual(d('details', p('Array', d('1:listener'))), {
            'name': 'details',
            'detail': '',
            'patterns': [{
                'type': 'Array',
                'nexts': [{
                    'name': '1',
                    'detail': '',
                    'patterns': [],
                    'descriptionSide': 'data',
                    'alias': 'listener'
                }],
                'descriptionSide': 'pattern'
            }],
            'descriptionSide': 'data',
            'alias': ''
        });
    });

    it('simple type check', (done) => {
        let dsl = d('config', p('Object',
            d('a', p('Number')),
            d('b', p('String'))
        ));

        let typeCheck = getTypeChecker(dsl);

        typeCheck({
            a: 1,
            b: 'ok'
        });

        try {
            typeCheck({
                a: 1,
                b: 10
            });
        } catch (err) {
            assert(err.toString().indexOf('type checking fail') !== -1, true);
            done();
        }
    });
});
