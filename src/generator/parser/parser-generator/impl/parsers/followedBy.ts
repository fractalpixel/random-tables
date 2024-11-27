import { Parser, parser } from "../Parser";
import { failure } from "../ParseResult";

/**
 * A parser that matches the specified parser, if followed by the other parser (not consumed).
 */
export function followedBy<T, S>(firstParser: Parser<T>, next: Parser<S>): Parser<T> {
    const name = firstParser.name + " followed by " + next.name;
    return parser((input: string, startPos: number) => {
        const parserResult = firstParser.parse(input, startPos);
        if (parserResult.isError()) return parserResult;
        else {
            const nextResult = next.parse(input, parserResult.endPos);
            if (nextResult.isError()) return failure("Expected " + firstParser.name + " followed by " + next.name, parserResult.endPos);
            else return parserResult;
        }
    }, name);
}
