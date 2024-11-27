import { expectFailure, expectSuccess } from "../testing-utils";
import { token } from "./token";
import { sep } from "./sep";
import { regExp } from "./regExp";


test("Separated by", () => {
    const p = sep(regExp(/a*/), token(","))

    expectSuccess(p.parse("aaa"), ["aaa"], 3)
    expectSuccess(p.parse("aa,a,aaa"), ["aa", "a", "aaa"], 8)
    expectSuccess(p.parse("aa,,"), ["aa", "", ""], 4)
    expectSuccess(p.parse(","), ["", ""], 1)
    expectSuccess(p.parse("c"), [""], 0)

    const p2 = sep(regExp(/b+/), regExp(/\-+/), 1)
    expectSuccess(p2.parse("bbb---bb--bXX"), ["bbb", "bb", "b"], 11)
    expectSuccess(p2.parse("bX"), ["b"], 1)
    expectFailure(p2.parse("---bbb--"), 0)
    expectFailure(p2.parse("XX"), 0)

})