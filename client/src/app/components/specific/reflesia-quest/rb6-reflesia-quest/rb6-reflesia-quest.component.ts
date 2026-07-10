import { Component, input } from "@angular/core"
import { Rb6QuestResponse } from "rbweb"

@Component({
    selector: "rb6-reflesia-quest",
    standalone: false,
    templateUrl: "./rb6-reflesia-quest.component.html",
    styleUrl: "./rb6-reflesia-quest.component.sass",
})
export class Rb6ReflesiaQuestComponent {
    readonly quest = input.required<Rb6QuestResponse>()

    protected onShowPopup(dungeonGrade: number) {

    }
}
