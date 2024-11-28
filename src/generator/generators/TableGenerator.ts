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

    // @ts-ignore
    private entries: RandomGenerator[] = []

    constructor(entries: (RandomGenerator|string)[]) {
        super()
        this.entries = entries.map((s) => {
            if (typeof s == 'string') return new ConstantGenerator(s)
            else return s
        } )
    }

    protected override doGenerate(random: Random, parameters: Map<string, string>): string {

        const entryCount = this.entries.length

        // Handle case of no entries
        if (entryCount <= 0) return ""

        // Select a random entry
        const selectedEntry = random.intRange(0, entryCount-1)

        return this.entries[selectedEntry]!.generate(random, parameters);
    }
}
