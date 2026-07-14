import { Component, computed, input } from "@angular/core"
import { Rb6QuestRecordResponse, Rb6QuestType } from "rbweb"

@Component({
    selector: "rb6-reflesia-quest",
    standalone: false,
    templateUrl: "./rb6-reflesia-quest.component.html",
    styleUrl: "./rb6-reflesia-quest.component.sass",
})
export class Rb6ReflesiaQuestComponent {
    readonly quest = input.required<Rb6QuestRecordResponse>()
    protected readonly questNameMain = computed(() => {
        if (this.quest().questType === Rb6QuestType.challenge) return this.quest().dungeon.dungeonName
        else if (this.quest().rankingId >= 0) return `Ranking quest group ${this.quest().rankingId + 1}`
        return this.quest().dungeon.dungeonNameOrig ?? this.quest().dungeon.dungeonName
    })
    protected readonly questNameSub = computed(() => this.quest().questType === Rb6QuestType.challenge || this.quest().rankingId >= 0 ? undefined : this.quest().dungeon.dungeonNameOrig ? this.quest().dungeon.dungeonName : undefined)
    protected readonly isShowMephius = computed(() => this.quest().dungeon.dungeonId === 96 && this.quest().records.some(r => r && (r.isCleared || r.stageLogs?.length === 4)))

    protected onShowPopup(dungeonGrade: number) {

    }
}
