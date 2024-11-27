import { expectFailure, expectSuccess } from "../testing-utils";
import { endOfInput } from "./endOfInput";

test("Test end of input", () => {
    const p = endOfInput()

    expectFailure(p.parse("ab"), 0)
    expectFailure(p.parse("ab", 1), 1)
    expectSuccess(p.parse("ab", 2), undefined, 2)
    expectSuccess(p.parse(""), undefined, 0)
})
