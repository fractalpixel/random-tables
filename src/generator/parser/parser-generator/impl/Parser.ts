import { ParseResult, success, failure } from "./ParseResult";
import { opt, optOrElse } from "./parsers/opt";
import { sep, sep1, sepN } from "./parsers/sep";
import { surroundedBy } from "./parsers/surroundedBy";
import { followedBy } from "./parsers/followedBy";
import { rep, rep1, repN } from "./parsers/rep";
import { alt } from "./parsers/alt";
import { seq } from "./parsers/seq";

/**
 * A parser that can take an input string and return a result of type T, or an error.
 * Has various convenience functions to return modified parsers.
 */
export abstract class Parser<T> {

    /**
     * @param name User readable name of this parser, for error reporting.
     */
    constructor(public name: string | undefined = undefined) {}

    /**
     * Parse the specified input (optionally starting at the specified position), returning a ParseResult with the parsed value, or an error message.
     */
    parse(input: string, startPos: number = 0): ParseResult<T> {
        return this.doParse(input, startPos)
    }


    /**
     * Returns this parser renamed to the specified name.
     * Useful for more readable error messages.
     */
    named(name: string): Parser<T> {
        return parser(this.doParse, name)
    }

    /**
     * Returns a parser that on success applies the given function to the result.
     */
    map<S>(f: (t: T) => S): Parser<S> {
        const p = this
        return parser((input: string, startPos: number): ParseResult<S> => {
            const pResult = p.doParse(input, startPos)
            if (pResult.isError()) return failure(pResult.error!, pResult.endPos)
            else return success(f(pResult.value!), pResult.endPos)
        })
    }

    /**
     * Returns a parser that on success returns the specified constant.
     */
    mapTo<S>(c: S): Parser<S> {
        return this.map(() => c)
    }


    /**
     * Returns this parser, but modified so that it must be followed by the specified next parser to succeed.
     */
    followedBy<N>(next: Parser<N>): Parser<T> {
        return followedBy(this, next)
    }


    /**
     * Returns a parser that matches this parser or the other parser specified
     */
    or(other: Parser<T>): Parser<T> {
        return alt(this, other)
    }

    /**
     * Returns a parser that matches this parser and then the other parser specified
     */
    then<S>(other: Parser<S>): Parser<[T, S]> {
        return seq(this, other)
    }

    /**
     * Returns a parser that matches this content surrounded by the specified prefix and postfix.
     */
    surroundedBy(prefix: Parser<any>, postfix: Parser<any>): Parser<T> {
        return surroundedBy(prefix, this, postfix)
    }

    /**
     * Returns a parser that matches this content the specified number of times.
     * (By default, zero or more times).
     */
    rep(minCount: number = 0, maxCount: number | undefined = undefined): Parser<T[]> {
        return rep(this, minCount, maxCount)
    }

    /**
     * Returns a parser that matches this content one or more times.
     */
    rep1(): Parser<T[]> {
        return rep1(this)
    }

    /**
     * Returns a parser that matches this content exactly the specified number of times.
     */
    repN(count: number): Parser<T[]> {
        return repN(this, count)
    }


    /**
     * Returns a parser that matches this parser the specified number of times separated with the specified separator.
     * Defaults to zero or more times.
     */
    sep(separator: Parser<any>, minCount: number = 0, maxCount: number | undefined = undefined): Parser<T[]> {
        return sep(this, separator, minCount, maxCount)
    }

    /**
     * Returns a parser that matches this parser one or more timnes separated with the specified separator.
     */
    sep1(separator: Parser<any>): Parser<T[]> {
        return sep1(this, separator)
    }

    /**
     * Returns a parser that matches this parser exactly the specified times separated with the specified separator.
     */
    sepN(separator: Parser<any>, count: number): Parser<T[]> {
        return sepN(this, separator, count)
    }

    /**
     * Matches this parser, or if not, returns undefined.
     */
    opt(): Parser<T | undefined> {
        return opt(this)
    }

    /**
     * Matches this parser, or if not, returns the specified value directly.
     */
    orElse<S>(value: S): Parser<T | S> {
        return optOrElse(this, value)
    }

    /**
     * Should be implemented by inheritors.  Does the actual parsing for this parser.
     */
    abstract doParse(input: string, startPos: number): ParseResult<T>    
}


/**
 * Class that wraps a function and implements a parser.
 */
export class ParserFun<T> extends Parser<T> {
    constructor(private f: (input: string, startPos: number) => ParseResult<T>, name: string | undefined = undefined) {
        super(name)
    }

    doParse(input: string, startPos: number): ParseResult<T> {
        return this.f(input, startPos)        
    }
}

/**
 * Utility function that creates a parser from an expression
 */
export function parser<T>(f: (input: string, startPos: number) => ParseResult<T>, name: string | undefined = undefined): Parser<T> {
    return new ParserFun(f, name)
}
