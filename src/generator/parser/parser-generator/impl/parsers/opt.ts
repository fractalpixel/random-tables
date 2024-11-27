import { Parser, parser } from "../Parser";
import { ParseResult, success } from "../ParseResult";

/**
 * Matches the specified parser if possible, otherwise returns a parse success with 
 * undefined result.
 */
export function opt<T>(p: Parser<T>): Parser<T | undefined> {
    return optOrElse(p, undefined)
}


/**
 * Matches the specified parser if possible, otherwise returns a parse success with 
 * the specified alternative value
 */
export function optOrElse<T, S>(p: Parser<T>, alternativeValue: S): Parser<T | S> {
    const name = "Optionally " + p.name;
    return parser((input: string, startPos: number): ParseResult<T | S> => {
        const r = p.parse(input, startPos);
        if (r.isOk()) return r;
        else return success(alternativeValue, startPos);
    }, name);
}
