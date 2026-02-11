import { AfterViewInit, Component, ElementRef, OnDestroy, ViewEncapsulation, computed, effect, inject, input, signal, viewChild } from "@angular/core"
import { BungInsertionComponent } from "../insertion/insertion.component"
import { BungInsertionContent } from "../../../utils/bung"
import { throttle } from "../../../utils/functions"
import { linkedToggle, toggleTransform } from "../../../signals/transforms"

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
    readonly clonedElement = computed(() => <HTMLElement>this.contentInsertion()?.element?.nativeElement.cloneNode(true))
    readonly isOverflowed = signal(false)
    readonly easingWhenHasDelay = computed(() => getMarqueeEasing(this.duration(), 1 /* second */))
    private readonly contentInsertion = viewChild("contentInsertion", { read: BungInsertionComponent })
    private readonly elementSize = signal(0)
    private readonly contentSize = signal(0)
    private readonly checkOverflowedCallback = throttle(this.checkOverflowed, this, 500)
    private readonly observer = new ResizeObserver(() => this.checkOverflowedCallback())

    constructor() {
        effect(() => this.checkOverflowedCallback())
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
}

function getMarqueeEasing(duration: number, easingTime: number): string {
    if (easingTime * 2 >= duration) return "cubic-bezier(0.5, 0, 0.5, 1)"
    const ratio = easingTime / duration
    return `cubic-bezier(${ratio}, 0, ${1 - ratio}, 1.000)`
}