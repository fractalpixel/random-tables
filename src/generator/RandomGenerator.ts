
export default interface RandomGenerator {

    /**
     * Given a seed for random number generation, and optional named parameters used by the generator,
     * generate a string formed output from the random generator.
     */
    generate(seed: string | null, parameters: Map<string, string>): string;

}
