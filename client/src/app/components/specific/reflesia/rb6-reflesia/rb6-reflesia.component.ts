import { Component, inject, input } from "@angular/core"
import { Rb6ReflesiaService } from "../../../../services/specified/rb6-reflesia.service"

@Component({
    selector: "rb6-reflesia",
    standalone: false,
    templateUrl: "./rb6-reflesia.component.html",
    styleUrl: "./rb6-reflesia.component.sass",
})
export class Rb6ReflesiaComponent {
    readonly mode = input<"story" | "hunting" | "challenge" | "ranking">("story")
    protected readonly service = inject(Rb6ReflesiaService)
}
