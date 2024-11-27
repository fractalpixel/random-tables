import { Parser, parser } from "../Parser";
import { success, failure } from "../ParseResult";

/**
 * A parser that matches the end of the input.
 */
export function endOfInput(): Parser<undefined> {
    const name = "End of input";
    return parser((input: string, startPos: number) => {
        if (startPos >= input.length) return success(undefined, startPos);
        else return failure("End of input expected", startPos);
    }, name);
}
