import { Random } from "src/random/Random";
import ConstantGenerator from "./ConstantGenerator";
import RandomGenerator from "./RandomGenerator";

/**
 * Given elements with flat weights, or custom weights, this RandomGenerator returns one of them
 * with a probability proportional to the weight of the element when generate is called.
 * 
 * The elements can be random generators as well.
 */
export default class TableGenerator extends RandomGenerator {

    private entries: TableEntry[] = []

    constructor(entries: (TableEntry|RandomGenerator|string)[]) {
        super()

        // Convert entries to weight and generator pairs
        this.entries = entries.map((e) => {
            if (typeof e == 'string') 
                return new TableEntry(undefined, new ConstantGenerator(e))
            else if (e instanceof RandomGenerator) 
                return new TableEntry(undefined, e)
            else 
                return e
        } )
    }

    protected override doGenerate(random: Random, parameters: Map<string, string>): string {

        const defaultWeight = 1

        // Determine total weight
        const totalWeight = this.entries.reduce<number>((sum, entry) => sum + Math.max(entry.weight || defaultWeight, 0), 0)

        // Handle case of no total weight (no entries or all zero or negative weight)
        if (totalWeight <= 0) return ""

        // Select a random entry
        const randomWeightPos = random.floatRange(0, totalWeight)

        // Find and return the entry
        let weightEnd = 0
        for (let entry of this.entries) {
            weightEnd += entry.weight || defaultWeight
            if (randomWeightPos <= weightEnd)
                return entry.value.generate(random, parameters)
        }

        // If we get here there was a rounding error or the algorithm is broken.
        // We'll assume the former (as we try to test for the latter) and return the last entry
        return this.entries[this.entries.length-1]!.value.generate(random, parameters)
    }
}

export class TableEntry {
    constructor(public readonly weight: number | undefined, public readonly value: RandomGenerator) {}
}