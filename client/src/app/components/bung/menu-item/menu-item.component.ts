import { Component, contentChildren, ElementRef, inject, input, output, ViewEncapsulation } from "@angular/core"
import { linkedToggle, toggleTransform } from "../../../signals/transforms"
import { BungInsertionContent } from "../../../utils/bung"

@Component({
    selector: "bung-menu-item",
    template: "<ng-content />",
    styleUrls: ["./menu-item.component.sass"],
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class BungMenuItemComponent {
    readonly icon = input("")
    readonly iconUrl = input<string | undefined>()
    readonly content = input<BungInsertionContent>()
    readonly context = input<any>()
    readonly isDivider = input(false, { transform: toggleTransform })
    readonly isStatic = input(false, { transform: toggleTransform })
    readonly isActive = input(false, { transform: toggleTransform })
    readonly disabledInput = input(false, { alias: "disabled", transform: toggleTransform })
    readonly disabled = linkedToggle(this.disabledInput)
    readonly subItems = contentChildren(BungMenuItemComponent)
    readonly element = inject<ElementRef<HTMLElement>>(ElementRef)

    readonly click = output()
    readonly rightclick = output()
    readonly mouseover = output<MouseEvent>()
    readonly mouseenter = output<MouseEvent>()
    readonly mouseleave = output<MouseEvent>()
    readonly focus = output()
    readonly blur = output()
}
