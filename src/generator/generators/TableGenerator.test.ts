import { test, expect } from "vitest";
import TableGenerator from "./TableGenerator";
import ConstantGenerator from "./ConstantGenerator";
import MockRandom from "src/random/MockRandom";

test("Table generator", () => {
    const g = new TableGenerator([new ConstantGenerator("foo"), new ConstantGenerator("bar")])
    const rng = new MockRandom(0)
    expect(g.generate(rng)).toEqual("foo")

    rng.randomValue = 1
    expect(g.generate(rng)).toEqual("bar")
})
