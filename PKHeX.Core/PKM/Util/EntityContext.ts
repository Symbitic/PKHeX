import { GameVersion } from "../../Game/Enums/GameVersion.js";
import { GameConsole } from "./GameConsole.js";

/**
 * "Context" is an existence island; data format restricts the types of changes that can be made (such as evolving).
 *
 * Starting in the 8th generation games, entities can move between games with wildly different evolution rules.
 * Previous implementations of a "Format Generation" were unable to differentiate if a class object was present in one of these different-rule contexts.
 * The "Format Generation" is still a useful generalization to check if certain fields are present in the entity data, or if certain mutations are possible.
 */
export enum EntityContext {
    None = 0,
    Gen1 = 1,
    Gen2 = 2,
    Gen3 = 3,
    Gen4 = 4,
    Gen5 = 5,
    Gen6 = 6,
    Gen7 = 7,
    Gen8 = 8,
    Gen9 = 9,
    /** Internal separator to pivot between adjacent contexts. */
    SplitInvalid,
    /** Let's Go, Pikachu! &amp; Let's Go, Eevee! */
    Gen7b,
    /** Legends: Arceus */
    Gen8a,
    /** Brilliant Diamond & Shining Pearl */
    Gen8b,
    /** Internal separator to bounds check count. */
    MaxInvalid,
}

export class EntityContextExtensions {
    /** Get the generation number of the context. */
    static Generation(value: EntityContext): number {
        if (value < EntityContext.SplitInvalid) {
            return value;
        }
        switch (value) {
            case EntityContext.Gen7b:
                return 7;
            case EntityContext.Gen8a:
                return 8;
            case EntityContext.Gen8b:
                return 8;
            default:
                throw new RangeError(`Invalid context value: ${value}`);
        }
    }

    /** Checks if the context is a defined value assigned to a valid context. */
    static IsValid(value: EntityContext): boolean {
        return value > EntityContext.None && value < EntityContext.SplitInvalid;
    }

    /**
     * Get a pre-defined single game version associated with the context.
     *
     * @remarks Game ID choice here is the developer's choice; if multiple game sets exist for a context, one from the most recent was chosen.
     */
    static GetSingleGameVersion(value: EntityContext): GameVersion {
        switch (value) {
            case EntityContext.Gen1:
                return GameVersion.RD;
            case EntityContext.Gen2:
                return GameVersion.C;
            case EntityContext.Gen3:
                return GameVersion.E;
            case EntityContext.Gen4:
                return GameVersion.SS;
            case EntityContext.Gen5:
                return GameVersion.W2;
            case EntityContext.Gen6:
                return GameVersion.AS;
            case EntityContext.Gen7:
                return GameVersion.UM;
            case EntityContext.Gen8:
                return GameVersion.SH;
            case EntityContext.Gen9:
                return GameVersion.VL;
            case EntityContext.Gen7b:
                return GameVersion.GP;
            case EntityContext.Gen8a:
                return GameVersion.PLA;
            case EntityContext.Gen8b:
                return GameVersion.BD;
        }
        throw new RangeError(`${value} is not a valid game version`);
    }

    /** Get the game console associated with the context. */
    static GetConsole(value: EntityContext): GameConsole {
        switch (value) {
            case EntityContext.Gen1:
            case EntityContext.Gen2:
                return GameConsole.GB;
            case EntityContext.Gen3:
                return GameConsole.GBA;
            case EntityContext.Gen4:
            case EntityContext.Gen5:
                return GameConsole.NDS;
            case EntityContext.Gen6:
            case EntityContext.Gen7:
                return GameConsole._3DS;
            case EntityContext.Gen7b:
            case EntityContext.Gen8:
            case EntityContext.Gen8a:
            case EntityContext.Gen8b:
            case EntityContext.Gen9:
                return GameConsole.NX;
        }
        throw new RangeError(`${value} is not a valid console`);
    }

    /** Gets all [[GameVersion]] values that fall within the context. */
    static GetVersionsWithin(value: EntityContext, source: GameVersion[]): GameVersion[] {
        /*
        version switch

        GameVersion.GP or GameVersion.GE or GameVersion.GO => Gen7b,
        GameVersion.PLA => Gen8a,
        GameVersion.BD or GameVersion.SP => Gen8b,
        _ => (EntityContext)version.GetGeneration(),
        */
    }
}
