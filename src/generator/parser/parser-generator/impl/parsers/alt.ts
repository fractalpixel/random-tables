import { Parser, parser } from "../Parser";
import { ParseResult, failure } from "../ParseResult";

/**
 * Parses the first matching of the specified parsers.
 * Fails if none of the specified parsers match.
 */
export function alt<T>(firstParser: Parser<T>, ...additionalParsers: Parser<T>[]): Parser<T> {
    const parsers = [firstParser, ...additionalParsers];

    const name = "one of [" + parsers.map(p => p.name).join(" | ") + "]";
    return parser((input: string, startPos: number): ParseResult<T> => {
        for (let p of parsers) {
            const result = p.parse(input, startPos);
            if (result.isOk())
                return result;
        }
        return failure("Expected " + name, startPos);
    }, name);

}
