/**
 * Hardware console types.
 *
 * Related to [[EntityContext]]; no need to specify side-game consoles like the N64 as they're tied to the mainline console.
 * Console revisions (like Game Boy Color) or 3DS-XL are not included, again, only care about console limitations that run the games.
 */
export enum GameConsole {
    /** Invalid console type. */
    None,
    /** Nintendo GameBoy. */
    GB,
    /** Nintendo GameBoy Advance. */
    GBA,
    /** Nintendo GameCube. */
    GC = GBA,
    /** Nintendo DS. */
    NDS,
    /** Nintendo 3DS. */
    _3DS,
    /** Nintendo Switch. */
    NX,
}
