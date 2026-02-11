import { Injectable, Signal, computed, signal } from "@angular/core"

export type BungBreakpoint = "mobile" | "tablet" | "desktop" | "widescreen" | "fullhd"
const mobileBreakpoint = 768
const tabletBreakpoint = 1024
const desktopBreakpoint = 1216
const widescreenBreakpoint = 1408

@Injectable({ providedIn: "root" })
export class BungBreakpointService {
    readonly breakpoint = signal<BungBreakpoint>("fullhd")
    readonly breakpointsToggled: Record<BungBreakpoint, Signal<boolean>> = {
        mobile: computed(() => this.breakpoint() === "mobile"),
        tablet: computed(() => this.breakpoint() === "tablet"),
        desktop: computed(() => this.breakpoint() === "desktop"),
        widescreen: computed(() => this.breakpoint() === "widescreen"),
        fullhd: computed(() => this.breakpoint() === "fullhd")
    }

    #mediaQueries: Record<BungBreakpoint, MediaQueryList> = {
        mobile: window.matchMedia(`(width < ${mobileBreakpoint}px)`),
        tablet: window.matchMedia(`(${mobileBreakpoint}px <= width < ${tabletBreakpoint}px)`),
        desktop: window.matchMedia(`(${tabletBreakpoint}px <= width < ${desktopBreakpoint}px)`),
        widescreen: window.matchMedia(`(${desktopBreakpoint}px <= width < ${widescreenBreakpoint}px)`),
        fullhd: window.matchMedia(`(width >= ${widescreenBreakpoint}px)`)
    }

    constructor() {
        for (const key in this.#mediaQueries) {
            const bp = <BungBreakpoint>key
            this.#mediaQueries[bp].addEventListener("change", e => e.matches ? this.onChangeBreakpoint(bp) : undefined)
            if (this.#mediaQueries[bp].matches) this.onChangeBreakpoint(bp)
        }
    }

    onChangeBreakpoint(breakpoint: BungBreakpoint) {
        if (this.breakpoint() === breakpoint) return
        this.breakpoint.set(breakpoint)
    }
}
