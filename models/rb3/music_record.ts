import { ICollection } from "../utility/definitions"
import { boolme, getCollectionMappingElement, KObjectMappingRecord, s16me, s32me, s8me } from "../../utility/mapping"

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
    musicId: s16me("mid"),
    chartType: s8me("ntgrd"),
    playCount: s32me("pc"),
    clearType: s8me("ct"), // 1: hard failed, 10: hard cleared, 11: s-hard cleared
    achievementRateTimes100: s16me("ar"),
    score: s16me("scr"),
    combo: s16me("cmb"),
    missCount: s16me("ms"),
    time: s32me(),
    bestScoreUpdateTime: s32me("bscrt"),
    bestAchievementRateUpdateTime: s32me("bart"),
    bestComboUpdateTime: s32me("bctt"),
    bestMissCountUpdateTime: s32me("bmst"),
    kFlag: s32me("k_flag"),
    isHasGhostBlue: boolme("ghostb"),
    isHasGhostRed: boolme("ghostr"),
    version: {
        score: s16me("scr"),
        combo: s16me("cmb"),
        missCount: s16me("ms"),
        clearType: s16me("ct"),
        achievementRate: s16me("ar"),
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