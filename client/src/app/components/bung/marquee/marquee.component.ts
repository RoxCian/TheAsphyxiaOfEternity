import { AfterViewInit, Component, ElementRef, OnDestroy, ViewEncapsulation, computed, effect, inject, input, signal, viewChild } from "@angular/core"
import { BungInsertionComponent } from "../insertion/insertion.component"
import { BungInsertionContent } from "../../../utils/bung"
import { throttle } from "../../../utils/functions"
import { linkedToggle, toggleTransform } from "../../../signals/transforms"
import { BungTooltipService } from "../../../services/bung/tooltip.service"

@Component({
    selector: "bung-marquee",
    templateUrl: "./marquee.component.html",
    styleUrls: ["./marquee.component.sass"],
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class BungMarqueeComponent implements AfterViewInit, OnDestroy {
    readonly content = input<BungInsertionContent>()
    readonly context = input<any>()
    readonly speed = input(1)
    readonly spacing = input(36)
    readonly delay = input(0)
    readonly isVertical = input(false, { transform: toggleTransform })
    readonly disabledInput = input(false, { alias: "disabled", transform: toggleTransform })
    readonly disabled = linkedToggle(this.disabledInput)
    readonly contentAlign = input<"start" | "end" | "center" | "stretch">("start")
    readonly duration = computed(() => Math.abs(this.speed()) * (this.contentSize() + this.spacing()) / 100) // in seconds
    readonly element = inject<ElementRef<HTMLElement>>(ElementRef)
    private readonly updateFlag = signal(0)
    readonly clonedElement = computed(() => this.updateFlag() >= 0 ? <HTMLElement>this.contentInsertion()?.element?.nativeElement.cloneNode(true) : new HTMLElement())
    readonly isOverflowed = signal(false)
    readonly easingWhenHasDelay = computed(() => getMarqueeEasing(this.duration(), 1 /* second */))

    readonly isDblClickCopyDisabled = input(false, { transform: toggleTransform })
    readonly isLongTapCopyDisabled = input(false, { transform: toggleTransform})
    private readonly contentInsertion = viewChild("contentInsertion", { read: BungInsertionComponent })
    private readonly elementSize = signal(0)
    private readonly contentSize = signal(0)
    private readonly checkOverflowedCallback = throttle(this.checkOverflowed, this, 500)
    private readonly observer = new ResizeObserver(() => this.checkOverflowedCallback())
    private readonly elementEventListeners: Record<string, EventListener> = {}
    private readonly tooltipService = inject(BungTooltipService)

    #touchStarted?: number

    constructor() {
        effect(() => this.checkOverflowedCallback())
        effect(() => {
            const el = this.element.nativeElement
            if (this.isLongTapCopyDisabled()) {
                if (this.elementEventListeners["touchstart"]) {
                    el.removeEventListener("touchstart", this.elementEventListeners["touchstart"])
                    delete this.elementEventListeners["touchstart"]
                }
                if (this.elementEventListeners["touchend"]) {
                    el.removeEventListener("touchend", this.elementEventListeners["touchend"])
                    delete this.elementEventListeners["touchend"]
                }
                if (this.elementEventListeners["touchmove"]) {
                    el.removeEventListener("touchmove", this.elementEventListeners["touchmove"])
                    delete this.elementEventListeners["touchmove"]
                }
                if (this.elementEventListeners["touchcancel"]) {
                    el.removeEventListener("touchcancel", this.elementEventListeners["touchcancel"])
                    delete this.elementEventListeners["touchcancel"]
                }
            } else {
                if (!this.elementEventListeners["touchstart"]) {
                    this.elementEventListeners["touchstart"] = e => this.onTouchStart(e)
                    el.addEventListener("touchstart", this.elementEventListeners["touchstart"])
                }
                if (!this.elementEventListeners["touchend"]) {
                    this.elementEventListeners["touchend"] = e => this.onTouchEnd(e)
                    el.addEventListener("touchend", this.elementEventListeners["touchend"])
                }
                if (!this.elementEventListeners["touchmove"]) {
                    this.elementEventListeners["touchmove"] = e => this.onTouchEnd(e)
                    el.addEventListener("touchmove", this.elementEventListeners["touchmove"])
                }
                if (!this.elementEventListeners["touchcancel"]) {
                    this.elementEventListeners["touchcancel"] = e => this.onTouchEnd(e)
                    el.addEventListener("touchcancel", this.elementEventListeners["touchcancel"])
                }
            }
            if (this.isDblClickCopyDisabled()) {
                if (this.elementEventListeners["dblclick"]) {
                    el.removeEventListener("dblclick", this.elementEventListeners["dblclick"])
                    delete this.elementEventListeners["dblclick"]
                }
            } else if (!this.elementEventListeners["dblclick"]) {
                this.elementEventListeners["dblclick"] = () => this.copyText()
                el.addEventListener("dblclick", this.elementEventListeners["dblclick"])
            }
        })
        this.observer.observe(this.element.nativeElement)
    }
    ngAfterViewInit(): void {
        this.checkOverflowed()
    }
    ngOnDestroy(): void {
        this.observer.unobserve(this.element.nativeElement)
    }
    private checkOverflowed(isAsync: boolean = false) {
        const oldElementSize = this.elementSize()
        const newElementSize = this.isVertical() ? this.element.nativeElement.offsetHeight : this.element.nativeElement.offsetWidth
        const oldContentSize = this.contentSize()
        const newContentSize = (this.isVertical() ? this.contentInsertion()?.element?.nativeElement.offsetHeight : this.contentInsertion()?.element?.nativeElement.offsetWidth) ?? 0
        const oldValue = this.isOverflowed()
        const newValue = newElementSize < newContentSize
        if (oldElementSize === newElementSize && oldContentSize === newContentSize && newValue === oldValue) return
        if (isAsync) {
            setTimeout(() => {
                if (oldElementSize !== newElementSize) this.elementSize.set(newElementSize)
                if (oldContentSize !== newContentSize) this.contentSize.set(newContentSize)
                if (newValue !== oldValue) {
                    this.isOverflowed.set(newValue)
                }
            }, 0)
        } else {
            if (oldElementSize !== newElementSize) this.elementSize.set(newElementSize)
            if (oldContentSize !== newContentSize) this.contentSize.set(newContentSize)
            if (newValue !== oldValue) {
                this.isOverflowed.set(newValue)
            }
        }
    }
    markContentUpdated() {
        setTimeout(() => {
            this.updateFlag.update(f => f += 1)
            this.checkOverflowed()
        }, 0)
    }
    private onTouchStart(e: Event) {
        e.preventDefault()
        e.stopImmediatePropagation()
        this.#touchStarted = Date.now()
    }
    private onTouchEnd(e: Event) {
        e.preventDefault()
        e.stopImmediatePropagation()
        if (this.#touchStarted == undefined) return
        const elapsed = Date.now() - this.#touchStarted
        if (elapsed > 200) this.copyText()
        this.#touchStarted = undefined
    }
    copyText() {
        const contentEl = this.element.nativeElement.querySelector(".marquee-animation-wrapper > .marquee-content")
        if (!contentEl || !(contentEl instanceof HTMLElement)) return
        navigator.clipboard.writeText(contentEl.innerText)
        this.tooltipService.tip("Text copied", undefined, this.element, {
            duration: 1000
        })
    }
}

function getMarqueeEasing(duration: number, easingTime: number): string {
    if (easingTime * 2 >= duration) return "cubic-bezier(0.5, 0, 0.5, 1)"
    const ratio = easingTime / duration
    return `cubic-bezier(${ratio}, 0, ${1 - ratio}, 1.000)`
}