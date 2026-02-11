import { Injectable, signal } from "@angular/core"

@Injectable({
    providedIn: "root"
})
export class BungThemeService {
    readonly theme = signal<"dark" | "light">("light")
    readonly #mediaQuery = window?.matchMedia("(prefers-color-scheme: dark)")
    constructor() {
        this.#mediaQuery.addEventListener("change", () => this.onChange(this.#mediaQuery.matches))
        this.onChange(this.#mediaQuery.matches)
    }
    private onChange(isDark: boolean) {
        const theme = isDark ? "dark" : "light"
        if (theme === this.theme()) return
        this.theme.set(theme)
    }
}
