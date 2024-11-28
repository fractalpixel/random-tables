import { Random } from "src/random/Random";
import SeedRandomImpl from "src/random/SeedRandomImpl";

const EMPTY_PARAMS: Map<string, string> = new Map()

/**
 * Base class for random generators.
 * Inheritors should implement doGenerate().
 */
export default abstract class RandomGenerator {

    /**
     * Given an optional random seed or random number generator, and optional named parameters used by the generator,
     * generate a string formed output from the random generator.
     */
    generate(random: Random | number | undefined = undefined, parameters: Map<string, string> = EMPTY_PARAMS): string {
        // Ensure we have a random number generator
        const rng: Random = typeof random === 'number' ? new SeedRandomImpl(random) : 
                    (random === undefined ? new SeedRandomImpl() : random)

        // Call implementation
        return this.doGenerate(rng, parameters)
    }

    protected abstract doGenerate(random: Random, parameters: Map<string, string>): string;

}
