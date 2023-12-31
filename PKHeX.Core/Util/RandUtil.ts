/**
 * Approximation of the .NET `Random` class.
 */
export class Random {
    private readonly MAX_VALUE: number = 2147483647;

    Next(): number;
    Next(maxValue: number): number;
    Next(minValue: number, maxValue: number): number;
    Next(minValue?: number, maxValue?: number): number {
        if (minValue === undefined) {
            return Math.floor(Math.random() * this.MAX_VALUE);
        } else if (maxValue === undefined) {
            return Math.floor(Math.random() * minValue);
        } else {
            return Math.floor(Math.random() * (maxValue - minValue) + minValue);
        }
    }

    Shuffle<T = number>(array: T[]): T[] {
        let currentIndex = array.length;
        let randomIndex = 0;

        while (currentIndex != 0) {
            randomIndex = this.Next(currentIndex);
            currentIndex--;

            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }

        return array;
    }
}

/**
 * RNG utils.
 *
 * Probably hopelessly overcomplicated.
 */
export class RandUtil {
    static Rand = new Random();

    static Rand32(rnd?: Random) {
        const random = rnd || RandUtil.Rand;
        const l = random.Next(1 << 30) << 2;
        const r = random.Next(1 << 2);
        return l | r;
    }

    static Rand64() {
        const l = BigInt(RandUtil.Rand32());
        const r = BigInt(RandUtil.Rand32());
        return l | (r << 32n);
    }

    static Rand64_alt() {
        const high = BigInt(RandUtil.Rand32());
        const low = BigInt(RandUtil.Rand32());
        return (high << 32n) + low;
    }
}
