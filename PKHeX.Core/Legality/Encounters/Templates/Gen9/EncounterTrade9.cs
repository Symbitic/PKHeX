using System;

namespace PKHeX.Core;

/// <summary>
/// Generation 9 Trade Encounter
/// </summary>
public sealed record EncounterTrade9
    : IEncounterable, IEncounterMatch, IFixedTrainer, IFixedNickname, IEncounterConvertible<PK9>, IGemType, IFixedGender, IFixedNature, IRibbonPartner, IMoveset
{
    public int Generation => 9;
    public EntityContext Context => EntityContext.Gen9;
    public int Location => Locations.LinkTrade6NPC;
    public Shiny Shiny { get; init; } = Shiny.Never;
    public bool EggEncounter => false;
    public Ball FixedBall { get; init; }
    public bool IsShiny => false;
    public int EggLocation => 0;
    public bool IsFixedTrainer => true;
    public bool IsFixedNickname => Nicknames.Length > 0;
    public GameVersion Version { get; }

    private string[] TrainerNames { get; }
    private string[] Nicknames { get; }

    public required Nature Nature { get; init; }
    public required uint ID32 { get; init; }
    public required AbilityPermission Ability { get; init; }
    public byte Gender { get; init; }
    public required byte OTGender { get; init; }
    public required IndividualValueSet IVs { get; init; }
    public ushort Species { get; }
    public byte Level { get; }
    public Moveset Moves { get; init; }
    public bool EvolveOnTrade { get; init; }
    public SizeType9 Weight { get; init; }
    public SizeType9 Scale { get; init; }
    private const byte FixedValueScale = 128;

    public byte Form { get; init; }

    private const string _name = "In-game Trade";
    public string Name => _name;
    public string LongName => _name;
    public byte LevelMin => Level;
    public byte LevelMax => Level;

    public required GemType TeraType { get; init; }
    public bool RibbonPartner { get; }

    public EncounterTrade9(ReadOnlySpan<string[]> names, byte index, GameVersion game, ushort species, byte level)
    {
        Version = game;
        bool partner = RibbonPartner = index is (>= 2 and <= 31);
        Nicknames = partner ? [] : EncounterUtil.GetNamesForLanguage(names, index);
        TrainerNames = EncounterUtil.GetNamesForLanguage(names, (uint)(index + (names[1].Length >> 1)));
        Species = species;
        Level = level;
    }

    #region Generating

    PKM IEncounterConvertible.ConvertToPKM(ITrainerInfo tr) => ConvertToPKM(tr);
    PKM IEncounterConvertible.ConvertToPKM(ITrainerInfo tr, EncounterCriteria criteria) => ConvertToPKM(tr, criteria);

    public PK9 ConvertToPKM(ITrainerInfo tr) => ConvertToPKM(tr, EncounterCriteria.Unrestricted);

    public PK9 ConvertToPKM(ITrainerInfo tr, EncounterCriteria criteria)
    {
        var version = this.GetCompatibleVersion((GameVersion)tr.Game);
        int lang = (int)Language.GetSafeLanguage(Generation, (LanguageID)tr.Language, version);
        var pi = PersonalTable.SV[Species, Form];
        var rnd = new Xoroshiro128Plus(Util.Rand.Rand64());
        var pk = new PK9
        {
            Species = Species,
            Form = Form,
            CurrentLevel = Level,
            Met_Location = Location,
            Met_Level = Level,
            MetDate = EncounterDate.GetDateSwitch(),
            Gender = Gender,
            Nature = (byte)Nature,
            StatNature = (byte)Nature,
            Ball = (byte)FixedBall,

            ID32 = ID32,
            Version = (byte)version,
            Language = lang,
            OT_Gender = OTGender,
            OT_Name = TrainerNames[lang],

            OT_Friendship = pi.BaseFriendship,

            IsNicknamed = IsFixedNickname,
            Nickname = IsFixedNickname ? Nicknames[lang] : SpeciesName.GetSpeciesNameGeneration(Species, lang, Generation),

            HeightScalar = PokeSizeUtil.GetRandomScalar(),
            WeightScalar = Weight.GetSizeValue(Weight != SizeType9.RANDOM ? FixedValueScale : default, ref rnd),
            Scale = Scale.GetSizeValue(Scale != SizeType9.RANDOM ? FixedValueScale : default, ref rnd),
            TeraTypeOriginal = GetOriginalTeraType(),

            HT_Name = tr.OT,
            HT_Language = (byte)tr.Language,
            CurrentHandler = 1,
            HT_Friendship = pi.BaseFriendship,
            Obedience_Level = Level,
        };

        EncounterUtil1.SetEncounterMoves(pk, version, Level);
        SetPINGA(pk, criteria, pi);
        if (EvolveOnTrade)
            pk.Species++;
        if (RibbonPartner)
        {
            pk.RibbonPartner = true;
            pk.AffixedRibbon = (sbyte)RibbonIndex.Partner;
        }

        pk.ResetPartyStats();

        return pk;
    }

    private void SetPINGA(PK9 pk, EncounterCriteria criteria, PersonalInfo9SV pi)
    {
        pk.PID = Util.Rand32();
        pk.EncryptionConstant = Util.Rand32();
        pk.Nature = pk.StatNature = (int)criteria.GetNature(Nature);
        pk.Gender = criteria.GetGender(Gender, pi);
        pk.RefreshAbility(criteria.GetAbilityFromNumber(Ability));
        criteria.SetRandomIVs(pk, IVs);
    }

    private MoveType GetOriginalTeraType()
    {
        if (TeraType is GemType.Default)
            return (MoveType)PersonalTable.SV.GetFormEntry(Species, Form).Type1;
        if (TeraType.IsSpecified(out var type))
            return (MoveType)type;
        return (MoveType)Util.Rand.Next(0, 18);
    }

    #endregion

    #region Matching

    public bool IsTrainerMatch(PKM pk, ReadOnlySpan<char> trainer, int language) => (uint)language < TrainerNames.Length && trainer.SequenceEqual(TrainerNames[language]);
    public bool IsNicknameMatch(PKM pk, ReadOnlySpan<char> nickname, int language) => (uint)language < Nicknames.Length && nickname.SequenceEqual(Nicknames[language]);
    public string GetNickname(int language) => (uint)language < Nicknames.Length ? Nicknames[language] : Nicknames[0];

    private bool IsMatchNatureGenderShiny(PKM pk)
    {
        if (!Shiny.IsValid(pk))
            return false;
        if (pk.Gender != Gender)
            return false;
        if (pk.Nature != (int)Nature)
            return false;
        return true;
    }

    public EncounterMatchRating GetMatchRating(PKM pk) => EncounterMatchRating.Match;

    #endregion

    public bool IsMatchExact(PKM pk, EvoCriteria evo)
    {
        if (pk.Met_Level != Level)
            return false;
        if (TeraType != GemType.Random && pk is ITeraType t && !Tera9RNG.IsMatchTeraType(TeraType, Species, Form, (byte)t.TeraTypeOriginal))
            return false;
        if (!IsMatchLocation(pk))
            return false;
        if (!Legal.GetIsFixedIVSequenceValidNoRand(IVs, pk))
            return false;
        if (!IsMatchNatureGenderShiny(pk))
            return false;
        if (pk.ID32 != ID32)
            return false;
        if (evo.Form != Form && !FormInfo.IsFormChangeable(Species, Form, pk.Form, Context, pk.Context))
            return false;
        if (pk.OT_Gender != OTGender)
            return false;
        if (!IsMatchEggLocation(pk))
            return false;
        if (EvolveOnTrade && pk.Species == Species)
            return false;
        if (pk is IScaledSize s2)
        {
            if (pk is IScaledSize3 s3 && !VerifyScalar(Scale, s3.Scale))
                return false;
            if (!VerifyScalar(Weight, s2.WeightScalar))
                return false;
        }
        return true;
    }

    private static bool VerifyScalar(SizeType9 type, byte value)
    {
        if (type is SizeType9.VALUE)
            return value == FixedValueScale;
        return type.IsWithinRange(value);
    }

    private bool IsMatchEggLocation(PKM pk)
    {
        var metState = LocationsHOME.GetRemapState(Context, pk.Context);
        if (metState == LocationRemapState.Original)
            return IsMatchEggLocationExact(pk);
        if (metState == LocationRemapState.Remapped)
            return IsMatchEggLocationRemapped(pk);
        // Either
        return IsMatchEggLocationExact(pk) || IsMatchEggLocationRemapped(pk);
    }

    private static bool IsMatchEggLocationRemapped(PKM pk) => pk.Egg_Location == 0;
    private bool IsMatchEggLocationExact(PKM pk) => pk.Egg_Location == EggLocation;

    private bool IsMatchLocation(PKM pk)
    {
        var metState = LocationsHOME.GetRemapState(Context, pk.Context);
        if (metState == LocationRemapState.Original)
            return IsMatchLocationExact(pk);
        if (metState == LocationRemapState.Remapped)
            return IsMatchLocationRemapped(pk);
        return IsMatchLocationExact(pk) || IsMatchLocationRemapped(pk);
    }

    private bool IsMatchLocationExact(PKM pk) => pk.Met_Location == Location;

    private bool IsMatchLocationRemapped(PKM pk)
    {
        var met = (ushort)pk.Met_Location;
        var version = pk.Version;
        if (pk.Context == EntityContext.Gen8)
            return LocationsHOME.IsValidMetSV(met, version);
        return LocationsHOME.GetMetSWSH((ushort)Location, version) == met;
    }
}
