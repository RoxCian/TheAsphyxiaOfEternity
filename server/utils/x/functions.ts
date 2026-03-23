import { X, XMap, XMapNonEquivalent, XTypeExtended } from "./types"
import { DBBigInt, BufferArray, NumberGroup, isBufferArray, isNumberGroup, isDBBigInt, toBigInt, toDate } from "../db/db_types"
import { injectorSymbol, isTypeOrToken, isTypeToken, Type, TypeInjector, TypeToken } from "../types"
import { getPropertyDescriptor, instantiate } from "../utility_functions"

export namespace XF {
    function toSnakeCase(camel: string) {
        let result = camel
        let matchFlag = true
        while (matchFlag) {
            matchFlag = false
            result = result.replace(/[A-Z]/g, c => {
                matchFlag = true
                return `_${c.toLowerCase()}`
            })
        }
        return result
    }
    // export function isXMap<T, TXType extends XTypeExtended, TTarget = T, TXKey extends string | undefined = undefined>(map: any): map is XMap<T, TXType, TTarget, TXKey> {
    //     return map?.$xType || map?.$xKey || map?.$convert || map?.$convertBack || map?.$fallbackValue || map?.$el || map?.$type || map?.$elSubMap || map?.$subMap
    // }
    export function isTypeInjector(value: unknown): value is TypeInjector {
        return typeof value === "object" && value[injectorSymbol]
    }
    export function getMap<T, TXType extends XTypeExtended, TTarget = T, TXKey extends string | undefined = undefined>(type: Type<T> | TypeToken<T>, map: XMap<T, TXType, TTarget, TXKey> | XMapNonEquivalent<T, TXType, TTarget, TXKey> | undefined, typeInjector: TypeInjector | undefined, side: "x" | "o"): XMap<T, TXType, TTarget, TXKey> | undefined {
        const mapStack: XMap<T, TXType, TTarget, TXKey>[] = map ? isNonEquivalentMap(map) ? side === "o" && map.$oSide ? [map.$oSide] : side === "x" && map.$xSide ? [map.$xSide] : [] : [map] : []
        while (type) {
            let map: any
            if (isTypeToken(type)) {
                type = (typeInjector[type] ?? type) as Type<T>
                if (!type) break
            }
            map = type.hasOwnProperty("__map__") ? (type as any).__map__ : undefined
            if (map) {
                if (isNonEquivalentMap(map)) {
                    if (side === "o" && map.$oSide) mapStack.push(map.$oSide as XMap<T, TXType, TTarget, TXKey>)
                    if (side === "x" && map.$xSide) mapStack.push(map.$xSide as XMap<T, TXType, TTarget, TXKey>)
                } else mapStack.push(map)
            }
            type = Object.getPrototypeOf(type)
        }
        if (mapStack.length === 0) return undefined
        if (mapStack.length === 1) return mapStack[0]
        return mapStack.reverse().reduce((prev, curr) => Object.assign(prev, curr), {}) as XMap<T, TXType, TTarget, TXKey>
    }
    export function isNonEquivalentMap<T, TXType extends XTypeExtended, TTarget = T, TXKey extends string | undefined = undefined>(map: XMap<T, TXType, TTarget, TXKey> | XMapNonEquivalent<T, TXType, TTarget, TXKey>): map is XMapNonEquivalent<T, TXType, TTarget, TXKey> {
        return !!(map as any).$xSide || !!(map as any).$oSide
    }
    export function x<T>(value: T): X<T>
    export function x<T, TXType extends XTypeExtended, TTarget = T, TXKey extends string | undefined = undefined>(value: T, map: XMap<T, TXType, TTarget, TXKey>, typeInjector?: TypeInjector): X<T>
    export function x<T, TXType extends XTypeExtended, TTarget = T, TXKey extends string | undefined = undefined>(value: T, type: Type<T> | TypeToken<T>, typeInjector?: TypeInjector): X<T>
    export function x<T, TXType extends XTypeExtended, TTarget = T, TXKey extends string | undefined = undefined>(value: T, type: Type<T> | TypeToken<T>, map?: XMap<T, TXType, TTarget, TXKey>, typeInjector?: TypeInjector): X<T>
    export function x<T, TXType extends XTypeExtended, TTarget = T, TXKey extends string | undefined = undefined>(value: T, mapOrType?: Type<T> | TypeToken<T> | XMap<T, TXType, TTarget, TXKey>, mapOrTypeInjector?: XMap<T, TXType, TTarget, TXKey> | TypeInjector, typeInjector?: TypeInjector): X<T> {
        let type: Type<T> | TypeToken<T>
        let map: XMap<T, TXType, TTarget, TXKey>
        if (mapOrType && !isTypeOrToken(mapOrType)) map = mapOrType as XMap<T, TXType, TTarget, TXKey>
        else if (mapOrType) type = mapOrType as Type<T> | TypeToken<T>
        else type = value ? Object.getPrototypeOf(value)?.constructor : undefined as Type<T>
        if (!isTypeInjector(mapOrTypeInjector)) map = mapOrTypeInjector as XMap<T, TXType, TTarget, TXKey>
        else typeInjector ??= mapOrTypeInjector

        map = getMap(type, map, typeInjector, "x")
        if (!map) return value

        const xType = map.$xType
        const attr: Record<string, any> = {}
        const result = {
            "@attr": attr
        } as X<T>
        let content: any = value
        let hasAttr = typeof xType === "string"

        // find #value, fill @attr dictionary
        for (const k in map) {
            switch (k) {
                case "$type": case "$xType": case "$xKey": case "$convert": case "$convertBack": case "$fallbackValue": case "$subMap": case "$el": case "$elSubMap": continue
                default:
                    if (map[k].$xType === "xvalue") {
                        content = value[k]
                    } else if (map[k].$xType === "xattr") {
                        attr[map[k].$xKey ?? toSnakeCase(k)] = value[k]
                        hasAttr = true
                    }
            }
        }
        if (typeof xType === "string" && xType !== "xignore" && xType !== "xattr" && xType !== "xvalue") {
            attr.__type = xType
            hasAttr = true
        }

        // convert
        if (map.$convert) content = map.$convert(content as T)
        
        // map array
        if (Array.isArray(content) && ((map as any).$el || (map as any).$xSide?.$el)) { // array of object or array of primitive types with attrs or xvalue (wrapped in objects)
            let elType = ((map as any).$xSide?.$el ?? (map as any).$el) as Type<T extends Array<infer TE> ? TE : never> | TypeToken<T extends Array<infer TE> ? TE : never> | undefined
            let elMap = ((map as any).$xSide?.$elSubMap ?? (map as any).$elSubMap) as XMap<T extends Array<infer TE> ? TE : never, XTypeExtended, unknown, string | undefined> | undefined
            const array = content.map(el => x(el, elType, elMap, typeInjector))
            if (hasAttr) return {
                "@attr": attr,
                "@content": array
            } as X<T>
            else return array as X<T>
        } else if (((map as any).$el || (map as any).$xSide?.$el)) return [] as X<T>

        if (content == undefined) return undefined
        // set @content
        switch (xType) {
            case "xignore": return undefined
            case "xattr": return content?.toString() ?? ""
            case "bool":
                if (Array.isArray(content)) {
                    attr.__count = content.length
                    result["@content"] = content.map(v => (v && (v !== "false") && (v !== 0)) ? 1 : 0)
                }
                else result["@content"] = [(content && (content !== "false") && (content !== 0)) ? 1 : 0]
                break
            case "s8": case "u8": case "s16": case "u16": case "s32": case "u32": case "float": case "double": case "bin":
                if (xType === "s8" || xType === "u8" || xType === "bin") {
                    if (content instanceof Buffer) {
                        attr.__count = content.byteLength
                        result["@content"] = content
                        break
                    }
                }
                if (Array.isArray(content)) {
                    attr.__count = content.length
                    result["@content"] = content
                } else result["@content"] = [content ?? 0]
                break
            case "s64": case "u64":
                if (Array.isArray(content)) {
                    attr.__count = content.length
                    result["@content"] = content.map(toBigInt)
                } else {
                    if (typeof content === "number" || typeof content === "bigint" || isDBBigInt(content)) result["@content"] = toBigInt(content)
                    else result["@content"] = BigInt(0)
                }
                break
            case "2s8": case "2u8": case "2s16": case "2u16": case "2s32": case "2u32": case "2b": case "2d": case "2f":
                if (Array.isArray(content)) result["@content"] = content.slice(0, 2)
                else if (isNumberGroup(content)) content = content["@numberGroupValue"].slice(0, 2)
                else result["@content"] = [0, 0]
                break
            case "2s64": case "2u64":
                if (Array.isArray(content)) result["@content"] = content.slice(0, 2).map(toBigInt)
                else if (isNumberGroup(content)) result["@content"] = content["@numberGroupValue"].slice(0, 2).map(toBigInt)
                else result["@content"] = [BigInt(0), BigInt(0)]
                break
            case "3s8": case "3u8": case "3s16": case "3u16": case "3s32": case "3u32": case "3b": case "3d": case "3f":
                if (Array.isArray(content)) result["@content"] = content.slice(0, 3)
                else if (isNumberGroup(content)) result["@content"] = content["@numberGroupValue"].slice(0, 3)
                else result["@content"] = [0, 0, 0]
                break
            case "3s64": case "3u64":
                if (Array.isArray(content)) result["@content"] = content.slice(0, 3).map(toBigInt)
                else if (isNumberGroup(content)) result["@content"] = content["@numberGroupValue"].slice(0, 3).map(toBigInt)
                else result["@content"] = [BigInt(0), BigInt(0), BigInt(0)]
                break
            case "4s8": case "4u8": case "4s16": case "4u16": case "4s32": case "4u32": case "4b": case "4d": case "4f":
                if (Array.isArray(content)) result["@content"] = content.slice(0, 4)
                else if (isNumberGroup(content)) result["@content"] = content["@numberGroupValue"].slice(0, 4)
                else result["@content"] = [0, 0, 0, 0]
                break
            case "4s64": case "4u64":
                if (Array.isArray(content)) result["@content"] = content.slice(0, 4).map(toBigInt)
                else if (isNumberGroup(content)) result["@content"] = content["@numberGroupValue"].slice(0, 4).map(toBigInt)
                else result["@content"] = [BigInt(0), BigInt(0), BigInt(0), BigInt(0)]
                break
            case "vb":
                if (Array.isArray(content)) result["@content"] = content
                else if (isNumberGroup(content)) result["@content"] = content["@numberGroupValue"]
                else result["@content"] = [0]
                break
            case "vs8": case "vu8": case "vs16": case "vu16":
                if (Array.isArray(content)) result["@content"] = content.map(toBigInt)
                else if (isNumberGroup(content)) result["@content"] = content["@numberGroupValue"].map(toBigInt)
                else result["@content"] = [BigInt(0)]
                break
            case "ip4":
                if (Array.isArray(content)) result["@content"] = `${content[0] ?? 0}.${content[1] ?? 0}.${content[2] ?? 0}.${content[3] ?? 0}`
                else if (typeof content === "number") result["@content"] = `${content & 0xFF}.${(content & 0xFF00) >> 8}.${(content & 0xFF0000) >> 16}.${(content & 0xFF000000) >> 24}`
                else if (typeof content === "string" && content.match(/^\d{1-3}.\d{1-3}.\d{1-3}.\d{1-3}$/)) result["@content"] = content
                else result["@content"] = "0.0.0.0"
                break
            case "str":
                if (typeof content !== "string") content = content?.toString() ?? ""
                result["@content"] = content
                break
            case "time":
                result["@content"] = [toDate((content as number) ?? 0)]
                break
        }

        // fill fields
        if (typeof value === "object" && value != undefined) for (const k in map) {
            switch (k) {
                case "$type": case "$xType": case "$xKey": case "$convert": case "$convertBack": case "$fallbackValue": case "$subMap": case "$el": case "$elSubMap": continue
                default:
                    const subMap = isNonEquivalentMap(map[k]) ? map[k].$xSide : map[k]
                    if (!subMap) continue
                    const field = value[k]
                    if (subMap.$xType === "xignore" || subMap.$xType === "xattr" || subMap.$xType === "xvalue") continue
                    const subItem = x(field, subMap.$type, subMap.$subMap ?? subMap, typeInjector)
                    if (subItem != undefined) result[subMap.$xKey ?? toSnakeCase(k)] = subItem
                    break
            }
        }
        if (!hasAttr) delete result["@attr"]

        return result
    }


    export function o<T>(xValue: X<T>, type: Type<T>, typeInjector?: TypeInjector): T
    export function o<T, TXType extends XTypeExtended, TTarget = T, TXKey extends string | undefined = undefined>(xValue: X<T>, map: XMap<T, TXType, TTarget, TXKey>, typeInjector?: TypeInjector): T
    export function o<T, TXType extends XTypeExtended, TTarget = T, TXKey extends string | undefined = undefined>(xValue: X<T>, type: Type<T> | TypeToken<T>, map: XMap<T, TXType, TTarget, TXKey>, typeInjector?: TypeInjector): T
    export function o<T, TXType extends XTypeExtended, TTarget = T, TXKey extends string | undefined = undefined>(xValue: X<T>, mapOrType: XMap<T, TXType, TTarget, TXKey> | Type<T> | TypeToken<T>, mapOrTypeInjector?: XMap<T, TXType, TTarget, TXKey> | TypeInjector, typeInjector?: TypeInjector): T {
        let type: Type<T> | TypeToken<T>
        let map: XMap<T, TXType, TTarget, TXKey>
        if (!isTypeOrToken(mapOrType)) map = mapOrType as XMap<T, TXType, TTarget, TXKey>
        else type = mapOrType as Type<T> | TypeToken<T>
        if (!isTypeInjector(mapOrTypeInjector)) map = mapOrTypeInjector as XMap<T, TXType, TTarget, TXKey>
        else typeInjector ??= mapOrTypeInjector

        if (isTypeToken(type)) type = (typeInjector[type]) as Type<T>
        let result: any
        if (type) result = instantiate(type)

        map = getMap(type, map, typeInjector, "o")
        if (!map) return result

        const xType = map.$xType

        let xValueKey: string | undefined
        for (const k in map) {
            switch (k) {
                case "$type": case "$xType": case "$xKey": case "$convert": case "$convertBack": case "$fallbackValue": case "$subMap": case "$el": case "$elSubMap": continue
                default:
                    // map back #value in xml to object
                    const subMap = isNonEquivalentMap(map[k]) ? map[k].$oSide : map[k]
                    if (!subMap) break
                    if (subMap.$xType === "xvalue") {
                        xValueKey = k
                        break
                    }
                    break
            }
        }
        function setValue(value: any) {
            if (xValueKey) {
                const desc = getPropertyDescriptor(result, xValueKey)
                if (!desc || desc.writable || desc.set) result[xValueKey] = value
            } else if (value && typeof value === "object") {
                if (Array.isArray(value) && Array.isArray(result)) for (let i = 0; i < value.length; i++) result[i] = value[i]
                else if (typeof result === "object") {
                    Object.assign(value, result)
                    result = value
                }
                else result = value
            } else if (value == undefined) return
            else result = value
        }
        const content = xValue?.["@content"] ?? xValue
        if (content == undefined && xType) return undefined
        const isArray = (typeof xType === "string" && xValue?.["@attr"]?.__count != undefined) || (typeof xType !== "string" && Array.isArray(content) || ((map as any).$el || (map as any).$oSide?.$el))
        switch (xType) {
            case "xignore":
                setValue(map.$fallbackValue)
                break
            case "bool":
                if (isArray) setValue(content?.map(v => v != 0) ?? [])
                else setValue(content?.[0] != 0)
                break
            case "s8": case "u8": case "bin":
                if (content instanceof Buffer) {
                    setValue(content)
                    break
                }
                if (xType === "bin") {
                    setValue(Buffer.alloc(0))
                    break
                }
            // no break here
            case "s8": case "u8": case "s16": case "u16": case "s32": case "u32": case "float": case "double":
                if (isArray) setValue(content ?? [])
                else setValue(content?.[0] ?? 0)
                break
            case "s64": case "u64":
                if (isArray) setValue(content.map(DBBigInt) ?? [])
                else setValue(DBBigInt(content?.[0] ?? 0))
                break
            case "2s8": case "2u8": case "2s16": case "2u16": case "2s32": case "2u32": case "2b": case "2d": case "2f":
                setValue(NumberGroup(content?.slice(0, 2) ?? [0, 0]))
                break
            case "2s64": case "2u64":
                setValue(NumberGroup(content?.slice(0, 2)?.map(DBBigInt) ?? [DBBigInt(0), DBBigInt(0)]))
                break
            case "3s8": case "3u8": case "3s16": case "3u16": case "3s32": case "3u32": case "3b": case "3d": case "3f":
                setValue(NumberGroup(content?.slice(0, 3) ?? [0, 0, 0]))
                break
            case "3s64": case "3u64":
                setValue(NumberGroup(content?.slice(0, 3)?.map(DBBigInt) ?? [DBBigInt(0), DBBigInt(0), DBBigInt(0)]))
                break
            case "4s8": case "4u8": case "4s16": case "4u16": case "4s32": case "4u32": case "4b": case "4d": case "4f":
                setValue(NumberGroup(content?.slice(0, 4) ?? [0, 0, 0, 0]))
                break
            case "4s64": case "4u64":
                setValue(NumberGroup(content?.slice(0, 4)?.map(DBBigInt) ?? [DBBigInt(0), DBBigInt(0), DBBigInt(0), DBBigInt(0)]))
                break
            case "vb":
                setValue(NumberGroup(content ?? [0]))
                break
            case "vs8": case "vu8": case "vs16": case "vu16":
                setValue(NumberGroup(content?.map(DBBigInt) ?? [DBBigInt(0)]))
                break
            case "ip4":
                setValue(content?.split(".").map(t => parseInt(t)) ?? [0, 0, 0, 0])
                break
            case "str":
                if (typeof content !== "string") setValue(content)
                else setValue(content ?? "")
                break
            case "time":
                setValue(toDate(content))
                break
        }
        if (isArray && ((map as any).$el || (map as any).$oSide?.$el)) {
            let elType = ((map as any).$xSide?.$el ?? (map as any).$el) as Type<T extends Array<infer TE> ? TE : never> | TypeToken<T extends Array<infer TE> ? TE : never> | undefined
            let elMap = ((map as any).$xSide?.$elSubMap ?? (map as any).$elSubMap) as XMap<T extends Array<infer TE> ? TE : never, XTypeExtended, unknown, string | undefined> | undefined
            const array = Array.isArray(content) ? content.map(el => o(el, elType, elMap, typeInjector)) : [o(content, elType, elMap, typeInjector)]
            setValue(array)
        }
        result ??= {}
        for (const k in map) {
            switch (k) {
                case "$type": case "$xType": case "$xKey": case "$convert": case "$convertBack": case "$fallbackValue": case "$subMap": case "$el": case "$elSubMap": continue
                default:
                    const subMap = isNonEquivalentMap(map[k]) ? map[k].$oSide : map[k]
                    const xKey = subMap?.$xKey ?? toSnakeCase(k)
                    const xField = subMap?.$type === "attr" ? xValue["@attr"]?.[xKey] : subMap?.$xType === "xignore" ? subMap?.$fallbackValue : xValue?.[xKey]
                    if (!subMap || xField == undefined) {
                        result[k] = xField ?? result[k]
                        break
                    }
                    if (subMap?.$xType === "xattr" || subMap?.$xType === "xvalue") continue
                    const desc = getPropertyDescriptor(result, k as keyof T)
                    if (!desc || desc.writable || desc.set) {
                        const subItem = o(xField, subMap.$type, subMap?.$subMap ?? subMap, typeInjector)
                        if (subItem != undefined) result[k] = subItem
                    }
                    break
            }
        }
        return map.$convertBack ? map.$convertBack(result) : result
    }
}
