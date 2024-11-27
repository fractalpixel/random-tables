import { expectFailure, expectSuccess } from "../testing-utils";
import { token } from "./token";
import { surroundedBy } from "./surroundedBy";
import { rep1 } from "./rep";


test("Surrounded by", () => {
    const p = surroundedBy(token("("), rep1(token("a")), token(")"))

    expectFailure(p.parse("aaa"), 0)
    expectFailure(p.parse("(a"), 2)
    expectFailure(p.parse("aaa)"), 0)
    expectFailure(p.parse("()"), 1)
    expectSuccess(p.parse("(aaaa)b"), ["a", "a", "a", "a"], 6)
    expectSuccess(p.parse("(a)"), ["a"], 3)

    const p2 = rep1(token("b")).surroundedBy(token("("), token(")"))
    expectFailure(p2.parse("(bb"), 3)
    expectFailure(p2.parse("()"), 1)
    expectSuccess(p2.parse("(bb)"), ["b", "b"], 4)
})
