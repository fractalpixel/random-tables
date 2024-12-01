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

    /**
     * @param entries The entries for the table.  Will be converted to TableEntries if they are not.
     * @param defaultWeightDistribution the weight distribution to use for entries that don't have a custom weight specified.  Defaults to flat, with a weight of 1 for each entry.
     * @param distributionParameter a parameter for the weight distribution specified in the table code, or undefined to use default values.
     */
    constructor(
        entries: (TableEntry | RandomGenerator | string)[],
        private defaultWeightDistribution: WeightDistribution = FlatWeightDistribution,
        private distributionParameter: number | undefined = undefined
    ) {
        super()

        // Convert entries to weight and generator pairs
        this.entries = entries.map((e) => {
            if (typeof e == 'string')
                return new TableEntry(undefined, new ConstantGenerator(e))
            else if (e instanceof RandomGenerator)
                return new TableEntry(undefined, e)
            else
                return e
        })
    }

    protected override doGenerate(random: Random, parameters: Map<string, string>): string {

        // Utility function for calculating the weight of an entry
        const weightDistribution = this.defaultWeightDistribution
        const entryCount = this.entries.length
        const distributionParam = this.distributionParameter
        function calculateEntryWeight(entry: TableEntry, index: number): number {
            return Math.max(0, entry.weight || weightDistribution.weightFor(index, entryCount, distributionParam))
        }

        // Determine total weight
        const totalWeight = this.entries.reduce<number>(
            (sum, entry, index) => sum + calculateEntryWeight(entry, index),
            0
        )

        // Handle case of no total weight (no entries or all zero or negative weight)
        if (totalWeight <= 0) return ""

        // Select a random entry
        const randomWeightPos = random.floatRange(0, totalWeight)

        // Find and return the entry
        let weightEnd = 0
        let index = 0
        for (let entry of this.entries) {
            weightEnd += calculateEntryWeight(entry, index)
            if (randomWeightPos < weightEnd) {
                return entry.value.generate(random, parameters)
            }
            index++
        }

        // If we get here there was a rounding error or the algorithm is broken.
        // We'll assume the former (as we try to test for the latter) and return the last entry
        return this.entries[this.entries.length - 1]!.value.generate(random, parameters)
    }
}

export class TableEntry {
    constructor(public readonly weight: number | undefined, public readonly value: RandomGenerator) { }
}

/**
 * A probability distribution for the entries in a table that don't have custom weights.
 * The average weight should equal to 1 (that is, the sum of weights divided by number of entries should be 1).
 */
export interface WeightDistribution {
    /**
     * Calculate the weight for the specified index in the table.
     * @param entryIndex 0-based index
     * @param totalEntries entry count
     * @param distributionParameter possible parameter that can be passed to the distribution in the table code.
     * Useful e.g. for how much more probable the first alternative should be compared to the last one.
     */
    weightFor(entryIndex: number, totalEntries: number, distributionParameter: number | undefined): number
}


/**
 * A flat probability distribution, all entries have the weight 1.
 */
class FlatWeightDistributionImpl implements WeightDistribution {
    weightFor(entryIndex: number, totalEntries: number, distributionParameter: number | undefined): number {
        return 1
    }
}

export const FlatWeightDistribution = new FlatWeightDistributionImpl


/**
 * A linear weight distribution
 */
export class LinearWeightDistribution implements WeightDistribution {
    constructor(private invert: boolean = false) { }

    weightFor(entryIndex: number, totalEntries: number, distributionParameter: number | undefined): number {

        // Quick handle for one entry (or less, although we shouldn't be called in that case)
        if (totalEntries <= 1) return 1

        // Handle case of zero or negative parameter
        // Logically we should return the lastmost on dropping probabilities, 
        // or the firstmost on rising probabilities
        if (distributionParameter !== undefined && distributionParameter <= 0)
            if (this.invert) return entryIndex <= 0 ? totalEntries : 0
            else return entryIndex >= (totalEntries - 1) ? totalEntries : 0

        // Determine how much more likely the first entry should be compared to the last.
        let p = distributionParameter || totalEntries
        if (this.invert) p = 1 / p

        // Calculate sum of weights if we interpolated linearily from p to 1
        // (Sum of arithmetic series)
        const weightSum = totalEntries * (p + 1) / 2

        // Scale values so that total weight is equal to number of entries (average weight 1)
        const scalingFactor = totalEntries / weightSum

        // Linearily interpolate p*scalingFactor for first entry to 1*scalingFactor for last entry
        const t = entryIndex / (totalEntries - 1) // 0 for first, 1 for last
        return (p * (1 - t) + t) * scalingFactor
    }
}


export class GaussianWeightDistribution implements WeightDistribution {

    constructor() {}

    weightFor(entryIndex: number, totalEntries: number, distributionParameter: number | undefined): number {
        const scale = 3 // Last items will be rare, but not super-rare
        const pos = scale * entryIndex / (totalEntries-1)
        const weight = 2*normalDistribution(pos, 0, 1) // Double, as we are using only one side, and we need to get a total integral of 1.
        return weight * totalEntries // Scale total weight so that average weight is 1
    }

}

function normalDistribution(x: number, mean: number = 0, stdDev: number = 1): number {
    // https://en.wikipedia.org/wiki/Normal_distribution

    const stdDevSquared = stdDev * stdDev
    const xAdjustedByMean = x - mean

    const eExponent = -xAdjustedByMean*xAdjustedByMean / (2 * stdDevSquared)
    return Math.exp(eExponent) / Math.sqrt(2 * Math.PI * stdDevSquared)
}