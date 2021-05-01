import { ICollection } from "../utility/definitions"
import { boolme, getCollectionMappingElement, ignoreme, KObjectMappingRecord, s16me, s32me, s8me, u16me } from "../../utility/mapping"

export interface IRb4MusicRecord extends ICollection<"rb.rb4.playData.musicRecord"> {
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
    isHasGhostRed: boolean
    isHasGhostBlue: boolean
    version?: number
}
export const Rb4MusicRecordMap: KObjectMappingRecord<IRb4MusicRecord> = {
    collection: getCollectionMappingElement<IRb4MusicRecord>("rb.rb4.playData.musicRecord"),
    musicId: s16me("mid"),
    chartType: s8me("ntgrd"),
    playCount: s32me("pc"),
    clearType: s8me("ct"), // 1: hard failed, 10: hard cleared, 11: s-hard cleared
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
    isHasGhostBlue: boolme("ghostb"),
    isHasGhostRed: boolme("ghostr"),
    version: u16me("ver")
}
export const Rb4OldMusicRecordMap: KObjectMappingRecord<IRb4MusicRecord> = {
    collection: getCollectionMappingElement<IRb4MusicRecord>("rb.rb4.playData.musicRecord"),
    musicId: s16me("mid"),
    chartType: s8me("ntgrd"),
    playCount: s32me("pc"),
    clearType: s8me("ct"), // 1: hard failed, 10: hard cleared, 11: s-hard cleared
    achievementRateTimes100: s16me("ar"),
    score: s16me("scr"),
    combo: s16me(),
    missCount: s16me("ms"),
    param: s16me(),
    time: ignoreme(),
    bestScoreUpdateTime: s32me("bst"),
    bestAchievementRateUpdateTime: s32me("bat"),
    bestComboUpdateTime: s32me("bct"),
    bestMissCountUpdateTime: s32me("bmt"),
    kFlag: ignoreme(),
    version: u16me("ver"),
    isHasGhostBlue: ignoreme(),
    isHasGhostRed: ignoreme()
}
export function generateRb4MusicRecord(musicId: number, chartType: number): IRb4MusicRecord {
    return {
        collection: "rb.rb4.playData.musicRecord",
        musicId: musicId,
        chartType: chartType,
        playCount: 0,
        clearType: 0,
        achievementRateTimes100: 0,
        score: 0,
        combo: 0,
        missCount: -1,
        param: 0,
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