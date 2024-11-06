import { lazy, many, map, opt, or, Parser, regexp, seq, token } from "tspc";
import RandomGenerator from "./RandomGenerator";
import ConstantGenerator from "./ConstantGenerator";
import TableGenerator from "./TableGenerator";


const generatorParser: Parser<string, RandomGenerator> = lazy(() => or(bracketList, constant))
const constant = map(regexp(/[^\{\}\;]+/), (s) => new ConstantGenerator(s))
const bracketList = map(seq(
    token("{"), 
    many(map(seq(generatorParser, opt(token(";"))), (p) => p[0])), 
    token("}")
), (v) => new TableGenerator(v[1]))


export function parseGenerator(input: string): RandomGenerator {
    
    const result= generatorParser(input, 0)

    if (result.success) return result.value
    else return new ConstantGenerator("")
}

