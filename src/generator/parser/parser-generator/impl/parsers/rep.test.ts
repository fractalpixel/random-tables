import { expectFailure, expectSuccess } from "../testing-utils";
import { token } from "./token";
import {rep, rep1, repN} from "./rep";
import { alt } from "./alt";

test("Repeating, zero or more", () => {
    const p = rep(alt(token("a1"), token("b2")))
    expectSuccess(p.parse(""), [], 0)
    expectSuccess(p.parse("cd"), [], 0)
    expectSuccess(p.parse("b2"), ["b2"], 2)
    expectSuccess(p.parse("a1a1"), ["a1","a1"], 4)
    expectSuccess(p.parse("b2a1b2cd"), ["b2","a1","b2"], 6)
})

test("Repeating, one or more", () => {
    const p = rep1(alt(token("a1"), token("b2")))
    expectFailure(p.parse(""), 0)
    expectFailure(p.parse("cd"), 0)
    expectSuccess(p.parse("b2"), ["b2"], 2)
    expectSuccess(p.parse("a1a1"), ["a1","a1"], 4)
    expectSuccess(p.parse("b2a1b2cd"), ["b2","a1","b2"], 6)
})

test("Repeating, N times", () => {
    const p = repN(alt(token("a1"), token("b2")), 3)
    expectFailure(p.parse(""), 0)
    expectFailure(p.parse("cd"), 0)
    expectFailure(p.parse("b2"), 2)
    expectFailure(p.parse("a1b2cd"), 4)
    expectSuccess(p.parse("b2a1b2cd"), ["b2","a1","b2"], 6)
    expectSuccess(p.parse("b2a1b2b2b2"), ["b2","a1","b2"], 6)
})

test("Repeating, range", () => {
    const p = rep(alt(token("a1"), token("b2")), 2, 3)
    expectFailure(p.parse(""), 0)
    expectFailure(p.parse("cd"), 0)
    expectFailure(p.parse("b2"), 2)
    expectSuccess(p.parse("a1b2cd"), ["a1", "b2"], 4)
    expectSuccess(p.parse("b2a1b2cd"), ["b2","a1","b2"], 6)
    expectSuccess(p.parse("a1a1b2a1cd"), ["a1","a1","b2"], 6)
})

