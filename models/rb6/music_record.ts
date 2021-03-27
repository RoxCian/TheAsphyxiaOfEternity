import { ICollection } from "../utility/definitions"
import { boolme, getCollectionMappingElement, KObjectMappingRecord, s16me, s32me, s8me } from "../../utility/mapping"

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
    musicId: s16me("mid"),
    chartType: s8me("ntgrd"),
    playCount: s32me("pc"),
    clearType: s8me("ct"),
    achievementRateTimes100: s16me("ar"),
    score: s16me("scr"),
    combo: s16me(),
    missCount: s16me("ms"),
    param: s16me(),
    time: s32me(),
    bestScoreUpdateTime: s32me("bscrt"),
    bestAchievementRateUpdateTime: s32me("bart"),
    bestComboUpdateTime: s32me("bctt"),
    bestMissCountUpdateTime: s32me("bmst"),
    kFlag: s32me("k_flag"),
    justCollectionRateTimes100Red: s32me("jcolr"),
    justCollectionRateTimes100Blue: s32me("jcolb"),
    isHasGhostBlue: boolme("ghostb"),
    isHasGhostRed: boolme("ghostr")
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