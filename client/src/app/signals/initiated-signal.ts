import { computed, Signal, signal } from "@angular/core"

export type InitiatedSignal<T> = Signal<T> & {
    set(value: T) : void
    update(fn: (oldValue: T) => T): void
    asReadonly(): Signal<T>
    modified: Signal<boolean>
    reset(): void
}
export function initiatedSignal<T>(source: () => T): InitiatedSignal<T> {
    const modified = signal(false)
    const writable = signal<T | undefined>(undefined)
    const result = computed(() => {
        if (modified()) return writable()
        return source()
    }) as InitiatedSignal<T>
    result.set = v => {
        modified.set(true)
        writable.set(v)
    }
    result.update = fn => {
        const oldModified = modified
        modified.set(true)
        writable.update(v => {
            if (!oldModified) return fn(source())
            if (v == undefined) return v
            return fn(v)
        })
    }
    result.asReadonly = () => computed(() => {
        if (modified()) return writable()!
        return source()
    })
    result.modified = modified.asReadonly()
    result.reset = () => {
        modified.set(false)
        writable.set(undefined)
    }
    return result
}