import ConstantGenerator from "../ConstantGenerator"
import RandomGenerator from "../RandomGenerator"
import SequenceGenerator from "../SequenceGenerator"
import TableGenerator from "../TableGenerator"
import { parseGenerator } from "./generator-parser"
import { ParseResult } from "./parser-generator/parser-generator"


test('parses empty string', () => {
    expectParserEquals(
        "",
        new ConstantGenerator("")
    )
})

test('parses constant', () => {
    expectParserEquals(
        "foo",
        new ConstantGenerator("foo")
    )
})

test('parses one element table', () => {
    expectParserEquals(
        "{bar}",
        new ConstantGenerator("bar"),
    )
})


test('parses simple table', () => {
    expectParserEquals(
        "{bar; zap}",
        new TableGenerator([
            "bar",
            " zap"
        ])
    )
})



test('parses table sequence', () => {
    expectParserEquals(
        "foo {bar; zap}",
        new SequenceGenerator([
            new ConstantGenerator("foo "),
            new TableGenerator([
                "bar",
                " zap"
            ])
        ])
    )
})


test('Fails on unclosed table', () => {
    expectParserToFail("foo {bar;")
    expectParserToFail("{{}")
    expectParserToFail("{")
    expectParserToFail("}{")
})




test('parses nested table sequence', () => {
    expectParserEquals(
        "foo {bar; zap ; yuu {zoo;baa};;fuu}fii",
        new SequenceGenerator([
            new ConstantGenerator("foo "),
            new TableGenerator([
                "bar",
                " zap ",
                new SequenceGenerator([
                    new ConstantGenerator(" yuu "),
                    new TableGenerator([
                        "zoo",
                        "baa"
                    ]),
                ]),
                "",
                "fuu"
            ]),
            new ConstantGenerator("fii")
        ])
    )
})


function expectParserEquals(input: string, generator: RandomGenerator) {
    const r: ParseResult<RandomGenerator> = parseGenerator(input)
    if (r.isError()) console.log(r.error)
    expect(r.isOk()).toEqual(true)
    expect(r.value).toEqual(generator)
}


function expectParserToFail(input: string) {
    const r: ParseResult<RandomGenerator> = parseGenerator(input)
    if (r.isError()) console.log(r.error)
    expect(r.isOk()).toEqual(false)
}