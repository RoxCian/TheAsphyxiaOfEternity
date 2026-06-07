import { Component, computed, ElementRef, inject, input, model, signal, ViewEncapsulation } from "@angular/core"
import { BungPopupComponent } from "../popup/popup.component"
import { BungMenuDef, BungMenuDefComponent } from "../menu-def/menu-def.component"
import { BungMenuItemComponent } from "../menu-item/menu-item.component"
import { BungDropdownService } from "../../../services/bung/dropdown.service"
import { timeout } from "../../../utils/functions"

export type BungDropdownFloat = "align-left" | "left" | "top-and-align-left" | "top" | "top-and-align-right" | "align-right" | "right" | "bottom-and-align-right" | "bottom" | "bottom-and-align-left" | "auto"

declare global {
    interface ArrayConstructor {
        isArray(arg: ReadonlyArray<any> | any): arg is ReadonlyArray<any>
    }
}

@Component({
    selector: "bung-dropdown",
    templateUrl: "./dropdown.component.html",
    styleUrl: "./dropdown.component.sass",
    encapsulation: ViewEncapsulation.None,
    standalone: false,
    host: {
        "[class]": "class()",
        "[class.is-reversed]": "isReversed()",
        "[style.--dropdown-left]": "`${dropdownLeft()}px`",
        "[style.--dropdown-top]": "dropdownTop()",
        "[style.--dropdown-bottom]": "dropdownBottom()",
        "[style.--dropdown-width]": "`${dropdownWidth()}px`",
        "[style.--dropdown-height]": "`${dropdownHeight()}px`",
        "[style.--dropdown-content-init-top]": "dropdownContentInitTop()",
    }
})
export class BungDropdownComponent extends BungPopupComponent {
    readonly def = model<BungMenuDef>([])
    readonly float = model<BungDropdownFloat>("auto")
    readonly host = model<ElementRef<HTMLElement> | MouseEvent>()
    readonly isReversed = model(false)

    protected readonly class = computed(() => {
        let def = this.def()
        if (def instanceof BungMenuDefComponent) return def.class()
        return ""
    })

    protected readonly items = computed(() => {
        let def = this.def()
        if (def instanceof BungMenuDefComponent) return def.items()
        if (Array.isArray(def)) return def
        return []
    })
    protected readonly hasIcons = computed(() => this.items().some(i => i.icon() || i.iconUrl()))

    protected readonly dropdownLeft = signal(0)
    protected readonly dropdownTop = signal("")
    protected readonly dropdownBottom = signal("")
    protected readonly dropdownWidth = signal(0)
    protected readonly dropdownHeight = signal(0)
    protected readonly dropdownContentInitTop = signal("")

    protected readonly subDropdownFloat = computed(() => {
        const float = this.float()
        if (float === "left" || float === "right") return float
        return float.includes("align-right") ? "left" : "right"
    })
    protected readonly itemWithSubDropdown = signal<BungMenuItemComponent | undefined>(undefined)

    private readonly offset = 8
    private readonly dropdownService = inject(BungDropdownService)
    private readonly pageClickHandler = (e: MouseEvent) => this.onPageClick(e)

    #clearSubDropdownTimeout?: number
    #subDropdown?: BungDropdownComponent
    #prevDropdown?: BungDropdownComponent

    override open() {
        document.addEventListener("click", this.pageClickHandler)
        this.updatePosition()
        super.open()
    }
    override close() {
        document.removeEventListener("click", this.pageClickHandler)
        super.close()
        this.#subDropdown?.close()
    }
    updatePosition() {
        let float: BungDropdownFloat | `${"top" | "bottom"}-and-${"left" | "right"}` = this.float()
        const host = this.host()
        const hr = host instanceof MouseEvent ? new DOMRect(host.x, host.y, 0, 0) : (host?.nativeElement.getBoundingClientRect() ?? new DOMRect())
        const viewportRect = document.body.getBoundingClientRect()
        const tr = this.element?.nativeElement.getBoundingClientRect() ?? new DOMRect()
        if (float === "auto" || float === "align-left" || float === "align-right" || float === "left" || float === "right") {
            if (hr.bottom + this.offset + tr.height > viewportRect.height - this.offset) float = float === "auto" ? "top" : `top-and-${float}`
            else float = float === "auto" ? "bottom" : `bottom-and-${float}`
        }

        let x = 0
        let t = "auto"
        let b = "auto"
        let w = tr.width
        let initCY = "0"
        switch (float) {
            case "top-and-align-left":
                x = hr.x
                b = `${viewportRect.bottom - hr.top + this.offset}px`
                initCY = `calc(-${tr.height}px + 1em)`
                break
            case "top":
                w = Math.max(tr.width, hr.width)
                x = hr.x + hr.width / 2 - w / 2
                b = `${viewportRect.bottom - hr.top + this.offset}px`
                initCY = `calc(-${tr.height}px + 1em)`
                break
            case "top-and-align-right":
                x = hr.x + hr.width - tr.width
                b = `${viewportRect.bottom - hr.top + this.offset}px`
                initCY = `calc(-${tr.height}px + 1em)`
                break
            case "bottom-and-align-left":
                x = hr.x
                t = `${hr.top + hr.height + this.offset}px`
                initCY = `-1em`
                break
            case "bottom":
                w = Math.max(tr.width, hr.width)
                x = hr.x + hr.width / 2 - w / 2
                t = `${hr.top + hr.height + this.offset}px`
                initCY = `-1em`
                break
            case "bottom-and-align-right":
                x = hr.x + hr.width - tr.width
                t = `${hr.top + hr.height + this.offset}px`
                initCY = `-1em`
                break
            case "top-and-left":
                x = hr.x - tr.width - this.offset
                b = `calc(${viewportRect.bottom - hr.bottom}px - var(--dropdown-padding))`
                initCY = `calc(-${tr.height}px + 1em)`
                break
            case "top-and-right":
                x = hr.x + hr.width + this.offset
                b = `calc(${viewportRect.bottom - hr.bottom}px - var(--dropdown-padding))`
                initCY = `calc(-${tr.height}px + 1em)`
                break
            case "bottom-and-left":
                x = hr.x - tr.width - this.offset
                t = `calc(${hr.top}px - var(--dropdown-padding))`
                initCY = `-1em`
                break
            case "bottom-and-right":
                x = hr.x + hr.width + this.offset
                t = `calc(${hr.top}px - var(--dropdown-padding))`
                initCY = `-1em`
                break
        }
        if (x < this.offset) x = this.offset
        else if (x + tr.width > viewportRect.width - this.offset) x = viewportRect.width - this.offset - tr.width
        this.dropdownLeft.set(x)
        this.dropdownTop.set(t)
        this.dropdownBottom.set(b)
        this.dropdownWidth.set(w)
        this.dropdownHeight.set(tr.height)
        this.dropdownContentInitTop.set(initCY)
    }

    protected onClick(item: BungMenuItemComponent, e: MouseEvent) {
        if (item.disabled()) return
        if (e.button === 0) {
            item.click.emit()
            if (!item.isStatic()) {
                let dd: BungDropdownComponent | undefined = this
                while (dd) {
                    dd.close()
                    dd = dd.#prevDropdown
                }
            }
        }
        else if (e.button === 1) item.rightclick.emit()
    }
    protected onFocus(item: BungMenuItemComponent) {
        if (item.disabled()) return
        item.focus.emit()
    }
    protected onBlur(item: BungMenuItemComponent) {
        if (item.disabled()) return
        item.blur.emit()
    }
    protected onMouseOver(item: BungMenuItemComponent, e: MouseEvent) {
        if (item.disabled()) return
        item.mouseover.emit(e)
    }
    protected async onMouseEnter(item: BungMenuItemComponent, e: MouseEvent) {
        if (item.disabled()) return
        item.mouseenter.emit(e)
        if (this.itemWithSubDropdown() === item) {
            window.clearTimeout(this.#clearSubDropdownTimeout)
            this.#clearSubDropdownTimeout = undefined
        } else if (item.subItems().length > 0) {
            this.itemWithSubDropdown.set(item)
            if (this.#subDropdown) this.#subDropdown.close()
            this.#subDropdown = this.dropdownService.dropdown(item.subItems, { nativeElement: e.target as HTMLElement }, {
                backdropOptions: {
                    hasBackdrop: false
                },
                setter: dd => {
                    dd.float.set(this.subDropdownFloat())
                    dd.element.nativeElement.addEventListener("mouseenter", () => this.onMouseEnterSubDropdown())
                    dd.element.nativeElement.addEventListener("mouseleave", () => this.onMouseLeaveSubDropdown())
                    if (this.element.nativeElement.classList.contains("is-small")) dd.element.nativeElement.classList.add("is-small")
                    if (this.element.nativeElement.classList.contains("is-medium")) dd.element.nativeElement.classList.add("is-medium")
                    if (this.element.nativeElement.classList.contains("is-large")) dd.element.nativeElement.classList.add("is-large")
                }
            })
            this.#subDropdown.#prevDropdown = this
            await timeout()
            this.#subDropdown.open()
        }
    }
    protected onMouseLeave(item: BungMenuItemComponent, e: MouseEvent) {
        if (item.disabled()) return
        item.mouseleave.emit(e)
        const subdd = this.#subDropdown
        if (item.subItems().length > 0) {
            if (this.#clearSubDropdownTimeout != undefined) window.clearTimeout(this.#clearSubDropdownTimeout)
            this.#clearSubDropdownTimeout = window.setTimeout(() => {
                const i = this.itemWithSubDropdown()
                if (i === item) {
                    this.itemWithSubDropdown.set(undefined)
                    subdd?.close()
                    if (this.#subDropdown === subdd) this.#subDropdown = undefined
                }
                this.#clearSubDropdownTimeout = undefined
            }, 200)
        }
    }
    protected onMouseEnterSubDropdown() {
        window.clearTimeout(this.#clearSubDropdownTimeout)
        this.#clearSubDropdownTimeout = undefined
        this.#prevDropdown?.onMouseEnterSubDropdown()
    }
    protected onMouseLeaveSubDropdown() {
        const subdd = this.#subDropdown
        if (this.#clearSubDropdownTimeout != undefined) window.clearTimeout(this.#clearSubDropdownTimeout)
        this.#clearSubDropdownTimeout = window.setTimeout(() => {
            this.itemWithSubDropdown.set(undefined)
            subdd?.close()
            if (this.#subDropdown === subdd) this.#subDropdown = undefined
            this.#clearSubDropdownTimeout = undefined
        }, 200)
        this.#prevDropdown?.onMouseLeaveSubDropdown()
    }
    includeElement(el: HTMLElement): boolean {
        if (this.element.nativeElement.contains(el)) return true
        return !!this.#subDropdown?.includeElement(el)
    }
    private onPageClick(e: MouseEvent) {
        if (this.includeElement(e.target as HTMLElement)) return
        this.close()
    }
}
