import { Directive, effect, ElementRef, inject, input, OnDestroy, output, OutputRefSubscription, signal } from "@angular/core"
import { BungInsertionContent, BungPopupOptions } from "../../utils/bung"
import { BungTooltipAlign, BungTooltipComponent, BungTooltipFloat, BungTooltipFloatExtend } from "../../components/bung/tooltip/tooltip.component"
import { BungTooltipService } from "../../services/bung/tooltip.service"
import { throttle } from "../../utils/functions"
import { toggleTransform } from "../../signals/transforms"

@Directive({
    selector: "[bungTooltip]",
    standalone: false
})
export class BungTooltipDirective implements OnDestroy {
    readonly content = input<BungInsertionContent>(undefined, { alias: "bungTooltip" })
    readonly context = input<any>(undefined)
    readonly options = input<BungPopupOptions<BungTooltipComponent<any>> | undefined>(undefined)
    readonly hostElement = inject<ElementRef<HTMLElement>>(ElementRef)
    readonly triggerMethod = input<"mouseenter" | "click">("mouseenter")
    readonly closeTriggerMethod = input<"mouseleave" | "click">("mouseleave")
    readonly float = input<BungTooltipFloat>("auto")
    readonly preferedFloats = input<BungTooltipFloatExtend | BungTooltipFloatExtend[]>("vertical")
    readonly align = input<BungTooltipAlign>("center")
    readonly padding = input<number | [number, number] | [number, number, number, number]>(32)
    readonly delay = input(250)
    readonly duration = input(Infinity)
    readonly disabled = input(false, { alias: "bungTooltip.disabled", transform: toggleTransform })
    private readonly isTooltipOpenInternal = signal(false)
    readonly isTooltipOpen = this.isTooltipOpenInternal.asReadonly()
    readonly tooltipOpened = output()
    readonly tooltipClosed = output()

    private readonly mouseenterEventHandler = (e: MouseEvent) => {
        if (this.#delayTimeout != undefined || this.#component) return
        this.#delayTimeout = window.setTimeout(() => this.open(), this.delay())
    }
    private readonly mouseleaveEventHandler = (e: MouseEvent) => {
        this.close()
    }
    private readonly clickEventHandler = (e: MouseEvent) => {
        if (e.button !== 0) return
        if (this.hostElement.nativeElement.contains(e.target as Node)) {
            if (this.#delayTimeout != undefined || this.#component) return
            if (this.#delayTimeout == undefined && this.triggerMethod() === "click") {
                this.#delayTimeout = window.setTimeout(() => this.open(), this.delay())
                return
            } else if (this.closeTriggerMethod() === "click") {
                this.close()
                e.stopImmediatePropagation()
            }
            return
        }
        if (this.closeTriggerMethod() !== "click") return
        if (this.#delayTimeout != undefined) {
            clearTimeout(this.#delayTimeout)
            return
        }
        if (!this.#component) return
        this.close()
        e.stopImmediatePropagation()
    }
    private readonly cleanEventHandler = () => {
        this.#componentCloseHandle?.unsubscribe()
        this.#componentCloseHandle = undefined
        this.#delayTimeout = undefined
    }
    private readonly scrollEventHandler = throttle(() => this.#component?.updatePosition(), undefined, 17)


    private readonly tooltipService = inject(BungTooltipService)

    #prevTriggerMethod?: "mouseenter" | "click"
    #prevCloseTriggerMethod?: "mouseleave" | "click"
    #delayTimeout?: number
    #component?: BungTooltipComponent
    #componentCloseHandle?: OutputRefSubscription

    constructor() {
        effect(() => {
            if (this.#prevTriggerMethod !== this.triggerMethod()) {
                if (this.#prevTriggerMethod === "mouseenter") this.hostElement.nativeElement.removeEventListener("mouseenter", this.mouseenterEventHandler)
                else if (this.#prevTriggerMethod === "click") this.hostElement.nativeElement.removeEventListener("click", this.clickEventHandler)
                this.#prevTriggerMethod = this.triggerMethod()
                if (this.triggerMethod() === "mouseenter") this.hostElement.nativeElement.addEventListener("mouseenter", this.mouseenterEventHandler)
                else if (this.triggerMethod() === "click") this.hostElement.nativeElement.addEventListener("click", this.clickEventHandler)
            }
            if (this.#prevCloseTriggerMethod !== this.closeTriggerMethod()) {
                if (this.#prevCloseTriggerMethod === "mouseleave") this.hostElement.nativeElement.removeEventListener("mouseleave", this.mouseleaveEventHandler)
                else if (this.#prevCloseTriggerMethod === "click") {
                    document.removeEventListener("click", this.clickEventHandler)
                    document.removeEventListener("scroll", this.scrollEventHandler)
                }
                this.#prevCloseTriggerMethod = this.closeTriggerMethod()
                if (this.closeTriggerMethod() === "mouseleave") this.hostElement.nativeElement.addEventListener("mouseleave", this.mouseleaveEventHandler)
                else if (this.closeTriggerMethod() === "click") {
                    document.addEventListener("click", this.clickEventHandler)
                    document.addEventListener("scroll", this.scrollEventHandler, { capture: true })
                }
            }
        })
        effect(() => {
            if (this.disabled()) this.close()
        })
    }
    ngOnDestroy() {
        this.dispose()
    }
    open() {
        if (this.disabled() || this.#component || this.#delayTimeout == undefined || this.content() == undefined) return
        this.#delayTimeout = undefined
        this.#component = this.tooltipService.tip(this.content, this.context, this.hostElement, Object.assign({}, this.options(), {
            bindings: { float: this.float, preferedFloats: this.preferedFloats, align: this.align, padding: this.padding, duration: this.duration }
        } as BungPopupOptions<BungTooltipComponent>))
        const openedHandle = this.#component.opened.subscribe(() => {
            this.tooltipOpened.emit()
            openedHandle.unsubscribe()
        })
        const closedHandle = this.#component.closed.subscribe(() => {
            this.tooltipClosed.emit()
            closedHandle.unsubscribe()
        })
        this.#componentCloseHandle = this.#component.closed.subscribe(this.cleanEventHandler)
    }
    close() {
        if (this.#delayTimeout != undefined) {
            clearTimeout(this.#delayTimeout)
            this.cleanEventHandler()
            this.#component = undefined
            return
        }
        if (!this.#component) return
        if (this.#component.state() !== "show") {
            // open event not happened
            try {
                const ref = this.#component.opening.subscribe(ev => {
                    ev.isCanceled = true
                    ref.unsubscribe()
                })
            } catch {
                this.#component.close()
                this.#component = undefined
                this.cleanEventHandler()
                return
            }
        }
        if (this.duration() == Infinity) this.#component.close()
        this.#component = undefined
    }
    dispose() {
        this.hostElement.nativeElement.removeEventListener("mouseenter", this.mouseenterEventHandler)
        this.hostElement.nativeElement.removeEventListener("click", this.clickEventHandler)
        this.hostElement.nativeElement.removeEventListener("mouseleave", this.mouseleaveEventHandler)
        document.removeEventListener("click", this.clickEventHandler)
        document.removeEventListener("scroll", this.scrollEventHandler)
        this.close()
        this.cleanEventHandler()
    }
}
