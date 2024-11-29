import PRNG from "random-seedable/@types/PRNG";
import { Random } from "./Random";
import * as rng from "random-seedable";

export default class SeedRandomImpl extends Random {
    private rng: PRNG

    constructor(seed: number | undefined = undefined) {
        super()
        const s0 = seed || Date.now()
        // TODO: We should run s0 through a hash function, but in lack of better fudge around with it:
        this.rng = new rng.XORShift64(s0 * 137 + 231 + s0)
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