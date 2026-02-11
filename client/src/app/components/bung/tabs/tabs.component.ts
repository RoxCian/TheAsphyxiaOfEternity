import { AfterViewInit, Component, ElementRef, Injector, OnDestroy, OutputRefSubscription, ViewEncapsulation, computed, contentChildren, inject, input, linkedSignal, output, signal, viewChild, viewChildren } from "@angular/core"
import { BungTabComponent } from "../tab/tab.component"
import { BungInsertionComponent } from "../insertion/insertion.component"
import { isUnloaded } from "../../../utils/functions"
import { asPromise } from "../../../signals/functions"
import { BungWaitableEvent } from "../../../utils/bung"

@Component({
    selector: "bung-tabs",
    templateUrl: "./tabs.component.html",
    styleUrls: ["./tabs.component.sass"],
    encapsulation: ViewEncapsulation.None,
    host: {
        "[class.is-loading]": "loadingTabIndex() != undefined"
    },
    standalone: false
})
export class BungTabsComponent implements AfterViewInit, OnDestroy {
    readonly tabs = contentChildren(BungTabComponent)
    readonly contentInsertion = viewChildren("contentInsertion", { read: BungInsertionComponent })
    readonly animateWrapper = viewChild<ElementRef<HTMLElement>>("tabsAnimateWrapper")
    readonly index = input<string | undefined>()
    readonly firstAvailableTabIndex = computed(() => this.tabs().find(t => !t.disabled()))
    private readonly activatedBackupInternal = linkedSignal(this.index)
    readonly activated = computed<string | undefined>(() => {
        const tabs = this.tabs()
        const activated = this.activatedBackupInternal()
        for (const tab of tabs) {
            if (tab.index() === activated) return activated
        }
        return tabs[0]?.index()
    })
    readonly indexChanged = output<string | undefined>()
    protected readonly direction = signal<"left" | "right" | undefined>(undefined)
    protected readonly currIndex = signal<string | undefined>(undefined)
    protected readonly leftIndex = signal<string | undefined>(undefined)
    protected readonly rightIndex = signal<string | undefined>(undefined)
    protected readonly loadingTabIndex = signal<string | undefined>(undefined)

    private readonly contentObserver = new ResizeObserver(() => this.checkStyle())
    private readonly injector = inject(Injector)

    #previousContentInsertion?: BungInsertionComponent
    #currentAnimation?: Animation

    ngAfterViewInit(): void {
        this.checkStyle()
        this.checkObserver()
    }
    ngOnDestroy(): void {
        if (this.#previousContentInsertion) this.contentObserver.unobserve(this.#previousContentInsertion.element.nativeElement)
    }
    protected getFirstAvailableTabIndex(): string | undefined {
        return this.tabs().find(t => !t.disabled())?.index()
    }
    protected async onChangeIndex(index: string) {
        if (index === this.currIndex()) return
        const dir = this.direction()
        const left = this.leftIndex()
        const right = this.rightIndex()
        let curr = this.currIndex()
        const tabs = this.tabs()
        let activated = this.activated() ?? this.getFirstAvailableTabIndex()
        if (activated == undefined) return
        let fromTab: BungTabComponent | undefined = undefined
        let toTab: BungTabComponent | undefined = undefined
        let fromIndex: string
        if (!dir && activated !== index) fromIndex = activated
        else if ((dir === "left" && left !== index) || (dir === "right" && right !== index)) fromIndex = curr!
        else return
        if (fromIndex !== index) {
            let fromLoc = -1
            let toLoc = -1
            for (let i = 0; i < tabs.length; i++) {
                const tabId = tabs[i]?.index()
                if (tabId === fromIndex) {
                    fromLoc = i
                    fromTab = tabs[i]
                }
                if (tabId === index) {
                    toLoc = i
                    toTab = tabs[i]
                }
                if (fromLoc >= 0 && toLoc >= 0) break
            }
            if (fromLoc < 0 || toLoc < 0 || fromLoc === toLoc) return
            const deactivateEvent: BungWaitableEvent = {
                canceled: false
            }
            const activateEvent: BungWaitableEvent = {
                canceled: false
            }
            fromTab?.deactivated.emit(deactivateEvent)
            toTab?.activated.emit(activateEvent)
            if (deactivateEvent.canceled || activateEvent.canceled) return
            else if (deactivateEvent.promise || activateEvent.promise || deactivateEvent.resource || activateEvent.resource) {
                try {
                    const promises = [deactivateEvent.promise, activateEvent.promise, deactivateEvent.resource ? asPromise(deactivateEvent.resource, this.injector) : undefined, activateEvent.resource ? asPromise(activateEvent.resource, this.injector) : undefined]
                    this.loadingTabIndex.set(index)
                    await Promise.all(promises)
                } catch {
                    return
                } finally {
                    this.loadingTabIndex.set(undefined)
                }
            }
            if (this.#currentAnimation) {
                this.#currentAnimation.cancel()
                this.#currentAnimation = undefined
                this.leftIndex.set(undefined)
                this.rightIndex.set(undefined)
                this.direction.set(undefined)
            }
            this.currIndex.set(fromIndex)
            if (fromLoc < toLoc) {
                this.leftIndex.set(index)
                this.direction.set("left")
            } else {
                this.rightIndex.set(index)
                this.direction.set("right")
            }
        }
        this.activatedBackupInternal.set(index)
        this.indexChanged.emit(index)
    }
    protected onTabViewInited() {
        this.onStartAnimation()
    }
    private async onStartAnimation() {
        const dir = this.direction()
        const left = this.leftIndex()
        const right = this.rightIndex()
        if (dir === undefined) return;
        let ein = this.animateWrapper()?.nativeElement.querySelector(dir === "left" ? ".tabs-content-wrapper.left" : ".tabs-content-wrapper.right")
        let eout = this.animateWrapper()?.nativeElement.querySelector(".tabs-content-wrapper:not(.left):not(.right)")
        if (!ein || !eout) return
        let fromHeight = eout.scrollHeight
        let toHeight = ein.scrollHeight
        this.unobserve()
        this.animateWrapper()!.nativeElement.style.setProperty("--from-height", `${fromHeight}px`)
        this.animateWrapper()!.nativeElement.style.setProperty("--height", `${toHeight}px`)
        this.animateWrapper()!.nativeElement.style.setProperty("--to-x", dir === "left" ? "calc(-100% - 2em)" : "calc(100% + 2em)")
        this.animateWrapper()?.nativeElement.classList.add("transit")
        const onAnimationEnd = (e: AnimationEvent) => {
            if (e.animationName !== "bung-tab-content-switch-animation") return
            this.activatedBackupInternal.set(dir === "left" ? left : right)
            this.currIndex.set(undefined)
            this.leftIndex.set(undefined)
            this.rightIndex.set(undefined)
            this.direction.set(undefined)
            this.animateWrapper()?.nativeElement.removeEventListener("animationend", onAnimationEnd)
            this.animateWrapper()?.nativeElement.removeEventListener("animationcancel", onAnimationEnd)
            this.animateWrapper()?.nativeElement.classList.remove("transit")
            requestAnimationFrame(() => {
                this.checkStyle()
                this.checkObserver()
                this.#currentAnimation?.cancel()
                this.#currentAnimation = undefined
            })
        }
        this.animateWrapper()?.nativeElement.addEventListener("animationend", onAnimationEnd)
        this.animateWrapper()?.nativeElement.addEventListener("animationcancel", onAnimationEnd)
        // requestAnimationFrame(() => {
        //     this.#currentAnimation = this.animateWrapper()?.nativeElement.animate([
        //         { transform: "none", height: `${fromHeight}px`, offset: "0%" },
        //         { transform: `translateX(calc(${dir === "left" ? "-100% - 2rem" : "100% + 2rem"}))`, height: `${toHeight}px`, offset: "99.9999%" },
        //         { height: "auto", offset: "100%" }
        //     ], { fill: "forwards", duration: 550, easing: "var(--ease-in)" })
        //     this.#currentAnimation?.addEventListener("finish", () => {
        //         this.activatedBackupInternal.set(dir == "left" ? left : right)
        //         this.currIndexInternal.set(undefined)
        //         this.leftIndexInternal.set(undefined)
        //         this.rightIndexInternal.set(undefined)
        //         this.directionInternal.set(undefined)
        //         requestAnimationFrame(() => {
        //             this.#currentAnimation?.cancel()
        //             this.#currentAnimation = undefined
        //         })
        //     })
        // })
    }
    private checkStyle() {
        if (isUnloaded(this.animateWrapper()?.nativeElement)) return
        // this.animateWrapper()!.nativeElement.style.transform = "none"
        this.animateWrapper()!.nativeElement.style.setProperty("--height", `${this.animateWrapper()!.nativeElement.querySelector(".tabs-content-wrapper:not(.left):not(.right)")?.scrollHeight ?? 0}px`)
    }
    private unobserve() {
        if (this.#previousContentInsertion) this.contentObserver.unobserve(this.#previousContentInsertion.element.nativeElement)
    }
    private checkObserver() {
        if (this.#previousContentInsertion === this.contentInsertion()[0]) return
        if (this.#previousContentInsertion) this.contentObserver.unobserve(this.#previousContentInsertion.element.nativeElement)
        this.#previousContentInsertion = this.contentInsertion()[0]
        this.contentObserver.observe(this.#previousContentInsertion.element.nativeElement)
    }
}
