import RandomGenerator from "./RandomGenerator";

/**
 * Always generate the same constant string output.
 */
export default class ConstantGenerator implements RandomGenerator {

    constructor(private constant: string = "") { }

    generate(seed: string | null = null, parameters: Map<string, string> = new Map()): string {
        return this.constant;
    }

}
