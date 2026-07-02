import { Component, inject } from "@angular/core"
import { Rb2GlassesService } from "../../../../services/specified/rb2-glasses.service"

@Component({
    selector: "rb2-glass-list",
    standalone: false,
    templateUrl: "./rb2-glass-list.component.html",
    styleUrl: "./rb2-glass-list.component.sass",
})
export class Rb2GlassListComponent {
    protected readonly service = inject(Rb2GlassesService)
}
