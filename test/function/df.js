'use strict';

let {
    df, f, arg, d, p
} = require('../..');

let assert = require('assert');

describe('df', () => {
    it('base', (done) => {
        let add = df(
            (v1, v2) => v1 + v2,
            f('add',
                arg(d('*', p('Number'))),
                d('return', p('Number'))
            )
        );

        let v = add(1, 2);

        assert.equal(v, 3);

        try {
            add(1, 'true');
        } catch (err) {
            assert(err.toString().indexOf('type checking fail') !== -1, true);
            done();
        }
    });

    it('high order', (done) => {
        let add = df(
            (v1) => (v2) => v1 + v2,

            f('add',
                arg(
                    d('0:added', p('Number'))
                ),

                f('add2',
                    arg(d('0:add', p('Number'))),
                    d('return', p('Number'))
                )
            ),

            {
                recursion: true
            }
        );

        let v = add(1)(2);

        assert.equal(v, 3);

        try {
            add('1');
        } catch (err) {
            assert(err.toString().indexOf('type checking fail') !== -1, true);
            try {
                add(1)('2');
            } catch (err) {
                assert(err.toString().indexOf('type checking fail') !== -1, true);
                done();
            }
        }
    });

    it('fakeMap', (done) => {
        let fakeMap = df(
            (list, handler) => {
                let ret = [];
                for (let i = 0; i < list.length; i++) {
                    if (handler) {
                        ret.push(handler(list[i]));
                    } else {
                        ret.push(list[i]);
                    }
                }
                return ret;
            },

            f('fakeMap', arg(d('0:list', p('Array')), d('1:handler', p('Function'), p('Null'))),
                d('return', p('Array'))
            )
        );

        assert.deepEqual(fakeMap([1, 2, 3], null), [1, 2, 3]);
        assert.deepEqual(fakeMap([1, 2, 3], (v) => v + 1), [2, 3, 4]);

        try {
            fakeMap([1], 'true');
        } catch (err) {
            assert(err.toString().indexOf('type checking fail') !== -1, true);
            done();
        }
    });


    it('polymorphic', () => {
        let v = df(
            () => {},

            f('v', arg(d('0', p('Number'))), arg(d('0', p('String'))), d('return'))
        );

        v(1);
        v('hello');
    });
});
