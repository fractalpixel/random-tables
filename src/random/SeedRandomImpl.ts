import { Random } from "./Random";
import * as rng from "random-seedable";

export default class SeedRandomImpl implements Random {
    private r = new rng.XORShift128Plus()

    constructor() {
        this.r.seed = Date.now()
    }

    nextGaussian(stdDev: number = 1.0, mean: number = 0): number {
        // We use the Box-Muller algorithm https://www.taygeta.com/random/gaussian.html
        const x1 = this.r.float();
        const x2 = this.r.float();
        const TAU = 2.0 * Math.PI;
        const y1 = Math.sqrt( -2.0 * Math.log(x1) ) * Math.cos( TAU * x2 );

        // Just calculate one value instead of two as is possible with Box-Muller.

        return stdDev * y1 + mean
    }
}