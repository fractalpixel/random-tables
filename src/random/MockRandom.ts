import { Random } from "./Random";

/**
 * Ranomd with fixed return value, for testing.
 */
export default class MockRandom implements Random {

    // https://i.sstatic.net/Y3zE3.gif
    constructor(public randomValue = 9) {}

    nextGaussian(stdDev: number = 1, mean: number = 0): number {
        return this.randomValue * stdDev + mean
    }
}