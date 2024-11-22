import TextSpan from "./TextSpan";

export enum TokenType {
    LEFT_BRACE,
    RIGHT_BRACE,
    SEMICOLON,
    TEXT,
}


export class Token {
    constructor(
        public readonly type: TokenType, 
        public readonly value: string, 
        public readonly location: TextSpan
    ) {}
}


export function tokenizeGenerator(input: string): Token[] {

    // NOTE: If we want to support longer tokens, we could lookahead for a token starting from the current spot.

    let tokens: Token[] = []

    let start = 0
    let end = 0
    let textTokenFound = false
    for (const char of input) {
        end++

        if (char === '{') {
            storeAnyPreviousTextToken(1)
            addToken(TokenType.LEFT_BRACE)
        }
        else if (char === '}') {
            storeAnyPreviousTextToken(1)
            addToken(TokenType.RIGHT_BRACE)
        }
        else if (char === ';') {
            storeAnyPreviousTextToken(1)
            addToken(TokenType.SEMICOLON)
        }
        else {
            textTokenFound = true
        }
    }
    storeAnyPreviousTextToken(0)

    return tokens


    function addToken(type: TokenType, endRetrace: number = 0) {
        const tokenEnd = end - endRetrace
        tokens.push(new Token(type, input.slice(start, tokenEnd), new TextSpan(start, tokenEnd)))
        start = tokenEnd
    }

    // endRetrace is used to step back the length of any other token found after a text token.
    function storeAnyPreviousTextToken(endRetrace: number) {
        if (textTokenFound) {
            addToken(TokenType.TEXT, endRetrace)
            textTokenFound = false
        }
    }
}