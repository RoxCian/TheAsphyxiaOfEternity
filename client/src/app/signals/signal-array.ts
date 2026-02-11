import { ModelSignal, WritableSignal, linkedSignal, signal } from "@angular/core"

export interface SignalArray<T> extends WritableSignal<T[]> {
    at(i: number): WritableSignal<T>
    pop(): T | undefined
    push(...items: T[]): number
    splice(start: number, deleteCount?: number): T[]
    splice(start: number, deleteCount: number, ...items: T[]): T[]
    reverse(): T[]
    shift(): T | undefined
    unshift(...items: T[]): number
    sort(compareFn?: (a: T, b: T) => number): T[]
}

function getIndexedSignal<T>(i: number, s: SignalArray<T>, indexedSignals: WritableSignal<T>[]): WritableSignal<T> {
    if (indexedSignals[i]) return indexedSignals[i]
    const result = linkedSignal(() => s()[i])
    result.set = v => s.update(a => {
        const realIndex = i >= 0 ? i : a.length + i
        const ret = [...a.slice(0, i), undefined as unknown as T, ...a.slice(i + 1)]
        if (realIndex >= 0) ret[realIndex] = v
        return ret
    })
    result.update = fn => s.update(a => {
        const realIndex = i >= 0 ? i : a.length + i
        const ret = [...a.slice(0, i), undefined as unknown as T, ...a.slice(i + 1)]
        if (realIndex >= 0) ret[realIndex] = fn(a[realIndex])
        return ret
    })
    indexedSignals[i] = result
    return result
}

function composeSignalArray<T>(signalArray: SignalArray<T>, indexedSignals: WritableSignal<T>[] = []): void {
    signalArray.at = i => getIndexedSignal(i, signalArray, indexedSignals)
    signalArray.pop = () => {
        let ret: T | undefined = undefined
        signalArray.update(v => {
            if (v.length === 0) return v
            ret = v[v.length - 1]
            return v.slice(0, v.length - 1)
        })
        return ret
    }
    signalArray.push = (...items: T[]) => {
        if (items.length === 0) return 0
        signalArray.update(v => [...v, ...items])
        return items.length
    }
    signalArray.splice = (start: number, deleteCount: number, ...items: T[]) => {
        let ret: T[] = []
        deleteCount ??= 1
        if (deleteCount <= 0 && items.length === 0) return ret
        signalArray.update(v => {
            ret = v.slice(start, deleteCount)
            return [...v.slice(0, start), ...items, ...v.slice(start + deleteCount)]
        })
        return ret
    }
    signalArray.reverse = () => {
        let ret: T[] = []
        signalArray.update(v => {
            ret = [...v].reverse()
            return ret
        })
        return ret
    }
    signalArray.shift = () => {
        let ret: T | undefined = undefined
        signalArray.update(v => {
            ret = v[0]
            if (v.length === 0) return v
            return v.slice(1)
        })
        return ret
    }
    signalArray.unshift = (...items: T[]) => {
        if (items.length === 0) return 0
        signalArray.update(v => [...items, ...v])
        return items.length
    }
    signalArray.sort = (compareFn: ((a: T, b: T) => number) | undefined) => {
        let ret: T[] = []
        signalArray.update(v => {
            if (v.length === 0) {
                ret = v
                return v
            }
            ret = [...v].sort(compareFn)
            return ret
        })
        return ret
    }
}

export function signalArray<T>(value: T[]): SignalArray<T> {
    const result = signal([...value]) as SignalArray<T>
    composeSignalArray(result)
    return result
}

export function signalArrayLinked<T>(computation: () => T[]): SignalArray<T>
export function signalArrayLinked<T>(elementsSignals: ModelSignal<T>[], value: T[]): SignalArray<T>
export function signalArrayLinked<T>(arg1: (() => T[]) | ModelSignal<T>[], value?: T[]): SignalArray<T> {
    if (Array.isArray(arg1)) {
        const result = signal([...(value ?? [])]) as SignalArray<T>
        for (let i = 0; i < arg1.length; i++) {
            const model = arg1[i]
            if (!model) continue
            const setFn = model.set
            const updateFn = model.update
            model.set = v => result.update(a => {
                const realIndex = i >= 0 ? i : a.length + i
                const ret = [...a.slice(0, i), undefined as unknown as T, ...a.slice(i + 1)]
                if (realIndex >= 0) ret[realIndex] = v
                setFn(v)
                return ret
            })
            model.update = fn => result.update(a => {
                const realIndex = i >= 0 ? i : a.length + i
                const ret = [...a.slice(0, i), undefined as unknown as T, ...a.slice(i + 1)]
                if (realIndex >= 0) ret[realIndex] = fn(a[realIndex])
                updateFn(fn)
                return ret
            })
        }
        composeSignalArray(result, arg1)
        return result
    } else {
        const result = linkedSignal(arg1) as SignalArray<T>
        composeSignalArray(result)
        return result
    }
}
