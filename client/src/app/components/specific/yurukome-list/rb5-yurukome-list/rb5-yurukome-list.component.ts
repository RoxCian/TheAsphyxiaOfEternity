import { Component, inject } from "@angular/core"
import { Rb5YurukomeService } from "../../../../services/specified/rb5-yurukome.service"

@Component({
    selector: "rb5-yurukome-list",
    standalone: false,
    templateUrl: "./rb5-yurukome-list.component.html",
    styleUrl: "./rb5-yurukome-list.component.sass",
})
export class Rb5YurukomeListComponent {
    protected readonly service = inject(Rb5YurukomeService)
}
