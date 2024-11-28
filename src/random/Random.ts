/**
 * Wrapper for random number generator
 */
export abstract class Random {

    /**
     * Returns a new random floating point number between 0 (inclusive) and 1 (exclusive)
     */
    abstract float0to1(): number

    /**
     * Returns a new random floating point number between 0 and less than the specified upperLimit (defaults to 1)
     */
    float(upperLimit: number = 1): number {
        return this.float0to1() * upperLimit
    }

    /**
     * Returns a new random floating point number between min (inclusive) and the specified upperLimit (exclusive)
     */
    floatRange(min: number, maxExclusive: number): number {
        const range = maxExclusive - min
        return min + this.float(range)
    }

    /**
     * Returns a new random integer between zero and max (both inclusive).
     */
    int(max: number): number {
        return this.intRange(0, max)
    }

    /**
     * Returns a new random integer value in the specified range 
     * (both inclusive).
     */
    abstract intRange(min: number, max: number): number


    /**
     * Return a normal distributed floating point value with the 
     * specified standard deviation (defaults to 1) and mean value (defaults to 0).
     */
    gaussian(stdDev: number = 1, mean: number = 0): number {
        // We use the Box-Muller algorithm https://www.taygeta.com/random/gaussian.html
        const x1 = this.float0to1();
        const x2 = this.float0to1();
        const TAU = 2.0 * Math.PI;
        const y1 = Math.sqrt( -2.0 * Math.log(x1) ) * Math.cos( TAU * x2 );

        // Just calculate one value instead of two as is possible with Box-Muller.

        return stdDev * y1 + mean
    }


    /**
     * Generate a new random number generator seeded with a new random number.
     */
    abstract newRandom(): Random
}