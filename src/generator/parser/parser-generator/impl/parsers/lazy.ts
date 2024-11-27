import { Parser } from "../Parser";
import { ParseResult } from "../ParseResult";

/**
 * Create a parser that must be initialized with an actual parser before use (using setParser()).
 * This allows creating parsers that recursively call each other.
 */
export function lazy<T>(): LazyParser<T> {
    return new LazyParser<T>();
}


/**
 * Parser class that must be initialized with a parser before use.  Allows for some recursive parsers.
 */
export class LazyParser<T> extends Parser<T> {
    private parser: Parser<T> | undefined = undefined;

    /**
     * Call this before parsing starts to set the parser that this parser should actually use.
     */
    setParser(parser: Parser<T>) {
        this.parser = parser;
    }

    doParse(input: string, startPos: number): ParseResult<T> {
        if (this.parser === undefined) throw Error("Lazy parser has not been initialized!");
        return this.parser!.parse(input, startPos);
    }
}
