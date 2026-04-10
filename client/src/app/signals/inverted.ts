import { computed, Signal } from "@angular/core"

export function inverted(signal: Signal<unknown>): Signal<boolean> {
    return computed(() => !signal())
}
export function invertedAsync(signal: Signal<Promise<unknown>>): Signal<Promise<boolean>> {
    return computed(async () => !await signal())
}