import { Component, computed, effect, ElementRef, model, signal, ViewEncapsulation } from "@angular/core"
import { BungPopupComponent } from "../popup/popup.component"

export type BungTooltipFloat = "left" | "top-left" | "top" | "top-right" | "right" | "bottom-right" | "bottom" | "bottom-left" | "covered" | "auto"
// diagonal1: <\>, diagonal2: </>
export type BungTooltipFloatExtend = "left" | "top-left" | "top" | "top-right" | "right" | "bottom-right" | "bottom" | "bottom-left" | "horizontal" | "vertical" | "diagonal1" | "diagonal2" | "covered"
export type BungTooltipAlign = "start" | "center" | "end" | "stretch"

@Component({
    selector: "bung-tooltip",
    templateUrl: "./tooltip.component.html",
    styleUrl: "./tooltip.component.sass",
    standalone: false,
    encapsulation: ViewEncapsulation.None,
    host: {
        "[style.--tooltip-left]": "`${tooltipLeft()}px`",
        "[style.--tooltip-top]": "`${tooltipTop()}px`",
        "[style.--tooltip-init-left]": "tooltipInitLeft()",
        "[style.--tooltip-init-top]": "tooltipInitTop()",
        "[style.--tooltip-width]": "tooltipWidth() == undefined ? '' : `${tooltipWidth()}px`",
        "[style.--tooltip-height]": "tooltipHeight() == undefined ? '' : `${tooltipHeight()}px`"
    }
})
export class BungTooltipComponent<T = any> extends BungPopupComponent<T> {
    readonly float = model<BungTooltipFloat>("auto")
    readonly preferedFloats = model<BungTooltipFloatExtend | BungTooltipFloatExtend[]>("vertical")
    readonly align = model<BungTooltipAlign>("center")
    readonly padding = model<number | [number, number] | [number, number, number, number]>(32)
    readonly hostElement = model<ElementRef<HTMLElement>>()

    protected readonly tooltipLeft = signal(0)
    protected readonly tooltipTop = signal(0)
    protected readonly tooltipWidth = signal<number | undefined>(undefined)
    protected readonly tooltipHeight = signal<number | undefined>(undefined)
    protected readonly tooltipInitLeft = signal("")
    protected readonly tooltipInitTop = signal("")

    protected readonly paddingComputed = computed(() => {
        const padding = this.padding()
        if (typeof padding === "number") return [padding, padding, padding, padding] as const
        if (padding.length === 2) return [padding[0], padding[1], padding[0], padding[1]] as const
        return padding
    })

    private readonly offset = 8

    #observer?: MutationObserver
    #lastObserved?: HTMLElement

    constructor() {
        super()
        effect(() => {
            if (this.state() !== "show") return
            const el = this.element.nativeElement
            if (el === this.#lastObserved) return
            if (this.#lastObserved) this.#observer?.disconnect()
            if (el) {
                this.#observer = new MutationObserver(() => this.updatePosition())
                this.#observer.observe(el, { childList: true, subtree: true, characterData: true })
            }
            this.#lastObserved = el
        })
    }

    override open() {
        this.updatePosition()
        super.open()
    }
    updatePosition() {
        let float = this.float()
        const preferedFloats = this.preferedFloats()
        const align = this.align()
        const floatSelectArray: ("left" | "top-left" | "top" | "top-right" | "right" | "bottom-right" | "bottom" | "bottom-left" | "covered")[] = []
        const hr = this.hostElement()?.nativeElement.getBoundingClientRect() ?? new DOMRect()
        const tr = this.element?.nativeElement.getBoundingClientRect() ?? new DOMRect()
        const padding = this.paddingComputed()
        const viewportRect = document.body.getBoundingClientRect()
        if (float === "auto") {
            for (const f of Array.isArray(preferedFloats) ? preferedFloats : [preferedFloats]) {
                switch (f) {
                    case "left": case "top": case "right": case "bottom":
                    case "top-left": case "top-right": case "bottom-right": case "bottom-left":
                    case "covered":
                        if (!floatSelectArray.includes(f)) floatSelectArray.push(f)
                        break
                    case "horizontal":
                        if (!floatSelectArray.includes("left")) floatSelectArray.push("left")
                        if (!floatSelectArray.includes("right")) floatSelectArray.push("right")
                        break
                    case "vertical":
                        if (!floatSelectArray.includes("top")) floatSelectArray.push("top")
                        if (!floatSelectArray.includes("bottom")) floatSelectArray.push("bottom")
                        break
                    case "diagonal1":
                        if (!floatSelectArray.includes("top-left")) floatSelectArray.push("top-left")
                        if (!floatSelectArray.includes("bottom-right")) floatSelectArray.push("bottom-right")
                        break
                    case "diagonal2":
                        if (!floatSelectArray.includes("top-right")) floatSelectArray.push("top-right")
                        if (!floatSelectArray.includes("bottom-left")) floatSelectArray.push("bottom-left")
                        break
                }
            }
            for (const f of floatSelectArray) {
                switch (f) {
                    case "left":
                        if (hr.x - tr.width >= Math.max(padding[0], viewportRect.width * 0.3333)) float = f
                        break
                    case "right":
                        if (hr.x + hr.width + tr.width <= Math.min(viewportRect.right - padding[2], viewportRect.width * 0.6667)) float = f
                        break
                    case "top":
                        if (hr.y - tr.height >= Math.max(padding[1], viewportRect.height * 0.3333)) float = f
                        break
                    case "bottom":
                        if (hr.y + hr.height + tr.height <= Math.min(viewportRect.bottom - padding[3], viewportRect.height * 0.6667)) float = f
                        break
                    case "top-left":
                        if (hr.x - tr.width >= Math.max(padding[0], viewportRect.width * 0.3333)
                            && hr.y - tr.height >= Math.max(padding[1], viewportRect.height * 0.3333)) float = f
                        break
                    case "top-right":
                        if (hr.x + hr.width + tr.width <= Math.min(viewportRect.right - padding[2], viewportRect.width * 0.6667)
                            && hr.y - tr.height >= Math.max(padding[1], viewportRect.height * 0.3333)) float = f
                        break
                    case "bottom-left":
                        if (hr.x - tr.width >= Math.max(padding[0], viewportRect.width * 0.3333)
                            && hr.y + hr.height + tr.height <= Math.min(viewportRect.bottom - padding[3], viewportRect.height * 0.6667)) float = f
                        break
                    case "bottom-right":
                        if (hr.x + hr.width + tr.width <= Math.min(viewportRect.right - padding[2], viewportRect.width * 0.6667)
                            && hr.y + hr.height + tr.height <= Math.min(viewportRect.bottom - padding[3], viewportRect.height * 0.6667)) float = f
                        break
                }
                if (float !== "auto") break
            }
            if (float === "auto") for (const f of floatSelectArray) {
                switch (f) {
                    case "left":
                        if (hr.x - tr.width >= padding[0]) float = f
                        break
                    case "right":
                        if (hr.x + hr.width + tr.width <= viewportRect.right - padding[2]) float = f
                        break
                    case "top":
                        if (hr.y - tr.height >= padding[1]) float = f
                        break
                    case "bottom":
                        if (hr.y + hr.height + tr.height <= viewportRect.bottom - padding[3]) float = f
                        break
                    case "top-left":
                        if (hr.x - tr.width >= padding[0] && hr.y - tr.height >= padding[1]) float = f
                        break
                    case "top-right":
                        if (hr.x + hr.width + tr.width <= viewportRect.right - padding[2] && hr.y - tr.height >= padding[1]) float = f
                        break
                    case "bottom-left":
                        if (hr.x - tr.width >= padding[0] && hr.y + hr.height + tr.height <= viewportRect.bottom - padding[3]) float = f
                        break
                    case "bottom-right":
                        if (hr.x + hr.width + tr.width <= viewportRect.right - padding[2] && hr.y + hr.height + tr.height <= viewportRect.bottom - padding[3]) float = f
                        break
                    case "covered":
                        float = f
                        break
                }
                if (float !== "auto") break
            }
        }
        if (float === "auto") float = floatSelectArray[floatSelectArray.length - 1]
        let x = 0
        let y = 0
        let w: number | undefined = undefined
        let h: number | undefined = undefined
        let initX = "0"
        let initY = "0"
        const clampX = (x: number) => Math.min(Math.max(x, padding[0]), viewportRect.right - padding[2])
        const clampY = (y: number) => Math.min(Math.max(y, padding[0]), viewportRect.bottom - padding[3])
        switch (float) {
            case "top-left":
                x = clampX(hr.x - tr.width - this.offset)
                y = clampY(hr.y - tr.height - this.offset)
                initX = `calc(${x}px - 2em)`
                initY = `${y}px`
                break
            case "top":
                switch (align) {
                    case "start":
                        x = clampX(hr.x)
                        break
                    case "end":
                        x = clampX(hr.x + hr.width - tr.width)
                        break
                    case "center":
                        x = clampX(hr.x + hr.width / 2 - tr.width / 2)
                        break
                    case "stretch":
                        x = clampX(hr.x)
                        w = hr.width
                        break
                }
                y = clampY(hr.y - tr.height - this.offset)
                initX = `${x}px`
                initY = `calc(${y}px - 2em)`
                break
            case "top-right":
                x = clampX(hr.x + hr.width + this.offset)
                y = clampY(hr.y - tr.height + this.offset)
                initX = `calc(${x}px + 2em)`
                initY = `${y}px`
                break
            case "left":
                switch (align) {
                    case "start":
                        y = clampY(hr.y)
                        break
                    case "end":
                        y = clampY(hr.y + hr.height - tr.height)
                        break
                    case "center":
                        y = clampY(hr.y + hr.height / 2 - tr.height / 2)
                        break
                    case "stretch":
                        y = clampY(hr.y)
                        h = hr.height
                        break
                }
                x = clampX(hr.x - tr.width - this.offset)
                initX = `calc(${x}px - 2em)`
                initY = `${y}px`
                break
            case "right":
                switch (align) {
                    case "start":
                        y = clampY(hr.y)
                        break
                    case "end":
                        y = clampY(hr.y + hr.height - tr.height)
                        break
                    case "center":
                        y = clampY(hr.y + hr.height / 2 - tr.height / 2)
                        break
                    case "stretch":
                        y = clampY(hr.y)
                        h = hr.height
                        break
                }
                x = clampX(hr.x + hr.width + this.offset)
                initX = `calc(${x}px + 2em)`
                initY = `${y}px`
                break
            case "bottom-left":
                x = clampX(hr.x - tr.width - this.offset)
                y = clampY(hr.y + hr.height + this.offset)
                initX = `calc(${x}px - 2em)`
                initY = `${y}px`
                break
            case "bottom":
                switch (align) {
                    case "start":
                        x = clampX(hr.x)
                        break
                    case "end":
                        x = clampX(hr.x + hr.width - tr.width)
                        break
                    case "center":
                        x = clampX(hr.x + hr.width / 2 - tr.width / 2)
                        break
                    case "stretch":
                        x = clampX(hr.x)
                        w = hr.width
                        break
                }
                y = clampY(hr.y + hr.height + this.offset)
                initX = `${x}px`
                initY = `calc(${y}px + 2em)`
                break
            case "bottom-right":
                x = clampX(hr.x + hr.width + this.offset)
                y = clampY(hr.y + hr.height + this.offset)
                initX = `calc(${x}px + 2em)`
                initY = `${y}px`
                break
            case "covered":
                switch (align) {
                    case "start":
                        x = clampX(hr.x)
                        y = clampY(hr.y)
                        break
                    case "end":
                        x = clampX(hr.x + hr.width - tr.width)
                        y = clampY(hr.y + hr.height - tr.height)
                        break
                    case "center":
                        x = clampX(hr.x + hr.width / 2 - tr.width / 2)
                        y = clampY(hr.y + hr.height / 2 - tr.height / 2)
                        break
                    case "stretch":
                        x = clampX(hr.x)
                        y = clampY(hr.y)
                        w = hr.width
                        h = hr.height
                        break
                }
                initX = `${x}px`
                initY = `${y}px`

        }
        this.tooltipLeft.set(x)
        this.tooltipTop.set(y)
        if ((w ?? tr.width) + padding[0] + padding[2] >= viewportRect.width) w = viewportRect.width - padding[0] - padding[2]
        if ((h ?? tr.height) + padding[1] + padding[3] >= viewportRect.height) h = viewportRect.height - padding[1] - padding[3]
        this.tooltipWidth.set(w)
        this.tooltipHeight.set(h)
        this.tooltipInitLeft.set(initX)
        this.tooltipInitTop.set(initY)
    }
}
