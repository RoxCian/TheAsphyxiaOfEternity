import { AfterViewInit, Component, effect, ElementRef, inject, input, output, signal, viewChild } from "@angular/core"

export type AutoLoadEvent = {
    result?: "failed" | "finished" | Promise<"failed" | "finished" | undefined>
}

@Component({
    selector: "auto-load-panel",
    standalone: false,
    templateUrl: "./auto-load-panel.component.html",
    styleUrls: ["./auto-load-panel.component.sass"]
})
export class AutoLoadPanelComponent implements AfterViewInit {
    readonly bottomMargin = input<number>(640)
    readonly loading = output<AutoLoadEvent>()
    readonly element = inject<ElementRef<HTMLElement>>(ElementRef)
    private readonly isLoadFinishedInternal = signal(false)
    readonly isLoadFinished = this.isLoadFinishedInternal.asReadonly()

    private readonly bottom = viewChild<ElementRef<HTMLElement>>("autoLoadBottom")

    private readonly mutationObserver = new MutationObserver(e => {
        this.onCheck()
    })
    private readonly intersectionObserver = new IntersectionObserver(e => {
        this.onCheck()
    }, { rootMargin: "640px" })
    private readonly resizeObserver = new ResizeObserver(e => {
        this.onCheck()
    })
    #bottomMarginBackup = 640
    #isCheckingIntersection = false
    #isNextCheckQueued = false

    constructor() {
        this.mutationObserver.observe(this.element.nativeElement, { childList: true, subtree: true })
        this.resizeObserver.observe(this.element.nativeElement)
        document.onscroll = () => {
            this.onCheck()
        }
        effect(() => {
            if (this.bottomMargin() === this.#bottomMarginBackup || this.isLoadFinishedInternal()) return
            this.checkIntersect()
            this.#bottomMarginBackup = this.bottomMargin()
        })
    }

    ngAfterViewInit(): void {
        const bottomEl = this.bottom()?.nativeElement
        if (bottomEl) this.intersectionObserver.observe(bottomEl)
    }
    reset() {
        this.isLoadFinishedInternal.set(false)
    }

    private onCheck() {
        this.checkIntersect()
    }
    private async checkIntersect() {
        if (this.#isCheckingIntersection) return
        const rect = this.element.nativeElement.getBoundingClientRect()
        if (rect.x === 0 && rect.y === 0 && rect.width === 0 && rect.height === 0) return
        if (rect.bottom > window.innerHeight + this.bottomMargin() || rect.top > window.innerHeight + this.bottomMargin()) return
        this.#isCheckingIntersection = true
        setTimeout(() => {
            this.#isCheckingIntersection = false
            if (this.#isNextCheckQueued) {
                this.#isNextCheckQueued = false
                this.checkIntersect()
            }
        }, 50)
        if (this.isLoadFinished()) return
        const event: AutoLoadEvent = {}
        this.loading.emit(event)
        let result: "failed" | "finished" | undefined = undefined
        if (event.result instanceof Promise) result = await event.result
        else result = event.result

        if (!result) {
            if (this.#isCheckingIntersection) this.#isNextCheckQueued = true
            else this.checkIntersect()
            return
        }
        if (result === "failed") setTimeout(() => this.checkIntersect(), 500)
        else this.isLoadFinishedInternal.set(true)
    }
}
