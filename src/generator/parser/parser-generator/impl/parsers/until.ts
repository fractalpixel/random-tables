import { Parser, parser } from "../Parser";
import { ParseResult, success, failure } from "../ParseResult";

/**
 * Matches input until the specified parser matches. 
 * Requires at least the specified number of characters before the end parser is matched, or it fails.
 * Defaults to zero or more characters.
 */
export function until(end: Parser<any>, minimumCharacters: number = 0): Parser<string> {
    const name = "Parse until " + end.name;
    return parser((input: string, startPos: number): ParseResult<string> => {
        for (let i = startPos; i < input.length; i++) {
            const endParserResult = end.parse(input, i);
            if (endParserResult.isOk())
                if (i-startPos >= minimumCharacters)
                    return success(input.substring(startPos, i), i);
                else
                    return failure("Expected at least " + minimumCharacters + " before " + end.name, startPos)
        }

        if (input.length-startPos >= minimumCharacters)
            return success(input.substring(startPos), input.length);
        else
            return failure("Expected at least " + minimumCharacters + " before " + end.name, startPos)
    }, name);
}

/**
 * Matches one or more characters of input until the specified parser matches. 
 */
export function until1(end: Parser<any>): Parser<string> {
    return until(end, 1)
}

