import { Component, contentChildren, effect, ElementRef, inject, Injector, input, model, output, Renderer2, viewChild, ViewEncapsulation } from "@angular/core"
import { BungOptionComponent } from "../option/option.component"
import { toggleTransform } from "../../../signals/transforms"
import { BungInsertionContent, BungWaitableEvent } from "../../../utils/bung"
import { BungDropdownDirective } from "../../../directives/bung/dropdown.directive"
import { FormValueControl } from "@angular/forms/signals"
import { asPromise } from "../../../signals/functions"

@Component({
    selector: "bung-select",
    templateUrl: "./select.component.html",
    styleUrl: "./select.component.sass",
    standalone: false,
    encapsulation: ViewEncapsulation.None,
    host: {
        "[class.bung-input]": "true",
        "[class.is-disabled]": "disabled()",
        "[class.is-readonly]": "readonly()",
        "[class.is-loading]": "isLoading()",
        "[class.is-reversed]": "isReversed()"
    }
})
export class BungSelectComponent<T> implements FormValueControl<T | undefined> {
    readonly value = model<T | undefined>(undefined)
    readonly placeholder = input<BungInsertionContent>()
    readonly placeholderContext = input<any>()
    readonly noOptionsPlaceholder = input<BungInsertionContent>()
    readonly noOptionsPlaceholderContext = input<any>()
    readonly icon = input("")
    readonly iconUrl = input<string | undefined>()
    readonly options = contentChildren<BungOptionComponent<T>>(BungOptionComponent)
    /** @ts-ignore */
    readonly disabled = input(false, { transform: toggleTransform })
    /** @ts-ignore */
    readonly readonly = input(false, { transform: toggleTransform })
    readonly isLoading = input(false, { transform: toggleTransform })
    readonly hasClearButton = input(false, { transform: toggleTransform })
    readonly dropdownClass = input("")
    readonly triggerMethod = input<"click" | "mouseover">("click")
    readonly isReversed = input(false, { transform: toggleTransform })
    readonly equalFn = input(((option: T, value: T | undefined) => option === value))

    readonly changing = output<BungWaitableEvent>()
    readonly changed = output<T | undefined>()

    protected readonly element = inject<ElementRef<HTMLElement>>(ElementRef)
    private readonly injector = inject(Injector)

    private dropdownTrigger = viewChild("dropdownTrigger", { read: BungDropdownDirective })

    protected cloneElement(el: HTMLElement): HTMLElement {
        return el.cloneNode(true) as HTMLElement
    }
    protected hasClass(className: string): boolean {
        return this.element.nativeElement.classList.contains(className)
    }
    protected onClearButtonClicked(e: MouseEvent) {
        this.value.set(undefined)
        e.preventDefault()
        e.stopImmediatePropagation()
        this.dropdownTrigger()?.close()
    }
    protected getSizeClass(): string {
        const sizeClasses = ["is-small", "is-medium", "is-large"]
        return sizeClasses.find(c => this.hasClass(c)) ?? ""
    }
    protected getPaletteClass(): string {
        const paletteClasses = ["is-primary", "is-success", "is-info", "is-link", "is-warning", "is-danger"]
        return paletteClasses.find(c => this.hasClass(c)) ?? ""
    }
    protected async onChange(value: T | undefined) {
        const event: BungWaitableEvent = {
            canceled: false
        }
        this.changing.emit(event)
        if (event.canceled) return
        else if (event.promise || event.resource) {
            try {
                const promises = [event.promise, event.resource ? asPromise(event.resource, this.injector) : undefined]
                await Promise.all(promises)
            } catch {
                return
            }
        }
        this.value.set(value)
        this.changed.emit(value)
    }
}
