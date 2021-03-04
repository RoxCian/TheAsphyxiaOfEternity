import { ICollection } from "../utility/definitions"
import { getCollectionMappingElement, KObjectMappingRecord } from "../../utility/mapping"

export interface IRb3MusicRecord extends ICollection<"rb.rb3.playData.musicRecord"> {
    musicId: number
    chartType: number
    playCount: number
    clearType: number
    achievementRateTimes100: number
    score: number
    combo: number
    missCount: number
    time: number
    bestScoreUpdateTime: number
    bestAchievementRateUpdateTime: number
    bestComboUpdateTime: number
    bestMissCountUpdateTime: number
    kFlag: number
    isHasGhostRed: boolean
    isHasGhostBlue: boolean
    version?: {
        score: number
        combo: number
        missCount: number
        clearType: number
        achievementRate: number
    }
}
export const Rb3MusicRecordMap: KObjectMappingRecord<IRb3MusicRecord> = {
    collection: getCollectionMappingElement<IRb3MusicRecord>("rb.rb3.playData.musicRecord"),
    musicId: { $type: "s16", $targetKey: "mid" },
    chartType: { $type: "s8", $targetKey: "ntgrd" },
    playCount: { $type: "s32", $targetKey: "pc" },
    clearType: { $type: "s8", $targetKey: "ct" }, // 1: hard failed, 10: hard cleared, 11: s-hard cleared
    achievementRateTimes100: { $type: "s16", $targetKey: "ar" },
    score: { $type: "s16", $targetKey: "scr" },
    combo: { $type: "s16", $targetKey: "cmb" },
    missCount: { $type: "s16", $targetKey: "ms" },
    time: { $type: "s32" },
    bestScoreUpdateTime: { $type: "s32", $targetKey: "bscrt" },
    bestAchievementRateUpdateTime: { $type: "s32", $targetKey: "bart" },
    bestComboUpdateTime: { $type: "s32", $targetKey: "bctt" },
    bestMissCountUpdateTime: { $type: "s32", $targetKey: "bmst" },
    kFlag: { $type: "s32", $targetKey: "k_flag" },
    isHasGhostBlue: { $type: "bool", $targetKey: "ghostb" },
    isHasGhostRed: { $type: "bool", $targetKey: "ghostr" },
    version: {
        score: { $type: "s16", $targetKey: "scr" },
        combo: { $type: "s16", $targetKey: "cmb" },
        missCount: { $type: "s16", $targetKey: "ms" },
        clearType: { $type: "s16", $targetKey: "ct" },
        achievementRate: { $type: "s16", $targetKey: "ar" },
        $targetKey: "ver"
    }
}
export function generateRb3MusicRecord(musicId: number, chartType: number): IRb3MusicRecord {
    return {
        collection: "rb.rb3.playData.musicRecord",
        musicId: musicId,
        chartType: chartType,
        playCount: 0,
        clearType: 0,
        achievementRateTimes100: 0,
        score: 0,
        combo: 0,
        missCount: -1,
        time: Math.trunc(Date.now() / 1000),
        bestScoreUpdateTime: Math.trunc(Date.now() / 1000),
        bestAchievementRateUpdateTime: Math.trunc(Date.now() / 1000),
        bestComboUpdateTime: Math.trunc(Date.now() / 1000),
        bestMissCountUpdateTime: Math.trunc(Date.now() / 1000),
        kFlag: 0,
        isHasGhostRed: false,
        isHasGhostBlue: false
    }
}