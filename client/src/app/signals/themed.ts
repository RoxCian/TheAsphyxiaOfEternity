import { Signal, computed, signal } from "@angular/core"

export type Theme = "light" | "dark"
const darkThemeMediaQuery = window.matchMedia?.("(prefers-color-scheme: dark)")
const themeSignal = signal<Theme>(darkThemeMediaQuery?.matches ? "dark" : "light")
darkThemeMediaQuery?.addEventListener("change", event => themeSignal.set(event.matches ? "dark" : "light"))

export function themed<T>(map: ((theme: Theme) => T) | Record<Theme, T>): Signal<T> {
    return typeof map == "function" ? computed(() => map(themeSignal())) : computed(() => map[themeSignal()])
}
export const themedDefault = computed(themeSignal)