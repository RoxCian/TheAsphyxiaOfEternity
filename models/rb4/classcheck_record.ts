import { getCollectionMappingElement, ignoreme, KObjectMappingRecord, s32me } from "../../utility/mapping"
import { ICollection } from "../utility/definitions"

export interface IRb4ClasscheckRecord extends ICollection<"rb.rb4.playData.classcheck"> {
    class: number
    clearType: number // 1: failed, 2: cleared
    averageAchievementRateTimes100: number
    totalScore: number
    seperateScore: number[]
    seperateAchievementRateTimes100: number[]
    musicsId: number[]
    chartsType: number[]
    playCount: number
    lastPlayTime: number
    recordUpdateTime: number
    rank: number
}
export const Rb4ClasscheckRecordMappingRecord: KObjectMappingRecord<IRb4ClasscheckRecord> = {
    collection: getCollectionMappingElement<IRb4ClasscheckRecord>("rb.rb4.playData.classcheck"),
    class: { $type: "s32" },
    clearType: { $type: "s32", $targetKey: "clear_type" },
    averageAchievementRateTimes100: { $type: "s32", $targetKey: "total_ar" },
    totalScore: { $type: "s32", $targetKey: "total_score" },
    seperateScore: ignoreme(),
    seperateAchievementRateTimes100: ignoreme(),
    musicsId: ignoreme(),
    chartsType: ignoreme(),
    playCount: { $type: "s32", $targetKey: "play_count" },
    lastPlayTime: { $type: "s32", $targetKey: "last_play_time" },
    recordUpdateTime: { $type: "s32", $targetKey: "record_update_time" },
    rank: { $type: "s32" }
}
export function generateRb4ClasscheckRecord(classIndex: number): IRb4ClasscheckRecord {
    return {
        collection: "rb.rb4.playData.classcheck",
        class: classIndex,
        clearType: 0,
        averageAchievementRateTimes100: 0,
        totalScore: 0,
        seperateScore: [0, 0, 0],
        seperateAchievementRateTimes100: [0, 0, 0],
        musicsId: [-1, -1, -1],
        chartsType: [-1, -1, -1],
        playCount: 0,
        lastPlayTime: 0,
        recordUpdateTime: 0,
        rank: 0
    }
}