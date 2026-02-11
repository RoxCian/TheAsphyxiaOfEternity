import { Component, model } from "@angular/core"
import { FormValueControl } from "@angular/forms/signals"

@Component({
    selector: "rb-object-size-select",
    templateUrl: "./rb-object-size-select.component.html",
    styleUrl: "./rb-object-size-select.component.sass",
    standalone: false,
    host: {
        "[class.buttons]": "true"
    }
})
export class RbObjectSizeSelectComponent implements FormValueControl<number> {
    value = model(0)
}
