import ConstantGenerator from "../ConstantGenerator";
import RandomGenerator from "../RandomGenerator";
import SequenceGenerator from "../SequenceGenerator";
import TableGenerator from "../TableGenerator";
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
function tableGen(gens: RandomGenerator[]): RandomGenerator {
    if (gens.length <= 0) return consGen("")
    else if (gens.length == 1) return gens[0]!
    else return new TableGenerator(gens)
}


const INLINE_START = P.token("{")
const INLINE_END = P.token("}")
const INLINE_SEPARATOR = P.token(";")


const inlineTable = P.lazy<RandomGenerator>()
const textInsideInlineBlock = P.until1(P.alt(INLINE_START, INLINE_END, INLINE_SEPARATOR)).map((s) => consGen(s))
const insideInlineBlockSequence = P.rep(P.alt(inlineTable, textInsideInlineBlock)).map((v) => seqGen(v))
inlineTable.setParser(P.surroundedBy(
    INLINE_START, 
    P.sep(
        insideInlineBlockSequence.orElse(consGen()), 
        INLINE_SEPARATOR
    ).map((v) => tableGen(v)), 
    INLINE_END)
)

const textOutsideInlineBlock = P.until1(INLINE_START).map((s) => consGen(s))
const inlineBlockParser = P.rep(P.alt(inlineTable, textOutsideInlineBlock)).map((v) => seqGen(v)).followedBy(P.endOfInput())





// @ts-ignore
export function parseGenerator(input: string): ParseResult<RandomGenerator> {
    return inlineBlockParser.parse(input)
}

