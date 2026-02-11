import { XF } from "./functions"
import { XM } from "./map_builder"
import { DBBigInt, Vector, Vector2, Vector2B, Vector3, Vector3B, Vector4, Vector4B, VectorB } from "../db/db_types"
import { XTypeExtended, XMap, XSubMap, XType } from "./types"
import { ArrayWrapper, isType, isTypeOrToken, Type, TypeToken } from "../types"

export namespace XD {
    type PropertyDecorator<T = any> = (target: any, propKey: keyof T) => void
    export function prop<T, TXType extends XTypeExtended, TTarget = T, TXKey extends string | undefined = undefined>(xType: TXType, xKey?: TXKey, type?: Type<T> | TypeToken<T>, convert?: (source: T) => TTarget, convertBack?: (target: TTarget) => T, fallbackValue?: T, elType?: T extends Array<infer TE> ? Type<TE> | TypeToken<TE> : undefined, subMap?: XSubMap<T>, elSubMap?: T extends Array<infer TE> ? XMap<TE, TXType, unknown> : undefined, side?: "x" | "o"): PropertyDecorator {
        return (target, propKey) => {
            const targetType = target.constructor
            if (!targetType.hasOwnProperty("__map__") || !targetType.__map__) targetType.__map__ = {}
            const map = XM.map(xType, xKey, type, convert, convertBack, fallbackValue, elType, subMap, elSubMap)
            switch (side) {
                case "x":
                    if (targetType.__map__[propKey]) {
                        if (XF.isNonEquivalentMap(targetType.__map__[propKey])) targetType.__map__[propKey].$xSide = map as any
                        else {
                            const m = targetType.__map__[propKey]
                            targetType.__map__[propKey] = {
                                $xSide: map,
                                $oSide: m
                            }
                        }
                    } else targetType.__map__[propKey] = {
                        $xSide: map
                    }
                    break
                case "o":
                    if (targetType.__map__[propKey]) {
                        if (XF.isNonEquivalentMap(targetType.__map__[propKey])) targetType.__map__[propKey].$oSide = map as any
                        else {
                            const m = targetType.__map__[propKey]
                            targetType.__map__[propKey] = {
                                $oSide: map,
                                $xSide: m
                            }
                        }
                    } else targetType.__map__[propKey] = {
                        $oSide: map
                    }
                    break
                default: targetType.__map__[propKey] = map
            }
        }
    }
    type NumberOrArray = number | number[]
    type BigIntOrArray = bigint | DBBigInt | bigint[] | DBBigInt[] | (bigint | DBBigInt)[]
    type BooleanOrArray = boolean | boolean[]
    export function s8(): PropertyDecorator
    export function s8<TXKey extends string>(xKey: TXKey): PropertyDecorator
    export function s8<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): PropertyDecorator
    export function s8<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): PropertyDecorator {
        return prop("s8", xKey, type, convert, convertBack, fallbackValue)
    }
    export function u8(): PropertyDecorator
    export function u8<TXKey extends string>(xKey: TXKey): PropertyDecorator
    export function u8<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): PropertyDecorator
    export function u8<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): PropertyDecorator {
        return prop("u8", xKey, type, convert, convertBack, fallbackValue)
    }
    export function s16(): PropertyDecorator
    export function s16<TXKey extends string>(xKey: TXKey): PropertyDecorator
    export function s16<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): PropertyDecorator
    export function s16<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): PropertyDecorator {
        return prop("s16", xKey, type, convert, convertBack, fallbackValue)
    }
    export function u16(): PropertyDecorator
    export function u16<TXKey extends string>(xKey: TXKey): PropertyDecorator
    export function u16<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): PropertyDecorator
    export function u16<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): PropertyDecorator {
        return prop("u16", xKey, type, convert, convertBack, fallbackValue)
    }
    export function s32(): PropertyDecorator
    export function s32<TXKey extends string>(xKey: TXKey): PropertyDecorator
    export function s32<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): PropertyDecorator
    export function s32<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): PropertyDecorator {
        return prop("s32", xKey, type, convert, convertBack, fallbackValue)
    }
    export function u32(): PropertyDecorator
    export function u32<TXKey extends string>(xKey: TXKey): PropertyDecorator
    export function u32<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): PropertyDecorator
    export function u32<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): PropertyDecorator {
        return prop("u32", xKey, type, convert, convertBack, fallbackValue)
    }
    export function s64(): PropertyDecorator
    export function s64<TXKey extends string>(xKey: TXKey): PropertyDecorator
    export function s64<TTarget = BigIntOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: BigIntOrArray) => TTarget, convertBack?: (target: TTarget) => BigIntOrArray, fallbackValue?: BigIntOrArray): PropertyDecorator
    export function s64<TTarget = BigIntOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: BigIntOrArray) => TTarget, convertBack?: (target: TTarget) => BigIntOrArray, fallbackValue?: BigIntOrArray): PropertyDecorator {
        return prop("s64", xKey, type, convert, convertBack, fallbackValue)
    }
    export function u64(): PropertyDecorator
    export function u64<TXKey extends string>(xKey: TXKey): PropertyDecorator
    export function u64<TTarget = BigIntOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: BigIntOrArray) => TTarget, convertBack?: (target: TTarget) => BigIntOrArray, fallbackValue?: BigIntOrArray): PropertyDecorator
    export function u64<TTarget = BigIntOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: BigIntOrArray) => TTarget, convertBack?: (target: TTarget) => BigIntOrArray, fallbackValue?: BigIntOrArray): PropertyDecorator {
        return prop("u64", xKey, type, convert, convertBack, fallbackValue)
    }
    export function float(): PropertyDecorator
    export function float<TXKey extends string>(xKey: TXKey): PropertyDecorator
    export function float<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): PropertyDecorator
    export function float<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): PropertyDecorator {
        return prop("float", xKey, type, convert, convertBack, fallbackValue)
    }
    export function double(): PropertyDecorator
    export function double<TXKey extends string>(xKey: TXKey): PropertyDecorator
    export function double<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): PropertyDecorator
    export function double<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): PropertyDecorator {
        return prop("double", xKey, type, convert, convertBack, fallbackValue)
    }
    export function bool(): PropertyDecorator
    export function bool<TXKey extends string>(xKey: TXKey): PropertyDecorator
    export function bool<TTarget = BooleanOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: BooleanOrArray) => TTarget, convertBack?: (target: TTarget) => BooleanOrArray, fallbackValue?: BooleanOrArray): PropertyDecorator
    export function bool<TTarget = BooleanOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: BooleanOrArray) => TTarget, convertBack?: (target: TTarget) => BooleanOrArray, fallbackValue?: BooleanOrArray): PropertyDecorator {
        return prop("bool", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v2s8(): PropertyDecorator
    export function v2s8<TXKey extends string>(xKey: TXKey): PropertyDecorator
    export function v2s8<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): PropertyDecorator
    export function v2s8<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): PropertyDecorator {
        return prop("2s8", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v2u8(): PropertyDecorator
    export function v2u8<TXKey extends string>(xKey: TXKey): PropertyDecorator
    export function v2u8<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): PropertyDecorator
    export function v2u8<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): PropertyDecorator {
        return prop("2u8", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v2s16(): PropertyDecorator
    export function v2s16<TXKey extends string>(xKey: TXKey): PropertyDecorator
    export function v2s16<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): PropertyDecorator
    export function v2s16<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): PropertyDecorator {
        return prop("2s16", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v2u16(): PropertyDecorator
    export function v2u16<TXKey extends string>(xKey: TXKey): PropertyDecorator
    export function v2u16<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): PropertyDecorator
    export function v2u16<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): PropertyDecorator {
        return prop("2u16", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v2s32(): PropertyDecorator
    export function v2s32<TXKey extends string>(xKey: TXKey): PropertyDecorator
    export function v2s32<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): PropertyDecorator
    export function v2s32<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): PropertyDecorator {
        return prop("2s32", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v2u32(): PropertyDecorator
    export function v2u32<TXKey extends string>(xKey: TXKey): PropertyDecorator
    export function v2u32<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): PropertyDecorator
    export function v2u32<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): PropertyDecorator {
        return prop("2u32", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v2s64(): PropertyDecorator
    export function v2s64<TXKey extends string>(xKey: TXKey): PropertyDecorator
    export function v2s64<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2B) => TTarget, convertBack?: (target: TTarget) => Vector2B, fallbackValue?: Vector2B): PropertyDecorator
    export function v2s64<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2B) => TTarget, convertBack?: (target: TTarget) => Vector2B, fallbackValue?: Vector2B): PropertyDecorator {
        return prop("2s64", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v2u64(): PropertyDecorator
    export function v2u64<TXKey extends string>(xKey: TXKey): PropertyDecorator
    export function v2u64<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2B) => TTarget, convertBack?: (target: TTarget) => Vector2B, fallbackValue?: Vector2B): PropertyDecorator
    export function v2u64<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2B) => TTarget, convertBack?: (target: TTarget) => Vector2B, fallbackValue?: Vector2B): PropertyDecorator {
        return prop("2u64", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v2f(): PropertyDecorator
    export function v2f<TXKey extends string>(xKey: TXKey): PropertyDecorator
    export function v2f<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): PropertyDecorator
    export function v2f<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): PropertyDecorator {
        return prop("2f", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v2d(): PropertyDecorator
    export function v2d<TXKey extends string>(xKey: TXKey): PropertyDecorator
    export function v2d<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): PropertyDecorator
    export function v2d<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): PropertyDecorator {
        return prop("2d", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v2b(): PropertyDecorator
    export function v2b<TXKey extends string>(xKey: TXKey): PropertyDecorator
    export function v2b<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): PropertyDecorator
    export function v2b<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): PropertyDecorator {
        return prop("2b", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v3s8(): PropertyDecorator
    export function v3s8<TXKey extends string>(xKey: TXKey): PropertyDecorator
    export function v3s8<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): PropertyDecorator
    export function v3s8<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): PropertyDecorator {
        return prop("3s8", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v3u8(): PropertyDecorator
    export function v3u8<TXKey extends string>(xKey: TXKey): PropertyDecorator
    export function v3u8<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): PropertyDecorator
    export function v3u8<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): PropertyDecorator {
        return prop("3u8", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v3s16(): PropertyDecorator
    export function v3s16<TXKey extends string>(xKey: TXKey): PropertyDecorator
    export function v3s16<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): PropertyDecorator
    export function v3s16<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): PropertyDecorator {
        return prop("3s16", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v3u16(): PropertyDecorator
    export function v3u16<TXKey extends string>(xKey: TXKey): PropertyDecorator
    export function v3u16<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): PropertyDecorator
    export function v3u16<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): PropertyDecorator {
        return prop("3u16", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v3s32(): PropertyDecorator
    export function v3s32<TXKey extends string>(xKey: TXKey): PropertyDecorator
    export function v3s32<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): PropertyDecorator
    export function v3s32<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): PropertyDecorator {
        return prop("3s32", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v3u32(): PropertyDecorator
    export function v3u32<TXKey extends string>(xKey: TXKey): PropertyDecorator
    export function v3u32<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): PropertyDecorator
    export function v3u32<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): PropertyDecorator {
        return prop("3u32", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v3s64(): PropertyDecorator
    export function v3s64<TXKey extends string>(xKey: TXKey): PropertyDecorator
    export function v3s64<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3B) => TTarget, convertBack?: (target: TTarget) => Vector3B, fallbackValue?: Vector3B): PropertyDecorator
    export function v3s64<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3B) => TTarget, convertBack?: (target: TTarget) => Vector3B, fallbackValue?: Vector3B): PropertyDecorator {
        return prop("3s64", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v3u64(): PropertyDecorator
    export function v3u64<TXKey extends string>(xKey: TXKey): PropertyDecorator
    export function v3u64<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3B) => TTarget, convertBack?: (target: TTarget) => Vector3B, fallbackValue?: Vector3B): PropertyDecorator
    export function v3u64<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3B) => TTarget, convertBack?: (target: TTarget) => Vector3B, fallbackValue?: Vector3B): PropertyDecorator {
        return prop("3u64", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v3f(): PropertyDecorator
    export function v3f<TXKey extends string>(xKey: TXKey): PropertyDecorator
    export function v3f<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): PropertyDecorator
    export function v3f<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): PropertyDecorator {
        return prop("3f", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v3d(): PropertyDecorator
    export function v3d<TXKey extends string>(xKey: TXKey): PropertyDecorator
    export function v3d<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): PropertyDecorator
    export function v3d<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): PropertyDecorator {
        return prop("3d", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v3b(): PropertyDecorator
    export function v3b<TXKey extends string>(xKey: TXKey): PropertyDecorator
    export function v3b<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): PropertyDecorator
    export function v3b<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): PropertyDecorator {
        return prop("3b", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v4s8(): PropertyDecorator
    export function v4s8<TXKey extends string>(xKey: TXKey): PropertyDecorator
    export function v4s8<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): PropertyDecorator
    export function v4s8<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): PropertyDecorator {
        return prop("4s8", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v4u8(): PropertyDecorator
    export function v4u8<TXKey extends string>(xKey: TXKey): PropertyDecorator
    export function v4u8<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): PropertyDecorator
    export function v4u8<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): PropertyDecorator {
        return prop("4u8", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v4s16(): PropertyDecorator
    export function v4s16<TXKey extends string>(xKey: TXKey): PropertyDecorator
    export function v4s16<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): PropertyDecorator
    export function v4s16<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): PropertyDecorator {
        return prop("4s16", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v4u16(): PropertyDecorator
    export function v4u16<TXKey extends string>(xKey: TXKey): PropertyDecorator
    export function v4u16<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): PropertyDecorator
    export function v4u16<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): PropertyDecorator {
        return prop("4u16", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v4s32(): PropertyDecorator
    export function v4s32<TXKey extends string>(xKey: TXKey): PropertyDecorator
    export function v4s32<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): PropertyDecorator
    export function v4s32<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): PropertyDecorator {
        return prop("4s32", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v4u32(): PropertyDecorator
    export function v4u32<TXKey extends string>(xKey: TXKey): PropertyDecorator
    export function v4u32<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): PropertyDecorator
    export function v4u32<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): PropertyDecorator {
        return prop("4u32", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v4s64(): PropertyDecorator
    export function v4s64<TXKey extends string>(xKey: TXKey): PropertyDecorator
    export function v4s64<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4B) => TTarget, convertBack?: (target: TTarget) => Vector4B, fallbackValue?: Vector4B): PropertyDecorator
    export function v4s64<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4B) => TTarget, convertBack?: (target: TTarget) => Vector4B, fallbackValue?: Vector4B): PropertyDecorator {
        return prop("4s64", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v4u64(): PropertyDecorator
    export function v4u64<TXKey extends string>(xKey: TXKey): PropertyDecorator
    export function v4u64<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4B) => TTarget, convertBack?: (target: TTarget) => Vector4B, fallbackValue?: Vector4B): PropertyDecorator
    export function v4u64<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4B) => TTarget, convertBack?: (target: TTarget) => Vector4B, fallbackValue?: Vector4B): PropertyDecorator {
        return prop("4u64", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v4f(): PropertyDecorator
    export function v4f<TXKey extends string>(xKey: TXKey): PropertyDecorator
    export function v4f<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): PropertyDecorator
    export function v4f<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): PropertyDecorator {
        return prop("4f", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v4d(): PropertyDecorator
    export function v4d<TXKey extends string>(xKey: TXKey): PropertyDecorator
    export function v4d<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): PropertyDecorator
    export function v4d<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): PropertyDecorator {
        return prop("4d", xKey, type, convert, convertBack, fallbackValue)
    }
    export function v4b(): PropertyDecorator
    export function v4b<TXKey extends string>(xKey: TXKey): PropertyDecorator
    export function v4b<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): PropertyDecorator
    export function v4b<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): PropertyDecorator {
        return prop("4b", xKey, type, convert, convertBack, fallbackValue)
    }
    export function vs8(): PropertyDecorator
    export function vs8<TXKey extends string>(xKey: TXKey): PropertyDecorator
    export function vs8<TTarget = VectorB, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: VectorB) => TTarget, convertBack?: (target: TTarget) => VectorB, fallbackValue?: VectorB): PropertyDecorator
    export function vs8<TTarget = VectorB, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: VectorB) => TTarget, convertBack?: (target: TTarget) => VectorB, fallbackValue?: VectorB): PropertyDecorator {
        return prop("vs8", xKey, type, convert, convertBack, fallbackValue)
    }
    export function vu8(): PropertyDecorator
    export function vu8<TXKey extends string>(xKey: TXKey): PropertyDecorator
    export function vu8<TTarget = VectorB, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: VectorB) => TTarget, convertBack?: (target: TTarget) => VectorB, fallbackValue?: VectorB): PropertyDecorator
    export function vu8<TTarget = VectorB, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: VectorB) => TTarget, convertBack?: (target: TTarget) => VectorB, fallbackValue?: VectorB): PropertyDecorator {
        return prop("vu8", xKey, type, convert, convertBack, fallbackValue)
    }
    export function vs16(): PropertyDecorator
    export function vs16<TXKey extends string>(xKey: TXKey): PropertyDecorator
    export function vs16<TTarget = VectorB, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: VectorB) => TTarget, convertBack?: (target: TTarget) => VectorB, fallbackValue?: VectorB): PropertyDecorator
    export function vs16<TTarget = VectorB, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: VectorB) => TTarget, convertBack?: (target: TTarget) => VectorB, fallbackValue?: VectorB): PropertyDecorator {
        return prop("vs16", xKey, type, convert, convertBack, fallbackValue)
    }
    export function vu16(): PropertyDecorator
    export function vu16<TXKey extends string>(xKey: TXKey): PropertyDecorator
    export function vu16<TTarget = VectorB, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: VectorB) => TTarget, convertBack?: (target: TTarget) => VectorB, fallbackValue?: VectorB): PropertyDecorator
    export function vu16<TTarget = VectorB, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: VectorB) => TTarget, convertBack?: (target: TTarget) => VectorB, fallbackValue?: VectorB): PropertyDecorator {
        return prop("vu16", xKey, type, convert, convertBack, fallbackValue)
    }
    export function vb(): PropertyDecorator
    export function vb<TXKey extends string>(xKey: TXKey): PropertyDecorator
    export function vb<TTarget = Vector, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector) => TTarget, convertBack?: (target: TTarget) => Vector, fallbackValue?: Vector): PropertyDecorator
    export function vb<TTarget = Vector, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector) => TTarget, convertBack?: (target: TTarget) => Vector, fallbackValue?: Vector): PropertyDecorator {
        return prop("vb", xKey, type, convert, convertBack, fallbackValue)
    }
    export function bin(): PropertyDecorator
    export function bin<TXKey extends string>(xKey: TXKey): PropertyDecorator
    export function bin<TTarget = Buffer, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Buffer) => TTarget, convertBack?: (target: TTarget) => Buffer, fallbackValue?: Buffer): PropertyDecorator
    export function bin<TTarget = Buffer, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Buffer) => TTarget, convertBack?: (target: TTarget) => Buffer, fallbackValue?: Buffer): PropertyDecorator {
        return prop("bin", xKey, type, convert, convertBack, fallbackValue)
    }
    export function ip4(): PropertyDecorator
    export function ip4<TXKey extends string>(xKey: TXKey): PropertyDecorator
    export function ip4<TTarget = number[], TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: number[]) => TTarget, convertBack?: (target: TTarget) => number[], fallbackValue?: number[]): PropertyDecorator
    export function ip4<TTarget = number[], TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: number[]) => TTarget, convertBack?: (target: TTarget) => number[], fallbackValue?: number[]): PropertyDecorator {
        return prop("ip4", xKey, type, convert, convertBack, fallbackValue)
    }
    export function str(): PropertyDecorator
    export function str<TXKey extends string>(xKey: TXKey): PropertyDecorator
    export function str<TTarget = string, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: string) => TTarget, convertBack?: (target: TTarget) => string, fallbackValue?: string): PropertyDecorator
    export function str<TTarget = string, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: string) => TTarget, convertBack?: (target: TTarget) => string, fallbackValue?: string): PropertyDecorator {
        return prop("str", xKey, type, convert, convertBack, fallbackValue)
    }
    export function time(): PropertyDecorator
    export function time<TXKey extends string>(xKey: TXKey): PropertyDecorator
    export function time<TTarget = Date, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Date) => TTarget, convertBack?: (target: TTarget) => Date, fallbackValue?: Date): PropertyDecorator
    export function time<TTarget = Date, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Date) => TTarget, convertBack?: (target: TTarget) => Date, fallbackValue?: Date): PropertyDecorator {
        return prop("time", xKey, type, convert, convertBack, fallbackValue)
    }
    export function attr(): PropertyDecorator
    export function attr<TXKey extends string>(xKey: TXKey): PropertyDecorator
    export function attr<TTarget = string, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: string) => TTarget, convertBack?: (target: TTarget) => string, fallbackValue?: string): PropertyDecorator
    export function attr<TTarget = string, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: string) => TTarget, convertBack?: (target: TTarget) => string, fallbackValue?: string): PropertyDecorator {
        return prop("xattr", xKey, type, convert, convertBack, fallbackValue)
    }
    export function obj<T extends object>(subMap: XSubMap<T>): PropertyDecorator
    export function obj<T extends object, TXKey extends string>(xKey: TXKey, subMap: XSubMap<T>): PropertyDecorator
    export function obj<T extends object, TTarget = T, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: T) => TTarget, convertBack?: (target: TTarget) => T, fallbackValue?: T): PropertyDecorator
    export function obj<T extends object, TTarget = T, TXKey extends string | undefined = undefined>(xKeyOrSubMap?: TXKey | XSubMap<T>, typeOrSubMap?: Type<unknown> | XSubMap<T>, convert?: (source: T) => TTarget, convertBack?: (target: TTarget) => T, fallbackValue?: T, subMap?: XSubMap<T>): PropertyDecorator {
        if (typeof xKeyOrSubMap !== "string") return prop(undefined, undefined, undefined, undefined, undefined, undefined, undefined, xKeyOrSubMap)
        if (typeOrSubMap?.constructor && !typeOrSubMap?.constructor.toString().startsWith("class")) return prop(undefined, xKeyOrSubMap, undefined, undefined, undefined, undefined, undefined, typeOrSubMap as XSubMap<T>)
        return prop(undefined, xKeyOrSubMap, typeOrSubMap as Type<T>, convert, convertBack, fallbackValue, undefined, subMap)
    }
    export function type<T>(type: Type<T>): PropertyDecorator
    export function type<T, TXKey extends string>(xKey: TXKey, type: Type<T>): PropertyDecorator
    export function type<T, TTarget = T, TXKey extends string | undefined = undefined>(xKey: TXKey, type: Type<T>, convert?: (source: T) => TTarget, convertBack?: (target: TTarget) => T, fallbackValue?: T): PropertyDecorator
    export function type<T, TTarget = T, TXKey extends string | undefined = undefined>(typeOrXKey: TXKey | Type<T>, type?: Type<T>, convert?: (source: T) => TTarget, convertBack?: (target: TTarget) => T, fallbackValue?: T): PropertyDecorator {
        const xKey = typeof typeOrXKey === "string" ? typeOrXKey : undefined
        type ??= typeof typeOrXKey === "string" ? undefined : typeOrXKey
        return prop(undefined, xKey, type, convert, convertBack, fallbackValue)
    }
    export function a<TE>(elType: Type<TE>): PropertyDecorator
    export function a<TE>(elMap: XMap<TE, XTypeExtended, unknown>): PropertyDecorator
    export function a<TE, TXKey extends string>(elType: Type<TE>, xKey: TXKey): PropertyDecorator
    export function a<TE, TXKey extends string>(elMap: XMap<TE, XTypeExtended, unknown>, xKey: TXKey): PropertyDecorator
    export function a<TE, TTarget = TE[], TXKey extends string | undefined = undefined>(elType: Type<TE> | TypeToken<TE>, xKey?: TXKey, convert?: (source: TE[]) => TTarget, convertBack?: (target: TTarget) => TE[], fallbackValue?: TE[]): PropertyDecorator
    export function a<TE, TTarget = TE[], TXKey extends string | undefined = undefined>(elMap: XMap<TE, XTypeExtended, unknown>, xKey?: TXKey, convert?: (source: TE[]) => TTarget, convertBack?: (target: TTarget) => TE[], fallbackValue?: TE[]): PropertyDecorator
    export function a<TE, TTarget = TE[], TXKey extends string | undefined = undefined>(elMapOrType: Type<TE> | TypeToken<TE> | XMap<TE, XTypeExtended, unknown>, xKey?: TXKey, convert?: (source: TE[]) => TTarget, convertBack?: (target: TTarget) => TE[], fallbackValue?: TE[]): PropertyDecorator {
        let map: XMap<TE, XTypeExtended, unknown>
        let type: Type<TE> | TypeToken<TE>
        if (!isTypeOrToken(elMapOrType)) map = elMapOrType
        else type = elMapOrType
        return prop(undefined, xKey, undefined, convert, convertBack, fallbackValue, type, undefined, map)
    }
    // wrapped array
    export function aw<TE>(wrapperKey: string, elType: Type<TE>, map?: XMap<any, XTypeExtended>): PropertyDecorator
    export function aw<TE, TXKey extends string>(xKey: TXKey, wrapperKey: string, elType: Type<TE>, map?: XMap<unknown, XTypeExtended>): PropertyDecorator
    export function aw<TE, TXKey extends string | undefined = undefined>(xKeyOrWrapperKey: string | TXKey, wrapperKeyOrElType: string | Type<TE>, elTypeOrMap?: Type<TE> | TypeToken<TE> | XMap<unknown, XTypeExtended>, map?: XMap<unknown, XTypeExtended>): PropertyDecorator { // array wrapper, structure like { key?: Type[] }
        const wrapperKey = typeof wrapperKeyOrElType === "string" ? wrapperKeyOrElType : xKeyOrWrapperKey as string
        const xKey = typeof wrapperKeyOrElType === "string" ? xKeyOrWrapperKey as TXKey : undefined
        const elType = typeof wrapperKeyOrElType !== "string" ? wrapperKeyOrElType : (isType(elTypeOrMap) || typeof elTypeOrMap === "symbol") ? elTypeOrMap : undefined
        map ??= !(isType(elTypeOrMap) || typeof elTypeOrMap === "symbol") ? elTypeOrMap : map
        const c = class __AW__ {
            static __map__ = Object.assign({
                [wrapperKey]: {
                    $el: elType
                }
            }, map)
        }
        return prop<{ [K in string]: TE[] }, undefined, { [K in string]: TE[] }, TXKey>(undefined, xKey, c as Type<ArrayWrapper<string, TE>>, undefined, undefined, {}, undefined, undefined)
    }
    export function ignore(): PropertyDecorator {
        return prop("xignore")
    }

    export namespace ToX {
        export function s8(): PropertyDecorator
        export function s8<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function s8<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): PropertyDecorator
        export function s8<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): PropertyDecorator {
            return prop("s8", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "x")
        }
        export function u8(): PropertyDecorator
        export function u8<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function u8<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): PropertyDecorator
        export function u8<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): PropertyDecorator {
            return prop("u8", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "x")
        }
        export function s16(): PropertyDecorator
        export function s16<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function s16<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): PropertyDecorator
        export function s16<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): PropertyDecorator {
            return prop("s16", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "x")
        }
        export function u16(): PropertyDecorator
        export function u16<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function u16<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): PropertyDecorator
        export function u16<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): PropertyDecorator {
            return prop("u16", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "x")
        }
        export function s32(): PropertyDecorator
        export function s32<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function s32<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): PropertyDecorator
        export function s32<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): PropertyDecorator {
            return prop("s32", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "x")
        }
        export function u32(): PropertyDecorator
        export function u32<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function u32<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): PropertyDecorator
        export function u32<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): PropertyDecorator {
            return prop("u32", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "x")
        }
        export function s64(): PropertyDecorator
        export function s64<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function s64<TTarget = BigIntOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: BigIntOrArray) => TTarget, convertBack?: (target: TTarget) => BigIntOrArray, fallbackValue?: BigIntOrArray): PropertyDecorator
        export function s64<TTarget = BigIntOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: BigIntOrArray) => TTarget, convertBack?: (target: TTarget) => BigIntOrArray, fallbackValue?: BigIntOrArray): PropertyDecorator {
            return prop("s64", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "x")
        }
        export function u64(): PropertyDecorator
        export function u64<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function u64<TTarget = BigIntOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: BigIntOrArray) => TTarget, convertBack?: (target: TTarget) => BigIntOrArray, fallbackValue?: BigIntOrArray): PropertyDecorator
        export function u64<TTarget = BigIntOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: BigIntOrArray) => TTarget, convertBack?: (target: TTarget) => BigIntOrArray, fallbackValue?: BigIntOrArray): PropertyDecorator {
            return prop("u64", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "x")
        }
        export function float(): PropertyDecorator
        export function float<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function float<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): PropertyDecorator
        export function float<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): PropertyDecorator {
            return prop("float", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "x")
        }
        export function double(): PropertyDecorator
        export function double<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function double<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): PropertyDecorator
        export function double<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): PropertyDecorator {
            return prop("double", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "x")
        }
        export function bool(): PropertyDecorator
        export function bool<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function bool<TTarget = BooleanOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: BooleanOrArray) => TTarget, convertBack?: (target: TTarget) => BooleanOrArray, fallbackValue?: BooleanOrArray): PropertyDecorator
        export function bool<TTarget = BooleanOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: BooleanOrArray) => TTarget, convertBack?: (target: TTarget) => BooleanOrArray, fallbackValue?: BooleanOrArray): PropertyDecorator {
            return prop("bool", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "x")
        }
        export function v2s8(): PropertyDecorator
        export function v2s8<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v2s8<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): PropertyDecorator
        export function v2s8<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): PropertyDecorator {
            return prop("2s8", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "x")
        }
        export function v2u8(): PropertyDecorator
        export function v2u8<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v2u8<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): PropertyDecorator
        export function v2u8<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): PropertyDecorator {
            return prop("2u8", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "x")
        }
        export function v2s16(): PropertyDecorator
        export function v2s16<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v2s16<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): PropertyDecorator
        export function v2s16<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): PropertyDecorator {
            return prop("2s16", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "x")
        }
        export function v2u16(): PropertyDecorator
        export function v2u16<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v2u16<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): PropertyDecorator
        export function v2u16<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): PropertyDecorator {
            return prop("2u16", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "x")
        }
        export function v2s32(): PropertyDecorator
        export function v2s32<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v2s32<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): PropertyDecorator
        export function v2s32<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): PropertyDecorator {
            return prop("2s32", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "x")
        }
        export function v2u32(): PropertyDecorator
        export function v2u32<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v2u32<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): PropertyDecorator
        export function v2u32<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): PropertyDecorator {
            return prop("2u32", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "x")
        }
        export function v2s64(): PropertyDecorator
        export function v2s64<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v2s64<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2B) => TTarget, convertBack?: (target: TTarget) => Vector2B, fallbackValue?: Vector2B): PropertyDecorator
        export function v2s64<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2B) => TTarget, convertBack?: (target: TTarget) => Vector2B, fallbackValue?: Vector2B): PropertyDecorator {
            return prop("2s64", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "x")
        }
        export function v2u64(): PropertyDecorator
        export function v2u64<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v2u64<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2B) => TTarget, convertBack?: (target: TTarget) => Vector2B, fallbackValue?: Vector2B): PropertyDecorator
        export function v2u64<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2B) => TTarget, convertBack?: (target: TTarget) => Vector2B, fallbackValue?: Vector2B): PropertyDecorator {
            return prop("2u64", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "x")
        }
        export function v2f(): PropertyDecorator
        export function v2f<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v2f<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): PropertyDecorator
        export function v2f<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): PropertyDecorator {
            return prop("2f", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "x")
        }
        export function v2d(): PropertyDecorator
        export function v2d<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v2d<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): PropertyDecorator
        export function v2d<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): PropertyDecorator {
            return prop("2d", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "x")
        }
        export function v2b(): PropertyDecorator
        export function v2b<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v2b<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): PropertyDecorator
        export function v2b<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): PropertyDecorator {
            return prop("2b", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "x")
        }
        export function v3s8(): PropertyDecorator
        export function v3s8<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v3s8<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): PropertyDecorator
        export function v3s8<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): PropertyDecorator {
            return prop("3s8", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "x")
        }
        export function v3u8(): PropertyDecorator
        export function v3u8<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v3u8<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): PropertyDecorator
        export function v3u8<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): PropertyDecorator {
            return prop("3u8", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "x")
        }
        export function v3s16(): PropertyDecorator
        export function v3s16<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v3s16<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): PropertyDecorator
        export function v3s16<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): PropertyDecorator {
            return prop("3s16", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "x")
        }
        export function v3u16(): PropertyDecorator
        export function v3u16<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v3u16<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): PropertyDecorator
        export function v3u16<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): PropertyDecorator {
            return prop("3u16", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "x")
        }
        export function v3s32(): PropertyDecorator
        export function v3s32<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v3s32<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): PropertyDecorator
        export function v3s32<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): PropertyDecorator {
            return prop("3s32", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "x")
        }
        export function v3u32(): PropertyDecorator
        export function v3u32<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v3u32<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): PropertyDecorator
        export function v3u32<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): PropertyDecorator {
            return prop("3u32", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "x")
        }
        export function v3s64(): PropertyDecorator
        export function v3s64<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v3s64<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3B) => TTarget, convertBack?: (target: TTarget) => Vector3B, fallbackValue?: Vector3B): PropertyDecorator
        export function v3s64<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3B) => TTarget, convertBack?: (target: TTarget) => Vector3B, fallbackValue?: Vector3B): PropertyDecorator {
            return prop("3s64", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "x")
        }
        export function v3u64(): PropertyDecorator
        export function v3u64<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v3u64<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3B) => TTarget, convertBack?: (target: TTarget) => Vector3B, fallbackValue?: Vector3B): PropertyDecorator
        export function v3u64<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3B) => TTarget, convertBack?: (target: TTarget) => Vector3B, fallbackValue?: Vector3B): PropertyDecorator {
            return prop("3u64", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "x")
        }
        export function v3f(): PropertyDecorator
        export function v3f<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v3f<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): PropertyDecorator
        export function v3f<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): PropertyDecorator {
            return prop("3f", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "x")
        }
        export function v3d(): PropertyDecorator
        export function v3d<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v3d<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): PropertyDecorator
        export function v3d<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): PropertyDecorator {
            return prop("3d", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "x")
        }
        export function v3b(): PropertyDecorator
        export function v3b<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v3b<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): PropertyDecorator
        export function v3b<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): PropertyDecorator {
            return prop("3b", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "x")
        }
        export function v4s8(): PropertyDecorator
        export function v4s8<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v4s8<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): PropertyDecorator
        export function v4s8<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): PropertyDecorator {
            return prop("4s8", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "x")
        }
        export function v4u8(): PropertyDecorator
        export function v4u8<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v4u8<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): PropertyDecorator
        export function v4u8<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): PropertyDecorator {
            return prop("4u8", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "x")
        }
        export function v4s16(): PropertyDecorator
        export function v4s16<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v4s16<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): PropertyDecorator
        export function v4s16<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): PropertyDecorator {
            return prop("4s16", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "x")
        }
        export function v4u16(): PropertyDecorator
        export function v4u16<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v4u16<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): PropertyDecorator
        export function v4u16<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): PropertyDecorator {
            return prop("4u16", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "x")
        }
        export function v4s32(): PropertyDecorator
        export function v4s32<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v4s32<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): PropertyDecorator
        export function v4s32<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): PropertyDecorator {
            return prop("4s32", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "x")
        }
        export function v4u32(): PropertyDecorator
        export function v4u32<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v4u32<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): PropertyDecorator
        export function v4u32<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): PropertyDecorator {
            return prop("4u32", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "x")
        }
        export function v4s64(): PropertyDecorator
        export function v4s64<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v4s64<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4B) => TTarget, convertBack?: (target: TTarget) => Vector4B, fallbackValue?: Vector4B): PropertyDecorator
        export function v4s64<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4B) => TTarget, convertBack?: (target: TTarget) => Vector4B, fallbackValue?: Vector4B): PropertyDecorator {
            return prop("4s64", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "x")
        }
        export function v4u64(): PropertyDecorator
        export function v4u64<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v4u64<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4B) => TTarget, convertBack?: (target: TTarget) => Vector4B, fallbackValue?: Vector4B): PropertyDecorator
        export function v4u64<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4B) => TTarget, convertBack?: (target: TTarget) => Vector4B, fallbackValue?: Vector4B): PropertyDecorator {
            return prop("4u64", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "x")
        }
        export function v4f(): PropertyDecorator
        export function v4f<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v4f<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): PropertyDecorator
        export function v4f<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): PropertyDecorator {
            return prop("4f", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "x")
        }
        export function v4d(): PropertyDecorator
        export function v4d<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v4d<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): PropertyDecorator
        export function v4d<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): PropertyDecorator {
            return prop("4d", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "x")
        }
        export function v4b(): PropertyDecorator
        export function v4b<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v4b<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): PropertyDecorator
        export function v4b<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): PropertyDecorator {
            return prop("4b", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "x")
        }
        export function vs8(): PropertyDecorator
        export function vs8<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function vs8<TTarget = VectorB, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: VectorB) => TTarget, convertBack?: (target: TTarget) => VectorB, fallbackValue?: VectorB): PropertyDecorator
        export function vs8<TTarget = VectorB, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: VectorB) => TTarget, convertBack?: (target: TTarget) => VectorB, fallbackValue?: VectorB): PropertyDecorator {
            return prop("vs8", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "x")
        }
        export function vu8(): PropertyDecorator
        export function vu8<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function vu8<TTarget = VectorB, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: VectorB) => TTarget, convertBack?: (target: TTarget) => VectorB, fallbackValue?: VectorB): PropertyDecorator
        export function vu8<TTarget = VectorB, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: VectorB) => TTarget, convertBack?: (target: TTarget) => VectorB, fallbackValue?: VectorB): PropertyDecorator {
            return prop("vu8", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "x")
        }
        export function vs16(): PropertyDecorator
        export function vs16<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function vs16<TTarget = VectorB, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: VectorB) => TTarget, convertBack?: (target: TTarget) => VectorB, fallbackValue?: VectorB): PropertyDecorator
        export function vs16<TTarget = VectorB, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: VectorB) => TTarget, convertBack?: (target: TTarget) => VectorB, fallbackValue?: VectorB): PropertyDecorator {
            return prop("vs16", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "x")
        }
        export function vu16(): PropertyDecorator
        export function vu16<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function vu16<TTarget = VectorB, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: VectorB) => TTarget, convertBack?: (target: TTarget) => VectorB, fallbackValue?: VectorB): PropertyDecorator
        export function vu16<TTarget = VectorB, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: VectorB) => TTarget, convertBack?: (target: TTarget) => VectorB, fallbackValue?: VectorB): PropertyDecorator {
            return prop("vu16", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "x")
        }
        export function vb(): PropertyDecorator
        export function vb<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function vb<TTarget = Vector, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector) => TTarget, convertBack?: (target: TTarget) => Vector, fallbackValue?: Vector): PropertyDecorator
        export function vb<TTarget = Vector, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector) => TTarget, convertBack?: (target: TTarget) => Vector, fallbackValue?: Vector): PropertyDecorator {
            return prop("vb", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "x")
        }
        export function bin(): PropertyDecorator
        export function bin<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function bin<TTarget = Buffer, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Buffer) => TTarget, convertBack?: (target: TTarget) => Buffer, fallbackValue?: Buffer): PropertyDecorator
        export function bin<TTarget = Buffer, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Buffer) => TTarget, convertBack?: (target: TTarget) => Buffer, fallbackValue?: Buffer): PropertyDecorator {
            return prop("bin", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "x")
        }
        export function ip4(): PropertyDecorator
        export function ip4<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function ip4<TTarget = number[], TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: number[]) => TTarget, convertBack?: (target: TTarget) => number[], fallbackValue?: number[]): PropertyDecorator
        export function ip4<TTarget = number[], TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: number[]) => TTarget, convertBack?: (target: TTarget) => number[], fallbackValue?: number[]): PropertyDecorator {
            return prop("ip4", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "x")
        }
        export function str(): PropertyDecorator
        export function str<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function str<TTarget = string, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: string) => TTarget, convertBack?: (target: TTarget) => string, fallbackValue?: string): PropertyDecorator
        export function str<TTarget = string, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: string) => TTarget, convertBack?: (target: TTarget) => string, fallbackValue?: string): PropertyDecorator {
            return prop("str", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "x")
        }
        export function time(): PropertyDecorator
        export function time<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function time<TTarget = Date, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Date) => TTarget, convertBack?: (target: TTarget) => Date, fallbackValue?: Date): PropertyDecorator
        export function time<TTarget = Date, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Date) => TTarget, convertBack?: (target: TTarget) => Date, fallbackValue?: Date): PropertyDecorator {
            return prop("time", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "x")
        }
        export function attr(): PropertyDecorator
        export function attr<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function attr<TTarget = string, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: string) => TTarget, convertBack?: (target: TTarget) => string, fallbackValue?: string): PropertyDecorator
        export function attr<TTarget = string, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: string) => TTarget, convertBack?: (target: TTarget) => string, fallbackValue?: string): PropertyDecorator {
            return prop("xattr", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "x")
        }
        export function obj<T extends object>(subMap: XSubMap<T>): PropertyDecorator
        export function obj<T extends object, TXKey extends string>(xKey: TXKey, subMap: XSubMap<T>): PropertyDecorator
        export function obj<T extends object, TTarget = T, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: T) => TTarget, convertBack?: (target: TTarget) => T, fallbackValue?: T): PropertyDecorator
        export function obj<T extends object, TTarget = T, TXKey extends string | undefined = undefined>(xKeyOrSubMap?: TXKey | XSubMap<T>, typeOrSubMap?: Type<unknown> | XSubMap<T>, convert?: (source: T) => TTarget, convertBack?: (target: TTarget) => T, fallbackValue?: T, subMap?: XSubMap<T>): PropertyDecorator {
            if (typeof xKeyOrSubMap !== "string") return prop(undefined, undefined, undefined, undefined, undefined, undefined, undefined, xKeyOrSubMap)
            if (typeOrSubMap?.constructor && !typeOrSubMap?.constructor.toString().startsWith("class")) return prop(undefined, xKeyOrSubMap, undefined, undefined, undefined, undefined, undefined, typeOrSubMap as XSubMap<T>)
            return prop(undefined, xKeyOrSubMap, typeOrSubMap as Type<T>, convert, convertBack, fallbackValue, undefined, subMap)
        }
        export function type<T>(type: Type<T> | TypeToken<T>): PropertyDecorator
        export function type<T, TXKey extends string>(xKey: TXKey, type: Type<T> | TypeToken<T>): PropertyDecorator
        export function type<T, TTarget = T, TXKey extends string | undefined = undefined>(xKey: TXKey, type: Type<T> | TypeToken<T>, convert?: (source: T) => TTarget, convertBack?: (target: TTarget) => T, fallbackValue?: T): PropertyDecorator
        export function type<T, TTarget = T, TXKey extends string | undefined = undefined>(typeOrXKey: TXKey | Type<T> | TypeToken<T>, type?: Type<T> | TypeToken<T>, convert?: (source: T) => TTarget, convertBack?: (target: TTarget) => T, fallbackValue?: T): PropertyDecorator {
            const xKey = typeof typeOrXKey === "string" ? typeOrXKey : undefined
            type ??= typeof typeOrXKey === "string" ? undefined : typeOrXKey
            return prop(undefined, xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "x")
        }
        export function a<TE>(elType: Type<TE>): PropertyDecorator
        export function a<TE>(elMap: XMap<TE, XTypeExtended, unknown>): PropertyDecorator
        export function a<TE, TXKey extends string>(elType: Type<TE>, xKey: TXKey): PropertyDecorator
        export function a<TE, TXKey extends string>(elMap: XMap<TE, XTypeExtended, unknown>, xKey: TXKey): PropertyDecorator
        export function a<TE, TTarget = TE[], TXKey extends string | undefined = undefined>(elType: Type<TE>, xKey?: TXKey, convert?: (source: TE[]) => TTarget, convertBack?: (target: TTarget) => TE[], fallbackValue?: TE[]): PropertyDecorator
        export function a<TE, TTarget = TE[], TXKey extends string | undefined = undefined>(elMap: XMap<TE, XTypeExtended, unknown>, xKey?: TXKey, convert?: (source: TE[]) => TTarget, convertBack?: (target: TTarget) => TE[], fallbackValue?: TE[]): PropertyDecorator
        export function a<TE, TTarget = TE[], TXKey extends string | undefined = undefined>(elMapOrType: Type<TE> | XMap<TE, XTypeExtended, unknown>, xKey?: TXKey, convert?: (source: TE[]) => TTarget, convertBack?: (target: TTarget) => TE[], fallbackValue?: TE[]): PropertyDecorator {
            let map: XMap<TE, XTypeExtended, unknown>
            let type: Type<TE> | TypeToken<TE>
            if (!isTypeOrToken(elMapOrType)) map = elMapOrType
            else type = elMapOrType
            return prop(undefined, xKey, undefined, convert, convertBack, fallbackValue, type, undefined, map, "x")
        }
        export function aw<TE>(wrapperKey: string, elType: Type<TE>, map?: XMap<unknown, XTypeExtended>): PropertyDecorator
        export function aw<TE, TXKey extends string>(xKey: TXKey, wrapperKey: string, elType: Type<TE>, map?: XMap<unknown, XTypeExtended>): PropertyDecorator
        export function aw<TE, TXKey extends string | undefined = undefined>(xKeyOrWrapperKey: string | TXKey, wrapperKeyOrElType: string | Type<TE>, elTypeOrMap?: Type<TE> | TypeToken<TE> | XMap<unknown, XTypeExtended>, map?: XMap<unknown, XTypeExtended>): PropertyDecorator { // array wrapper, structure like { key?: Type[] }
            const wrapperKey = typeof wrapperKeyOrElType === "string" ? wrapperKeyOrElType : xKeyOrWrapperKey as string
            const xKey = typeof wrapperKeyOrElType === "string" ? xKeyOrWrapperKey as TXKey : undefined
            const elType = typeof wrapperKeyOrElType !== "string" ? wrapperKeyOrElType : isTypeOrToken(elTypeOrMap) ? elTypeOrMap : undefined
            map ??= !isTypeOrToken(elTypeOrMap) ? elTypeOrMap : map
            const c = class __AW__ {
                static __map__ = Object.assign({
                    [wrapperKey]: {
                        $el: elType
                    }
                }, map)
            }
            return prop<{ [K in string]: TE[] }, undefined, { [K in string]: TE[] }, TXKey>(undefined, xKey, c as Type<ArrayWrapper<string, TE>>, undefined, undefined, {}, undefined, undefined, undefined, "x")
        }
        export function ignore(): PropertyDecorator {
            return prop("xignore", undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, "x")
        }
    }
    export namespace ToO {
        export function s8(): PropertyDecorator
        export function s8<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function s8<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): PropertyDecorator
        export function s8<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): PropertyDecorator {
            return prop("s8", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "o")
        }
        export function u8(): PropertyDecorator
        export function u8<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function u8<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): PropertyDecorator
        export function u8<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): PropertyDecorator {
            return prop("u8", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "o")
        }
        export function s16(): PropertyDecorator
        export function s16<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function s16<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): PropertyDecorator
        export function s16<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): PropertyDecorator {
            return prop("s16", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "o")
        }
        export function u16(): PropertyDecorator
        export function u16<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function u16<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): PropertyDecorator
        export function u16<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): PropertyDecorator {
            return prop("u16", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "o")
        }
        export function s32(): PropertyDecorator
        export function s32<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function s32<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): PropertyDecorator
        export function s32<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): PropertyDecorator {
            return prop("s32", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "o")
        }
        export function u32(): PropertyDecorator
        export function u32<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function u32<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): PropertyDecorator
        export function u32<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): PropertyDecorator {
            return prop("u32", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "o")
        }
        export function s64(): PropertyDecorator
        export function s64<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function s64<TTarget = BigIntOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: BigIntOrArray) => TTarget, convertBack?: (target: TTarget) => BigIntOrArray, fallbackValue?: BigIntOrArray): PropertyDecorator
        export function s64<TTarget = BigIntOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: BigIntOrArray) => TTarget, convertBack?: (target: TTarget) => BigIntOrArray, fallbackValue?: BigIntOrArray): PropertyDecorator {
            return prop("s64", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "o")
        }
        export function u64(): PropertyDecorator
        export function u64<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function u64<TTarget = BigIntOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: BigIntOrArray) => TTarget, convertBack?: (target: TTarget) => BigIntOrArray, fallbackValue?: BigIntOrArray): PropertyDecorator
        export function u64<TTarget = BigIntOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: BigIntOrArray) => TTarget, convertBack?: (target: TTarget) => BigIntOrArray, fallbackValue?: BigIntOrArray): PropertyDecorator {
            return prop("u64", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "o")
        }
        export function float(): PropertyDecorator
        export function float<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function float<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): PropertyDecorator
        export function float<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): PropertyDecorator {
            return prop("float", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "o")
        }
        export function double(): PropertyDecorator
        export function double<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function double<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): PropertyDecorator
        export function double<TTarget = NumberOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: NumberOrArray) => TTarget, convertBack?: (target: TTarget) => NumberOrArray, fallbackValue?: NumberOrArray): PropertyDecorator {
            return prop("double", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "o")
        }
        export function bool(): PropertyDecorator
        export function bool<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function bool<TTarget = BooleanOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: BooleanOrArray) => TTarget, convertBack?: (target: TTarget) => BooleanOrArray, fallbackValue?: BooleanOrArray): PropertyDecorator
        export function bool<TTarget = BooleanOrArray, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: BooleanOrArray) => TTarget, convertBack?: (target: TTarget) => BooleanOrArray, fallbackValue?: BooleanOrArray): PropertyDecorator {
            return prop("bool", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "o")
        }
        export function v2s8(): PropertyDecorator
        export function v2s8<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v2s8<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): PropertyDecorator
        export function v2s8<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): PropertyDecorator {
            return prop("2s8", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "o")
        }
        export function v2u8(): PropertyDecorator
        export function v2u8<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v2u8<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): PropertyDecorator
        export function v2u8<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): PropertyDecorator {
            return prop("2u8", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "o")
        }
        export function v2s16(): PropertyDecorator
        export function v2s16<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v2s16<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): PropertyDecorator
        export function v2s16<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): PropertyDecorator {
            return prop("2s16", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "o")
        }
        export function v2u16(): PropertyDecorator
        export function v2u16<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v2u16<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): PropertyDecorator
        export function v2u16<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): PropertyDecorator {
            return prop("2u16", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "o")
        }
        export function v2s32(): PropertyDecorator
        export function v2s32<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v2s32<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): PropertyDecorator
        export function v2s32<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): PropertyDecorator {
            return prop("2s32", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "o")
        }
        export function v2u32(): PropertyDecorator
        export function v2u32<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v2u32<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): PropertyDecorator
        export function v2u32<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): PropertyDecorator {
            return prop("2u32", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "o")
        }
        export function v2s64(): PropertyDecorator
        export function v2s64<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v2s64<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2B) => TTarget, convertBack?: (target: TTarget) => Vector2B, fallbackValue?: Vector2B): PropertyDecorator
        export function v2s64<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2B) => TTarget, convertBack?: (target: TTarget) => Vector2B, fallbackValue?: Vector2B): PropertyDecorator {
            return prop("2s64", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "o")
        }
        export function v2u64(): PropertyDecorator
        export function v2u64<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v2u64<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2B) => TTarget, convertBack?: (target: TTarget) => Vector2B, fallbackValue?: Vector2B): PropertyDecorator
        export function v2u64<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2B) => TTarget, convertBack?: (target: TTarget) => Vector2B, fallbackValue?: Vector2B): PropertyDecorator {
            return prop("2u64", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "o")
        }
        export function v2f(): PropertyDecorator
        export function v2f<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v2f<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): PropertyDecorator
        export function v2f<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): PropertyDecorator {
            return prop("2f", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "o")
        }
        export function v2d(): PropertyDecorator
        export function v2d<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v2d<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): PropertyDecorator
        export function v2d<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): PropertyDecorator {
            return prop("2d", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "o")
        }
        export function v2b(): PropertyDecorator
        export function v2b<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v2b<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): PropertyDecorator
        export function v2b<TTarget = Vector2, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector2) => TTarget, convertBack?: (target: TTarget) => Vector2, fallbackValue?: Vector2): PropertyDecorator {
            return prop("2b", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "o")
        }
        export function v3s8(): PropertyDecorator
        export function v3s8<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v3s8<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): PropertyDecorator
        export function v3s8<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): PropertyDecorator {
            return prop("3s8", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "o")
        }
        export function v3u8(): PropertyDecorator
        export function v3u8<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v3u8<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): PropertyDecorator
        export function v3u8<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): PropertyDecorator {
            return prop("3u8", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "o")
        }
        export function v3s16(): PropertyDecorator
        export function v3s16<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v3s16<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): PropertyDecorator
        export function v3s16<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): PropertyDecorator {
            return prop("3s16", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "o")
        }
        export function v3u16(): PropertyDecorator
        export function v3u16<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v3u16<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): PropertyDecorator
        export function v3u16<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): PropertyDecorator {
            return prop("3u16", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "o")
        }
        export function v3s32(): PropertyDecorator
        export function v3s32<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v3s32<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): PropertyDecorator
        export function v3s32<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): PropertyDecorator {
            return prop("3s32", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "o")
        }
        export function v3u32(): PropertyDecorator
        export function v3u32<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v3u32<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): PropertyDecorator
        export function v3u32<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): PropertyDecorator {
            return prop("3u32", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "o")
        }
        export function v3s64(): PropertyDecorator
        export function v3s64<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v3s64<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3B) => TTarget, convertBack?: (target: TTarget) => Vector3B, fallbackValue?: Vector3B): PropertyDecorator
        export function v3s64<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3B) => TTarget, convertBack?: (target: TTarget) => Vector3B, fallbackValue?: Vector3B): PropertyDecorator {
            return prop("3s64", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "o")
        }
        export function v3u64(): PropertyDecorator
        export function v3u64<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v3u64<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3B) => TTarget, convertBack?: (target: TTarget) => Vector3B, fallbackValue?: Vector3B): PropertyDecorator
        export function v3u64<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3B) => TTarget, convertBack?: (target: TTarget) => Vector3B, fallbackValue?: Vector3B): PropertyDecorator {
            return prop("3u64", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "o")
        }
        export function v3f(): PropertyDecorator
        export function v3f<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v3f<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): PropertyDecorator
        export function v3f<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): PropertyDecorator {
            return prop("3f", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "o")
        }
        export function v3d(): PropertyDecorator
        export function v3d<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v3d<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): PropertyDecorator
        export function v3d<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): PropertyDecorator {
            return prop("3d", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "o")
        }
        export function v3b(): PropertyDecorator
        export function v3b<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v3b<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): PropertyDecorator
        export function v3b<TTarget = Vector3, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector3) => TTarget, convertBack?: (target: TTarget) => Vector3, fallbackValue?: Vector3): PropertyDecorator {
            return prop("3b", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "o")
        }
        export function v4s8(): PropertyDecorator
        export function v4s8<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v4s8<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): PropertyDecorator
        export function v4s8<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): PropertyDecorator {
            return prop("4s8", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "o")
        }
        export function v4u8(): PropertyDecorator
        export function v4u8<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v4u8<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): PropertyDecorator
        export function v4u8<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): PropertyDecorator {
            return prop("4u8", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "o")
        }
        export function v4s16(): PropertyDecorator
        export function v4s16<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v4s16<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): PropertyDecorator
        export function v4s16<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): PropertyDecorator {
            return prop("4s16", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "o")
        }
        export function v4u16(): PropertyDecorator
        export function v4u16<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v4u16<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): PropertyDecorator
        export function v4u16<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): PropertyDecorator {
            return prop("4u16", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "o")
        }
        export function v4s32(): PropertyDecorator
        export function v4s32<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v4s32<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): PropertyDecorator
        export function v4s32<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): PropertyDecorator {
            return prop("4s32", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "o")
        }
        export function v4u32(): PropertyDecorator
        export function v4u32<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v4u32<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): PropertyDecorator
        export function v4u32<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): PropertyDecorator {
            return prop("4u32", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "o")
        }
        export function v4s64(): PropertyDecorator
        export function v4s64<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v4s64<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4B) => TTarget, convertBack?: (target: TTarget) => Vector4B, fallbackValue?: Vector4B): PropertyDecorator
        export function v4s64<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4B) => TTarget, convertBack?: (target: TTarget) => Vector4B, fallbackValue?: Vector4B): PropertyDecorator {
            return prop("4s64", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "o")
        }
        export function v4u64(): PropertyDecorator
        export function v4u64<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v4u64<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4B) => TTarget, convertBack?: (target: TTarget) => Vector4B, fallbackValue?: Vector4B): PropertyDecorator
        export function v4u64<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4B) => TTarget, convertBack?: (target: TTarget) => Vector4B, fallbackValue?: Vector4B): PropertyDecorator {
            return prop("4u64", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "o")
        }
        export function v4f(): PropertyDecorator
        export function v4f<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v4f<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): PropertyDecorator
        export function v4f<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): PropertyDecorator {
            return prop("4f", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "o")
        }
        export function v4d(): PropertyDecorator
        export function v4d<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v4d<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): PropertyDecorator
        export function v4d<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): PropertyDecorator {
            return prop("4d", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "o")
        }
        export function v4b(): PropertyDecorator
        export function v4b<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function v4b<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): PropertyDecorator
        export function v4b<TTarget = Vector4, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector4) => TTarget, convertBack?: (target: TTarget) => Vector4, fallbackValue?: Vector4): PropertyDecorator {
            return prop("4b", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "o")
        }
        export function vs8(): PropertyDecorator
        export function vs8<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function vs8<TTarget = VectorB, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: VectorB) => TTarget, convertBack?: (target: TTarget) => VectorB, fallbackValue?: VectorB): PropertyDecorator
        export function vs8<TTarget = VectorB, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: VectorB) => TTarget, convertBack?: (target: TTarget) => VectorB, fallbackValue?: VectorB): PropertyDecorator {
            return prop("vs8", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "o")
        }
        export function vu8(): PropertyDecorator
        export function vu8<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function vu8<TTarget = VectorB, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: VectorB) => TTarget, convertBack?: (target: TTarget) => VectorB, fallbackValue?: VectorB): PropertyDecorator
        export function vu8<TTarget = VectorB, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: VectorB) => TTarget, convertBack?: (target: TTarget) => VectorB, fallbackValue?: VectorB): PropertyDecorator {
            return prop("vu8", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "o")
        }
        export function vs16(): PropertyDecorator
        export function vs16<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function vs16<TTarget = VectorB, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: VectorB) => TTarget, convertBack?: (target: TTarget) => VectorB, fallbackValue?: VectorB): PropertyDecorator
        export function vs16<TTarget = VectorB, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: VectorB) => TTarget, convertBack?: (target: TTarget) => VectorB, fallbackValue?: VectorB): PropertyDecorator {
            return prop("vs16", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "o")
        }
        export function vu16(): PropertyDecorator
        export function vu16<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function vu16<TTarget = VectorB, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: VectorB) => TTarget, convertBack?: (target: TTarget) => VectorB, fallbackValue?: VectorB): PropertyDecorator
        export function vu16<TTarget = VectorB, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: VectorB) => TTarget, convertBack?: (target: TTarget) => VectorB, fallbackValue?: VectorB): PropertyDecorator {
            return prop("vu16", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "o")
        }
        export function vb(): PropertyDecorator
        export function vb<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function vb<TTarget = Vector, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector) => TTarget, convertBack?: (target: TTarget) => Vector, fallbackValue?: Vector): PropertyDecorator
        export function vb<TTarget = Vector, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Vector) => TTarget, convertBack?: (target: TTarget) => Vector, fallbackValue?: Vector): PropertyDecorator {
            return prop("vb", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "o")
        }
        export function bin(): PropertyDecorator
        export function bin<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function bin<TTarget = Buffer, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Buffer) => TTarget, convertBack?: (target: TTarget) => Buffer, fallbackValue?: Buffer): PropertyDecorator
        export function bin<TTarget = Buffer, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Buffer) => TTarget, convertBack?: (target: TTarget) => Buffer, fallbackValue?: Buffer): PropertyDecorator {
            return prop("bin", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "o")
        }
        export function ip4(): PropertyDecorator
        export function ip4<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function ip4<TTarget = number[], TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: number[]) => TTarget, convertBack?: (target: TTarget) => number[], fallbackValue?: number[]): PropertyDecorator
        export function ip4<TTarget = number[], TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: number[]) => TTarget, convertBack?: (target: TTarget) => number[], fallbackValue?: number[]): PropertyDecorator {
            return prop("ip4", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "o")
        }
        export function str(): PropertyDecorator
        export function str<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function str<TTarget = string, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: string) => TTarget, convertBack?: (target: TTarget) => string, fallbackValue?: string): PropertyDecorator
        export function str<TTarget = string, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: string) => TTarget, convertBack?: (target: TTarget) => string, fallbackValue?: string): PropertyDecorator {
            return prop("str", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "o")
        }
        export function time(): PropertyDecorator
        export function time<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function time<TTarget = Date, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Date) => TTarget, convertBack?: (target: TTarget) => Date, fallbackValue?: Date): PropertyDecorator
        export function time<TTarget = Date, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: Date) => TTarget, convertBack?: (target: TTarget) => Date, fallbackValue?: Date): PropertyDecorator {
            return prop("time", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "o")
        }
        export function attr(): PropertyDecorator
        export function attr<TXKey extends string>(xKey: TXKey): PropertyDecorator
        export function attr<TTarget = string, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: string) => TTarget, convertBack?: (target: TTarget) => string, fallbackValue?: string): PropertyDecorator
        export function attr<TTarget = string, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: string) => TTarget, convertBack?: (target: TTarget) => string, fallbackValue?: string): PropertyDecorator {
            return prop("xattr", xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "o")
        }
        export function obj<T extends object>(subMap: XSubMap<T>): PropertyDecorator
        export function obj<T extends object, TXKey extends string>(xKey: TXKey, subMap: XSubMap<T>): PropertyDecorator
        export function obj<T extends object, TTarget = T, TXKey extends string | undefined = undefined>(xKey?: TXKey, type?: Type<unknown>, convert?: (source: T) => TTarget, convertBack?: (target: TTarget) => T, fallbackValue?: T): PropertyDecorator
        export function obj<T extends object, TTarget = T, TXKey extends string | undefined = undefined>(xKeyOrSubMap?: TXKey | XSubMap<T>, typeOrSubMap?: Type<unknown> | XSubMap<T>, convert?: (source: T) => TTarget, convertBack?: (target: TTarget) => T, fallbackValue?: T, subMap?: XSubMap<T>): PropertyDecorator {
            if (typeof xKeyOrSubMap !== "string") return prop(undefined, undefined, undefined, undefined, undefined, undefined, undefined, xKeyOrSubMap)
            if (typeOrSubMap?.constructor && !typeOrSubMap?.constructor.toString().startsWith("class")) return prop(undefined, xKeyOrSubMap, undefined, undefined, undefined, undefined, undefined, typeOrSubMap as XSubMap<T>)
            return prop(undefined, xKeyOrSubMap, typeOrSubMap as Type<T>, convert, convertBack, fallbackValue, undefined, subMap)
        }
        export function type<T>(type: Type<T>): PropertyDecorator
        export function type<T, TXKey extends string>(xKey: TXKey, type: Type<T>): PropertyDecorator
        export function type<T, TTarget = T, TXKey extends string | undefined = undefined>(xKey: TXKey, type: Type<T>, convert?: (source: T) => TTarget, convertBack?: (target: TTarget) => T, fallbackValue?: T): PropertyDecorator
        export function type<T, TTarget = T, TXKey extends string | undefined = undefined>(typeOrXKey: TXKey | Type<T>, type?: Type<T>, convert?: (source: T) => TTarget, convertBack?: (target: TTarget) => T, fallbackValue?: T): PropertyDecorator {
            const xKey = typeof typeOrXKey === "string" ? typeOrXKey : undefined
            type ??= typeof typeOrXKey === "string" ? undefined : typeOrXKey
            return prop(undefined, xKey, type, convert, convertBack, fallbackValue, undefined, undefined, undefined, "o")
        }
        export function a<TE>(elType: Type<TE>): PropertyDecorator
        export function a<TE>(elMap: XMap<TE, XTypeExtended, unknown>): PropertyDecorator
        export function a<TE, TXKey extends string>(elType: Type<TE>, xKey: TXKey): PropertyDecorator
        export function a<TE, TXKey extends string>(elMap: XMap<TE, XTypeExtended, unknown>, xKey: TXKey): PropertyDecorator
        export function a<TE, TTarget = TE[], TXKey extends string | undefined = undefined>(elType: Type<TE>, xKey?: TXKey, convert?: (source: TE[]) => TTarget, convertBack?: (target: TTarget) => TE[], fallbackValue?: TE[]): PropertyDecorator
        export function a<TE, TTarget = TE[], TXKey extends string | undefined = undefined>(elMap: XMap<TE, XTypeExtended, unknown>, xKey?: TXKey, convert?: (source: TE[]) => TTarget, convertBack?: (target: TTarget) => TE[], fallbackValue?: TE[]): PropertyDecorator
        export function a<TE, TTarget = TE[], TXKey extends string | undefined = undefined>(elMapOrType: Type<TE> | XMap<TE, XTypeExtended, unknown>, xKey?: TXKey, convert?: (source: TE[]) => TTarget, convertBack?: (target: TTarget) => TE[], fallbackValue?: TE[]): PropertyDecorator {
            let map: XMap<TE, XTypeExtended, unknown>
            let type: Type<TE> | TypeToken<TE>
            if (!isTypeOrToken(elMapOrType)) map = elMapOrType
            else type = elMapOrType
            return prop(undefined, xKey, undefined, convert, convertBack, fallbackValue, type, undefined, map, "o")
        }
        export function aw<TE>(wrapperKey: string, elType: Type<TE>, map?: XMap<unknown, XTypeExtended>): PropertyDecorator
        export function aw<TE, TXKey extends string>(xKey: TXKey, wrapperKey: string, elType: Type<TE>, map?: XMap<unknown, XTypeExtended>): PropertyDecorator
        export function aw<TE, TXKey extends string | undefined = undefined>(xKeyOrWrapperKey: string | TXKey, wrapperKeyOrElType: string | Type<TE>, elTypeOrMap?: Type<TE> | TypeToken<TE> | XMap<unknown, XTypeExtended>, map?: XMap<unknown, XTypeExtended>): PropertyDecorator { // array wrapper, structure like { key?: Type[] }
            const wrapperKey = typeof wrapperKeyOrElType === "string" ? wrapperKeyOrElType : xKeyOrWrapperKey as string
            const xKey = typeof wrapperKeyOrElType === "string" ? xKeyOrWrapperKey as TXKey : undefined
            const elType = typeof wrapperKeyOrElType !== "string" ? wrapperKeyOrElType : isTypeOrToken(elTypeOrMap) ? elTypeOrMap : undefined
            map ??= !isTypeOrToken(elTypeOrMap) ? elTypeOrMap : map
            const c = class __AW__ {
                static __map__ = Object.assign({
                    [wrapperKey]: {
                        $el: elType
                    }
                }, map)
            }
            return prop<{ [K in string]: TE[] }, undefined, { [K in string]: TE[] }, TXKey>(undefined, xKey, c as Type<ArrayWrapper<string, TE>>, undefined, undefined, {}, undefined, undefined, undefined, "o")
        }
        export function ignore(): PropertyDecorator {
            return prop("xignore", undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, "o")
        }
    }
}
