import { Component, ElementRef, TemplateRef, ViewEncapsulation, contentChild, inject, input, output } from "@angular/core"
import { BungInsertionContent, BungWaitableEvent } from "../../../utils/bung"
import { toggleTransform } from "../../../signals/transforms"

@Component({
    selector: "bung-tab",
    template: "<ng-content />",
    styleUrls: ["./tab.component.sass"],
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class BungTabComponent {
    readonly header = input<BungInsertionContent>()
    readonly index = input("")
    readonly headerTemplate = contentChild("header", { read: TemplateRef })
    readonly element = inject<ElementRef<HTMLElement>>(ElementRef)
    readonly activated = output<BungWaitableEvent>()
    readonly deactivated = output<BungWaitableEvent>()
    readonly disabled = input(false, { transform: toggleTransform })
}
