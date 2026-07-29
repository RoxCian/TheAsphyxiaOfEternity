import { Component, computed, inject, input } from "@angular/core"
import { Rb6ChartType, Rb6QuestRecordResponse, Rb6QuestType, RbStageLogResponse } from "rbweb"
import { BungPopupService } from "../../../../services/bung/popup.service"
import { RbCoursePopupComponent } from "../../course-popup/rb-course-popup/rb-course-popup.component"

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
    private readonly popupService = inject(BungPopupService)

    protected onShowPopup(dungeonGrade: number) {
        const quest = this.quest()
        const dungeonRecord = quest.records[dungeonGrade]
        if (!dungeonRecord?.stageLogs) return
        const questNameMain = quest.rankingId >= 0 ? `Ranking Quest Group ${quest.rankingId + 1}` : quest.questType === Rb6QuestType.challenge ? `${quest.quest.questName} ${quest.dungeon.dungeonName}` : (quest.dungeon.dungeonNameOrig ?? quest.dungeon.dungeonName)
        const questNameSub = quest.rankingId < 0 && quest.questType !== Rb6QuestType.challenge ? quest.dungeon.dungeonNameOrig ? quest.dungeon.dungeonName : undefined : undefined
        const questChartType = quest.questType !== Rb6QuestType.challenge ? dungeonGrade as Rb6ChartType : undefined
        this.popupService.popup(undefined, undefined, RbCoursePopupComponent, {
            layer: "rb-classcheck",
            duration: Infinity,
            bindings: {
                version: 6,
                stageLogs: dungeonRecord.stageLogs,
                isCleared: dungeonRecord.isCleared,
                courseNameSub: questNameSub,
                courseNameMain: questNameMain,
                clearInfoSub: undefined,
                clearInfoMain: dungeonRecord.isCleared ? "QUEST CLEARED" : "QUEST FAILED",
                emphasisScore: true,
                averageAchievementRate: dungeonRecord.stageLogs.reduce((prev, next) => prev + next.achievementRate, 0) / (dungeonRecord.stageLogs.length <= 3 ? 3 : dungeonRecord.stageLogs.length),
                playCount: dungeonRecord.playCount,
                update: dungeonRecord.updateTime,
                lastPlay: dungeonRecord.lastPlayTime,
                chartType: questChartType
            }
        })

    }
    protected sumScore(stageLogs: RbStageLogResponse<6, Rb6ChartType>[]): number {
        return stageLogs.reduce((total, curr) => total + curr.score, 0)
    }
}
