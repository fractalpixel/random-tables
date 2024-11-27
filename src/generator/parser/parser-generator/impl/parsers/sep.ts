import { Parser, parser } from "../Parser";
import { ParseResult, success, failure } from "../ParseResult";

/**
 * Mathces the specified element the specified number of times (default 0 or more), separated by the specified
 * separator.
 */
export function sep<T>(element: Parser<T>, separator: Parser<any>, minCount: number = 0, maxCount: number | undefined = undefined): Parser<T[]> {
    const name = (
        minCount == maxCount ?
            (minCount + " matches of " + element.name) :
            (maxCount === undefined ?
                minCount + " or more matches of " + element.name :
                minCount + " up to " + maxCount + " matches of " + element.name)
    ) + " separated by " + separator.name;

    return parser((input: string, startPos: number): ParseResult<T[]> => {
        let results: T[] = [];
        let pResult: ParseResult<T>;
        let pos = startPos;
        let count = 0;
        do {
            pResult = element.parse(input, pos);
            if (pResult.isOk()) {
                results.push(pResult.value!);
                pos = pResult.endPos;
                count++;

                pResult = separator.parse(input, pos);
                if (pResult.isOk()) {
                    pos = pResult.endPos;
                }
            }
        } while (pResult.isOk() && (maxCount === undefined || count < maxCount));

        if (results.length >= minCount) return success(results, pos);
        else return failure("Expected at least " + minCount + " matches, but got " + count + " matches of " + element.name + " separated by " + separator.name, pos);
    }, name);
}


/**
 * Mathces the specified element 1 or more times, separated by the specified separator.
 */
export function sep1<T>(element: Parser<T>, separator: Parser<any>): Parser<T[]> {
    return sep(element, separator, 1, undefined);
}


/**
 * Mathces the specified element exactly the specified number of times, separated by the specified separator.
 */
export function sepN<T>(element: Parser<T>, separator: Parser<any>, count: number): Parser<T[]> {
    return sep(element, separator, count, count);
}
