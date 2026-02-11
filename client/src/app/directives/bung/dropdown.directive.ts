import { Directive, ElementRef, OnDestroy, OutputRefSubscription, computed, effect, inject, input, inputBinding, model, output, signal } from "@angular/core"
import { BungMenuDef } from "../../components/bung/menu-def/menu-def.component"
import { BungPopupOptions } from "../../utils/bung"
import { BungDropdownComponent, BungDropdownFloat } from "../../components/bung/dropdown/dropdown.component"
import { BungDropdownService } from "../../services/bung/dropdown.service"
import { throttle } from "../../utils/functions"
import { toggleTransform } from "../../signals/transforms"

@Directive({
    selector: "[bungDropdown]",
    standalone: false
})
export class BungDropdownDirective implements OnDestroy {
    readonly def = input.required<BungMenuDef>({ alias: "bungDropdown" })
    readonly options = input<BungPopupOptions<BungDropdownComponent> | undefined>(undefined)
    readonly hostElement = inject<ElementRef<HTMLElement>>(ElementRef)
    readonly triggerMethod = input<"mouseenter" | "click" | "contextmenu">("click")
    readonly closeTriggerMethod = input<"mouseleave" | "click">("click")
    readonly isContextMenu = computed(() => this.triggerMethod() === "contextmenu")
    readonly float = input<BungDropdownFloat>("auto")
    readonly delay = input<number>(0)
    readonly duration = input<number>(Infinity)
    readonly disabled = input(false, { transform: toggleTransform })
    private readonly isDropdownOpenInternal = signal(false)
    readonly isDropdownOpen = this.isDropdownOpenInternal.asReadonly()
    readonly isReversed = input(false, { transform: toggleTransform })
    readonly activeClass = model("is-dropdown-active")
    readonly dropdownOpened = output()
    readonly dropdownClosed = output()

    private readonly dropdownService = inject(BungDropdownService)

    #lastMouseEvent?: MouseEvent
    #prevTriggerMethod?: "mouseenter" | "click" | "contextmenu"
    #prevCloseTriggerMethod?: "mouseleave" | "click"
    #delayTimeout?: number
    #closeTimeout?: number
    #component?: BungDropdownComponent
    #componentCloseHandle?: OutputRefSubscription
    #componentClosingHandle?: OutputRefSubscription
    #lastAvtiveClass?: string

    private readonly mouseenterEventHandler = (e: MouseEvent) => {
        if (this.disabled()) return
        if (this.#closeTimeout != undefined) {
            this.cancelClose()
            return
        }
        this.#delayTimeout = window.setTimeout(() => this.open(), this.delay())
    }
    private readonly contextmenuEventHandler = (e: MouseEvent) => {
        if (this.disabled()) return
        if (this.#delayTimeout != undefined || this.#component) return
        this.#lastMouseEvent = e
        this.#delayTimeout = window.setTimeout(() => this.open(), this.delay())
        e.preventDefault()
        e.stopImmediatePropagation()
    }
    private readonly mouseleaveEventHandler = (e: MouseEvent) => {
        this.#closeTimeout = window.setTimeout(() => this.close(this.#component), 200)
    }
    private readonly clickEventHandler = (e: MouseEvent) => {
        if (this.disabled()) return
        if (e.button !== 0) return
        if (!this.#component) {
            if (this.#delayTimeout != undefined || !this.hostElement.nativeElement.contains(e.target as HTMLElement)) return
            if (this.#delayTimeout == undefined && this.triggerMethod() !== "contextmenu") {
                this.#delayTimeout = window.setTimeout(() => this.open(), this.delay())
                return
            } else if (this.closeTriggerMethod() === "click") {
                this.close()
            }
            return
        }
        // if (this.#component.includeElement(e.target as HTMLElement)) return
        // if (this.closeTriggerMethod() !== "click") return
        if (this.#delayTimeout != undefined) {
            clearTimeout(this.#delayTimeout)
            return
        }
        if (!this.#component) return
        this.close()
    }
    private readonly cleanEventHandler = (component?: BungDropdownComponent) => {
        this.#componentCloseHandle?.unsubscribe()
        this.#componentCloseHandle = undefined
        this.#componentClosingHandle?.unsubscribe()
        this.#componentClosingHandle = undefined
        this.#delayTimeout = undefined
        if (component === this.#component) this.#component = undefined
        this.isDropdownOpenInternal.set(false)
    }
    private readonly removeActiveHandler = () => {
        if (this.#lastAvtiveClass) this.hostElement.nativeElement.classList.remove(this.#lastAvtiveClass)
        this.#lastAvtiveClass = undefined
    }
    private readonly scrollEventHandler = throttle(() => this.#component?.updatePosition(), undefined, 17)
    private readonly cancelClose = (() => {
        window.clearTimeout(this.#closeTimeout)
        this.#closeTimeout = undefined
    })

    constructor() {
        effect(() => {
            if (this.#prevTriggerMethod !== this.triggerMethod()) {
                if (this.#prevTriggerMethod === "contextmenu") this.hostElement.nativeElement.removeEventListener("contextmenu", this.contextmenuEventHandler)
                else if (this.#prevTriggerMethod === "mouseenter") {
                    this.hostElement.nativeElement.removeEventListener("click", this.clickEventHandler)
                    this.hostElement.nativeElement.removeEventListener("mouseenter", this.mouseenterEventHandler)
                }
                else if (this.#prevTriggerMethod === "click") this.hostElement.nativeElement.removeEventListener("click", this.clickEventHandler)
                this.#prevTriggerMethod = this.triggerMethod()
                if (this.triggerMethod() === "contextmenu") this.hostElement.nativeElement.addEventListener("contextmenu", this.contextmenuEventHandler)
                else if (this.triggerMethod() === "mouseenter") {
                    this.hostElement.nativeElement.addEventListener("click", this.clickEventHandler)
                    this.hostElement.nativeElement.addEventListener("mouseenter", this.mouseenterEventHandler) // if a dropdown menu can be triggered by mouse hovering, intuitively it also should be triggered by clicking.
                }
                else if (this.triggerMethod() === "click") this.hostElement.nativeElement.addEventListener("click", this.clickEventHandler)
            }
            if (this.#prevCloseTriggerMethod !== this.closeTriggerMethod()) {
                if (this.#prevCloseTriggerMethod === "mouseleave") this.hostElement.nativeElement.removeEventListener("mouseleave", this.mouseleaveEventHandler)
                else if (this.#prevCloseTriggerMethod === "click") document.removeEventListener("click", this.clickEventHandler)
                this.#prevCloseTriggerMethod = this.closeTriggerMethod()
                if (this.closeTriggerMethod() === "mouseleave") this.hostElement.nativeElement.addEventListener("mouseleave", this.mouseleaveEventHandler)
                else if (this.closeTriggerMethod() === "click") document.addEventListener("click", this.clickEventHandler)
            }
            if (this.#prevTriggerMethod === "mouseenter" && this.#prevCloseTriggerMethod === "mouseleave") document.addEventListener("scroll", this.scrollEventHandler, { capture: true })
            else document.removeEventListener("scroll", this.scrollEventHandler)
        })
        effect(() => {
            if (this.triggerMethod() !== "contextmenu" && !(this.options()?.backdropOptions?.hasBackdrop ?? true)) document.addEventListener("scroll", this.scrollEventHandler)
        })
        effect(() => this.disabled() ? this.close() : undefined)
    }
    ngOnDestroy() {
        this.dispose()
    }
    open() {
        if ((this.#component && this.#component.state() !== "out") || this.#delayTimeout == undefined) return
        this.#delayTimeout = undefined
        this.#component = this.dropdownService.dropdown(this.def, this.#lastMouseEvent ?? this.hostElement, Object.assign({}, this.options(), {
            bindings: [
                inputBinding("float", this.float),
                inputBinding("isReversed", this.isReversed)
            ]
        }))
        this.#lastMouseEvent = undefined
        this.isDropdownOpenInternal.set(true)
        this.#lastAvtiveClass = this.activeClass()
        this.hostElement.nativeElement.classList.add(this.#lastAvtiveClass)
        if (this.closeTriggerMethod() === "mouseleave") {
            this.#component.element.nativeElement.addEventListener("mouseenter", this.cancelClose)
            this.#component.element.nativeElement.addEventListener("mouseleave", this.mouseleaveEventHandler)
        }
        this.#componentCloseHandle = this.#component.closed.subscribe(this.cleanEventHandler)
        this.#componentClosingHandle = this.#component.closing.subscribe(this.removeActiveHandler)
    }
    close(component?: BungDropdownComponent) {
        this.#closeTimeout = undefined
        if (this.#delayTimeout != undefined) {
            clearTimeout(this.#delayTimeout)
            this.cleanEventHandler(component ?? this.#component)
            return
        }
        if (!component && !this.#component) return
        if ((component ?? this.#component)?.state() !== "show") {
            // open event not happened
            const ref = (component ?? this.#component)?.opening.subscribe(ev => {
                ev.isCanceled = true
                ref?.unsubscribe()
            })
        }
        (component ?? this.#component)?.close()
        this.#lastMouseEvent = undefined
    }
    dispose() {
        this.hostElement.nativeElement.removeEventListener("mouseenter", this.mouseenterEventHandler)
        this.hostElement.nativeElement.removeEventListener("click", this.clickEventHandler)
        this.hostElement.nativeElement.removeEventListener("mouseleave", this.mouseleaveEventHandler)
        document.removeEventListener("click", this.clickEventHandler)
        document.removeEventListener("scroll", this.scrollEventHandler)
        this.#componentCloseHandle?.unsubscribe()
    }
}
