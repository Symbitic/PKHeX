/**
 * Interface that exposes a [[Generation]] to see which canonical generation the data originated in.
 */
export interface IGeneration {
    /**
     * The canonical generation the data originated in.
     */
    readonly Generation: number;
}
