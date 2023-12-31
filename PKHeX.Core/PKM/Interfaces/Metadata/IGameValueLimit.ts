/**
 * Metadata indicating the maximums (and minimums) a type of value can be.
 */
export interface IGameValueLimit {
    /** Maximum species ID value that can exist. */
    readonly MaxSpeciesID: number;
    /** Maximum move ID value that can exist. */
    readonly MaxMoveID: number;
    /** Maximum item ID value that can exist. */
    readonly MaxItemID: number;
    /** Maximum ability ID value that can exist. */
    readonly MaxAbilityID: number;
    /** Maximum ball ID value that can exist. */
    readonly MaxBallID: number;
    /** Maximum Version ID value that can exist. */
    readonly MaxGameID: number;
    /** Minimum Version ID value that can exist. */
    readonly MinGameID: number;
    /** Maximum IV value that is possible. */
    readonly MaxIV: number;
    /** Minimum IV value that is possible. */
    readonly MaxEV: number;
    /** Maximum length of a string field for a Trainer Name. */
    readonly MaxStringLengthOT: number;
    /** Maximum length of a string field for a Pokémon Nickname. */
    readonly MaxStringLengthNickname: number;
}
