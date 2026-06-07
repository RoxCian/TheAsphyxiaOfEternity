import { Component, ElementRef, inject, input, ViewEncapsulation } from "@angular/core"
import { linkedToggle, toggleTransform } from "../../../signals/transforms"
import { BungInsertionContent } from "../../../utils/bung"
@Component({
    selector: "bung-option",
    template: "<ng-content />",
    styleUrls: ["./option.component.sass"],
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class BungOptionComponent<T> {
    readonly value = input.required<T>()
    readonly content = input<BungInsertionContent>()
    readonly context = input<any>()
    readonly icon = input("")
    readonly iconUrl = input<string | undefined>()
    readonly isDivider = input(false, { transform: toggleTransform })
    readonly isStatic = input(false, { transform: toggleTransform })
    readonly disabledInput = input(false, { alias: "disabled", transform: toggleTransform })
    readonly disabled = linkedToggle(this.disabledInput)
    readonly isHidden = input(false, { transform: toggleTransform })
    readonly element = inject<ElementRef<HTMLElement>>(ElementRef)
}
