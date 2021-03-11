import { KObjectMappingRecord } from "../../utility/mapping"

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
export function getExampleCourse(): IRb6Quest[] {
    return [
        { questId: 0, dungeonId: 0, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 0, dungeonId: 1, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 0, dungeonId: 2, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },

        { questId: 1, dungeonId: 3, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 1, dungeonId: 4, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },

        { questId: 1, dungeonId: 5, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 2, dungeonId: 6, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 2, dungeonId: 7, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },

        { questId: 2, dungeonId: 8, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },

        { questId: 3, dungeonId: 9, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },


        { questId: 4, dungeonId: 10, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 4, dungeonId: 11, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },

        { questId: 4, dungeonId: 12, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },

        { questId: 5, dungeonId: 13, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 5, dungeonId: 14, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },

        { questId: 5, dungeonId: 15, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 6, dungeonId: 16, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 6, dungeonId: 17, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },

        { questId: 6, dungeonId: 18, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },

        { questId: 7, dungeonId: 19, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },


        { questId: 8, dungeonId: 20, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 8, dungeonId: 21, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 8, dungeonId: 22, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },

        { questId: 9, dungeonId: 23, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 9, dungeonId: 24, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 9, dungeonId: 25, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },

        { questId: 10, dungeonId: 26, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 10, dungeonId: 27, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 10, dungeonId: 28, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },


        { questId: 11, dungeonId: 29, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },

        { questId: 30, dungeonId: 55, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 31, dungeonId: 56, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 31, dungeonId: 57, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 31, dungeonId: 58, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 32, dungeonId: 59, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 32, dungeonId: 60, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },

        { questId: 32, dungeonId: 61, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 33, dungeonId: 62, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 33, dungeonId: 63, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 33, dungeonId: 64, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },

        { questId: 34, dungeonId: 65, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },


        { questId: 35, dungeonId: 66, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 35, dungeonId: 67, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 35, dungeonId: 68, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 36, dungeonId: 69, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 36, dungeonId: 70, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },

        { questId: 36, dungeonId: 71, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 37, dungeonId: 72, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 37, dungeonId: 73, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 37, dungeonId: 74, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },

        { questId: 38, dungeonId: 75, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },


        { questId: 39, dungeonId: 76, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },

        { questId: 40, dungeonId: 77, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },

        { questId: 41, dungeonId: 78, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },


        { questId: 42, dungeonId: 79, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },


        { questId: 43, dungeonId: 80, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 43, dungeonId: 81, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 43, dungeonId: 82, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },

        { questId: 48, dungeonId: 94, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 48, dungeonId: 95, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 48, dungeonId: 96, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 49, dungeonId: 97, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 49, dungeonId: 98, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 49, dungeonId: 99, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 49, dungeonId: 100, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 49, dungeonId: 101, questType: 1, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },

        { questId: 13, dungeonId: 31, questType: 2, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 14, dungeonId: 32, questType: 2, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 15, dungeonId: 33, questType: 2, value: 1, endTime: 2147483647, rankingId: 0, musicId0: 852, musicId1: 874, musicId2: 210, chartType0: 3, chartType1: 2, chartType2: 3 },
        { questId: 15, dungeonId: 34, questType: 2, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 15, dungeonId: 35, questType: 2, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 15, dungeonId: 36, questType: 2, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 16, dungeonId: 37, questType: 2, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 17, dungeonId: 38, questType: 2, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 17, dungeonId: 39, questType: 2, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 17, dungeonId: 40, questType: 2, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 17, dungeonId: 41, questType: 2, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 17, dungeonId: 42, questType: 2, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 24, dungeonId: 49, questType: 2, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 25, dungeonId: 50, questType: 2, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 26, dungeonId: 51, questType: 2, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 27, dungeonId: 52, questType: 2, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 28, dungeonId: 53, questType: 2, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 29, dungeonId: 54, questType: 2, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 30, dungeonId: 55, questType: 2, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 44, dungeonId: 90, questType: 2, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 45, dungeonId: 91, questType: 2, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 46, dungeonId: 92, questType: 2, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 47, dungeonId: 93, questType: 2, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 50, dungeonId: 102, questType: 2, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 51, dungeonId: 103, questType: 2, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 52, dungeonId: 104, questType: 2, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 53, dungeonId: 105, questType: 2, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 54, dungeonId: 106, questType: 2, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 55, dungeonId: 107, questType: 2, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 56, dungeonId: 108, questType: 2, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 57, dungeonId: 109, questType: 2, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 58, dungeonId: 110, questType: 2, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
        { questId: 59, dungeonId: 111, questType: 2, value: 1, endTime: 2147483647, rankingId: 0, musicId0: -1, musicId1: -1, musicId2: -1, chartType0: -1, chartType1: -1, chartType2: -1 },
    ]
}