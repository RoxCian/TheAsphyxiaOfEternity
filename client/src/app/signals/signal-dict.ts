import { WritableSignal, isSignal, linkedSignal, signal } from "@angular/core"

export interface SignalDict<T> extends WritableSignal<T> {
    at(i: keyof T): WritableSignal<T[typeof i]>
}

type KeyedSignalsDict<T> = { [K in keyof T]: WritableSignal<T[K]> }
function getKeyedSignal<T>(k: keyof T, s: SignalDict<T>, indexedSignalsDict: KeyedSignalsDict<T>): WritableSignal<T[typeof k]> {
    if (indexedSignalsDict[k]) return indexedSignalsDict[k]
    const result = linkedSignal(() => s()[k])
    result.set = v => s.update(o => {
        const proto = Object.getPrototypeOf(o)
        o = { ...o }
        if (proto && proto !== Object.prototype) Object.setPrototypeOf(o, proto)
        o[k] = v
        return o
    })
    result.update = fn => s.update(o => {
        const proto = Object.getPrototypeOf(o)
        o = { ...o }
        if (proto && proto !== Object.prototype) Object.setPrototypeOf(o, proto)
        o[k] = fn(o[k])
        return o
    })
    indexedSignalsDict[k] = result
    return result
}

export function signalDict<T>(value: T): SignalDict<T> {
    const result = signal({ ...value }) as SignalDict<T>
    const keyedSignalsDict = {} as KeyedSignalsDict<T>
    result.at = i => getKeyedSignal(i, result, keyedSignalsDict)
    return result
}

export function signalDictLinked<T>(signals: { [K in keyof T]: T[K] | WritableSignal<T[K]> }): SignalDict<T> {
    const initValue = {} as T
    const keyedSignalsDict = {} as KeyedSignalsDict<T>
    for (const k in signals) {
        const s = signals[k as keyof T]
        if (isSignal(s)) {
            const _s = s as WritableSignal<T[typeof k]>
            const origSet = _s.set
            const origUpdate = _s.update
            _s.set = v => {
                result.update(o => {
                    const proto = Object.getPrototypeOf(o)
                    o = { ...o }
                    if (proto && proto !== Object.prototype) Object.setPrototypeOf(o, proto)
                    o[k] = v
                    return o
                })
                origSet(v)
            }
            _s.update = fn => {
                result.update(o => {
                    const proto = Object.getPrototypeOf(o)
                    o = { ...o }
                    if (proto && proto !== Object.prototype) Object.setPrototypeOf(o, proto)
                    o[k] = fn(o[k])
                    return o
                })
                origUpdate(fn)
            }
            keyedSignalsDict[k] = _s
            initValue[k] = _s() as T[typeof k]
        } else initValue[k] = s as T[typeof k]
    }
    const result = signal(initValue) as SignalDict<T>
    result.at = k => getKeyedSignal(k, result, keyedSignalsDict)
    return result
}