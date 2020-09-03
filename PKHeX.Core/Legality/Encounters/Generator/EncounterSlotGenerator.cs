﻿using System.Collections.Generic;
using System.Linq;

using static PKHeX.Core.Legal;
using static PKHeX.Core.Encounters1;
using static PKHeX.Core.Encounters2;
using static PKHeX.Core.Encounters3;
using static PKHeX.Core.Encounters4;
using static PKHeX.Core.Encounters5;
using static PKHeX.Core.Encounters6;
using static PKHeX.Core.Encounters7;
using static PKHeX.Core.Encounters7b;
using static PKHeX.Core.Encounters8;

namespace PKHeX.Core
{
    public static class EncounterSlotGenerator
    {
        public static IEnumerable<EncounterSlot> GetPossible(PKM pkm, IReadOnlyList<DexLevel> chain, GameVersion gameSource = GameVersion.Any)
        {
            var possibleAreas = GetEncounterSlots(pkm, gameSource);
            return possibleAreas.SelectMany(area => area.Slots).Where(z => chain.Any(v => v.Species == z.Species));
        }

        private static IEnumerable<EncounterSlot> GetRawEncounterSlots(PKM pkm, IReadOnlyList<EvoCriteria> chain, GameVersion gameSource)
        {
            if (pkm.Egg_Location != 0 || pkm.IsEgg)
                yield break;

            var possibleAreas = GetEncounterAreas(pkm, gameSource);
            foreach (var area in possibleAreas)
            {
                var slots = area.GetMatchingSlots(pkm, chain);
                foreach (var s in slots)
                    yield return s;
            }
        }

        public static IEnumerable<EncounterSlot> GetValidWildEncounters34(PKM pkm, IReadOnlyList<EvoCriteria> chain, GameVersion gameSource = GameVersion.Any)
        {
            if (gameSource == GameVersion.Any)
                gameSource = (GameVersion)pkm.Version;

            var slots = GetRawEncounterSlots(pkm, chain, gameSource);

            return slots; // defer deferrals to the method consuming this collection
        }

        public static IEnumerable<EncounterSlot> GetValidWildEncounters12(PKM pkm, IReadOnlyList<EvoCriteria> chain, GameVersion gameSource = GameVersion.Any)
        {
            if (gameSource == GameVersion.Any)
                gameSource = (GameVersion)pkm.Version;

            return GetRawEncounterSlots(pkm, chain, gameSource);
        }

        public static IEnumerable<EncounterSlot> GetValidWildEncounters(PKM pkm, IReadOnlyList<EvoCriteria> chain, GameVersion gameSource = GameVersion.Any)
        {
            if (gameSource == GameVersion.Any)
                gameSource = (GameVersion)pkm.Version;

            var s = GetRawEncounterSlots(pkm, chain, gameSource);

            bool IsHidden = pkm.AbilityNumber == 4; // hidden Ability
            int species = pkm.Species;

            return s.DeferByBoolean(slot => slot.IsDeferred(species, pkm, IsHidden)); // non-deferred first
        }

        public static bool IsDeferred3(this EncounterSlot slot, int currentSpecies, PKM pkm, bool IsSafariBall)
        {
            return slot.IsDeferredWurmple(currentSpecies, pkm)
                || slot.IsDeferredSafari3(IsSafariBall);
        }

        public static bool IsDeferred4(this EncounterSlot slot, int currentSpecies, PKM pkm, bool IsSafariBall, bool IsSportBall)
        {
            return slot.IsDeferredWurmple(currentSpecies, pkm)
                || slot.IsDeferredSafari4(IsSafariBall)
                || slot.IsDeferredSport(IsSportBall);
        }

        private static bool IsDeferred(this EncounterSlot slot, int currentSpecies, PKM pkm, bool IsHidden)
        {
            return slot.IsDeferredWurmple(currentSpecies, pkm)
                || slot.IsDeferredHiddenAbility(IsHidden);
        }

        private static bool IsDeferredWurmple(this IEncounterable slot, int currentSpecies, PKM pkm) => slot.Species == (int)Species.Wurmple && currentSpecies != (int)Species.Wurmple && !WurmpleUtil.IsWurmpleEvoValid(pkm);
        private static bool IsDeferredSafari3(this ILocation slot, bool IsSafariBall) => IsSafariBall != Locations.IsSafariZoneLocation3(slot.Location);
        private static bool IsDeferredSafari4(this ILocation slot, bool IsSafariBall) => IsSafariBall != Locations.IsSafariZoneLocation4(slot.Location);
        private static bool IsDeferredSport(this ILocation slot, bool IsSportBall) => IsSportBall != (slot.Location == Locations.BugCatchingContest4);
        private static bool IsDeferredHiddenAbility(this EncounterSlot slot, bool IsHidden) => IsHidden && !slot.IsHiddenAbilitySlot();

        public static IEnumerable<EncounterArea> GetEncounterSlots(PKM pkm, GameVersion gameSource = GameVersion.Any)
        {
            if (gameSource == GameVersion.Any)
                gameSource = (GameVersion)pkm.Version;

            return GetEncounterTable(pkm, gameSource);
        }

        private static IEnumerable<EncounterArea> GetEncounterAreas(PKM pkm, GameVersion gameSource = GameVersion.Any)
        {
            if (gameSource == GameVersion.Any)
                gameSource = (GameVersion)pkm.Version;

            var slots = GetEncounterSlots(pkm, gameSource: gameSource);
            bool noMet = !pkm.HasOriginalMetLocation || (pkm.Format == 2 && gameSource != GameVersion.C);
            if (noMet)
                return slots;
            var metLocation = pkm.Met_Location;
            return slots.Where(z => z.IsMatchLocation(metLocation));
        }

        private static bool IsHiddenAbilitySlot(this EncounterSlot slot)
        {
            return (slot is EncounterSlot6AO ao && ao.CanDexNav) || slot.Area.Type == SlotType.FriendSafari || slot.Area.Type == SlotType.Horde || slot.Area.Type == SlotType.SOS;
        }

        internal static EncounterSlot? GetCaptureLocation(PKM pkm)
        {
            var chain = EvolutionChain.GetValidPreEvolutions(pkm, maxLevel: 100, skipChecks: true);
            return GetPossible(pkm, chain).OrderBy(z => z.LevelMin).FirstOrDefault();
        }

        private static IEnumerable<EncounterArea> GetEncounterTable(PKM pkm, GameVersion gameSource = GameVersion.Any)
        {
            if (gameSource == GameVersion.Any)
                gameSource = (GameVersion)pkm.Version;

            switch (gameSource)
            {
                case GameVersion.RBY:
                case GameVersion.RD:
                case GameVersion.BU:
                case GameVersion.GN:
                case GameVersion.YW:
                    return SlotsRBY;

                case GameVersion.GSC:
                case GameVersion.GD:
                case GameVersion.SV:
                case GameVersion.C:
                    return GetEncounterTableGSC(pkm);

                case GameVersion.R: return SlotsR;
                case GameVersion.S: return SlotsS;
                case GameVersion.E: return SlotsE;
                case GameVersion.FR: return SlotsFR;
                case GameVersion.LG: return SlotsLG;
                case GameVersion.CXD: return SlotsXD;

                case GameVersion.D: return SlotsD;
                case GameVersion.P: return SlotsP;
                case GameVersion.Pt: return SlotsPt;
                case GameVersion.HG: return SlotsHG;
                case GameVersion.SS: return SlotsSS;

                case GameVersion.B: return SlotsB;
                case GameVersion.W: return SlotsW;
                case GameVersion.B2: return SlotsB2;
                case GameVersion.W2: return SlotsW2;

                case GameVersion.X: return SlotsX;
                case GameVersion.Y: return SlotsY;
                case GameVersion.AS: return SlotsA;
                case GameVersion.OR: return SlotsO;

                case GameVersion.SN: return SlotsSN;
                case GameVersion.MN: return SlotsMN;
                case GameVersion.US: return SlotsUS;
                case GameVersion.UM: return SlotsUM;

                case GameVersion.GP: return SlotsGP;
                case GameVersion.GE: return SlotsGE;
                case GameVersion.GO: return SlotsGO_GG;

                case GameVersion.SW: return SlotsSW;
                case GameVersion.SH: return SlotsSH;

                default: return Enumerable.Empty<EncounterArea>();
            }
        }

        private static IEnumerable<EncounterArea> GetEncounterTableGSC(PKM pkm)
        {
            if (!ParseSettings.AllowGen2Crystal(pkm))
                return SlotsGS;

            // Gen 2 met location is lost outside gen 2 games
            if (pkm.Format != 2)
                return SlotsGSC;

            // Format 2 with met location, encounter should be from Crystal
            if (pkm.HasOriginalMetLocation)
                return SlotsC;

            // Format 2 without met location but pokemon could not be tradeback to gen 1,
            // encounter should be from gold or silver
            if (pkm.Species > 151 && !FutureEvolutionsGen1.Contains(pkm.Species))
                return SlotsGS;

            // Encounter could be any gen 2 game, it can have empty met location for have a g/s origin
            // or it can be a Crystal pokemon that lost met location after being tradeback to gen 1 games
            return SlotsGSC;
        }
    }
}
