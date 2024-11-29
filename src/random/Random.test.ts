import { test, expect } from "vitest";
import SeedRandomImpl from "./SeedRandomImpl"
import MockRandom from "./MockRandom";

test('Statistical test of seed random', () => {
    const rng = new SeedRandomImpl()

    const range = 10
    const results: number[] = []
    for (let i = 0; i < range*2+1; i++) results.push(0)

    const runs = 10000
    // Collect rolls
    for (let i = 0; i < runs; i++) {
        const r = Math.round(rng.gaussian(3))
        if (r >= -range && r <= range) results[r + range]!++;
    }

    const printHistorgram = false
    if (printHistorgram) {
        // Printout histogram for visual inspection
        console.log("SeedRandomImpl nextGaussian histogram:")
        for (let i = 0; i < range*2+1; i++) 
            console.log(" " + (i - range) + ": \t" + 
                "#".repeat(Math.round(results[i]! * (range*20 / runs)))
            )
    }

    // Assert that center has more hits than edges
    expect(results[0]).toBeLessThan(results[range]!)
    expect(results[2*range]).toBeLessThan(results[range]!)

})

test("Test mock random", () => {
    const mr = new MockRandom(9)
    expect(mr.float()).toEqual(9)
    expect(mr.float0to1()).toEqual(9)
    expect(mr.floatRange(-100, 100)).toEqual(9)
    expect(mr.int(100)).toEqual(9)
    expect(mr.intRange(-100, 100)).toEqual(9)
    expect(mr.gaussian()).toEqual(9)
    expect(mr.newRandom().gaussian()).toEqual(9)

})