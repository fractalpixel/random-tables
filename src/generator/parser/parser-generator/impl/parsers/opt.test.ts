import { expectSuccess } from "../testing-utils";
import { token } from "./token";
import { opt, optOrElse } from "./opt";


test("Optional", () => {
    const p = opt(token("foo"))

    expectSuccess(p.parse(""), undefined, 0)
    expectSuccess(p.parse("bar"), undefined, 0)
    expectSuccess(p.parse("foobar"), "foo", 3)
    expectSuccess(p.parse("zapfoobar", 3), "foo", 6)

    const p2 = optOrElse(token("foo"), "xyz")
    expectSuccess(p2.parse(""), "xyz", 0)
    expectSuccess(p2.parse("bar"), "xyz", 0)
    expectSuccess(p2.parse("foobar"), "foo", 3)
    expectSuccess(p2.parse("zapfoobar", 3), "foo", 6)
})

