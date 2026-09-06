import { Component, computed, ElementRef, inject, input, model, signal, ViewEncapsulation } from "@angular/core"
import { BungPopupComponent } from "../popup/popup.component"
import { BungMenuDef, BungMenuDefComponent } from "../menu-def/menu-def.component"
import { BungMenuItemComponent } from "../menu-item/menu-item.component"
import { BungDropdownService } from "../../../services/bung/dropdown.service"
import { timeout, toPixelsLength } from "../../../utils/functions"

export type BungDropdownFloat = "left" | "top" | "right" | "bottom" | "covered" | "auto"
export type BungDropdownFloatExtend = "left" | "top" | "right" | "bottom" | "horizontal" | "vertical" | "covered"
export type BungDropdownAlign = "start" | "center" | "end" | "stretch"

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
        "[style.--dropdown-top]": "`${dropdownTop()}px`",
        "[style.--dropdown-width]": "`${dropdownWidth()}px`",
        "[style.--dropdown-height]": "`${dropdownHeight()}px`",
        "[style.--dropdown-init-left]": "`${dropdownInitLeft()}px`",
        "[style.--dropdown-init-top]": "`${dropdownInitTop()}px`",
        "[style.--dropdown-init-width]": "`${dropdownInitWidth()}px`",
        "[style.--dropdown-init-height]": "`${dropdownInitHeight()}px`",
        "[style.--dropdown-content-init-top]": "dropdownContentInitTop()",
        "[style.--dropdown-content-init-left]": "dropdownContentInitLeft()",
    }
})
export class BungDropdownComponent extends BungPopupComponent {
    readonly def = model<BungMenuDef>([])
    readonly float = model<BungDropdownFloat>("auto")
    readonly preferedFloats = model<BungDropdownFloatExtend | BungDropdownFloatExtend[]>("vertical")
    readonly align = model<BungDropdownAlign>("stretch")
    readonly alignOverflowed = model<BungDropdownAlign>("start")
    readonly minWidth = model<string>("12em")
    readonly padding = model<number | [number, number] | [number, number, number, number]>(32)
    readonly host = model<ElementRef<HTMLElement> | MouseEvent>()
    readonly isReversed = model(false)

    protected readonly class = signal("")
    protected readonly itemsClass = signal<string[]>([])

    protected readonly items = computed(() => {
        let def = this.def()
        if (def instanceof BungMenuDefComponent) return def.items()
        if (Array.isArray(def)) return def
        return []
    })
    protected readonly hasIcons = computed(() => this.items().some(i => i.icon() || i.iconUrl()))

    protected readonly dropdownLeft = signal(0)
    protected readonly dropdownTop = signal(0)
    protected readonly dropdownWidth = signal(0)
    protected readonly dropdownHeight = signal(0)
    protected readonly dropdownInitLeft = signal(0)
    protected readonly dropdownInitTop = signal(0)
    protected readonly dropdownInitWidth = signal(0)
    protected readonly dropdownInitHeight = signal(0)
    protected readonly dropdownContentInitLeft = signal("0")
    protected readonly dropdownContentInitTop = signal("0")

    protected readonly isContainerAlignBottom = signal(false)
    protected readonly isContainerAlignRight = signal(false)

    protected readonly subDropdownFloat = computed(() => {
        const float = this.float()
        if (float === "left" || float === "right") return float
        return float.includes("align-right") ? "left" : "right"
    })
    protected readonly itemWithSubDropdown = signal<BungMenuItemComponent | undefined>(undefined)

    protected readonly paddingComputed = computed(() => {
        const padding = this.padding()
        if (typeof padding === "number") return [padding, padding, padding, padding] as const
        if (padding.length === 2) return [padding[0], padding[1], padding[0], padding[1]] as const
        return padding
    })

    private readonly offset = 8
    private readonly dropdownService = inject(BungDropdownService)
    private readonly pageClickHandler = (e: MouseEvent) => this.onPageClick(e)

    #clearSubDropdownTimeout?: number
    #subDropdown?: BungDropdownComponent
    #prevDropdown?: BungDropdownComponent

    ngAfterViewInit() {
        this.updateClass()
    }

    override open() {
        document.addEventListener("click", this.pageClickHandler)
        this.updateClass()
        this.updatePosition()
        super.open()
    }
    override close() {
        document.removeEventListener("click", this.pageClickHandler)
        super.close()
        this.#subDropdown?.close()
    }
    updateClass() {
        const def = this.def()
        if (def instanceof BungMenuDefComponent) this.class.set(def.class())
        else this.class.set("")

        const items = this.items()
        this.itemsClass.set(items.map(i => i.element.nativeElement.classList.toString()))
    }
    updatePosition() {
        let float = this.float()
        const preferedFloats = this.preferedFloats()
        const floatSelectArray: ("left" | "top" | "right" | "bottom" | "covered")[] = []
        const host = this.host()
        const hr = host instanceof MouseEvent ? new DOMRect(host.x, host.y, 0, 0) : host?.nativeElement.getBoundingClientRect() ?? new DOMRect()
        const tr = this.element?.nativeElement.getBoundingClientRect() ?? new DOMRect()
        const padding = this.paddingComputed()
        const viewportRect = document.body.getBoundingClientRect()
        if (float === "auto") {
            for (const f of Array.isArray(preferedFloats) ? preferedFloats : [preferedFloats]) {
                switch (f) {
                    case "left": case "top": case "right": case "bottom":
                    case "covered":
                        if (!floatSelectArray.includes(f)) floatSelectArray.push(f)
                        break
                    case "horizontal":
                        if (!floatSelectArray.includes("right")) floatSelectArray.push("right")
                        if (!floatSelectArray.includes("left")) floatSelectArray.push("left")
                        break
                    case "vertical":
                        if (!floatSelectArray.includes("bottom")) floatSelectArray.push("bottom")
                        if (!floatSelectArray.includes("top")) floatSelectArray.push("top")
                        break
                }
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
                case "covered":
                    float = f
                    break
            }
            if (float !== "auto") break
        }
        if (float === "auto") float = floatSelectArray[floatSelectArray.length - 1]

        let x = 0
        let y = 0
        const minWidth = toPixelsLength(this.element.nativeElement, this.minWidth())
        let w = Math.max(tr.width, minWidth)
        let h = tr.height
        let initX = 0
        let initY = 0
        let initW = 0
        let initH = 0
        let cT = "0"
        let cL = "0"
        let cAlignBottom = false
        let cAlignRight = false
        const clampX = (x: number) => Math.min(Math.max(x, padding[0]), viewportRect.right - padding[2])
        const clampY = (y: number) => Math.min(Math.max(y, padding[0]), viewportRect.bottom - padding[3])
        const align = (float === "left" || float === "right" ? tr.height > hr.height : w > hr.width) ? this.alignOverflowed() : this.align()
        switch (float) {
            case "top":
                switch (align) {
                    case "start":
                        x = this.isReversed() ? clampX(hr.x + hr.width - w) : clampX(hr.x)
                        break
                    case "end":
                        x = this.isReversed() ? clampX(hr.x) : clampX(hr.x + hr.width - w)
                        break
                    case "center":
                        x = clampX(hr.x + hr.width / 2 - w / 2)
                        break
                    case "stretch":
                        x = clampX(hr.x)
                        w = Math.max(hr.width, minWidth)
                        break
                }
                y = clampY(hr.y - tr.height - this.offset)
                initX = x
                initY = y + tr.height
                initW = w
                initH = 0
                cT = `1em`
                cAlignBottom = true
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
                x = clampX(hr.x - w - this.offset)
                initX = x + w
                initY = y
                initW = 0
                initH = h
                cL = `1em`
                cAlignRight = true
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
                initX = x
                initY = y
                initW = 0
                initH = h
                cL = "-1em"
                break
            case "bottom":
                switch (align) {
                    case "start":
                        x = this.isReversed() ? clampX(hr.x + hr.width - w) : clampX(hr.x)
                        break
                    case "end":
                        x = this.isReversed() ? clampX(hr.x) : clampX(hr.x + hr.width - w)
                        break
                    case "center":
                        x = clampX(hr.x + hr.width / 2 - w / 2)
                        break
                    case "stretch":
                        x = clampX(hr.x)
                        w = Math.max(hr.width, minWidth)
                        break
                }
                y = clampY(hr.y + hr.height + this.offset)
                initX = x
                initY = y
                initW = w
                initH = 0
                cT = `-1em`
                break
            case "covered":
                switch (align) {
                    case "start":
                        x = this.isReversed() ? clampX(hr.x + hr.width - w) : clampX(hr.x)
                        y = clampY(hr.y)
                        break
                    case "end":
                        x = this.isReversed() ? clampX(hr.x) : clampX(hr.x + hr.width - w)
                        y = clampY(hr.y + hr.height - tr.height)
                        break
                    case "center":
                        x = clampX(hr.x + hr.width / 2 - w / 2)
                        y = clampY(hr.y + hr.height / 2 - tr.height / 2)
                        break
                    case "stretch":
                        x = clampX(hr.x)
                        y = clampY(hr.y)
                        w = hr.width
                        h = hr.height
                        break
                }
                initX = x
                initY = hr.y + tr.height / 2
                initH = 0

        }
        if (w + padding[0] + padding[2] >= viewportRect.width) {
            w = viewportRect.width - padding[0] - padding[2]
            x = padding[0]
            if (initW !== 0) initW = w
        } else if (w + x + padding[2] > viewportRect.width) {
            const newX = viewportRect.width - w - padding[2]
            initX = newX - x + initX
            x = newX
        }
        if (h + padding[1] + padding[3] >= viewportRect.height) {
            h = viewportRect.height - padding[1] - padding[3]
            y = padding[1]
            if (initH !== 0) initH = h
        } else if (h + y + padding[3] > viewportRect.height) {
            const newY = viewportRect.height - h - padding[3]
            initY = newY - y + initY
            y = newY
        }
        
        this.dropdownLeft.set(x)
        this.dropdownTop.set(y)
        this.dropdownWidth.set(w)
        this.dropdownHeight.set(h)
        this.dropdownInitLeft.set(initX)
        this.dropdownInitTop.set(initY)
        this.dropdownInitWidth.set(initW)
        this.dropdownInitHeight.set(initH)
        this.dropdownContentInitLeft.set(cL)
        this.dropdownContentInitTop.set(cT)
        this.isContainerAlignBottom.set(cAlignBottom)
        this.isContainerAlignRight.set(cAlignRight)
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
