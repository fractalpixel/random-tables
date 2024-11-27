import { Parser, parser } from "../Parser";
import { ParseResult, failure, success } from "../ParseResult";


/**
 * Parses a sequence with the specified parsers, in order.
 * Fails if any of the specified parsers fails.
 * The result is an array with the results of the individual parsers.
 */
export function seq<T1>(
    p1: Parser<T1>
): Parser<[T1]>;
export function seq<T1, T2>(
    p1: Parser<T1>,
    p2: Parser<T2>
): Parser<[T1, T2]>;
export function seq<T1, T2, T3>(
    p1: Parser<T1>,
    p2: Parser<T2>,
    p3: Parser<T3>
): Parser<[T1, T2, T3]>;
export function seq<T1, T2, T3, T4>(
    p1: Parser<T1>,
    p2: Parser<T2>,
    p3: Parser<T3>,
    p4: Parser<T4>
): Parser<[T1, T2, T3, T4]>;
export function seq<T1, T2, T3, T4, T5>(
    p1: Parser<T1>,
    p2: Parser<T2>,
    p3: Parser<T3>,
    p4: Parser<T4>,
    p5: Parser<T5>
): Parser<[T1, T2, T3, T4, T5]>;
export function seq<T1, T2, T3, T4, T5, T6>(
    p1: Parser<T1>,
    p2: Parser<T2>,
    p3: Parser<T3>,
    p4: Parser<T4>,
    p5: Parser<T5>,
    p6: Parser<T6>
): Parser<[T1, T2, T3, T4, T5, T6]>;
export function seq<T1, T2, T3, T4, T5, T6, T7>(
    p1: Parser<T1>,
    p2: Parser<T2>,
    p3: Parser<T3>,
    p4: Parser<T4>,
    p5: Parser<T5>,
    p6: Parser<T6>,
    p7: Parser<T7>
): Parser<[T1, T2, T3, T4, T5, T6, T7]>;
export function seq<T1, T2, T3, T4, T5, T6, T7, T8>(
    p1: Parser<T1>,
    p2: Parser<T2>,
    p3: Parser<T3>,
    p4: Parser<T4>,
    p5: Parser<T5>,
    p6: Parser<T6>,
    p7: Parser<T7>,
    p8: Parser<T8>
): Parser<[T1, T2, T3, T4, T5, T6, T7, T8]>;
export function seq<T1, T2, T3, T4, T5, T6, T7, T8, T9>(
    p1: Parser<T1>,
    p2: Parser<T2>,
    p3: Parser<T3>,
    p4: Parser<T4>,
    p5: Parser<T5>,
    p6: Parser<T6>,
    p7: Parser<T7>,
    p8: Parser<T8>,
    p9: Parser<T9>
): Parser<[T1, T2, T3, T4, T5, T6, T7, T8, T9]>;
export function seq<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(
    p1: Parser<T1>,
    p2: Parser<T2>,
    p3: Parser<T3>,
    p4: Parser<T4>,
    p5: Parser<T5>,
    p6: Parser<T6>,
    p7: Parser<T7>,
    p8: Parser<T8>,
    p9: Parser<T9>,
    p10: Parser<T10>
): Parser<[T1, T2, T3, T4, T5, T6, T7, T8, T9, T10]>;
export function seq(firstParser: Parser<any>, ...additionalParsers: Parser<any>[]): Parser<any[]> {
    const parsers = [firstParser, ...additionalParsers];

    const name = "Sequence of [" + parsers.map(p => p.name || "?").join(", ") + "]";

    return parser((input: string, startPos: number): ParseResult<any[]> => {
        let pos = startPos;
        let parseResult = [];
        for (let p of parsers) {
            const result = p.parse(input, pos);
            if (result.isError())
                return failure("Expected " + p.name, pos);
            pos = result.endPos;
            parseResult.push(result.value);
        }
        return success(parseResult, pos);
    }, name);
}
