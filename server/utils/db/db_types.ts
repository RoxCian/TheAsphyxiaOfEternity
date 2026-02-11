export interface ICollection<TCollectionName extends string> {
    readonly collection: TCollectionName
}

export type NumberGroup<T extends number[] | bigint[] | DBBigInt[] | (bigint | DBBigInt)[] = number[]> = {
    "@numberGroupValue": T
}
export type BufferArray = {
    "@bufferArrayValue": Buffer
}
export type DBBigInt = {
    "@serializedBigInt": string
}
export type DBDate = {
    "@tick": number
}
export type Vector2 = NumberGroup<[number, number]>
export type Vector2B = NumberGroup<[bigint, bigint]> | NumberGroup<[DBBigInt, DBBigInt]>
export type Vector3 = NumberGroup<[number, number, number]>
export type Vector3B = NumberGroup<[bigint, bigint, bigint]> | NumberGroup<[DBBigInt, DBBigInt, DBBigInt]>
export type Vector4 = NumberGroup<[number, number, number, number]>
export type Vector4B = NumberGroup<[bigint, bigint, bigint, bigint]> | NumberGroup<[DBBigInt, DBBigInt, DBBigInt, DBBigInt]>
export type Vector = NumberGroup<number[]>
export type VectorB = NumberGroup<bigint[]> | NumberGroup<DBBigInt[]>

export const NumberGroup = <T extends number[] | bigint[] = number[]>(ng: T) => <NumberGroup>{ "@numberGroupValue": ng }
export const BufferArray = (ba: Buffer) => <BufferArray>{ "@bufferArrayValue": ba }
export const DBBigInt = (value: bigint | number | string) => <DBBigInt>{ "@serializedBigInt": typeof value === "string" ? BigInt(value).toString() : value.toString() }
export const DBDate = (value: Date | number | string) => {
    if (typeof value === "number") return { "@tick": value }
    if (typeof value === "string") return { "@tick": Date.parse(value) }
    if (value instanceof Date) return { "@tick": value.valueOf() }
    if (isDBDate(value)) return value
    return { "@tick": 0 }
}

export function isNumberGroup(value: any): value is NumberGroup {
    try {
        return Array.isArray(BigInt(value["@numberGroupValue"]))
    } catch {
        return false
    }
}
export function isBufferArray(value: any): value is BufferArray {
    try {
        return value["@bufferArrayValue"] instanceof Buffer
    } catch {
        return false
    }
}
export function isDBBigInt(value: any): value is DBBigInt {
    try {
        return BigInt(value["@serializedBigInt"]).toString() == value["@serializedBigInt"]
    } catch {
        return false
    }
}
export function isDBDate(value: any): value is DBDate {
    try {
        return typeof value["@tick"] === "number"
    } catch {
        return false
    }
}
export function toBigInt(value: number | bigint | DBBigInt): bigint {
    if (typeof value === "number") return BigInt(value)
    else if (typeof value === "bigint") return <bigint>value
    else if ((<DBBigInt>value)["@serializedBigInt"] != null) return BigInt((<DBBigInt>value)["@serializedBigInt"])
    else return BigInt(0)
}
export function toDate(value: number | Date | string | DBDate): Date {
    if (typeof value === "number") return new Date(value)
    if (typeof value === "string") return new Date(Date.parse(value))
    if (value instanceof Date) return value
    if (isDBDate(value)) return new Date(value["@tick"])
    return new Date(0)
}