/** Game Version ID enum shared between actual Version IDs and lumped version groupings. */
export enum GameVersion
{
    Any = 0,
    Unknown = Number.MAX_VALUE - 1,
    Invalid = Number.MAX_VALUE,

    // The following values are IDs stored within PKM data, and can also identify individual games.

    /** Pokémon Sapphire (GBA) */
    S = 1,

    /** Pokémon Ruby (GBA) */
    R = 2,

    /** Pokémon Emerald (GBA) */
    E = 3,

    /** Pokémon FireRed (GBA) */
    FR = 4,

    /** Pokémon LeafGreen (GBA) */
    LG = 5,

    /** Pokémon Colosseum &amp; Pokémon XD (GameCube) */
    CXD = 15,

    /** Pokémon Diamond (NDS) */
    D = 10,

    /** Pokémon Pearl (NDS) */
    P = 11,

    /** Pokémon Platinum (NDS) */
    Pt = 12,

    /** Pokémon HeartGold (NDS) */
    HG = 7,

    /** Pokémon SoulSilver (NDS) */
    SS = 8,

    /** Pokémon White (NDS) */
    W = 20,

    /** Pokémon Black (NDS) */
    B = 21,

    /** Pokémon White 2 (NDS) */
    W2 = 22,

    /** Pokémon Black 2 (NDS) */
    B2 = 23,

    /** Pokémon X (3DS) */
    X = 24,

    /** Pokémon Y (3DS) */
    Y = 25,

    /** Pokémon Alpha Sapphire (3DS) */
    AS = 26,

    /** Pokémon Omega Ruby (3DS) */
    OR = 27,

    /** Pokémon Sun (3DS) */
    SN = 30,

    /** Pokémon Moon (3DS) */
    MN = 31,

    /** Pokémon Ultra Sun (3DS) */
    US = 32,

    /** Pokémon Ultra Moon (3DS) */
    UM = 33,

    /** Pokémon GO (GO -> Let's Go/HOME transfers) */
    GO = 34,

    /** Pokémon Red (3DS Virtual Console) */
    RD = 35,

    /** Pokémon Green[JP]/Blue[INT] (3DS Virtual Console) */
    GN = 36,

    /** Pokémon Blue[JP] (3DS Virtual Console) */
    BU = 37,

    /** Pokémon Yellow (3DS Virtual Console) */
    YW = 38,

    /** Pokémon Gold (3DS Virtual Console) */
    GD = 39,

    /** Pokémon Silver (3DS Virtual Console) */
    SI = 40,

    /** Pokémon Crystal (3DS Virtual Console) */
    C = 41,

    /** Pokémon: Let's Go, Pikachu! (NX) */
    GP = 42,

    /** Pokémon: Let's Go, Eevee! (NX) */
    GE = 43,

    /** Pokémon Sword (NX) */
    SW = 44,

    /** Pokémon Shield (NX) */
    SH = 45,

    // HOME = 46,

    /** Pokémon Legends: Arceus (NX) */
    PLA = 47,

    /** Pokémon Brilliant Diamond (NX) */
    BD = 48,

    /** Pokémon Shining Pearl (NX) */
    SP = 49,

    /** Pokémon Scarlet (NX) */
    SL = 50,

    /** Pokémon Violet (NX) */
    VL = 51,

    // The following values are not actually stored values in pk data,
    // These values are assigned within PKHeX as properties for various logic branching.

    /** Pokémon Red & Blue [<see cref="SAV1"/>] identifier. */
    /** <seealso cref="RD"/> */
    /** <seealso cref="GN"/> */
    /** <seealso cref="BU"/> */
    RB,

    /** Pokémon Red/Blue/Yellow [<see cref="SAV1"/>] identifier. */
    /** <see cref="RD"/> */
    /** <see cref="GN"/> */
    /** <see cref="BU"/> */
    /** <see cref="YW"/> */
    RBY,

    /** Pokémon Gold &amp; Silver [<see cref="SAV2"/>] identifier. */
    /** <see cref="GD"/> */
    /** <see cref="SI"/> */
    GS,

    /** Pokémon Gold/Silver/Crystal [<see cref="SAV2"/>] identifier. */
    /** <see cref="GD"/> */
    /** <see cref="SI"/> */
    /** <see cref="C"/> */
    GSC,

    /** Pokémon Ruby &amp; Sapphire [<see cref="SAV3"/>] identifier. */
    /** <see cref="R"/> */
    /** <see cref="S"/> */
    RS,

    /** Pokémon Ruby/Sapphire/Emerald [<see cref="SAV3"/>] identifier. */
    /** <see cref="R"/> */
    /** <see cref="S"/> */
    /** <see cref="E"/> */
    RSE,

    /** Pokémon FireRed/LeafGreen [<see cref="SAV3"/>] identifier. */
    /** <see cref="FR"/> */
    /** <see cref="LG"/> */
    FRLG,

    /** Pokémon Box Ruby &amp; Sapphire [<see cref="SAV3RSBox"/>] identifier. */
    RSBOX,

    /** Pokémon Colosseum [<see cref="SAV3Colosseum"/>] identifier. */
    /** <see cref="CXD"/> */
    /** <remarks>Also used to mark Colosseum-only origin data as this game shares a version ID with <see cref="XD"/></remarks> */
    COLO,

    /** Pokémon XD [<see cref="SAV3XD"/>] identifier. */
    /** <see cref="CXD"/> */
    /** <remarks>Also used to mark XD-only origin data as this game shares a version ID with <see cref="COLO"/></remarks> */
    XD,

    /** Pokémon Diamond &amp; Pearl [<see cref="SAV4"/>] identifier. */
    /** <see cref="D"/> */
    /** <see cref="P"/> */
    DP,

    /** Pokémon Diamond/Pearl/Platinum version group. */
    /** <remarks>Used to lump data from the associated games as data assets are shared.</remarks> */
    /** <see cref="D"/> */
    /** <see cref="P"/> */
    /** <see cref="Pt"/> */
    DPPt,

    /** Pokémon HeartGold & SoulSilver [<see cref="SAV4"/>] identifier. */
    /** <see cref="HG"/> */
    /** <see cref="SS"/> */
    HGSS,

    /** Pokémon Battle Revolution [<see cref="SAV4BR"/>] identifier. */
    BATREV,

    /** Pokémon Black &amp; White version group. */
    /** <remarks>Used to lump data from the associated games as data assets are shared.</remarks> */
    /** <see cref="B"/> */
    /** <see cref="W"/> */
    BW,

    /** Pokémon Black 2 &amp; White 2 version group. */
    /** <remarks>Used to lump data from the associated games as data assets are shared.</remarks> */
    /** <see cref="B2"/> */
    /** <see cref="W2"/> */
    B2W2,

    /** Pokémon X &amp; Y */
    /** <remarks>Used to lump data from the associated games as data assets are shared.</remarks> */
    /** <see cref="X"/> */
    /** <see cref="Y"/> */
    XY,

    /** Pokémon Omega Ruby &amp; Alpha Sapphire Demo [<see cref="SAV6"/>] identifier. */
    /** <see cref="ORAS"/> */
    ORASDEMO,

    /** Pokémon Omega Ruby &amp; Alpha Sapphire version group. */
    /** <remarks>Used to lump data from the associated games as data assets are shared.</remarks> */
    /** <see cref="OR"/> */
    /** <see cref="AS"/> */
    ORAS,

    /** Pokémon Sun &amp; Moon */
    /** <remarks>Used to lump data from the associated games as data assets are shared.</remarks> */
    /** <see cref="SN"/> */
    /** <see cref="MN"/> */
    SM,

    /** Pokémon Ultra Sun &amp; Ultra Moon */
    /** <remarks>Used to lump data from the associated games as data assets are shared.</remarks> */
    /** <see cref="US"/> */
    /** <see cref="UM"/> */
    USUM,

    /** Pokémon Let's Go Pikachu &amp; Eevee */
    /** <remarks>Used to lump data from the associated games as data assets are shared.</remarks> */
    /** <see cref="GP"/> */
    /** <see cref="GE"/> */
    GG,

    /** Pokémon Sword &amp; Shield */
    /** <remarks>Used to lump data from the associated games as data assets are shared.</remarks> */
    /** <see cref="SW"/> */
    /** <see cref="SH"/> */
    SWSH,

    /** Pokémon Brilliant Diamond &amp; Shining Pearl */
    /** <remarks>Used to lump data from the associated games as data assets are shared.</remarks> */
    /** <see cref="BD"/> */
    /** <see cref="SP"/> */
    BDSP,

    /** Pokémon Scarlet &amp; Violet */
    /** <remarks>Used to lump data from the associated games as data assets are shared.</remarks> */
    /** <see cref="SL"/> */
    /** <see cref="VL"/> */
    SV,

    /** Generation 1 Games */
    /** <see cref="RBY"/> */
    Gen1,

    /** Generation 2 Games */
    /** <see cref="GSC"/> */
    Gen2,

    /** Generation 3 Games */
    /** <see cref="RSE"/> */
    /** <see cref="FRLG"/> */
    Gen3,

    /** Generation 4 Games */
    /** <see cref="DPPt"/> */
    /** <see cref="HGSS"/> */
    Gen4,

    /** Generation 5 Games */
    /** <see cref="BW"/> */
    /** <see cref="B2W2"/> */
    Gen5,

    /** Generation 6 Games */
    /** <see cref="XY"/> */
    /** <see cref="ORAS"/> */
    Gen6,

    /** Generation 7 Games on the Nintendo 3DS */
    /** <see cref="SM"/> */
    /** <see cref="USUM"/> */
    Gen7,

    /** Generation 7 Games on the Nintendo Switch */
    /** <see cref="GG"/> */
    /** <see cref="GO"/> */
    Gen7b,

    /** Generation 8 Games */
    /** <see cref="SWSH"/> */
    /** <see cref="BDSP"/> */
    /** <see cref="PLA"/> */
    Gen8,

    /** Generation 9 Games */
    /** <see cref="SV"/> */
    Gen9,

    /** Pocket Monsters Stadium data origin identifier */
    StadiumJ,

    /** Pokémon Stadium data origin identifier */
    Stadium,

    /** Pokémon Stadium 2 data origin identifier */
    Stadium2,
}
