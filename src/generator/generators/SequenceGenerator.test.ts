import { test, expect } from "vitest";
import ConstantGenerator from "./ConstantGenerator";
import SequenceGenerator from "./SequenceGenerator";

test("Sequence generator", () => {
    const g = new SequenceGenerator([new ConstantGenerator("foo"), new ConstantGenerator("bar")])
    expect(g.generate()).toEqual("foobar")
})
