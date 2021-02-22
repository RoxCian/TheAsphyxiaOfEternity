import { KObjectMappingRecord } from "../../utility/mapping"

export interface IRb6Course {
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
export const Rb6CourseMap: KObjectMappingRecord<IRb6Course> = {
    questId: { $type: "s32", $targetKey: "quest_id" },
    dungeonId: { $type: "s32", $targetKey: "dungeon_id" },
    questType: { $type: "s32", $targetKey: "quest_type" },
    value: { $type: "s32" },
    endTime: { $type: "s32", $targetKey: "end_time" },
    rankingId: { $type: "s32", $targetKey: "ranking_id" },

    musicId0: { $type: "s32", $targetKey: "music_id_0" },
    musicId1: { $type: "s32", $targetKey: "music_id_1" },
    musicId2: { $type: "s32", $targetKey: "music_id_2" },
    chartType0: { $type: "s8", $targetKey: "note_grade_0" },
    chartType1: { $type: "s8", $targetKey: "note_grade_1" },
    chartType2: { $type: "s8", $targetKey: "note_grade_2" }
}
export function getExampleCourse(): IRb6Course {
    return {
        questId: 31,
        dungeonId: 56,
        questType: 1,
        value: 1,
        endTime: 1924991999,
        rankingId: 0,
        musicId0: -1,
        musicId1: -1,
        musicId2: -1,
        chartType0: -1,
        chartType1: -1,
        chartType2: -1
    }
}