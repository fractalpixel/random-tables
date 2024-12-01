import { test, expect } from "vitest";

import ConstantGenerator from "../generators/ConstantGenerator"
import RandomGenerator from "../generators/RandomGenerator"
import SequenceGenerator from "../generators/SequenceGenerator"
import TableGenerator, { FlatWeightDistribution, GaussianWeightDistribution, LinearWeightDistribution, TableEntry } from "../generators/TableGenerator"
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

test('parses table with custom weights', () => {
    expectParserEquals(
        `foo {  
        6  :bar;
          2  :zap; mip}`,
        new SequenceGenerator([
            new ConstantGenerator("foo "),
            new TableGenerator([
                new TableEntry(6, new ConstantGenerator("bar")),
                new TableEntry(2, new ConstantGenerator("zap")),
                new TableEntry(undefined, new ConstantGenerator(" mip")),
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


test("Linear probability table", () => {
    expectParserEquals("{-a;b;c}",
        new TableGenerator(["a", "b", "c"], new LinearWeightDistribution())
    )

    expectParserEquals("{-(10)a;b;c}",
        new TableGenerator(["a", "b", "c"], new LinearWeightDistribution(), 10)
    )

    expectParserEquals("{- ( 10  )a;b;c}",
        new TableGenerator(["a", "b", "c"], new LinearWeightDistribution(), 10)
    )

    expectParserEquals("{ -a;b;c}",
        new TableGenerator([" -a", "b", "c"], FlatWeightDistribution)
    )

    expectParserEquals("{+a;b;c}",
        new TableGenerator(["a", "b", "c"], new LinearWeightDistribution(true))
    )
})


test("Gaussian probability table", () => {
    expectParserEquals("{~a;b;c}",
        new TableGenerator(["a", "b", "c"], new GaussianWeightDistribution())
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