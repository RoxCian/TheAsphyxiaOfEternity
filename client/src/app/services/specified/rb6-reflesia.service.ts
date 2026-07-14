import { computed, inject, Service, signal } from "@angular/core"
import { Rb6QuestInfo, Rb6QuestRecordResponseElement, Rb6QuestRecordResponse, Rb6QuestType, Rb6ReflesiaResponse } from "rbweb"
import { RbActivatableServiceBase, RbPlayDataServiceBase } from "./rb.service"
import { rbData } from "../../signals/rb-data"
import { rbEmitJSON } from "../../utils/rb-functions"
import { BungNotificationService } from "../bung/notification.service"
import { HttpResourceRef } from "@angular/common/http"

type QuestGroup = { quest: Rb6QuestInfo, records: Rb6QuestRecordResponse[] }

@Service()
export class Rb6ReflesiaService extends RbActivatableServiceBase<Rb6ReflesiaResponse> {
    readonly reflesia = rbData<Rb6ReflesiaResponse>(() => this.isActivated() && this.dataVersion() === 6 ? `rb6ReadReflesia` : undefined, this.profileService.ridRequest())
    private readonly isLoadingInternal = signal(false)
    private readonly loadingRankingQuestInternal = signal(-1)
    readonly loadingRankingQuest = computed(() => (this.isLoadingInternal() || this.reflesia.isLoading()) ? this.loadingRankingQuestInternal() : -1)

    private readonly questService = inject(Rb6QuestService)
    private readonly rankingQuestService = inject(Rb6RankingQuestService)

    readonly questRecords = this.questService.data
    readonly rankingQuestRecords = this.rankingQuestService.data
    readonly groupedByQuestId = computed(() => this.questRecords.value()?.reduce<Record<number, QuestGroup>>((prev, next) => {
        let el = prev[next.quest.questId]
        if (!el) {
            el = {
                quest: next.quest,
                records: []
            }
            prev[next.quest.questId] = el
        }
        el.records.push(next)
        return prev
    }, {}) ?? {})
    readonly groupedByChapter = computed(() => {
        const grouped = Object.values(this.groupedByQuestId())
        return grouped.reduce<Record<number, QuestGroup[]>>((prev, next) => {
            if (next.quest.chapter < 0) return prev
            let el = prev[next.quest.chapter]
            if (!el) {
                el = []
                prev[next.quest.chapter] = el
            }
            el.push(next)
            return prev
        }, {})
    })
    readonly huntingQuestRecords = computed(() => Object.values(this.groupedByQuestId()).filter(g => g.quest.questType === Rb6QuestType.hunting))
    readonly challengeQuestRecords = computed(() => Object.values(this.groupedByQuestId()).filter(g => g.quest.questType === Rb6QuestType.challenge).reduce<Record<number, QuestGroup[]>>((prev, next) => {
        let el = prev[next.quest.questId]
        if (!el) {
            el = []
            prev[next.quest.questId] = el
        }
        el.push(next)
        return prev
    }, {}))

    private readonly notificationService = inject(BungNotificationService)

    protected override onActivate(): HttpResourceRef<Rb6ReflesiaResponse | undefined> {
        this.questService.activate()
        this.rankingQuestService.activate()
        return this.reflesia
    }
    protected override onDeactivate() {
        this.questService.deactivate()
        this.rankingQuestService.deactivate()
    }
    async setRankingQuest(rankingId: number) {
        if (!this.isActivated()) return
        this.isLoadingInternal.set(true)
        try {
            this.loadingRankingQuestInternal.set(rankingId)
            const result = await rbEmitJSON<{ modified: boolean }>("rb6WriteRankingQuest", {
                rid: this.profileService.rid(),
                rankingId
            })
            if (result.modified) this.reflesia.reload()
        } catch (ex) {
            if (ex instanceof Error) this.notificationService.notify(ex.message, "danger")
        }
        this.isLoadingInternal.set(false)
        // this.loadingOrderInternal.set(-1) × do not set to -1
    }
}

@Service()
class Rb6QuestService extends RbPlayDataServiceBase<Rb6QuestRecordResponse> {
    constructor() {
        super(computed(() => this.isActivated() ? "rb6ReadQuestRecords" : undefined))
    }
}
@Service()
class Rb6RankingQuestService extends RbPlayDataServiceBase<Rb6QuestRecordResponse> {
    constructor() {
        super(computed(() => this.isActivated() ? "rb6ReadRankingQuestRecords" : undefined))
    }
}