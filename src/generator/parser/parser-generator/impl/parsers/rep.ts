import { Parser, parser } from "../Parser";
import { ParseResult, success, failure } from "../ParseResult";

/**
 * Matches the specified parser between some minimum and maximum number of times.
 * Default to zero or more times.
 */
export function rep<T>(p: Parser<T>, minCount: number = 0, maxCount: number | undefined = undefined): Parser<T[]> {
    const name = minCount == maxCount ?
        (minCount + " matches of " + p.name) :
        (maxCount === undefined ?
            minCount + " or more matches of " + p.name :
            minCount + " up to " + maxCount + " matches of " + p.name);

    return parser((input: string, startPos: number): ParseResult<T[]> => {
        let results: T[] = [];
        let pResult: ParseResult<T>;
        let pos = startPos;
        let count = 0;
        do {
            pResult = p.parse(input, pos);
            if (pResult.isOk()) {
                results.push(pResult.value!);
                pos = pResult.endPos;
                count++;
            }
        } while (pResult.isOk() && (maxCount === undefined || count < maxCount));

        if (results.length >= minCount) return success(results, pos);
        else return failure("Expected at least " + minCount + " matches, but got " + count + " matches of " + p.name, pos);
    }, name);
}


/**
 * Matches the specified parser one or more times.
 */
export function rep1<T>(p: Parser<T>): Parser<T[]> {
    return rep(p, 1, undefined);
}


/**
 * Matches the specified parser exactly N times.
 */
export function repN<T>(p: Parser<T>, count: number): Parser<T[]> {
    return rep(p, count, count);
}
