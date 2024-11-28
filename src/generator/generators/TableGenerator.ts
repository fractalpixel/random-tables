import ConstantGenerator from "./ConstantGenerator";
import RandomGenerator from "./RandomGenerator";

/**
 * Given elements with flat weights, or custom weights, this RandomGenerator returns one of them
 * with a probability proportional to the weight of the element when generate is called.
 * 
 * The elements can be random generators as well.
 */
export default class TableGenerator implements RandomGenerator {

    // @ts-ignore
    private entries: RandomGenerator[] = []

    constructor(entries: (RandomGenerator|string)[]) {
        this.entries = entries.map((s) => {
            if (typeof s == 'string') return new ConstantGenerator(s)
            else return s
        } )
    }

    generate(seed: string | null = null, parameters: Map<string, string> = new Map()): string {
        return "";
    }
}
