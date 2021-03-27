import { getCollectionMappingElement, KObjectMappingRecord, s32me } from "../../utility/mapping"
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
    class: s32me(),
    clearType: s32me("clear_type"),
    averageAchievementRateTimes100: s32me("total_ar"),
    totalScore: s32me("total_score"),
    playCount: s32me("play_count"),
    lastPlayTime: s32me("last_play_time"),
    recordUpdateTime: s32me("record_update_time"),
    rank: s32me()
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