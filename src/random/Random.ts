/**
 * Wrapper for random number generator
 */
export interface Random {

    /**
     * Return a normal distributed floating point value with the 
     * specified standard deviation and mean value.
     */
    nextGaussian(stdDev: number, mean: number): number

    /**
     * Return a normal distributed floating point value with the 
     * specified standard deviation and mean 0.
     */
    nextGaussian(stdDev: number): number

    /**
     * Return a normal distributed floating point value with the 
     * standard deviation 1 and mean 0.
     */
    nextGaussian(): number
}