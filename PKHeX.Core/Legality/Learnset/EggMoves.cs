using System;
using static System.Buffers.Binary.BinaryPrimitives;

namespace PKHeX.Core;

/// <summary>
/// Stores the valid Move IDs the entry can be obtained with.
/// </summary>
public abstract class EggMoves(ushort[] moves)
{
    public ReadOnlySpan<ushort> Moves => moves;
    public bool GetHasEggMove(ushort move) => Moves.Contains(move);
}

/// <summary>
/// Specialized Egg Move storage for Generation 2.
/// </summary>
public sealed class EggMoves2 : EggMoves
{
    private EggMoves2(ushort[] moves) : base(moves) { }

    /// <summary>
    /// Gets the Egg Moves from the Generation 2 encoded format.
    /// </summary>
    /// <param name="data">Encoded data</param>
    /// <param name="count">Max Species ID</param>
    public static EggMoves2[] GetArray(ReadOnlySpan<byte> data, ushort count)
    {
        var entries = new EggMoves2[count + 1];
        var empty = entries[0] = new EggMoves2([]);

        int baseOffset = ReadInt16LittleEndian(data) - (count * 2);
        for (int i = 1; i < entries.Length; i++)
        {
            int start = ReadInt16LittleEndian(data[((i - 1) * 2)..]) - baseOffset;
            var slice = data[start..];
            int moveCount = slice.IndexOf<byte>(0xFF);
            if (moveCount == 0)
            {
                entries[i] = empty;
                continue;
            }

            var moves = new ushort[moveCount];
            for (int m = 0; m < moves.Length; m++)
                moves[m] = slice[m];

            entries[i] = new EggMoves2(moves);
        }

        return entries;
    }
}

/// <summary>
/// Specialized Egg Move storage for Generation 3-6.
/// </summary>
public sealed class EggMoves6 : EggMoves
{
    private EggMoves6(ushort[] moves) : base(moves) { }

    public static EggMoves6[] GetArray(BinLinkerAccessor entries)
    {
        var result = new EggMoves6[entries.Length];
        var empty = result[0] = new EggMoves6([]);
        for (int i = 1; i < result.Length; i++)
        {
            var data = entries[i];
            int count = ReadInt16LittleEndian(data);
            if (count == 0)
            {
                result[i] = empty;
                continue;
            }

            var moves = new ushort[count];
            var span = data[2..];
            for (int j = 0; j < moves.Length; j++)
                moves[j] = ReadUInt16LittleEndian(span[(j * 2)..]);
            result[i] = new EggMoves6(moves);
        }
        return result;
    }
}

/// <summary>
/// Specialized Egg Move storage for Generation 7+.
/// </summary>
public sealed class EggMoves7 : EggMoves
{
    /// <summary>
    /// Points to the index where form data is, within the parent Egg Move object array.
    /// </summary>
    public readonly ushort FormTableIndex;

    private EggMoves7(ushort[] moves, ushort formIndex = 0) : base(moves) => FormTableIndex = formIndex;

    public static EggMoves7[] GetArray(BinLinkerAccessor entries)
    {
        var result = new EggMoves7[entries.Length];
        var empty = result[0] = new EggMoves7([]);
        for (int i = 1; i < result.Length; i++)
        {
            var data = entries[i];
            int count = ReadInt16LittleEndian(data[2..]);
            var formIndex = ReadUInt16LittleEndian(data);
            if (count == 0)
            {
                // Might need to keep track of the Form Index for unavailable forms pointing to valid forms.
                if (formIndex != 0)
                    result[i] = new EggMoves7([], formIndex);
                else
                    result[i] = empty;
                continue;
            }

            var moves = new ushort[count];
            var span = data[4..];
            for (int j = 0; j < moves.Length; j++)
                moves[j] = ReadUInt16LittleEndian(span[(j * 2)..]);
            result[i] = new EggMoves7(moves, formIndex);
        }
        return result;
    }
}

internal static class EggMovesExtensions
{
    public static ReadOnlySpan<ushort> GetFormEggMoves(this EggMoves7[] table, ushort species, byte form)
    {
        if (species >= table.Length)
            return [];

        var entry = table[species];
        if (form == 0 || species >= entry.FormTableIndex)
            return entry.Moves;

        // Sanity check form in the event it is out of range.
        var baseIndex = entry.FormTableIndex;
        var index = baseIndex + form - 1;
        if ((uint)index >= table.Length)
            return [];
        entry = table[index];
        if (entry.FormTableIndex != baseIndex)
            return [];

        return entry.Moves;
    }
}

/// <summary>
/// Raw Egg Move storage
/// </summary>
public static class EggMoves9
{
    public static ushort[][] GetArray(BinLinkerAccessor entries)
    {
        var result = new ushort[entries.Length][];
        var empty = result[0] = [];
        for (int i = 1; i < result.Length; i++)
        {
            var data = entries[i];
            if (data.Length == 0)
            {
                result[i] = empty;
                continue;
            }
            var moves = new ushort[data.Length >> 1];
            for (int j = 0; j < data.Length; j+=2)
                moves[j >> 1] = ReadUInt16LittleEndian(data[j..]);
            result[i] = moves;
        }
        return result;
    }
}
