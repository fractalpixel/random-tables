import { expectFailure, expectSuccess } from "../testing-utils";
import { token } from "./token";
import { seq } from "./seq";

test("Parse sequence", () => {
    const p = seq(token("foo"), token("bar"), token("zap"))
    expectFailure(p.parse("bar"), 0)
    expectFailure(p.parse("foo"), 3)
    expectFailure(p.parse("foobar"), 6)
    expectSuccess(p.parse("foobarzap"), ["foo", "bar", "zap"], 9)
    expectSuccess(p.parse("guhfoobarzapblob", 3), ["foo", "bar", "zap"], 12)
})

