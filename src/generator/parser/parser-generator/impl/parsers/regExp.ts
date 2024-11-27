import { Parser, parser } from "../Parser";
import { ParseResult, success, failure } from "../ParseResult";


/**
 * Matches the specified regular expression.
 * 
 * Note that the g-flag is filtered away if present, and y flag added.
 * 
 * Take care when using regExps that match empty strings, 
 * in case they are matched in a potential loop such as sequence, 
 * they will cause a crash, because they are matched an infinite number of thimes.
 */
export function regExp(r: RegExp): Parser<string> {
    const name = "RegExp(" + r + ")";
    return parser((input: string, startPos: number): ParseResult<string> => {
        // Ensure the regexp is not global, and is sticky (y)
        const fixedR = new RegExp(r.source, r.flags.replace("g", "").replace("y", "") + "y");

        // Set start pos to regexp
        fixedR.lastIndex = startPos;

        // Check
        const result = fixedR.exec(input);
        if (result !== null && result.length > 0) {
            return success(result[0]!, fixedR.lastIndex);
        }
        else return failure("Expected input matching " + name, startPos);
    }, name);
}
