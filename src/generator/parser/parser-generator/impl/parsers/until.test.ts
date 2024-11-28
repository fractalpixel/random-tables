import { test } from "vitest";
import { token } from "./token";
import { expectSuccess, expectFailure } from "../testing-utils";
import { until, until1 } from "./until";
import { alt } from "./alt";

test("Match until", () => {
    const p = until(alt(token("}"), token("{"), token(";")))
    expectSuccess(p.parse(""), "", 0)
    expectSuccess(p.parse(";"), "", 0)
    expectSuccess(p.parse("aa;", 2), "", 2)
    expectSuccess(p.parse("ab;cd"), "ab", 2)
    expectSuccess(p.parse("{foobar}",1), "foobar", 7)
    expectSuccess(p.parse("{zap",1), "zap", 4)
    expectSuccess(p.parse("foo"), "foo", 3)
    expectSuccess(p.parse("foo\nbar"), "foo\nbar", 7)
})

test("Match until 1", () => {
    const p = until1(alt(token("}"), token("{"), token(";")))
    expectFailure(p.parse(""), 0)
    expectFailure(p.parse(";"), 0)
    expectFailure(p.parse("aa;", 2), 2)
    expectSuccess(p.parse("ab;cd"), "ab", 2)
    expectSuccess(p.parse("{foobar}",1), "foobar", 7)
    expectSuccess(p.parse("{zap",1), "zap", 4)
    expectSuccess(p.parse("foo"), "foo", 3)
    expectSuccess(p.parse("foo\nbar"), "foo\nbar", 7)
})

