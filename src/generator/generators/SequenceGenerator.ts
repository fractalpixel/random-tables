import { Random } from "src/random/Random";
import RandomGenerator from "./RandomGenerator";

export default class SequenceGenerator extends RandomGenerator {

    // @ts-ignore
    constructor(private elements: RandomGenerator[]) {
        super()
    }

    protected override doGenerate(random: Random, parameters: Map<string, string>): string {
        let result = ""
        for (let e of this.elements) {
            result += e.generate(random.newRandom(), parameters)
        }
        return result
    }
}