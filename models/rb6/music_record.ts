import { ICollection } from "../utility/definitions"
import { getCollectionMappingElement, KObjectMappingRecord, NumberGroup } from "../../utility/mapping"

export interface IRb6MusicRecord extends ICollection<"rb.rb6.playData.musicRecord"> {
    musicId: number
    chartType: number
    playCount: number
    clearType: number
    achievementRateTimes100: number
    score: number
    combo: number
    missCount: number
    param: number
    time: number
    bestScoreUpdateTime: number
    bestAchievementRateUpdateTime: number
    bestComboUpdateTime: number
    bestMissCountUpdateTime: number
    kFlag: number
    justCollectionRateTimes100Red: number
    justCollectionRateTimes100Blue: number
    isHasGhostRed: boolean
    isHasGhostBlue: boolean
}
export const Rb6MusicRecordMap: KObjectMappingRecord<IRb6MusicRecord> = {
    collection: getCollectionMappingElement<IRb6MusicRecord>("rb.rb6.playData.musicRecord"),
    musicId: { $type: "s16", $targetKey: "mid" },
    chartType: { $type: "s8", $targetKey: "ntgrd" },
    playCount: { $type: "s32", $targetKey: "pc" },
    clearType: { $type: "s8", $targetKey: "ct" },
    achievementRateTimes100: { $type: "s16", $targetKey: "ar" },
    score: { $type: "s16", $targetKey: "scr" },
    combo: { $type: "s16" },
    missCount: { $type: "s16", $targetKey: "ms" },
    param: { $type: "s16" },
    time: { $type: "s32" },
    bestScoreUpdateTime: { $type: "s32", $targetKey: "bscrt" },
    bestAchievementRateUpdateTime: { $type: "s32", $targetKey: "bart" },
    bestComboUpdateTime: { $type: "s32", $targetKey: "bctt" },
    bestMissCountUpdateTime: { $type: "s32", $targetKey: "bmst" },
    kFlag: { $type: "s32", $targetKey: "k_flag" },
    justCollectionRateTimes100Red: { $type: "s32", $targetKey: "jcolr" },
    justCollectionRateTimes100Blue: { $type: "s32", $targetKey: "jcolb" },
    isHasGhostBlue: { $type: "bool", $targetKey: "ghostb" },
    isHasGhostRed: { $type: "bool", $targetKey: "ghostr" }
}
export function generateRb6MusicRecord(musicId: number, chartType: number): IRb6MusicRecord {
    return {
        collection: "rb.rb6.playData.musicRecord",
        musicId: musicId,
        chartType: chartType,
        playCount: 0,
        clearType: 0,
        achievementRateTimes100: 0,
        score: 0,
        combo: 0,
        missCount: 0,
        param: 0,
        time: Date.now(),
        bestScoreUpdateTime: Date.now(),
        bestAchievementRateUpdateTime: Date.now(),
        bestComboUpdateTime: Date.now(),
        bestMissCountUpdateTime: Date.now(),
        kFlag: 0,
        justCollectionRateTimes100Blue: 0,
        justCollectionRateTimes100Red: 0,
        isHasGhostRed: false,
        isHasGhostBlue: false
    }
}