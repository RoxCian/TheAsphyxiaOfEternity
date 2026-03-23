import { DBBigInt, BufferArray, NumberGroup } from "../db/db_types"
import { Type, TypeToken } from "../types"

export type XArrayType = KNumberType | KBigIntType
export type XGroupType = KNumberGroupType | KBigIntGroupType
export type XType = XArrayType | XGroupType | "str" | "bin" | "ip4" | "bool"
export type XTypeExtended = XType | null | "xignore" | "xattr" | "xvalue"

export type XKey<T> = keyof T & (
    T extends string ? Exclude<keyof T, keyof string> :
    T extends Buffer ? Exclude<keyof T, keyof Buffer> :
    T extends boolean ? Exclude<keyof T, keyof boolean> :
    T extends number[] | bigint[] | boolean[] ? Exclude<keyof T, (keyof number[]) | (keyof bigint[]) | (keyof boolean[])> :
    T extends any[] ? Exclude<keyof T, keyof any[]> | number :
    T extends number ? Exclude<keyof T, keyof number> :
    T extends bigint | DBBigInt ? Exclude<keyof T, keyof bigint> :
    T extends BufferArray ? Exclude<keyof T, keyof BufferArray> :
    T extends NumberGroup<infer TGroup> ? Exclude<keyof T, keyof NumberGroup<TGroup>> :
    keyof T)

export type XTypeConvert<T extends string | Buffer | number | bigint | boolean | number[] | bigint[] | unknown> =
    T extends string ? "str" | "xtext" | "xattr" :
    T extends Buffer ? "bin" :
    T extends number ? KNumberType | "ip4" | "bool" :
    T extends bigint | DBBigInt ? KBigIntType :
    T extends boolean | boolean[] ? "bool" :
    T extends number[] ? KNumberType : // XARRAY 
    T extends bigint[] ? KBigIntType : // XARRAY 
    T extends NumberGroup<number[]> ? KNumberGroupType :
    T extends NumberGroup<bigint[]> ? KBigIntGroupType :
    T extends BufferArray ? "u8" | "s8" :
    never
export type XSubMap<T> = {
    [K in XKey<T>]?: XMap<T[K], XTypeExtended, unknown, string | undefined> | XMapNonEquivalent<T[K], XTypeExtended, unknown, string | undefined>
}
export type XMap<T, TXType extends XTypeExtended, TTarget = T, TXKey extends string | undefined = undefined> = {
    $type?: Type<T>
    $xType?: TXType
    $xKey?: TXKey
    $convert?: (source: T) => TTarget
    $convertBack?: (target: TTarget) => T
    $fallbackValue?: TXType extends "xignore" ? T : never
} & (T extends any[] ? T extends Array<infer TE> ? {
    $el?: Type<TE> | TypeToken<TE> | TypeNoneEquivalent<TE>
    $elSubMap?: XMap<TE, XTypeExtended, unknown, string | undefined> | XMapNonEquivalent<TE, XTypeExtended, unknown, string | undefined>
} : never : XSubMap<T>)
export type XMapNonEquivalent<T, TXTypeX extends XTypeExtended, TTargetX = T, TXKeyX extends string | undefined = undefined, TXTypeO extends XTypeExtended = TXTypeX, TTargetO = TTargetX, TXKeyO extends string | undefined = TXKeyX> = {
    $xSide?: XMap<T, TXTypeX, TTargetX, TXKeyX>
    $oSide?: XMap<T, TXTypeO, TTargetO, TXKeyO>
}
export type TypeNoneEquivalent<T> = {
    $xSide?: Type<T> | TypeToken<T>
    $oSide?: Type<T> | TypeToken<T>
}

declare const __xSymbol__: unique symbol
export type X<T> = {
    readonly [S in typeof __xSymbol__]?: {
        [K in keyof T]?: never
    }
}
