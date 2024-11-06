import {ConstantGenerator, parseGenerator, TableGenerator} from "../src/generatorParser"

test('parser parses empty string', () => {
    expect(parseGenerator("")).toEqual(new ConstantGenerator())
})

test("parses constant value", () => {
    expect(parseGenerator("foo")).toEqual(new ConstantGenerator("foo"))
})

test("constant generator generates value", () => {
    const cg = new ConstantGenerator("bar")
    expect(cg.generate()).toEqual("bar")
})


test("generator parser parses bracket list", () => {
    expect(parseGenerator("{a,b}")).toEqual(new TableGenerator(["a", "b"]))
})