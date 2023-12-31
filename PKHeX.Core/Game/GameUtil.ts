import { GameVersion } from "./Enums/GameVersion.js";

/**
 * Utility class for [[GameVersion]] logic.
 */
export class GameUtil {
    /**
     * All possible [[GameVersion]] values a [[PKM.Version]] can have.
     * @remarks Ordered roughly by most recent games first.
     */
    static readonly GameVersions: GameVersion[] = this.GetValidGameVersions();

    private static GetValidGameVersions(): GameVersion[] {
        const nums = Object.values(GameVersion).filter(
            (value) => typeof value === "number"
        ) as number[];
        return nums.filter(this.IsValidSavedVersion).reverse() as GameVersion[];
    }

    /**
     * Indicates if the [[GameVersion]] value is a value used by the games or is an aggregate indicator.
     * @param game Game to check.
     */
    static IsValidSavedVersion(game: GameVersion) {
        return game > 0 && game <= this.HighestGameID;
    }

    /** Most recent game ID utilized by official games. */
    private static HighestGameID: GameVersion = GameVersion.RB - 1;

    /**
     * Determines the Version Grouping of an input Version ID.
     * @param version Version of which to determine the group.
     * @returns Version Group Identifier or Invalid if type cannot be determined.
     */
    static GetMetLocationVersionGroup(version: GameVersion) {
        switch (version) {
            // Side games
            case GameVersion.CXD:
                return GameVersion.CXD;
            case GameVersion.GO:
                return GameVersion.GO;

            // VC Transfers
            case GameVersion.RD:
            case GameVersion.BU:
            case GameVersion.YW:
            case GameVersion.GN:
            case GameVersion.GD:
            case GameVersion.SI:
            case GameVersion.C:
                return GameVersion.USUM;

            // Gen2 -- PK2
            case GameVersion.GS:
            case GameVersion.GSC:
                return GameVersion.GSC;

            // Gen3
            case GameVersion.R:
            case GameVersion.S:
                return GameVersion.RS;
            case GameVersion.E:
                return GameVersion.E;
            case GameVersion.FR:
            case GameVersion.LG:
                return GameVersion.FR;

            // Gen4
            case GameVersion.D:
            case GameVersion.P:
                return GameVersion.DP;
            case GameVersion.Pt:
                return GameVersion.Pt;
            case GameVersion.HG:
            case GameVersion.SS:
                return GameVersion.HG;

            // Gen5
            case GameVersion.B:
            case GameVersion.W:
                return GameVersion.BW;
            case GameVersion.B2:
            case GameVersion.W2:
                return GameVersion.B2W2;

            // Gen6
            case GameVersion.X:
            case GameVersion.Y:
                return GameVersion.XY;
            case GameVersion.OR:
            case GameVersion.AS:
                return GameVersion.ORAS;

            // Gen7
            case GameVersion.SN:
            case GameVersion.MN:
                return GameVersion.SM;
            case GameVersion.US:
            case GameVersion.UM:
                return GameVersion.USUM;
            case GameVersion.GP:
            case GameVersion.GE:
                return GameVersion.GG;

            // Gen8
            case GameVersion.SW:
            case GameVersion.SH:
                return GameVersion.SWSH;
            case GameVersion.BD:
            case GameVersion.SP:
                return GameVersion.BDSP;
            case GameVersion.PLA:
                return GameVersion.PLA;

            // Gen9
            case GameVersion.SL:
            case GameVersion.VL:
                return GameVersion.SV;

            default:
                return GameVersion.Invalid;
        }
    }

    /**
     * Gets a Version ID from the end of that Generation.
     * @param generation Generation ID.
     * @returns Version ID from requested generation. If none, return [[Invalid]].
     */
    static GetVersion(generation: number): GameVersion {
        switch (generation) {
            case 1:
                return GameVersion.RBY;
            case 2:
                return GameVersion.C;
            case 3:
                return GameVersion.E;
            case 4:
                return GameVersion.SS;
            case 5:
                return GameVersion.W2;
            case 6:
                return GameVersion.AS;
            case 7:
                return GameVersion.UM;
            case 8:
                return GameVersion.SH;
            case 9:
                return GameVersion.VL;
            default:
                return GameVersion.Invalid;
        }
    }

    /**
     * Gets the Generation the [[GameVersion]] belongs to.
     * @param game Game to retrieve the generation for.
     * @returns Generation ID.
     */
    static GetGeneration(game: GameVersion): number {
        if (GameUtil.Contains(GameVersion.Gen1, game)) return 1;
        if (GameUtil.Contains(GameVersion.Gen2, game)) return 2;
        if (GameUtil.Contains(GameVersion.Gen3, game)) return 3;
        if (GameUtil.Contains(GameVersion.Gen4, game)) return 4;
        if (GameUtil.Contains(GameVersion.Gen5, game)) return 5;
        if (GameUtil.Contains(GameVersion.Gen6, game)) return 6;
        if (GameUtil.Contains(GameVersion.Gen7, game)) return 7;
        if (GameUtil.Contains(GameVersion.Gen7b, game)) return 7;
        if (GameUtil.Contains(GameVersion.Gen8, game)) return 8;
        if (GameUtil.Contains(GameVersion.Gen9, game)) return 9;
        return -1;
    }

    /**
     * Gets the Generation the [[GameVersion]] belongs to.
     * @param game Game to retrieve the generation for.
     * @returns Generation ID.
     */
    static GetMaxSpeciesID(game: GameVersion): number {
        if (GameUtil.Contains(GameVersion.Gen1, game)) return Legal.MaxSpeciesID_1;
        if (GameUtil.Contains(GameVersion.Gen2, game)) return Legal.MaxSpeciesID_2;
        if (GameUtil.Contains(GameVersion.Gen3, game)) return Legal.MaxSpeciesID_3;
        if (GameUtil.Contains(GameVersion.Gen4, game)) return Legal.MaxSpeciesID_4;
        if (GameUtil.Contains(GameVersion.Gen5, game)) return Legal.MaxSpeciesID_5;
        if (GameUtil.Contains(GameVersion.Gen6, game)) return Legal.MaxSpeciesID_6;
        if (GameUtil.Contains(GameVersion.Gen7b, game)) return Legal.MaxSpeciesID_7b;
        if (GameUtil.Contains(GameVersion.Gen7, game))
        {
            if (GameUtil.Contains(GameVersion.SM, game))
                return Legal.MaxSpeciesID_7;
            if (GameUtil.Contains(GameVersion.USUM, game))
                return Legal.MaxSpeciesID_7_USUM;
            return Legal.MaxSpeciesID_7_USUM;
        }
        if (GameVersion.PLA == game) return Legal.MaxSpeciesID_8a;
        if (GameUtil.Contains(GameVersion.BDSP, game)) return Legal.MaxSpeciesID_8b;
        if (GameUtil.Contains(GameVersion.Gen8, game)) return Legal.MaxSpeciesID_8;
        if (GameUtil.Contains(GameVersion.Gen9, game)) return Legal.MaxSpeciesID_9;
        return 0;
    }

    /**
     * Checks if the `g1` version (or subset versions) is equivalent to `g2`.
     * @param g1 Version (set).
     * @param g2 Individual version.
     */
    static Contains(g1: GameVersion, g2: GameVersion) {
        if (g1 === g2 || g1 === GameVersion.Any) {
            return true;
        }

        switch (g1) {
            case GameVersion.RB:
                return g2 === GameVersion.RD || g2 === GameVersion.BU || g2 === GameVersion.GN;
            case GameVersion.RBY:
            case GameVersion.Stadium:
                return GameUtil.Contains(GameVersion.RB, g2) || g2 === GameVersion.YW;
            case GameVersion.Gen1:
                return GameUtil.Contains(GameVersion.RBY, g2) || g2 === GameVersion.Stadium;
            case GameVersion.GS:
                return g2 === GameVersion.GD || g2 === GameVersion.SI;
            case GameVersion.GSC:
            case GameVersion.Stadium2:
                return GameUtil.Contains(GameVersion.GS, g2) || g2 === GameVersion.C;
            case GameVersion.Gen2:
                return GameUtil.Contains(GameVersion.GSC, g2) || g2 === GameVersion.Stadium2;
            case GameVersion.RS:
                return g2 === GameVersion.R || g2 === GameVersion.S;
            case GameVersion.RSE:
                return GameUtil.Contains(GameVersion.RS, g2) || g2 === GameVersion.E;
            case GameVersion.FRLG:
                return g2 === GameVersion.FR || g2 === GameVersion.LG;
            case GameVersion.COLO:
            case GameVersion.XD:
                return g2 === GameVersion.CXD;
            case GameVersion.CXD:
                return g2 === GameVersion.COLO || g2 === GameVersion.XD;
            case GameVersion.RSBOX:
                return GameUtil.Contains(GameVersion.RS, g2) || g2 === GameVersion.E || GameUtil.Contains(GameVersion.FRLG, g2);
            case GameVersion.Gen3:
                return (
                    GameUtil.Contains(GameVersion.RSE, g2) ||
                    GameUtil.Contains(GameVersion.FRLG, g2) ||
                    GameUtil.Contains(GameVersion.CXD, g2) ||
                    g2 === GameVersion.RSBOX
                );
            case GameVersion.DP:
                return g2 === GameVersion.D || g2 === GameVersion.P;
            case GameVersion.HGSS:
                return g2 === GameVersion.HG || g2 === GameVersion.SS;
            case GameVersion.DPPt:
                return GameUtil.Contains(GameVersion.DP, g2) || g2 === GameVersion.Pt;
            case GameVersion.BATREV:
                return GameUtil.Contains(GameVersion.DP, g2) || g2 === GameVersion.Pt || GameUtil.Contains(GameVersion.HGSS, g2);
            case GameVersion.Gen4:
                return GameUtil.Contains(GameVersion.DPPt, g2) || GameUtil.Contains(GameVersion.HGSS, g2) || g2 === GameVersion.BATREV;
            case GameVersion.BW:
                return g2 === GameVersion.B || g2 === GameVersion.W;
            case GameVersion.B2W2:
                return g2 === GameVersion.B2 || g2 === GameVersion.W2;
            case GameVersion.Gen5:
                return GameUtil.Contains(GameVersion.BW, g2) || GameUtil.Contains(GameVersion.B2W2, g2);
            case GameVersion.XY:
                return g2 === GameVersion.X || g2 === GameVersion.Y;
            case GameVersion.ORAS:
                return g2 === GameVersion.OR || g2 === GameVersion.AS;
            case GameVersion.Gen6:
                return GameUtil.Contains(GameVersion.XY, g2) || GameUtil.Contains(GameVersion.ORAS, g2);
            case GameVersion.SM:
                return g2 === GameVersion.SN || g2 === GameVersion.MN;
            case GameVersion.USUM:
                return g2 === GameVersion.US || g2 === GameVersion.UM;
            case GameVersion.GG:
                return g2 === GameVersion.GP || g2 === GameVersion.GE;
            case GameVersion.Gen7:
                return GameUtil.Contains(GameVersion.SM, g2) || GameUtil.Contains(GameVersion.USUM, g2);
            case GameVersion.Gen7b:
                return GameUtil.Contains(GameVersion.GG, g2) || g2 === GameVersion.GO;
            case GameVersion.SWSH:
                return g2 === GameVersion.SW || g2 === GameVersion.SH;
            case GameVersion.BDSP:
                return g2 === GameVersion.BD || g2 === GameVersion.SP;
            case GameVersion.Gen8:
                return GameUtil.Contains(GameVersion.SWSH, g2) || GameUtil.Contains(GameVersion.BDSP, g2) || g2 === GameVersion.PLA;
            case GameVersion.SV:
                return g2 === GameVersion.SL || g2 === GameVersion.VL;
            case GameVersion.Gen9:
                return GameUtil.Contains(GameVersion.SV, g2);
            default:
                return false;
        }
    }

    /**
     * List of possible [[GameVersion]] values within the provided `generation`.
     * @param generation Generation to look within.
     */
    static GetVersionsInGeneration(generation: number, pkVersion: number): GameVersion[]
    {
        if (GameUtil.Contains(GameVersion.Gen7b, pkVersion))
            return [GameVersion.GO, GameVersion.GP, GameVersion.GE];
        return GameUtil.GameVersions.filter((version) => GameUtil.GetGeneration(version) === generation);
    }

    /**
     * List of possible [[GameVersion]] values within the provided [[IGameValueLimit]] criteria.
     * @param obj Criteria for retrieving versions.
     * @param generation Generation format minimum (necessary for the CXD/Gen4 swap etc.).
     */
    static GetVersionsWithinRange(obj: IGameValueLimit, generation: number = -1): GameVersion[] {
        const max = obj.MaxGameID;

        // edge case
        if (max == Legal.MaxGameID_7b) {
            return [GameVersion.GO, GameVersion.GP, GameVersion.GE];
        }

        let versions = GameUtil.GameVersions.filter((version) => obj.MinGameID <= version && version <= max);
        if (generation < 0) {
            return versions;
        }
        if (max == Legal.MaxGameID_7 && generation == 7)
            versions = versions.filter(version => version !== GameVersion.GO);

        // HOME allows up-reach to Gen9
        if (generation >= 8)
            generation = 9;
        return versions.filter(version => GameUtil.GetGeneration(version) <= generation);
    }

    /*
    public static GameVersion[] GetVersionsWithinRange(this GameVersion lump, GameVersion[] source) =>
        Array.FindAll(source, z => lump.Contains(z));
    */
}
