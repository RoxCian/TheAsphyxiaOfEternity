import { Component, input } from "@angular/core"
import { Rb5YurukomeResponse } from "rbweb"

@Component({
    selector: "rb5-yurukome-panel",
    standalone: false,
    templateUrl: "./rb5-yurukome-panel.component.html",
    styleUrl: "./rb5-yurukome-panel.component.sass",
})
export class Rb5YurukomePanelComponent {
    readonly yurukome = input.required<Rb5YurukomeResponse>()
}
