import RandomGenerator from "./RandomGenerator";

export default class SequenceGenerator implements RandomGenerator {

    // @ts-ignore
    constructor(private elements: RandomGenerator[]) {}

    generate(seed: string | null, parameters: Map<string, string>): string {
        return ""
    }
}