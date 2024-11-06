
export interface RandomGenerator {
    
    generate(): string
}


export class ConstantGenerator implements RandomGenerator {
    constructor(private constant: string = "") {}

    generate(): string {
        return this.constant
    }

}

export class TableGenerator implements RandomGenerator {

    // @ts-ignore
    constructor(private entries: string[]) {}

    generate(): string {
        return ""
    }
}


export function parseGenerator(input: string): RandomGenerator {
    return new ConstantGenerator(input)
    
}