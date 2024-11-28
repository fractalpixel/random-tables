import { Random } from "./Random";
import * as rng from "random-seedable";

export default class SeedRandomImpl extends Random {
    private rng = new rng.XORShift128Plus()    

    constructor(seed: number | undefined = undefined) {
        super()
        this.rng.seed = seed || Date.now()
    }

    override intRange(min: number, max: number): number {
        return this.rng.randRange(min, max)
    }

    override float0to1(): number {
        return this.rng.float()
    }

    override newRandom(): Random {
        return new SeedRandomImpl(this.rng.int())
    }

}