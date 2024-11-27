import { expectFailure, expectSuccess } from "../testing-utils";
import { token } from "./token";
import { followedBy } from "./followedBy";


test("Followed by", () => {
    const p = followedBy(token("foo"), token("bar"))

    expectFailure(p.parse("zap"), 0)
    expectFailure(p.parse("foo"), 3)
    expectFailure(p.parse("bar"), 0)
    expectSuccess(p.parse("foobar"), "foo", 3)
    expectSuccess(p.parse("zipfoobarzap", 3), "foo", 6)
})

