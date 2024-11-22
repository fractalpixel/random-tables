import TextSpan from "../TextSpan"

export class TokenType {
    constructor(
        public readonly name: string, 
    ) {}
}


export class Token {
    constructor(
        public readonly type: TokenType, 
        public readonly value: string, 
        public readonly location: TextSpan
    ) {}
}


export class Parser<T> {
    constructor(
        private name: string,
        private parsingFunction: (context: ParseContext) => ParseResult<T>) {
    }

    getName(): string { 
        return this.name 
    }

    parse(context: ParseContext): ParseResult<T> {
        return this.parsingFunction(context)
    }

    /**
     * If this parser succeeds, map the resulting value using the provided mapping function.
     */
    map<S>(mappingFunction: (r: T) => S, name: string | undefined = undefined): Parser<S> {
        return new Parser<S>(
            name || (this.name + " (mapped)"), 
            (context: ParseContext) => {
                const parsedT = this.parsingFunction(context)            
                if (!parsedT.success)
                    return new ParseError<S>((parsedT as ParseError<T>).errorMessage)
                else
                    return new ParseSuccess<S>(mappingFunction((parsedT as ParseSuccess<T>).value))
            }
        )
    }
}

export function token(tokenType: TokenType, name: string): Parser<string> {
    return new Parser<string>(name, (context: ParseContext) => {
        const token = context.nextToken()
        if (token !== undefined && token.type == tokenType) {
            return new ParseSuccess(token.value)
        }
        else {
            return context.errorExpected(tokenType.name)
        }
    })
}

/**
 * Takes in a closure with the parser, instead of evaluating the parser immediately, 
 * only does so at first invocation.  This allows recursive and cyclic parser definitions.
 */
// @ts-ignore
export function lazy<T>(parser: ()=> Parser<T>, name: string = "lazy"): Parser<T> {    
    let cached: Parser<T> | undefined = undefined
    return new Parser<T>(name, (context: ParseContext) => {
        if (cached === undefined) cached = parser()

        return cached.parse(context)
    })
}

/**
 * Parses the first matching parser provided and returns its result, or a parse error if all failed.
 */
export function alt<T>(...alternativeParsers:Parser<T>[]): Parser<T> {
    const name = "[ "+ alternativeParsers.map((p)=>p.getName()).join(" | ")  +" ]"
    return new Parser<T>(name, (context: ParseContext) => {
        for (const p of alternativeParsers) {
            const result = p.parse(context.copy())
            if (result.success) {
                return result
            }
        }
        return new ParseError("Expected " + name + "\nat " + context.getUserReadablePosition())
    })
}

export function seq<T1>(
    p1:Parser<T1>,
): Parser<[T1]>;
export function seq<T1, T2>(
    p1:Parser<T1>,
    p2:Parser<T2>,
): Parser<[T1, T2]>;
export function seq<T1, T2, T3>(
    p1:Parser<T1>,
    p2:Parser<T2>,
    p3:Parser<T3>,
): Parser<[T1, T2, T3]>;
export function seq(...sequenceOfParsers:Parser<{}>[]): Parser<{}> {
    const name = sequenceOfParsers.map((p)=>p.getName()).join(" , ")
    return new Parser<any[]>(name, (context: ParseContext) => {
        let results = []
        for (const p of sequenceOfParsers) {
            const result = p.parse(context.copy())
            if (result.success) {
                results.push((result as ParseSuccess<{}>).value)
            }
            else {
                new ParseError("Expected " + p.getName() + "\nat " + context.getUserReadablePosition())
            }
        }
        return new ParseSuccess(results)
    })
}

export class ParseContext {
    constructor(
        public readonly input: string, 
        public readonly tokens: Token[],
        public tokenIndex: number = 0
    ) {}

    copy(): ParseContext {
        return new ParseContext(this.input, this.tokens, this.tokenIndex)
    }

    /**
     * Returns the current token and increment the token index.
     */
    nextToken(): Token | undefined {
        if (this.tokenIndex >= this.tokens.length) return undefined

        const token = this.tokens[this.tokenIndex]
        this.tokenIndex++
        return token
    }

    /**
     * Returns the current token without changing the active token.
     */
    currentToken(): Token | undefined {
        if (this.tokenIndex >= this.tokens.length) return undefined

        return this.tokens[this.tokenIndex]
    }

    getUserReadablePosition(): string {
        return "position " + this.tokenIndex
    }

    startsWith(s: string): boolean {
        if (s.length <= 0) return true
        if (this.tokenIndex >= this.tokens.length) return false

        const start = this.tokens[this.tokenIndex]?.location.startChar
        if (start === undefined) return false
        else {
            const end = start + s.length
            if (end >= this.input.length) return false
            else return this.input.substring(start, end).startsWith(s)
        }
    }

    errorExpected<T>(expectedWhat: string): ParseError<T> {
        return new ParseError("Expected " + expectedWhat + "\nat " + (this.currentToken()?.location?.toString() || "end of input"))
    }
}

export interface ParseResult<T> {
    success: boolean
    value: T | undefined
}

export class ParseSuccess<T> implements ParseResult<T> {
    success: true = true

    constructor(
        public readonly value: T
    ) {}
}

export class ParseError<T> implements ParseResult<T> {
    success: false = false
    value: undefined = undefined

    constructor(
        public readonly errorMessage: string, 
        //public readonly input: string, 
        //public readonly location: TextSpan,
    ) {}
}

