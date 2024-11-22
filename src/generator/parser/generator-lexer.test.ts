import { Token, tokenizeGenerator, TokenType } from "./generator-lexer"
import TextSpan from "./TextSpan"


test('tokenize empty input', () => {
    expect(tokenizeGenerator("")).toEqual([])
})

test('tokenize input with text', () => {
    expect(
        tokenizeGenerator("foo bar"))
    .toEqual(
        [new Token(TokenType.TEXT, "foo bar", new TextSpan(0, 7))]
    )
})


test('tokenize input with braces and semis', () => {
    const tokens = tokenizeGenerator("foo {bar;;zip zap} baz")
    expect(tokens).toEqual(
        [
            new Token(TokenType.TEXT, "foo ", new TextSpan(0, 4)),
            new Token(TokenType.LEFT_BRACE, "{", new TextSpan(4, 5)),
            new Token(TokenType.TEXT, "bar", new TextSpan(5, 8)),
            new Token(TokenType.SEMICOLON, ";", new TextSpan(8, 9)),
            new Token(TokenType.SEMICOLON, ";", new TextSpan(9, 10)),
            new Token(TokenType.TEXT, "zip zap", new TextSpan(10, 17)),
            new Token(TokenType.RIGHT_BRACE, "}", new TextSpan(17, 18)),
            new Token(TokenType.TEXT, " baz", new TextSpan(18, 22)),
        ]
    )
})

test('tokenize input with single brace', () => {
    const tokens = tokenizeGenerator("{")
    expect(tokens).toEqual(
        [
            new Token(TokenType.LEFT_BRACE, "{", new TextSpan(0, 1)),
        ]
    )
})

test('tokenize input with two braces', () => {
    const tokens = tokenizeGenerator("}{")
    expect(tokens).toEqual(
        [
            new Token(TokenType.RIGHT_BRACE, "}", new TextSpan(0, 1)),
            new Token(TokenType.LEFT_BRACE, "{", new TextSpan(1, 2)),
        ]
    )
})
