import RandomGenerator from "../RandomGenerator";
import { ParseResult } from "./parser-builder/parser-builder";

// @ts-ignore
export function parseGenerator(input: string): ParseResult<RandomGenerator> {
/*
    const tokens = tokenizeGenerator(input)
    const context = new ParseContext(input, tokens, 0)

    const singleTable = seq(
        token(TokenType.LEFT_BRACE, "{"),
        token(TokenType.TEXT, "element"),
        token(TokenType.RIGHT_BRACE, "}"),
    ).map(
        (r) => {
            console.log("r: " + r.join(", "));
            return new TableGenerator([r[1]])
        }
    )

    const parser = alt<RandomGenerator>(
        token(TokenType.TEXT, "text").map((text: string) => new ConstantGenerator(text)),
        singleTable
    )

    return parser.parse(context)
    */
}

