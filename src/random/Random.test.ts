import { test, expect } from "vitest";
import SeedRandomImpl from "./SeedRandomImpl"

test('Statistical test of seed random', () => {
    const rng = new SeedRandomImpl()

    const range = 10
    const results: number[] = []
    for (let i = 0; i < range*2+1; i++) results.push(0)

    const runs = 10000
    // Collect rolls
    for (let i = 0; i < runs; i++) {
        const r = Math.round(rng.nextGaussian(3))
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