import { expectFailure, expectSuccess } from "../testing-utils";
import { regExp } from "./regExp";

test("Regexp matching", () => {
    const p = regExp(/(ab)+/i)
    expectFailure(p.parse("aa"), 0)
    expectFailure(p.parse(""), 0)
    expectFailure(p.parse("cab"), 0)
    expectSuccess(p.parse("ab"), "ab", 2)
    expectSuccess(p.parse("abc"), "ab", 2)
    expectSuccess(p.parse("ababab"), "ababab", 6)
    expectSuccess(p.parse("AbABaB"), "AbABaB", 6)
    expectSuccess(p.parse("cdabababef", 2), "ababab", 8)
})

