import { Parser, parser } from "../Parser";
import { success } from "../ParseResult";

/**
 * Matches the specified content surrounded by the specified prefix and postfix.
 * Returns the conent and discards the prefix and postfix in the result.
 */
export function surroundedBy<T>(prefix: Parser<any>, content: Parser<T>, postfix: Parser<any>): Parser<T> {
    const name = content.name + " enclosed in " + prefix.name + " and " + postfix.name;
    return parser((input: string, startPos: number) => {
        const pre = prefix.parse(input, startPos);
        if (pre.isError()) return pre;

        const result = content.parse(input, pre.endPos);
        if (result.isError()) return result;

        const post = postfix.parse(input, result.endPos);
        if (post.isError()) return post;

        return success(result.value, post.endPos);
    }, name);
}
