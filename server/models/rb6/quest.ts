import { rb6Quests } from "../../data/tables/rb6_quests"
import { rb6RankingQuests } from "../../data/tables/rb6_ranking_quests"
import { XD } from "../../utils/x"
import { Rb6ChartType } from "../shared/rb_types"

export class Rb6Quest {
    @XD.s32() questId = 0
    @XD.s32() dungeonId?: number
    @XD.s32() questType = 0
    @XD.s32() value = 0
    @XD.s32() endTime = 0
    @XD.s32() rankingId = 0

    @XD.s32() musicId0 = 0
    @XD.s32() musicId1 = 0
    @XD.s32() musicId2 = 0
    @XD.s8("note_grade_0") chartType0 = Rb6ChartType.basic
    @XD.s8("note_grade_1") chartType1 = Rb6ChartType.basic
    @XD.s8("note_grade_2") chartType2 = Rb6ChartType.basic

    static async createExamples(rankingQuestId: number): Promise<Rb6Quest[]> {
        const rankingQuest = (await rb6RankingQuests).find(q => q.dungeonId === rankingQuestId)
        return [...await rb6Quests, rankingQuest]
    }
}