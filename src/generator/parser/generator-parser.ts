import ConstantGenerator from "../generators/ConstantGenerator";
import RandomGenerator from "../generators/RandomGenerator";
import SequenceGenerator from "../generators/SequenceGenerator";
import TableGenerator, { FlatWeightDistribution, GaussianWeightDistribution, LinearWeightDistribution, TableEntry, WeightDistribution } from "../generators/TableGenerator";
import * as P from "./parser-generator/parser-generator"


// Utility functions to make writing parsers more compact, and to compact down things like sequences with only one parser.
function consGen(s: string = ""): ConstantGenerator {
    return new ConstantGenerator(s)
}
function seqGen(gens: RandomGenerator[]): RandomGenerator {
    if (gens.length <= 0) return consGen("")
    else if (gens.length == 1) return gens[0]!
    else return new SequenceGenerator(gens)
}
function tableGen(gens: TableEntry[], distibution: WeightDistribution | undefined = undefined, distributionParam: number | undefined = undefined): RandomGenerator {
    if (gens.length <= 0) return consGen("")
    else if (gens.length == 1) return gens[0]?.value!
    else return new TableGenerator(gens, distibution || FlatWeightDistribution, distributionParam)
}


const INLINE_START = P.token("{")
const INLINE_END = P.token("}")
const INLINE_SEPARATOR = P.token(";")
const WEIGHT_SEPARATOR = P.token(":")

const TABLE_LINEARILY_DROPPING = P.token("-").mapTo(new LinearWeightDistribution())
const TABLE_LINEARILY_INCREASING = P.token("+").mapTo(new LinearWeightDistribution(true))
const TABLE_GAUSSIAN = P.token("~").mapTo(new GaussianWeightDistribution())


const whiteSpace = P.regExp(/\s*/)


// Possibly decimal number (no exponents though)
const number = P.regExp(/\d+(\.\d+)?/).map((s) => parseFloat(s)).named("number")

const inlineTable = P.lazy<RandomGenerator>()
const textInsideInlineBlock = P.until1(P.alt(INLINE_START, INLINE_END, INLINE_SEPARATOR)).map((s) => consGen(s))
const insideInlineBlockSequence = P.rep(P.alt(inlineTable, textInsideInlineBlock)).map((v) => seqGen(v))

const tableEntry = P.opt(
    whiteSpace.skipThenKeep(number.keepThenSkip(whiteSpace.then(WEIGHT_SEPARATOR)))
).then(insideInlineBlockSequence.orElse(consGen())).map(([weight, entry]) => new TableEntry(weight, entry)).named("table entry")

const tableProbabilityDistribution = 
    P.alt(
        TABLE_LINEARILY_DROPPING,
        TABLE_LINEARILY_INCREASING,
        TABLE_GAUSSIAN,
    ).then(
        P.opt(whiteSpace.skipThenKeep(
            P.surroundedBy(P.token("("), P.surroundedBy(whiteSpace, number.named("probability distribution parameter"), whiteSpace), P.token(")")))
        )
    )

inlineTable.setParser(
    P.surroundedBy(
        INLINE_START, 
        P.opt(tableProbabilityDistribution).then(
            P.sep(
                tableEntry, 
                INLINE_SEPARATOR
            )
        ).map(([distr, entries]) => tableGen(entries, distr?.[0], distr?.[1])), 
        INLINE_END
    ).named("inline table")
)

const textOutsideInlineBlock = P.until1(INLINE_START).map((s) => consGen(s))
const inlineBlockParser = 
    P.rep(
        P.alt(inlineTable, textOutsideInlineBlock)).map((v) => seqGen(v)
    )
    .named("sequence of random tables and text")
    .followedBy(P.endOfInput()
)





// @ts-ignore
export function parseGenerator(input: string): ParseResult<RandomGenerator> {
    return inlineBlockParser.parse(input)
}

