import { expectFailure, expectSuccess } from "../testing-utils";
import { token } from "./token";
import { alt } from "./alt";
import { seq } from "./seq";

test("Parse alternatives and mapping", () => {
    const p = alt(token("foo"), seq(token("ba"), token("r")).map((v) => v[0]+v[1]), token("zap"))
    expectFailure(p.parse("blob"), 0)
    expectSuccess(p.parse("foo"), "foo", 3)
    expectSuccess(p.parse("bar"), "bar", 3)
    expectFailure(p.parse("bax"), 0)
    expectSuccess(p.parse("zap"), "zap", 3)
    expectSuccess(p.parse("blobzap", 4), "zap", 7)
})

