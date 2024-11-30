import { test, expect } from "vitest";
import TableGenerator, { LinearWeightDistribution } from "./TableGenerator";
import ConstantGenerator from "./ConstantGenerator";
import MockRandom from "src/random/MockRandom";
import { parseGenerator } from "../parser/generator-parser";
import RandomGenerator from "./RandomGenerator";
import { ParseResult } from "../parser/parser-generator/parser-generator";

test("Table generator", () => {
    const rng = new MockRandom(0)

    const g0 = new TableGenerator([])
    expect(g0.generate(rng)).toEqual("")

    const g = new TableGenerator([new ConstantGenerator("foo"), new ConstantGenerator("bar")])

    rng.randomValue = 0.5
    expect(g.generate(rng)).toEqual("foo")

    rng.randomValue = 1.5
    expect(g.generate(rng)).toEqual("bar")
})



test("Table with custom weights", () => {
    const genRes: ParseResult<RandomGenerator> = parseGenerator(`{
            1:foo;
            6:bar;
            3:zap}`
        );

    expect(genRes.isOk()).toEqual(true)

    const gen = genRes.value!
    const rng = new MockRandom(0)

    rng.randomValue = 0
    expect(gen.generate(rng)).toEqual("foo")
    rng.randomValue = 1.01
    expect(gen.generate(rng)).toEqual("bar")
    rng.randomValue = 5
    expect(gen.generate(rng)).toEqual("bar")
    rng.randomValue = 7.01
    expect(gen.generate(rng)).toEqual("zap")
    rng.randomValue = 9
    expect(gen.generate(rng)).toEqual("zap")

    // Rounding error / failing random number generator test
    rng.randomValue = 11
    expect(gen.generate(rng)).toEqual("zap")

})

test('Flat weight distribution', () => {
    const gen = new TableGenerator(["a", "b", "c", "d"])

    const rng = new MockRandom(0)

    rng.randomValue = 0.5
    expect(gen.generate(rng)).toEqual("a")
    rng.randomValue = 1.5
    expect(gen.generate(rng)).toEqual("b")
    rng.randomValue = 2.5
    expect(gen.generate(rng)).toEqual("c")
    rng.randomValue = 3.5
    expect(gen.generate(rng)).toEqual("d")
})


test('Linear weight distribution', () => {
    const gen = new TableGenerator(["a", "b", "c"], new LinearWeightDistribution())

    const rng = new MockRandom(0)

    rng.randomValue = 1.49
    expect(gen.generate(rng)).toEqual("a")
    rng.randomValue = 1.51
    expect(gen.generate(rng)).toEqual("b")
    rng.randomValue = 2.49
    expect(gen.generate(rng)).toEqual("b")
    rng.randomValue = 2.51
    expect(gen.generate(rng)).toEqual("c")
    rng.randomValue = 2.99
    expect(gen.generate(rng)).toEqual("c")

})

test('Linear weight distribution with custom parameter', () => {
    const gen = new TableGenerator(["a", "b"], new LinearWeightDistribution(), 10)

    const rng = new MockRandom(0)

    rng.randomValue = 2*0.89
    expect(gen.generate(rng)).toEqual("a")
    rng.randomValue = 2*0.91
    expect(gen.generate(rng)).toEqual("b")

})

test('Linear weight distribution with custom zero param', () => {
    const gen = new TableGenerator(["a", "b"], new LinearWeightDistribution(), 0)

    const rng = new MockRandom(0)

    rng.randomValue = 0
    expect(gen.generate(rng)).toEqual("b")
})


test('Linear weight distribution with custom negative param', () => {
    const gen = new TableGenerator(["a", "b"], new LinearWeightDistribution(false), -10)

    const rng = new MockRandom(0)

    rng.randomValue = 0
    expect(gen.generate(rng)).toEqual("b")
})


test('Linear weight distribution with custom negative param, but flipped', () => {
    const gen = new TableGenerator(["a", "b"], new LinearWeightDistribution(true), -10)

    const rng = new MockRandom(0)

    rng.randomValue = 1
    expect(gen.generate(rng)).toEqual("a")
})


test('Linear weight distribution with custom parameter backwards', () => {
    const gen = new TableGenerator(["a", "b"], new LinearWeightDistribution(), 1/10)

    const rng = new MockRandom(0)

    rng.randomValue = 2*0.09
    expect(gen.generate(rng)).toEqual("a")
    rng.randomValue = 2*0.11
    expect(gen.generate(rng)).toEqual("b")

})


test('Linear weight distribution with custom parameter backwards', () => {
    const gen = new TableGenerator(["a", "b"], new LinearWeightDistribution(true), 10)

    const rng = new MockRandom(0)

    rng.randomValue = 2*0.09
    expect(gen.generate(rng)).toEqual("a")
    rng.randomValue = 2*0.11
    expect(gen.generate(rng)).toEqual("b")

})