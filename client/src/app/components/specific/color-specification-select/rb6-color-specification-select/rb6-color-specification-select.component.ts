import { Component, model } from "@angular/core"
import { FormValueControl } from "@angular/forms/signals"
import { RbColorSpecification } from "server/models/shared/rb_types"

@Component({
    selector: "rb6-color-specification-select",
    templateUrl: "./rb6-color-specification-select.component.html",
    styleUrl: "./rb6-color-specification-select.component.sass",
    standalone: false,
    host: {
        "[class.buttons]": "true",
    }
})
export class Rb6ColorSpecificationSelectComponent implements FormValueControl<RbColorSpecification> {
    value = model(RbColorSpecification.random)
}
