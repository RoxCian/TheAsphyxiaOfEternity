import { ModelSignal, Signal, WritableSignal, computed, isSignal, linkedSignal, signal } from "@angular/core"
import { SignalArray, signalArray, signalArrayLinked } from "./signal-array"
import { SignalDict, signalDict } from "./signal-dict"

export type FieldValidator<T> = (value: T) => boolean

export type FieldSignal<T> = (T extends (infer TE)[] ? SignalArray<TE> & WritableSignal<T> : WritableSignal<T>) & {
    readonly initial: T
    readonly default: T
    readonly modified: Signal<boolean>
    readonly isValid: Signal<boolean>
    restore(): void
    clear(): void
}

type FieldSignalRecord<T extends object> = {
    [K in keyof T]: FieldSignal<T[K]>
}

export type FormSignal<T extends object> = SignalDict<FieldSignalRecord<T>> & {
    readonly modified: Signal<boolean>
    readonly isValid: Signal<boolean>
    restore(): void
    clear(): void
    asObject(): Signal<T>
}

export type FieldConfigurations<T> = {
    model?: ModelSignal<T> | (T extends (infer TE)[] ? ModelSignal<TE>[] : never)
    default: T
    validator?: FieldValidator<T>
}
export type FormConfigurations<T extends object> = {
    [K in keyof T]?: FieldConfigurations<T[K]>
} & {
    extraValidator?: Signal<boolean>
}

const defaultValidator = signal(true)
function restoreField<T>(fieldSignal: FieldSignal<T>): void {
    fieldSignal.set(fieldSignal.initial)
}
function clearField<T>(fieldSignal: FieldSignal<T>): void {
    fieldSignal.set(fieldSignal.default)
}
function fieldSignal<T>(initial: T, config?: FieldConfigurations<T>): FieldSignal<T> {
    const model = config?.model
    const result = (Array.isArray(initial) ? (model ? signalArrayLinked(model as unknown as ModelSignal<any>[], initial) : signalArray(initial)) : (isSignal(model) ? linkedSignal(model) : signal(initial))) as FieldSignal<T>
    const setFn = isSignal(model) ? model?.set : result.set
    const modified = signal(false)
    result.set = (v: T) => {
        setFn(v)
        modified.set(true)
    }
    result.update = (fn: (v: T) => T) => {
        setFn(fn(result() as T))
        modified.set(true)
    }
    const leftParts = {
        initial,
        default: config?.default,
        isValid: config?.validator ? computed(() => config.validator!(result() as T)) : defaultValidator.asReadonly(),
        modified: modified.asReadonly(),
        restore: () => {
            restoreField(result)
            modified.set(false)
        },
        clear: () => clearField(result)
    } as FieldSignal<T>
    return Object.assign(result, leftParts)
}
export function formSignal<T extends object>(obj: T, config: FormConfigurations<T>): FormSignal<T> {
    const result = signalDict({} as FieldSignalRecord<T>) as FormSignal<T>
    for (const k in obj) result.at(k).set(fieldSignal(obj[k], config[k] as FieldConfigurations<T[keyof T]> | undefined))
    const leftParts = {
        modified: computed(() => {
            const s = result()
            for (const k in s) if (s[k].modified()) return true
            return false
        }),
        isValid: computed(() => {
            const r = result.asObject()
            if (config.extraValidator && !config.extraValidator()) return false
            const s = result()
            for (const k in s) if (!s[k].isValid()) return false
            return true
        }),
        restore: () => {
            const s = result()
            for (const k in s) s[k].restore()
        },
        clear: () => {
            const s = result()
            for (const k in s) s[k].clear()
        },
        asObject: computed(() => {
            const ret = {} as T
            const s = result()
            for (const k in s) ret[k] = s[k]() as T[typeof k]
            return ret
        })
    } as Partial<FormSignal<T>>
    return Object.assign(result, leftParts)
}