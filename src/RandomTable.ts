
export class RandoMTableEntry {

    private cachedWeight: number | null = null

    constructor(private weight: RandomGenerator, private content: RandomGenerator) {}
}


export class RandomTable implements RandomGenerator {

    private entries: RandoMTableEntry[] = []

    generate(seed: string | null, parameters: Map<string, string>): string {
        throw new Error("Method not implemented.")
    }
}


export default interface RandomGenerator {

    generate(seed: string | null, parameters: Map<string, string>): string

}

export const EMPTY_GENERATOR: RandomGenerator = {
    generate(seed: string | null, parameters: Map<string, string>): string {
        return ""
    }
}

