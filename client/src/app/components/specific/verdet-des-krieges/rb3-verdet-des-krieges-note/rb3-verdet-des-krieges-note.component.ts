import { Component, computed, inject, input } from "@angular/core"
import { Rb3VerdetDesKriegesService } from "../../../../services/specified/rb3-verdet-des-krieges.service"

@Component({
    selector: "rb3-verdet-des-krieges-note",
    standalone: false,
    templateUrl: "./rb3-verdet-des-krieges-note.component.html",
    styleUrl: "./rb3-verdet-des-krieges-note.component.sass"
})
export class Rb3VerdetDesKriegesNoteComponent {
    protected readonly service = inject(Rb3VerdetDesKriegesService)
    readonly annotationId = input.required<number>()
    protected readonly annotation = computed(() => this.service.notes.value()?.find(n => n.id === this.annotationId()))
}
