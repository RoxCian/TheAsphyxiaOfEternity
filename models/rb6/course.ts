import { KObjectMappingRecord, s32me, s8me } from "../../utility/mapping"

export interface IRb6Quest {
    questId: number
    dungeonId?: number
    questType: number
    value: number
    endTime: number
    rankingId: number

    musicId0: number
    musicId1: number
    musicId2: number
    chartType0: number
    chartType1: number
    chartType2: number
}
export const Rb6QuestMap: KObjectMappingRecord<IRb6Quest> = {
    questId: s32me("quest_id"),
    dungeonId: s32me("dungeon_id"),
    questType: s32me("quest_type"),
    value: s32me(),
    endTime: s32me("end_time"),
    rankingId: s32me("ranking_id"),

    musicId0: s32me("music_id_0"),
    musicId1: s32me("music_id_1"),
    musicId2: s32me("music_id_2"),
    chartType0: s8me("note_grade_0"),
    chartType1: s8me("note_grade_1"),
    chartType2: s8me("note_grade_2")
}
