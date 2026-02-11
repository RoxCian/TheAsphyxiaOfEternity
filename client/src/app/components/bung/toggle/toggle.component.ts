import { Component, effect, input, linkedSignal, model, ViewEncapsulation } from "@angular/core"
import { FormCheckboxControl } from "@angular/forms/signals"
import { toggleTransform } from "../../../signals/transforms"

@Component({
    selector: "bung-toggle",
    templateUrl: "./toggle.component.html",
    styleUrl: "./toggle.component.sass",
    standalone: false,
    encapsulation: ViewEncapsulation.None,
    host: {
        "[class.is-checked]": "checked()",
        "[class.is-disabled]": "disabled()",
        "[class.is-readonly]": "readonly()",
        "[attr.tabindex]": "0",
        "(click)": "toggle()"
    }
})
export class BungToggleComponent implements FormCheckboxControl {
    readonly checked = model(false)
    /** @ts-ignore */
    readonly disabled = input(false, { transform: toggleTransform })
    /** @ts-ignore */
    readonly readonly = input(false, { transform: toggleTransform })

    constructor() {
    }
    toggle() {
        if (this.disabled() || this.readonly()) return
        this.checked.update(v => !v)
    }
}
