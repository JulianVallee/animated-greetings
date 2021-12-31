/**
 * @jest-environment jsdom
 */

import Random from './../../src/assets/js/random';

const fixtures = {
    valuesTests: [
        {
            seed: 'TestSeed123',
            tests: {
                float: {
                    results: [0.44123512180522084, 0.5967353088781238, 0.8918309796135873, 0.7349957241676748, 0.9292314853519201, 0.02888443530537188, 0.09349124226719141, 0.9058422967791557, 0.773883200250566, 0.7349669355899096]
                },
                range: {
                    min: 100,
                    max: 200,
                    results: [144, 160, 190, 174, 193, 102, 109, 191, 178, 174]
                },
                rangeFloat: {
                    min: 0.0,
                    max: 0.5,
                    results: [0.22061756090261042, 0.2983676544390619, 0.44591548980679363, 0.3674978620838374, 0.46461574267596006, 0.01444221765268594, 0.046745621133595705, 0.45292114838957787, 0.386941600125283, 0.3674834677949548]
                }
            }
        }
    ],
    rangeTests: [
        {
            seed: 'TestSeed123',
            valueCount: 2500,
            tests: {
                float: {
                    min: 0,
                    max: 1
                },
                range: {
                    min: 100,
                    max: 200
                },
                rangeFloat: {
                    min: 0.25,
                    max: 0.5
                }
            }
        }
    ]
}

describe('Seeded RNG', () => {
    describe('creates values in the expected range', () => {
        for (let fixture of fixtures.rangeTests) {

            test('float()', async () => {
                const rand = new Random(fixture.seed);

                for (let i = 0; i < fixture.valueCount; i++) {
                    const res = rand.float();

                    expect(res).toBeGreaterThanOrEqual(fixture.tests.float.min)
                    expect(res).toBeLessThanOrEqual(fixture.tests.float.max)
                }
            });

            test('range()', async () => {
                const rand = new Random(fixture.seed);

                for (let i = 0; i < fixture.valueCount; i++) {
                    const res = rand.range(fixture.tests.range.min, fixture.tests.range.max);

                    expect(res).toBeGreaterThanOrEqual(fixture.tests.range.min)
                    expect(res).toBeLessThanOrEqual(fixture.tests.range.max)
                }
            });

            test('rangeFloat()', async () => {
                const rand = new Random(fixture.seed);

                for (let i = 0; i < fixture.valueCount; i++) {
                    const res = rand.rangeFloat(fixture.tests.rangeFloat.min, fixture.tests.rangeFloat.max);

                    expect(res).toBeGreaterThanOrEqual(fixture.tests.rangeFloat.min)
                    expect(res).toBeLessThanOrEqual(fixture.tests.rangeFloat.max)
                }
            });
        }
    });

    describe('creates expected values for a given seed', () => {
        for (let fixture of fixtures.valuesTests) {
            test('float()', async () => {
                const rand = new Random(fixture.seed);
                const results = [];

                for (let key in fixture.tests.float.results) {
                    results.push(rand.float());
                }

                expect(results).toEqual(fixture.tests.float.results);
            });

            test('range()', async () => {
                const rand = new Random(fixture.seed);
                const results = [];

                for (let key in fixture.tests.range.results) {
                    results.push(rand.range(fixture.tests.range.min, fixture.tests.range.max));
                }

                expect(results).toEqual(fixture.tests.range.results);
            });

            test('rangeFloat()', async () => {
                const rand = new Random(fixture.seed);
                const results = [];

                for (let key in fixture.tests.rangeFloat.results) {
                    results.push(rand.rangeFloat(fixture.tests.rangeFloat.min, fixture.tests.rangeFloat.max));
                }

                expect(results).toEqual(fixture.tests.rangeFloat.results);
            });
        }
    });
});