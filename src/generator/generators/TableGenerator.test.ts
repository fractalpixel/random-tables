import { test, expect } from "vitest";
import TableGenerator from "./TableGenerator";
import ConstantGenerator from "./ConstantGenerator";
import MockRandom from "src/random/MockRandom";

test("Table generator", () => {
    const rng = new MockRandom(0)

    const g0 = new TableGenerator([])
    expect(g0.generate(rng)).toEqual("")

    const g = new TableGenerator([new ConstantGenerator("foo"), new ConstantGenerator("bar")])

    rng.randomValue = 0
    expect(g.generate(rng)).toEqual("foo")

    rng.randomValue = 1
    expect(g.generate(rng)).toEqual("bar")
})
