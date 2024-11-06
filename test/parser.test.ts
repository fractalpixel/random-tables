import ConstantGenerator from "../src/generator/ConstantGenerator"
import TableGenerator from "../src/generator/TableGenerator"
import {parseGenerator} from "../src/generator/generator-parser"

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


test("generator parser parses constant", () => {
    expect(parseGenerator("foo bar")).toEqual(new ConstantGenerator("foo bar"))
})

test("generator parser parses bracket list", () => {
    expect(parseGenerator("{a;b}")).toEqual(new TableGenerator(["a", "b"]))
})
