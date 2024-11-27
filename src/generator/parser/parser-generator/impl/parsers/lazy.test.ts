import { expectFailure, expectSuccess } from "../testing-utils";
import { lazy } from "./lazy";
import { Parser } from "../Parser";
import { seq } from "./seq";
import { token } from "./token";
import { alt } from "./alt";


test("Test lazy parser", () => {
    const p1 = lazy<any>()
    const p2: Parser<any> = seq(token("b"), p1)
    p1.setParser(seq(token("a"), alt(p2, token("]"))))

    expectFailure(p1.parse("ab"), 1)
    expectSuccess(p1.parse("a]"), ["a", "]"], 2)
    expectSuccess(p1.parse("aba]"), ["a", ["b", ["a", "]"]]], 4)
})

