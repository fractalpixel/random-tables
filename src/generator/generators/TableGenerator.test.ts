import { test, expect } from "vitest";
import TableGenerator from "./TableGenerator";
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