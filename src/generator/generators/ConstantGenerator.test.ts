import { test, expect } from "vitest";
import ConstantGenerator from "./ConstantGenerator";

test("Constant generator", () => {
    const g = new ConstantGenerator("foo")
    expect(g.generate()).toEqual("foo")
})
