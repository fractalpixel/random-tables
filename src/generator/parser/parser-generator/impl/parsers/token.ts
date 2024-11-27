import { Parser, parser } from "../Parser";
import { success, failure } from "../ParseResult";

/**
 * Parses tokens matching the specified string.
 * The result is the string token.
 */
export function token(s: string): Parser<string> {
    //    if (s.length <= 0) throw Error("A token can not be empty (it would match everything")
    return parser((input: string, startPos: number) => {
        if (input.startsWith(s, startPos))
            return success(s, startPos + s.length);

        else
            return failure("Did not match token '" + s + "'", startPos);
    }, "Token '" + s + "'");
}
