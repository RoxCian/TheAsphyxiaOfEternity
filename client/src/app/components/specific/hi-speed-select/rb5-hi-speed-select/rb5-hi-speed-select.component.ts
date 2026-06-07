import { Component, model } from "@angular/core"
import { FormValueControl } from "@angular/forms/signals"

@Component({
    selector: "rb5-hi-speed-select",
    templateUrl: "./rb5-hi-speed-select.component.html",
    styleUrl: "./rb5-hi-speed-select.component.sass",
    standalone: false,
    host: {
        "[class.buttons]": "true",
        "[class.has-addons]": "true"
    }
})
export class Rb5HiSpeedSelectComponent implements FormValueControl<number> {
    value = model(0)

    protected toInt(v: unknown): number {
        if (typeof v === "string") return parseInt(v)
        else if (typeof v === "number") return v
        return 0
    }
}
