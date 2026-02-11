export declare interface Type<T> extends Function {
    new(...args: any[]): T;
}
export type GetType<T> = (value: Doc<T>) => Type<T>
declare const __typeToken__: unique symbol
export type TypeToken<T> = symbol & {
    [K in typeof __typeToken__]?: {
        [K in keyof T]?: never
    }
}
export const injectorSymbol: unique symbol = Symbol()
export type TypeInjector = {
    [K in Exclude<symbol, typeof injectorSymbol>]: Type<unknown>
} & {
    [injectorSymbol]: true
}
export function isType<T>(value: unknown): value is Type<T> {
    return typeof value === "function" && value.toString().startsWith("class ")
}
export function isTypeToken<T>(value: unknown): value is TypeToken<T> {
    return typeof (value as TypeToken<T>) === "symbol"
}
export function isTypeOrToken<T>(value: unknown): value is Type<T> | TypeToken<T> {
    return (typeof value === "function" && value.toString().startsWith("class ")) || typeof value === "symbol"
}
export function isTypeInjector(value: unknown): value is TypeInjector {
    return typeof value === "object" && value[injectorSymbol]
}

export type ArrayWrapper<TKey extends string, TE> = {
    [K in TKey]?: TE[]
}
export function isArrayWrapper<TKey extends string, TE>(value: unknown, key: TKey): value is ArrayWrapper<TKey, TE> {
    return Array.isArray(value?.[key])
}