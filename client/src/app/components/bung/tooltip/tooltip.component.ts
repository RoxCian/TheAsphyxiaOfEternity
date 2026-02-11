import { Component, ElementRef, model, signal, ViewEncapsulation } from "@angular/core"
import { BungPopupComponent } from "../popup/popup.component"

export type BungTooltipFloat = "left" | "top-left" | "top" | "top-right" | "right" | "bottom-right" | "bottom" | "bottom-left" | "auto"

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
        "[style.--tooltip-init-top]": "tooltipInitTop()"
    }
})
export class BungTooltipComponent<T = any> extends BungPopupComponent<T> {
    readonly float = model<BungTooltipFloat>("auto")
    readonly hostElement = model<ElementRef<HTMLElement>>()

    protected readonly tooltipLeft = signal(0)
    protected readonly tooltipTop = signal(0)
    protected readonly tooltipInitLeft = signal("")
    protected readonly tooltipInitTop = signal("")

    private readonly offset = 8

    override open() {
        this.updatePosition()
        super.open()
    }
    updatePosition() {
        let float = this.float()
        const hr = this.hostElement()?.nativeElement.getBoundingClientRect() ?? new DOMRect()
        if (float === "auto") {
            const horizontalLimit = 200
            const viewportRect = document.body.getBoundingClientRect()
            if (viewportRect.right - hr.left < horizontalLimit) float = "left"
            else if (hr.right < horizontalLimit) float = "right"
            else if (hr.bottom > viewportRect.height / 2) float = "top"
            else float = "bottom"
        }
        const tr = this.element?.nativeElement.getBoundingClientRect() ?? new DOMRect()
        let x = 0
        let y = 0
        let initX = "0"
        let initY = "0"
        switch (float) {
            case "top-left":
                x = hr.x - tr.width - this.offset
                y = hr.y - tr.height - this.offset
                initX = `calc(${x}px - 2em)`
                initY = `${y}px`
                break
            case "top":
                x = hr.x + hr.width / 2 - tr.width / 2
                y = hr.y - tr.height - this.offset
                initX = `${x}px`
                initY = `calc(${y}px - 2em)`
                break
            case "top-right":
                x = hr.x + hr.width + this.offset
                y = hr.y - tr.height + this.offset
                initX = `calc(${x}px + 2em)`
                initY = `${y}px`
                break
            case "left":
                x = hr.x - tr.width - this.offset
                y = hr.y + hr.height / 2 - tr.height / 2
                initX = `calc(${x}px - 2em)`
                initY = `${y}px`
                break
            case "right":
                x = hr.x + hr.width + this.offset
                y = hr.y + hr.height / 2 - tr.height / 2
                initX = `calc(${x}px + 2em)`
                initY = `${y}px`
                break
            case "bottom-left":
                x = hr.x - tr.width - this.offset
                y = hr.y + hr.height + this.offset
                initX = `calc(${x}px - 2em)`
                initY = `${y}px`
                break
            case "bottom":
                x = hr.x + hr.width / 2 - tr.width / 2
                y = hr.y + hr.height + this.offset
                initX = `${x}px`
                initY = `calc(${y}px + 2em)`
                break
            case "bottom-right":
                x = hr.x + hr.width + this.offset
                y = hr.y + hr.height + this.offset
                initX = `calc(${x}px + 2em)`
                initY = `${y}px`
                break
        }
        this.tooltipLeft.set(x)
        this.tooltipTop.set(y)
        this.tooltipInitLeft.set(initX)
        this.tooltipInitTop.set(initY)
    }
}
