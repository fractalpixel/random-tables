import { test } from "vitest";
import { token } from "../parser-generator";
import { expectFailure, expectSuccess } from "./testing-utils";

test("Keep then skip", () => {
    const p = token("foo").keepThenSkip(token("bar"))

    expectSuccess(p.parse("foobar"), "foo", 6)
    expectFailure(p.parse("foo"), 3)
})

test("Skip then keep", () => {
    const p = token("foo").skipThenKeep(token("bar"))

    expectSuccess(p.parse("foobar"), "bar", 6)
    expectFailure(p.parse("foo"), 3)
})