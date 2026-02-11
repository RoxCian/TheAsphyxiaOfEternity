import { Component, input, InputSignal, ViewEncapsulation } from "@angular/core"
import { BungInsertionContent } from "../../../utils/bung"
import { FieldTree } from "@angular/forms/signals"
import { toggleTransform } from "../../../signals/transforms"

@Component({
    selector: "bung-field",
    templateUrl: "./field.component.html",
    styleUrl: "./field.component.sass",
    standalone: false,
    encapsulation: ViewEncapsulation.None,
    host: {
        "[class.field]": "true",
        "[class.is-horizontal]": "true"
    }
})
export class BungFieldComponent {
    readonly label = input<BungInsertionContent>()
    readonly labelContext = input<unknown>()
    readonly help = input<BungInsertionContent>()
    readonly helpContext = input<unknown>()
    readonly field = input<FieldTree<unknown> | undefined>()
    readonly isDirty = input(false, { transform: toggleTransform })
}
