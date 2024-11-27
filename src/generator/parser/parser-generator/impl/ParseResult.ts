/**
 * Result of parsing something, or an error.
 * endPos is one past the last position parsed by this parser.
 */
export class ParseResult<T> {
    constructor(
        public readonly value: T | undefined,
        public readonly error: string | undefined,
        public readonly endPos: number) { }

    isOk(): boolean { return this.error === undefined; }
    isError(): boolean { return !this.isOk(); }
}


/**
 * Utility function that returns a successful parse result
 */
export function success<T>(value: T, endPos: number): ParseResult<T> {
    return new ParseResult<T>(value, undefined, endPos)
}

/**
 * Utility function that returns a parse error
 */
export function failure<T>(message: string, endPos: number): ParseResult<T> {
    return new ParseResult<T>(undefined, message, endPos)
}
