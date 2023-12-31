import { Random, RandUtil } from "../../Util/RandUtil.js";

/**
 * Logic for working with Effort Values
 */
export class EffortValues {
    /**
     * Maximum value for a single stat in Generation 1/2 formats.
     */
    public static readonly Max12: number = 65535;

    /**
     * Maximum value for a single stat in Generation 6+ formats.
     */
    public static readonly Max252: number = 252;

    /**
     * Maximum value for a single stat in Generation 3-5 formats.
     */
    public static readonly Max255: number = 255;

    /**
     * Maximum value for the sum of all stats in Generation 3+ formats.
     */
    public static readonly Max510: number = 510;

    /**
     * Since EVs are effective in multiples of 4, the leftover EVs (2) have no impact regardless of stat gained.
     */
    public static readonly MaxEffective: number = 508;

    /**
     * The leftover EVs if two stats are Max252.
     */
    public static readonly LeftoverDual252: number = 6;

    /**
     * Gets randomized EVs for a given generation format
     * @param evs Array to store the resulting EVs
     * @param generation Generation specific formatting option
     */
    public static setRandom(evs: number[], generation: number): void {
        const maxTotal: number = EffortValues.Max510;
        const maxStat: number = EffortValues.Max252;
        const maxStatPlusBias: number = 300; // weight more towards the high end of received EVs
        const rnd: Random = RandUtil.Rand;

        if (generation > 2) {
            EffortValues.setRandom252(
                evs,
                rnd,
                maxTotal,
                maxStat,
                maxStatPlusBias
            );
        } else {
            EffortValues.setRandom12(evs, rnd);
        }
    }

    private static setRandom252(
        evs: number[],
        rnd: Random,
        maxTotal: number,
        maxStat: number,
        maxStatPlusBias: number
    ): void {
        // Set random EVs (max 252 per stat) until we run out of EVs.
        // The last stat index receives the remaining EVs
        while (true) {
            let remain: number = maxTotal;
            for (let i = 0; i < evs.length - 1; i++) {
                const max: number = Math.min(maxStatPlusBias, remain);
                let amount: number = rnd.Next(0, max + 1);
                if (amount > maxStat) {
                    amount = maxStat;
                }
                remain -= evs[i] = amount;
            }
            if (remain > maxStat) {
                continue; // try again! must have had really low rand rolls.
            }

            evs[5] = remain;
            break; // done!
        }

        rnd.Shuffle(evs);
    }

    private static setRandom12(evs: number[], rnd: Random): void {
        // In generation 1/2, EVs can be 0-65535.
        for (let i = 0; i < evs.length; i++) {
            evs[i] = rnd.Next(EffortValues.Max12 + 1);
        }
    }

    /**
     * Sets the Effort Values to a reasonable max value.
     * @param evs Array to store the resulting EVs
     * @param entity Entity that will eventually receive the EVs
     */
    public static setMax(evs: number[], entity: PKM): void {
        if (entity.Format < 3) {
            EffortValues.setMax12(evs);
        } else {
            EffortValues.setMax252(evs, entity);
        }
    }

    private static setMax252(evs: number[], entity: PKM): void {
        // Get the 3 highest base stat indexes from the entity PersonalInfo
        const pi: PersonalInfo = entity.PersonalInfo;
        const tuples: { Index: number; Stat: number }[] =
            pi.GetSortedStatIndexes();

        evs[tuples[0].Index] = EffortValues.Max252;
        evs[tuples[1].Index] = EffortValues.Max252;
        evs[tuples[2].Index] = EffortValues.LeftoverDual252;
    }

    private static setMax12(evs: number[]): void {
        for (let i = 0; i < evs.length; i++) {
            evs[i] = EffortValues.Max12;
        }
    }

    /**
     * Sets all the EVs to zero.
     * @param evs Array to store the resulting EVs
     */
    public static clear(evs: number[]): void {
        evs.fill(0);
    }

    /**
     * Assessment of the total EVs, compared to the maximum allowed.
     * @param sum The sum of all EVs
     * @returns The grade of the total EVs
     */
    public static getGrade(sum: number): EffortValueGrade {
        if (sum === 0) {
            return EffortValueGrade.None;
        } else if (sum <= 128) {
            return EffortValueGrade.Quarter;
        } else if (sum <= 256) {
            return EffortValueGrade.Half;
        } else if (sum < EffortValues.MaxEffective) {
            return EffortValueGrade.NearFull;
        } else if (sum === EffortValues.MaxEffective) {
            return EffortValueGrade.MaxEffective;
        } else if (sum === EffortValues.Max510 - 1) {
            return EffortValueGrade.MaxNearCap;
        } else if (sum === EffortValues.Max510) {
            return EffortValueGrade.MaxLegal;
        } else {
            return EffortValueGrade.Illegal;
        }
    }
}

/**
 * Assessment of the total EVs, compared to the maximum allowed.
 */
export enum EffortValueGrade {
    None, // No EVs
    Quarter, // 1-128 EVs
    Half, // 129-256 EVs
    NearFull, // 257-508 EVs
    MaxEffective, // 508 EVs
    MaxNearCap, // 509 EVs
    MaxLegal, // 510 EVs
    Illegal, // 511+ EVs
}
