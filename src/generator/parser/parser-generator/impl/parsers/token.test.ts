import { token } from "./token";
import { expectFailure, expectSuccess } from "../testing-utils";


test("Parse simple token", () => {
    const p = token("foo")
    
    expectFailure(p.parse("bar"), 0)
    expectSuccess(p.parse("foo"), "foo", 3)
    expectSuccess(p.parse("fooBar"), "foo", 3)
    expectSuccess(p.parse("zapfoobar", 3), "foo", 6)
})
