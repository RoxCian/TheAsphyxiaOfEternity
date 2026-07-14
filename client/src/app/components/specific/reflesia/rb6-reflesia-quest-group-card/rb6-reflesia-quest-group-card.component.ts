import { Component, computed, input } from "@angular/core"
import { Rb6QuestInfo, Rb6QuestRecordResponse } from "rbweb"
import { toggleTransform } from "../../../../signals/transforms"

type QuestGroup = { quest: Rb6QuestInfo, records: Rb6QuestRecordResponse[] }

@Component({
    selector: "rb6-reflesia-quest-group-card",
    standalone: false,
    templateUrl: "./rb6-reflesia-quest-group-card.component.html",
    styleUrl: "./rb6-reflesia-quest-group-card.component.sass",
})
export class Rb6ReflesiaQuestGroupCardComponent {
    readonly isExpanded = input(false, { transform: toggleTransform })
    readonly group = input.required<QuestGroup>()
    protected readonly groupNameMain = computed(() => this.group().quest.questNameOrig ?? this.group().quest.questName)
    protected readonly groupNameSub = computed(() => this.group().quest.questNameOrig ? this.group().quest.questName : undefined)
}
