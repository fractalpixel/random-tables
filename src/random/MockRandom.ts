import { Random } from "./Random";

/**
 * Ranomd with fixed return value, for testing.
 */
export default class MockRandom extends Random {

    // https://i.sstatic.net/Y3zE3.gif
    constructor(public randomValue = 9) {
        super()
    }

    override intRange(min: number, max: number): number {
        return this.randomValue
    }

    override float0to1(): number {
        return this.randomValue
    }

    override newRandom(): Random {
        return new MockRandom(this.randomValue)
    }
}