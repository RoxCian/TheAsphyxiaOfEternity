import { DBBigInt, Vector, Vector2, Vector2B, Vector3, Vector3B, Vector4, Vector4B, VectorB } from "../db/db_types"
import { isTypeOrToken, Type, TypeToken } from "../types"
import { XF } from "./functions"
import { XMap, XSubMap, XTypeExtended } from "./types"

export namespace XM {
    export function map<T, TXType extends XTypeExtended, TTarget = T, TXKey extends string | undefined = undefined>(xType: TXType | "xremove", xKey?: TXKey, type?: Type<T> | TypeToken<T>, convert?: (source: T) => TTarget, convertBack?: (target: TTarget) => T, fallbackValue?: T, elType?: T extends Array<infer TE> ? Type<TE> | TypeToken<TE> : undefined, subMap?: XSubMap<T>, elSubMap?: T extends Array<infer TE> ? XSubMap<TE> : undefined): XMap<T, TXType, TTarget, TXKey> {
        if (xType === "xremove") return undefined
        else {
            return {
                $type: type,
                $xType: xType,
                $xKey: xKey,
                $convert: convert,
                $convertBack: convertBack,
                $fallbackValue: fallbackValue,
                $subMap: subMap,
                $el: elType,
                $elSubMap: elSubMap
            } as any
        }
    }

    type NumberOrArray = number | number[]
    type BigIntOrArray = bigint | DBBigInt | bigint[] | DBBigInt[] | (bigint | DBBigInt)[]
    type BooleanOrArray = boolean | boolean[]
    export function s8(): XMap<NumberOrArray, "s8">
    export function s8<TXKey extends string>(xKey: TXKey): XMap<NumberOrArray, "s8", NumberOrArray, TXKey>
    export function s8<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): XMap<NumberOrArray, "s8", TTarget, TXKey>
    export function s8<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<any>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): XMap<NumberOrArray, "s8", TTarget, TXKey> {
        return map("s8", xKey, type, convert, convertBack, fallbackValue)
    }
    export function u8(): XMap<NumberOrArray, "u8">
    export function u8<TXKey extends string>(xKey: TXKey): XMap<NumberOrArray, "u8", NumberOrArray, TXKey>
    export function u8<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): XMap<NumberOrArray, "u8", TTarget, TXKey>
    export function u8<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<any>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): XMap<NumberOrArray, "u8", TTarget, TXKey> {
        return map("u8", xKey, type, convert, convertBack, fallbackValue)
    }
    export function s16(): XMap<NumberOrArray, "s16">
    export function s16<TXKey extends string>(xKey: TXKey): XMap<NumberOrArray, "s16", NumberOrArray, TXKey>
    export function s16<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): XMap<NumberOrArray, "s16", TTarget, TXKey>
    export function s16<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<any>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): XMap<NumberOrArray, "s16", TTarget, TXKey> {
        return map("s16", xKey, type, convert, convertBack, fallbackValue)
    }
    export function u16(): XMap<NumberOrArray, "u16">
    export function u16<TXKey extends string>(xKey: TXKey): XMap<NumberOrArray, "u16", NumberOrArray, TXKey>
    export function u16<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): XMap<NumberOrArray, "u16", TTarget, TXKey>
    export function u16<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<any>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): XMap<NumberOrArray, "u16", TTarget, TXKey> {
        return map("u16", xKey, type, convert, convertBack, fallbackValue)
    }
    export function s32(): XMap<NumberOrArray, "s32">
    export function s32<TXKey extends string>(xKey: TXKey): XMap<NumberOrArray, "s32", NumberOrArray, TXKey>
    export function s32<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): XMap<NumberOrArray, "s32", TTarget, TXKey>
    export function s32<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<any>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): XMap<NumberOrArray, "s32", TTarget, TXKey> {
        return map("s32", xKey, type, convert, convertBack, fallbackValue)
    }
    export function u32(): XMap<NumberOrArray, "u32">
    export function u32<TXKey extends string>(xKey: TXKey): XMap<NumberOrArray, "u32", NumberOrArray, TXKey>
    export function u32<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): XMap<NumberOrArray, "u32", TTarget, TXKey>
    export function u32<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<any>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): XMap<NumberOrArray, "u32", TTarget, TXKey> {
        return map("u32", xKey, type, convert, convertBack, fallbackValue)
    }
    export function s64(): XMap<BigIntOrArray, "s64">
    export function s64<TXKey extends string>(xKey: TXKey): XMap<BigIntOrArray, "s64", BigIntOrArray, TXKey>
    export function s64<TTarget = BigIntOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: BigIntOrArray) => TTarget, convertBack?: (target: TTarget) => BigIntOrArray, fallbackValue?: BigIntOrArray): XMap<BigIntOrArray, "s64", TTarget, TXKey>
    export function s64<TTarget = BigIntOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<any>, convert?: (source: BigIntOrArray) => TTarget, convertBack?: (target: TTarget) => BigIntOrArray, fallbackValue?: BigIntOrArray): XMap<BigIntOrArray, "s64", TTarget, TXKey> {
        return map("s64", xKey, type, convert, convertBack, fallbackValue)
    }
    export function u64(): XMap<BigIntOrArray, "u64">
    export function u64<TXKey extends string>(xKey: TXKey): XMap<BigIntOrArray, "u64", BigIntOrArray, TXKey>
    export function u64<TTarget = BigIntOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: BigIntOrArray) => TTarget, convertBack?: (target: TTarget) => BigIntOrArray, fallbackValue?: BigIntOrArray): XMap<BigIntOrArray, "u64", TTarget, TXKey>
    export function u64<TTarget = BigIntOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<any>, convert?: (source: BigIntOrArray) => TTarget, convertBack?: (target: TTarget) => BigIntOrArray, fallbackValue?: BigIntOrArray): XMap<BigIntOrArray, "u64", TTarget, TXKey> {
        return map("u64", xKey, type, convert, convertBack, fallbackValue)
    }
    export function float(): XMap<NumberOrArray, "float">
    export function float<TXKey extends string>(xKey: TXKey): XMap<NumberOrArray, "float", NumberOrArray, TXKey>
    export function float<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): XMap<NumberOrArray, "float", TTarget, TXKey>
    export function float<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<any>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): XMap<NumberOrArray, "float", TTarget, TXKey> {
        return map("float", xKey, type, convert, convertBack, fallbackValue)
    }
    export function double(): XMap<NumberOrArray, "double">
    export function double<TXKey extends string>(xKey: TXKey): XMap<NumberOrArray, "double", NumberOrArray, TXKey>
    export function double<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): XMap<NumberOrArray, "double", TTarget, TXKey>
    export function double<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<any>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): XMap<NumberOrArray, "double", TTarget, TXKey> {
        return map("double", xKey, type, convert, convertBack, fallbackValue)
    }
    export function bool(): XMap<BooleanOrArray, "bool">
    export function bool<TXKey extends string>(xKey: TXKey): XMap<BooleanOrArray, "bool", BooleanOrArray, TXKey>
    export function bool<TTarget = BooleanOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: BooleanOrArray) => TTarget, convertBack?: (target: TTarget) => BooleanOrArray, fallbackValue?: BooleanOrArray): XMap<BooleanOrArray, "bool", TTarget, TXKey>
    export function bool<TTarget = BooleanOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<any>, convert?: (source: BooleanOrArray) => TTarget, convertBack?: (target: TTarget) => BooleanOrArray, fallbackValue?: BooleanOrArray): XMap<BooleanOrArray, "bool", TTarget, TXKey> {
        return map("bool", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v2s8(): XMap<Vector2, "2s8">
    export function v2s8<TXKey extends string>(xKey: TXKey): XMap<Vector2, "2s8", Vector2, TXKey>
    export function v2s8<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): XMap<Vector2, "2s8", TTarget, TXKey>
    export function v2s8<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<any>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): XMap<Vector2, "2s8", TTarget, TXKey> {
        return map("2s8", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v2u8(): XMap<Vector2, "2u8">
    export function v2u8<TXKey extends string>(xKey: TXKey): XMap<Vector2, "2u8", Vector2, TXKey>
    export function v2u8<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): XMap<Vector2, "2u8", TTarget, TXKey>
    export function v2u8<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<any>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): XMap<Vector2, "2u8", TTarget, TXKey> {
        return map("2u8", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v2s16(): XMap<Vector2, "2s16">
    export function v2s16<TXKey extends string>(xKey: TXKey): XMap<Vector2, "2s16", Vector2, TXKey>
    export function v2s16<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): XMap<Vector2, "2s16", TTarget, TXKey>
    export function v2s16<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<any>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): XMap<Vector2, "2s16", TTarget, TXKey> {
        return map("2s16", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v2u16(): XMap<Vector2, "2u16">
    export function v2u16<TXKey extends string>(xKey: TXKey): XMap<Vector2, "2u16", Vector2, TXKey>
    export function v2u16<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): XMap<Vector2, "2u16", TTarget, TXKey>
    export function v2u16<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<any>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): XMap<Vector2, "2u16", TTarget, TXKey> {
        return map("2u16", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v2s32(): XMap<Vector2, "2s32">
    export function v2s32<TXKey extends string>(xKey: TXKey): XMap<Vector2, "2s32", Vector2, TXKey>
    export function v2s32<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): XMap<Vector2, "2s32", TTarget, TXKey>
    export function v2s32<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<any>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): XMap<Vector2, "2s32", TTarget, TXKey> {
        return map("2s32", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v2u32(): XMap<Vector2, "2u32">
    export function v2u32<TXKey extends string>(xKey: TXKey): XMap<Vector2, "2u32", Vector2, TXKey>
    export function v2u32<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): XMap<Vector2, "2u32", TTarget, TXKey>
    export function v2u32<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<any>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): XMap<Vector2, "2u32", TTarget, TXKey> {
        return map("2u32", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v2s64(): XMap<Vector2B, "2s64">
    export function v2s64<TXKey extends string>(xKey: TXKey): XMap<Vector2B, "2s64", Vector2B, TXKey>
    export function v2s64<TTarget = Vector2B, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2B) => TTarget, convertBack?: (target: TTarget) => Vector2B, fallbackValue?: Vector2B): XMap<Vector2B, "2s64", TTarget, TXKey>
    export function v2s64<TTarget = Vector2B, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<any>, convert?: (source: Vector2B) => TTarget, convertBack?: (target: TTarget) => Vector2B, fallbackValue?: Vector2B): XMap<Vector2B, "2s64", TTarget, TXKey> {
        return map("2s64", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v2u64(): XMap<Vector2B, "2u64">
    export function v2u64<TXKey extends string>(xKey: TXKey): XMap<Vector2B, "2u64", Vector2B, TXKey>
    export function v2u64<TTarget = Vector2B, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2B) => TTarget, convertBack?: (target: TTarget) => Vector2B, fallbackValue?: Vector2B): XMap<Vector2B, "2u64", TTarget, TXKey>
    export function v2u64<TTarget = Vector2B, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<any>, convert?: (source: Vector2B) => TTarget, convertBack?: (target: TTarget) => Vector2B, fallbackValue?: Vector2B): XMap<Vector2B, "2u64", TTarget, TXKey> {
        return map("2u64", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v2f(): XMap<Vector2, "2f">
    export function v2f<TXKey extends string>(xKey: TXKey): XMap<Vector2, "2f", Vector2, TXKey>
    export function v2f<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): XMap<Vector2, "2f", TTarget, TXKey>
    export function v2f<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<any>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): XMap<Vector2, "2f", TTarget, TXKey> {
        return map("2f", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v2d(): XMap<Vector2, "2d">
    export function v2d<TXKey extends string>(xKey: TXKey): XMap<Vector2, "2d", Vector2, TXKey>
    export function v2d<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): XMap<Vector2, "2d", TTarget, TXKey>
    export function v2d<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<any>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): XMap<Vector2, "2d", TTarget, TXKey> {
        return map("2d", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v2b(): XMap<Vector2, "2b">
    export function v2b<TXKey extends string>(xKey: TXKey): XMap<Vector2, "2b", Vector2, TXKey>
    export function v2b<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): XMap<Vector2, "2b", TTarget, TXKey>
    export function v2b<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<any>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): XMap<Vector2, "2b", TTarget, TXKey> {
        return map("2b", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v3s8(): XMap<Vector3, "3s8">
    export function v3s8<TXKey extends string>(xKey: TXKey): XMap<Vector3, "3s8", Vector3, TXKey>
    export function v3s8<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): XMap<Vector3, "3s8", TTarget, TXKey>
    export function v3s8<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<any>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): XMap<Vector3, "3s8", TTarget, TXKey> {
        return map("3s8", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v3u8(): XMap<Vector3, "3u8">
    export function v3u8<TXKey extends string>(xKey: TXKey): XMap<Vector3, "3u8", Vector3, TXKey>
    export function v3u8<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): XMap<Vector3, "3u8", TTarget, TXKey>
    export function v3u8<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<any>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): XMap<Vector3, "3u8", TTarget, TXKey> {
        return map("3u8", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v3s16(): XMap<Vector3, "3s16">
    export function v3s16<TXKey extends string>(xKey: TXKey): XMap<Vector3, "3s16", Vector3, TXKey>
    export function v3s16<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): XMap<Vector3, "3s16", TTarget, TXKey>
    export function v3s16<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<any>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): XMap<Vector3, "3s16", TTarget, TXKey> {
        return map("3s16", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v3u16(): XMap<Vector3, "3u16">
    export function v3u16<TXKey extends string>(xKey: TXKey): XMap<Vector3, "3u16", Vector3, TXKey>
    export function v3u16<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): XMap<Vector3, "3u16", TTarget, TXKey>
    export function v3u16<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<any>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): XMap<Vector3, "3u16", TTarget, TXKey> {
        return map("3u16", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v3s32(): XMap<Vector3, "3s32">
    export function v3s32<TXKey extends string>(xKey: TXKey): XMap<Vector3, "3s32", Vector3, TXKey>
    export function v3s32<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): XMap<Vector3, "3s32", TTarget, TXKey>
    export function v3s32<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<any>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): XMap<Vector3, "3s32", TTarget, TXKey> {
        return map("3s32", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v3u32(): XMap<Vector3, "3u32">
    export function v3u32<TXKey extends string>(xKey: TXKey): XMap<Vector3, "3u32", Vector3, TXKey>
    export function v3u32<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): XMap<Vector3, "3u32", TTarget, TXKey>
    export function v3u32<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<any>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): XMap<Vector3, "3u32", TTarget, TXKey> {
        return map("3u32", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v3s64(): XMap<Vector3B, "3s64">
    export function v3s64<TXKey extends string>(xKey: TXKey): XMap<Vector3B, "3s64", Vector3B, TXKey>
    export function v3s64<TTarget = Vector3B, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3B) => TTarget, convertBack?: (target: TTarget) => Vector3B, fallbackValue?: Vector3B): XMap<Vector3B, "3s64", TTarget, TXKey>
    export function v3s64<TTarget = Vector3B, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<any>, convert?: (source: Vector3B) => TTarget, convertBack?: (target: TTarget) => Vector3B, fallbackValue?: Vector3B): XMap<Vector3B, "3s64", TTarget, TXKey> {
        return map("3s64", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v3u64(): XMap<Vector3B, "3u64">
    export function v3u64<TXKey extends string>(xKey: TXKey): XMap<Vector3B, "3u64", Vector3B, TXKey>
    export function v3u64<TTarget = Vector3B, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3B) => TTarget, convertBack?: (target: TTarget) => Vector3B, fallbackValue?: Vector3B): XMap<Vector3B, "3u64", TTarget, TXKey>
    export function v3u64<TTarget = Vector3B, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<any>, convert?: (source: Vector3B) => TTarget, convertBack?: (target: TTarget) => Vector3B, fallbackValue?: Vector3B): XMap<Vector3B, "3u64", TTarget, TXKey> {
        return map("3u64", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v3f(): XMap<Vector3, "3f">
    export function v3f<TXKey extends string>(xKey: TXKey): XMap<Vector3, "3f", Vector3, TXKey>
    export function v3f<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): XMap<Vector3, "3f", TTarget, TXKey>
    export function v3f<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<any>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): XMap<Vector3, "3f", TTarget, TXKey> {
        return map("3f", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v3d(): XMap<Vector3, "3d">
    export function v3d<TXKey extends string>(xKey: TXKey): XMap<Vector3, "3d", Vector3, TXKey>
    export function v3d<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): XMap<Vector3, "3d", TTarget, TXKey>
    export function v3d<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<any>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): XMap<Vector3, "3d", TTarget, TXKey> {
        return map("3d", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v3b(): XMap<Vector3, "3b">
    export function v3b<TXKey extends string>(xKey: TXKey): XMap<Vector3, "3b", Vector3, TXKey>
    export function v3b<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): XMap<Vector3, "3b", TTarget, TXKey>
    export function v3b<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<any>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): XMap<Vector3, "3b", TTarget, TXKey> {
        return map("3b", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v4s8(): XMap<Vector4, "4s8">
    export function v4s8<TXKey extends string>(xKey: TXKey): XMap<Vector4, "4s8", Vector4, TXKey>
    export function v4s8<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): XMap<Vector4, "4s8", TTarget, TXKey>
    export function v4s8<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<any>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): XMap<Vector4, "4s8", TTarget, TXKey> {
        return map("4s8", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v4u8(): XMap<Vector4, "4u8">
    export function v4u8<TXKey extends string>(xKey: TXKey): XMap<Vector4, "4u8", Vector4, TXKey>
    export function v4u8<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): XMap<Vector4, "4u8", TTarget, TXKey>
    export function v4u8<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<any>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): XMap<Vector4, "4u8", TTarget, TXKey> {
        return map("4u8", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v4s16(): XMap<Vector4, "4s16">
    export function v4s16<TXKey extends string>(xKey: TXKey): XMap<Vector4, "4s16", Vector4, TXKey>
    export function v4s16<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): XMap<Vector4, "4s16", TTarget, TXKey>
    export function v4s16<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<any>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): XMap<Vector4, "4s16", TTarget, TXKey> {
        return map("4s16", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v4u16(): XMap<Vector4, "4u16">
    export function v4u16<TXKey extends string>(xKey: TXKey): XMap<Vector4, "4u16", Vector4, TXKey>
    export function v4u16<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): XMap<Vector4, "4u16", TTarget, TXKey>
    export function v4u16<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<any>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): XMap<Vector4, "4u16", TTarget, TXKey> {
        return map("4u16", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v4s32(): XMap<Vector4, "4s32">
    export function v4s32<TXKey extends string>(xKey: TXKey): XMap<Vector4, "4s32", Vector4, TXKey>
    export function v4s32<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): XMap<Vector4, "4s32", TTarget, TXKey>
    export function v4s32<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<any>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): XMap<Vector4, "4s32", TTarget, TXKey> {
        return map("4s32", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v4u32(): XMap<Vector4, "4u32">
    export function v4u32<TXKey extends string>(xKey: TXKey): XMap<Vector4, "4u32", Vector4, TXKey>
    export function v4u32<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): XMap<Vector4, "4u32", TTarget, TXKey>
    export function v4u32<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<any>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): XMap<Vector4, "4u32", TTarget, TXKey> {
        return map("4u32", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v4s64(): XMap<Vector4B, "4s64">
    export function v4s64<TXKey extends string>(xKey: TXKey): XMap<Vector4B, "4s64", Vector4B, TXKey>
    export function v4s64<TTarget = Vector4B, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4B) => TTarget, convertBack?: (target: TTarget) => Vector4B, fallbackValue?: Vector4B): XMap<Vector4B, "4s64", TTarget, TXKey>
    export function v4s64<TTarget = Vector4B, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<any>, convert?: (source: Vector4B) => TTarget, convertBack?: (target: TTarget) => Vector4B, fallbackValue?: Vector4B): XMap<Vector4B, "4s64", TTarget, TXKey> {
        return map("4s64", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v4u64(): XMap<Vector4B, "4u64">
    export function v4u64<TXKey extends string>(xKey: TXKey): XMap<Vector4B, "4u64", Vector4B, TXKey>
    export function v4u64<TTarget = Vector4B, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4B) => TTarget, convertBack?: (target: TTarget) => Vector4B, fallbackValue?: Vector4B): XMap<Vector4B, "4u64", TTarget, TXKey>
    export function v4u64<TTarget = Vector4B, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<any>, convert?: (source: Vector4B) => TTarget, convertBack?: (target: TTarget) => Vector4B, fallbackValue?: Vector4B): XMap<Vector4B, "4u64", TTarget, TXKey> {
        return map("4u64", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v4f(): XMap<Vector4, "4f">
    export function v4f<TXKey extends string>(xKey: TXKey): XMap<Vector4, "4f", Vector4, TXKey>
    export function v4f<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): XMap<Vector4, "4f", TTarget, TXKey>
    export function v4f<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<any>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): XMap<Vector4, "4f", TTarget, TXKey> {
        return map("4f", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v4d(): XMap<Vector4, "4d">
    export function v4d<TXKey extends string>(xKey: TXKey): XMap<Vector4, "4d", Vector4, TXKey>
    export function v4d<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): XMap<Vector4, "4d", TTarget, TXKey>
    export function v4d<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<any>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): XMap<Vector4, "4d", TTarget, TXKey> {
        return map("4d", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v4b(): XMap<Vector4, "4b">
    export function v4b<TXKey extends string>(xKey: TXKey): XMap<Vector4, "4b", Vector4, TXKey>
    export function v4b<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): XMap<Vector4, "4b", TTarget, TXKey>
    export function v4b<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<any>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): XMap<Vector4, "4b", TTarget, TXKey> {
        return map("4b", xKey, type, convert, convertBack, fallbackValue)
    }
    export function vs8(): XMap<VectorB, "vs8">
    export function vs8<TXKey extends string>(xKey: TXKey): XMap<VectorB, "vs8", VectorB, TXKey>
    export function vs8<TTarget = VectorB, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: VectorB) => TTarget, convertBack?: (target: TTarget) => VectorB, fallbackValue?: VectorB): XMap<VectorB, "vs8", TTarget, TXKey>
    export function vs8<TTarget = VectorB, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<any>, convert?: (source: VectorB) => TTarget, convertBack?: (target: TTarget) => VectorB, fallbackValue?: VectorB): XMap<VectorB, "vs8", TTarget, TXKey> {
        return map("vs8", xKey, type, convert, convertBack, fallbackValue)
    }
    export function vu8(): XMap<VectorB, "vu8">
    export function vu8<TXKey extends string>(xKey: TXKey): XMap<VectorB, "vu8", VectorB, TXKey>
    export function vu8<TTarget = VectorB, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: VectorB) => TTarget, convertBack?: (target: TTarget) => VectorB, fallbackValue?: VectorB): XMap<VectorB, "vu8", TTarget, TXKey>
    export function vu8<TTarget = VectorB, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<any>, convert?: (source: VectorB) => TTarget, convertBack?: (target: TTarget) => VectorB, fallbackValue?: VectorB): XMap<VectorB, "vu8", TTarget, TXKey> {
        return map("vu8", xKey, type, convert, convertBack, fallbackValue)
    }
    export function vs16(): XMap<VectorB, "vs16">
    export function vs16<TXKey extends string>(xKey: TXKey): XMap<VectorB, "vs16", VectorB, TXKey>
    export function vs16<TTarget = VectorB, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: VectorB) => TTarget, convertBack?: (target: TTarget) => VectorB, fallbackValue?: VectorB): XMap<VectorB, "vs16", TTarget, TXKey>
    export function vs16<TTarget = VectorB, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<any>, convert?: (source: VectorB) => TTarget, convertBack?: (target: TTarget) => VectorB, fallbackValue?: VectorB): XMap<VectorB, "vs16", TTarget, TXKey> {
        return map("vs16", xKey, type, convert, convertBack, fallbackValue)
    }
    export function vu16(): XMap<VectorB, "vu16">
    export function vu16<TXKey extends string>(xKey: TXKey): XMap<VectorB, "vu16", VectorB, TXKey>
    export function vu16<TTarget = VectorB, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: VectorB) => TTarget, convertBack?: (target: TTarget) => VectorB, fallbackValue?: VectorB): XMap<VectorB, "vu16", TTarget, TXKey>
    export function vu16<TTarget = VectorB, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<any>, convert?: (source: VectorB) => TTarget, convertBack?: (target: TTarget) => VectorB, fallbackValue?: VectorB): XMap<VectorB, "vu16", TTarget, TXKey> {
        return map("vu16", xKey, type, convert, convertBack, fallbackValue)
    }
    export function vb(): XMap<Vector, "vb">
    export function vb<TXKey extends string>(xKey: TXKey): XMap<Vector, "vb", Vector, TXKey>
    export function vb<TTarget = Vector, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector) => TTarget, convertBack?: (target: TTarget) => Vector, fallbackValue?: Vector): XMap<Vector, "vb", TTarget, TXKey>
    export function vb<TTarget = Vector, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<any>, convert?: (source: Vector) => TTarget, convertBack?: (target: TTarget) => Vector, fallbackValue?: Vector): XMap<Vector, "vb", TTarget, TXKey> {
        return map("vb", xKey, type, convert, convertBack, fallbackValue)
    }
    export function bin(): XMap<Buffer, "bin">
    export function bin<TXKey extends string>(xKey: TXKey): XMap<Buffer, "bin", Buffer, TXKey>
    export function bin<TTarget = Buffer, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Buffer) => TTarget, convertBack?: (target: TTarget) => Buffer, fallbackValue?: Buffer): XMap<Buffer, "bin", TTarget, TXKey>
    export function bin<TTarget = Buffer, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<any>, convert?: (source: Buffer) => TTarget, convertBack?: (target: TTarget) => Buffer, fallbackValue?: Buffer): XMap<Buffer, "bin", TTarget, TXKey> {
        return map<Buffer, "bin", TTarget, TXKey>("bin", xKey, type, convert, convertBack, fallbackValue)
    }
    export function ip4(): XMap<number[], "ip4">
    export function ip4<TXKey extends string>(xKey: TXKey): XMap<number[], "ip4", number[], TXKey>
    export function ip4<TTarget = number[], TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: number[]) => TTarget, convertBack?: (target: TTarget) => number[], fallbackValue?: number[]): XMap<number[], "ip4", TTarget, TXKey>
    export function ip4<TTarget = number[], TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<any>, convert?: (source: number[]) => TTarget, convertBack?: (target: TTarget) => number[], fallbackValue?: number[]): XMap<number[], "ip4", TTarget, TXKey> {
        return map<number[], "ip4", TTarget, TXKey>("ip4", xKey, type, convert, convertBack, fallbackValue)
    }
    export function str(): XMap<string, "str">
    export function str<TXKey extends string>(xKey: TXKey): XMap<string, "str", string, TXKey>
    export function str<TTarget = string, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: string) => TTarget, convertBack?: (target: TTarget) => string, fallbackValue?: string): XMap<string, "str", TTarget, TXKey>
    export function str<TTarget = string, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<any>, convert?: (source: string) => TTarget, convertBack?: (target: TTarget) => string, fallbackValue?: string): XMap<string, "str", TTarget, TXKey> {
        return map("str", xKey, type, convert, convertBack, fallbackValue)
    }
    export function time(): XMap<Date, "time">
    export function time<TXKey extends string>(xKey: TXKey): XMap<Date, "time", Date, TXKey>
    export function time<TTarget = Date, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Date) => TTarget, convertBack?: (target: TTarget) => Date, fallbackValue?: Date): XMap<Date, "time", TTarget, TXKey>
    export function time<TTarget = Date, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<any>, convert?: (source: Date) => TTarget, convertBack?: (target: TTarget) => Date, fallbackValue?: Date): XMap<Date, "time", TTarget, TXKey> {
        return map("time", xKey, type, convert, convertBack, fallbackValue)
    }
    export function obj<T extends object>(subMap: XSubMap<T>): XMap<T, undefined>
    export function obj<T extends object, TXKey extends string>(xKey: TXKey, subMap: XSubMap<T>): XMap<T, undefined, T, TXKey>
    export function obj<T extends object, TTarget = T, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown> | TypeToken<unknown>, convert?: (source: T) => TTarget, convertBack?: (target: TTarget) => T, fallbackValue?: T): XMap<T, undefined, TTarget, TXKey>
    export function obj<T extends object, TTarget = T, TXKey extends string | undefined = undefined>(xKeyOrSubMap?: TXKey | XSubMap<T>, typeOrSubMap?: Type<unknown> | TypeToken<unknown> | XSubMap<T>, convert?: (source: T) => TTarget, convertBack?: (target: TTarget) => T, fallbackValue?: T, subMap?: XSubMap<T>): XMap<T, undefined, TTarget, TXKey> {
        if (typeof xKeyOrSubMap !== "string") return map(undefined, undefined, undefined, undefined, undefined, undefined, undefined, xKeyOrSubMap)
        if ((typeOrSubMap?.constructor && !typeOrSubMap?.constructor.toString().startsWith("class"))) return map(undefined, xKeyOrSubMap, undefined, undefined, undefined, undefined, undefined, typeOrSubMap as XSubMap<T>)
        return map(undefined, xKeyOrSubMap, typeOrSubMap as Type<T>, convert, convertBack, fallbackValue, undefined, subMap)
    }
    export function attr(): XMap<string, "xattr">
    export function attr<TXKey extends string>(xKey: TXKey): XMap<string, "xattr", string, TXKey>
    export function attr<TTarget = string, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: string) => TTarget, convertBack?: (target: TTarget) => string, fallbackValue?: string): XMap<string, "xattr", TTarget, TXKey>
    export function attr<TTarget = string, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<any>, convert?: (source: string) => TTarget, convertBack?: (target: TTarget) => string, fallbackValue?: string): XMap<string, "xattr", TTarget, TXKey> {
        return map("xattr", xKey, type, convert, convertBack, fallbackValue)
    }
    export function a<TE>(elMap: XMap<TE, XTypeExtended, unknown>): XMap<TE[], XTypeExtended, unknown>
    export function a<TE>(elType: Type<TE> | TypeToken<TE>, elMap?: XMap<TE, XTypeExtended, unknown>): XMap<TE[], XTypeExtended, unknown>
    export function a<TE>(elTypeOrMap: Type<TE> | TypeToken<TE> | XMap<TE, XTypeExtended, unknown>, elMap?: XMap<TE, XTypeExtended, unknown>): XMap<TE[], XTypeExtended, unknown> {
        return map<TE[], XTypeExtended, unknown>(undefined, undefined, undefined, undefined, undefined, undefined, isTypeOrToken(elTypeOrMap) ? elTypeOrMap : undefined, undefined, elMap ?? !isTypeOrToken(elTypeOrMap) ? elTypeOrMap as XMap<TE, XTypeExtended, unknown> : undefined)
    }
}