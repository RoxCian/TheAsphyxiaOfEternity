import { getCollectionMappingElement, KObjectMappingRecord } from "../../utility/mapping"
import { ICollection } from "../utility/definitions"

export interface IRb6ClasscheckRecord extends ICollection<"rb.rb6.playData.classcheck"> {
    class: number
    clearType: number
    averageAchievementRateTimes100: number
    totalScore: number
    playCount: number
    lastPlayTime: number
    recordUpdateTime: number
    rank: number
}
export const Rb6ClasscheckRecordMap: KObjectMappingRecord<IRb6ClasscheckRecord> = {
    collection: getCollectionMappingElement<IRb6ClasscheckRecord>("rb.rb6.playData.classcheck"),
    class: { $type: "s32" },
    clearType: { $type: "s32", $targetKey: "clear_type" },
    averageAchievementRateTimes100: { $type: "s32", $targetKey: "total_ar" },
    totalScore: { $type: "s32", $targetKey: "total_score" },
    playCount: { $type: "s32", $targetKey: "play_count" },
    lastPlayTime: { $type: "s32", $targetKey: "last_play_time" },
    recordUpdateTime: { $type: "s32", $targetKey: "record_update_time" },
    rank: { $type: "s32" }
}
export function generateRb6ClasscheckRecord(classIndex: number): IRb6ClasscheckRecord {
    return {
        collection: "rb.rb6.playData.classcheck",
        class: classIndex,
        clearType: 0,
        averageAchievementRateTimes100: 0,
        totalScore: 0,
        playCount: 0,
        lastPlayTime: 0,
        recordUpdateTime: 0,
        rank: 0
    }
}