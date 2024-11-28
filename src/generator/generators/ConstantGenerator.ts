import { Random } from "src/random/Random";
import RandomGenerator from "./RandomGenerator";

/**
 * Always generate the same constant string output.
 */
export default class ConstantGenerator extends RandomGenerator {

    constructor(private constant: string = "") {
        super()
    }

    protected override doGenerate(random: Random, parameters: Map<string, string>): string {
        return this.constant;
    }

}
