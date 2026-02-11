import { Rb1MusicRecord } from "../../models/rb1/profile"
import { Rb2MusicRecord } from "../../models/rb2/profile"
import { Rb3MusicRecord } from "../../models/rb3/music_record"
import { Rb4MusicRecord } from "../../models/rb4/music_record"
import { Rb5MusicRecord } from "../../models/rb5/music_record"
import { Rb1ChartType, Rb1ClearType, Rb2ClearType, Rb3ClearType, Rb4ChartType, Rb4ClearType, RbChartType, RbVersion } from "../../models/shared/rb_types"
import { convertMusicId, getMusicId } from "../../data/tables/rb_music_id"
import { findChartInfo } from "../../data/tables/rb_chart_info"

type RbMusicRecord = Rb1MusicRecord | Rb2MusicRecord | Rb3MusicRecord | Rb4MusicRecord | Rb5MusicRecord

export type RbBestMusicRecord = {
    musicId: number
    chartType: RbChartType<RbVersion>
    // max
    clearType: RbBestMusicRecordClearType
    gaugeType: RbBestMusicRecordGaugeType
    score: number
    combo: RbBestMusicRecordClearType
    missCount: number
    achievementRateTimes100: number
    param: number
    // sum
    playCount: number
    winCount: number
    loseCount: number
    drawCount: number

    clearTypeVersion?: number
    scoreVersion?: number
    comboVersion?: number
    missCountVersion?: number
    achievementRateVersion?: number
    clearTypeUpdateTime?: number
    scoreUpdateTime?: number
    comboUpdateTime?: number
    missCountUpdateTime?: number
    achievementRateUpdateTime?: number
}
export function RbBestMusicRecord(musicId: number, chartType: number): RbBestMusicRecord {
    return {
        musicId: musicId,
        chartType: chartType,
        clearType: 0,
        gaugeType: 0,
        score: 0,
        combo: 0,
        missCount: -1,
        achievementRateTimes100: 0,
        param: 0,
        playCount: 0,
        winCount: 0,
        loseCount: 0,
        drawCount: 0,
        clearTypeVersion: 100,
        scoreVersion: 100,
        comboVersion: 100,
        missCountVersion: 100,
        achievementRateVersion: 100,
        comboUpdateTime: 2147483647,
        scoreUpdateTime: 2147483647,
        clearTypeUpdateTime: 2147483647,
        missCountUpdateTime: 2147483647,
        achievementRateUpdateTime: 2147483647,
    }
}

export enum RbBestMusicRecordClearType {
    none = 0,
    failed = 1,
    clear = 2,
    hardClear,
    sHardClear,
    fullCombo,
    allJustReflecFullCombo,
    excellent
}
export enum RbBestMusicRecordGaugeType {
    normal = 0,
    hard = 1,
    sHard = 2
}

export async function findBestMusicRecord<TVersion extends RbVersion>(rid: string, musicUid: string, chartType: RbChartType<TVersion>, version: TVersion): Promise<RbBestMusicRecord> {
    const mid = await getMusicId(musicUid, version)
    if (mid == undefined) return undefined
    const chartInfo = await findChartInfo(mid, version, chartType)
    if (!chartInfo) return undefined
    if (chartInfo.chartVersion === version) return undefined // Newly updated chart and shouldn't have an old score
    const clearTypeArray: RbBestMusicRecordClearType[] = []
    const gaugeTypeArray: RbBestMusicRecordGaugeType[] = []
    const scoreArray: number[] = []
    const comboArray: RbBestMusicRecordClearType[] = []
    const missCountArray: number[] = []
    const arTimes100Array: number[] = []
    const paramArray: number[] = []
    const playCountArray: number[] = []
    const winCountArray: number[] = []
    const loseCountArray: number[] = []
    const drawCountArray: number[] = []

    const historyVersions: RbVersion[] = (version >= 4 && chartType === Rb4ChartType.special) ? [4, 5] : [1, 2, 3, 4, 5]

    for (const v of historyVersions) if (v !== version) {
        const historyChartInfo = await findChartInfo(mid, v, chartType)
        if (!historyChartInfo) continue
        switch (v) {
            case 1:
                const midRb1 = await getMusicId(musicUid, 1)
                const recordRb1: Rb1MusicRecord = await DB.FindOne<Rb1MusicRecord>(rid, { collection: "rb.rb1.playData.musicRecord", musicId: midRb1, chartType: chartType as Rb1ChartType })
                if (!recordRb1) break

                clearTypeArray.push(convertFromRb1ClearType(recordRb1.clearType, recordRb1.achievementRateTimes10 * 10))
                gaugeTypeArray.push(RbBestMusicRecordGaugeType.normal)
                scoreArray.push(recordRb1.score)
                comboArray.push(recordRb1.combo)
                missCountArray.push(recordRb1.missCount)
                arTimes100Array.push(recordRb1.achievementRateTimes10 * 10)
                playCountArray.push(recordRb1.playCount)
                winCountArray.push(recordRb1.winCount)
                loseCountArray.push(recordRb1.loseCount)
                drawCountArray.push(recordRb1.drawCount)
                break
            case 2:
                const midRb2 = await getMusicId(musicUid, 2)
                const recordRb2: Rb2MusicRecord = await DB.FindOne<Rb2MusicRecord>(rid, { collection: "rb.rb2.playData.musicRecord", musicId: midRb2, chartType: chartType as Rb1ChartType })
                if (!recordRb2) break

                clearTypeArray.push(convertFromRb2ClearType(recordRb2.newRecord.clearType, recordRb2.newRecord.achievementRateTimes10 * 10))
                gaugeTypeArray.push(RbBestMusicRecordGaugeType.normal)
                scoreArray.push(recordRb2.newRecord.score)
                comboArray.push(recordRb2.newRecord.combo)
                missCountArray.push(recordRb2.newRecord.missCount)
                arTimes100Array.push(recordRb2.newRecord.achievementRateTimes10 * 10)
                playCountArray.push(recordRb2.newRecord.playCount)
                winCountArray.push(recordRb2.newRecord.winCount)
                loseCountArray.push(recordRb2.newRecord.loseCount)
                drawCountArray.push(recordRb2.newRecord.drawCount)
                break
            case 3:
                const midRb3 = await getMusicId(musicUid, 3)
                const recordRb3: Rb3MusicRecord = await DB.FindOne<Rb3MusicRecord>(rid, { collection: "rb.rb3.playData.musicRecord", musicId: midRb3, chartType: chartType as Rb1ChartType })
                if (!recordRb3) break

                clearTypeArray.push(convertFromRb3ClearType(recordRb3.clearType, recordRb3.missCount, recordRb3.achievementRateTimes100))
                gaugeTypeArray.push(RbBestMusicRecordGaugeType.normal)
                scoreArray.push(recordRb3.score)
                comboArray.push(recordRb3.combo)
                missCountArray.push(recordRb3.missCount)
                arTimes100Array.push(recordRb3.achievementRateTimes100)
                playCountArray.push(recordRb3.playCount)
                break
            case 4:
                const midRb4 = await getMusicId(musicUid, 4)
                const recordRb4 = await DB.FindOne<Rb4MusicRecord>(rid, { collection: "rb.rb4.playData.musicRecord", musicId: midRb4, chartType: chartType as Rb4ChartType })
                if (!recordRb4) break

                clearTypeArray.push(convertFromRb4ClearType(recordRb4.clearType, recordRb4.missCount, recordRb4.achievementRateTimes100))
                gaugeTypeArray.push(convertGaugeTypeFromRb4ClearType(recordRb4.clearType))
                scoreArray.push(recordRb4.score)
                comboArray.push(recordRb4.combo)
                paramArray.push(recordRb4.param)
                missCountArray.push(recordRb4.missCount)
                arTimes100Array.push(recordRb4.achievementRateTimes100)
                playCountArray.push(recordRb4.playCount)
                break
            case 5:
                const midRb5 = await getMusicId(musicUid, 5)
                const recordRb5 = await DB.FindOne<Rb5MusicRecord>(rid, { collection: "rb.rb5.playData.musicRecord", musicId: midRb5, chartType: chartType as Rb4ChartType })
                if (!recordRb5) break

                clearTypeArray.push(convertFromRb4ClearType(recordRb5.clearType, recordRb5.missCount, recordRb5.achievementRateTimes100))
                gaugeTypeArray.push(convertGaugeTypeFromRb4ClearType(recordRb5.clearType))
                scoreArray.push(recordRb5.score)
                comboArray.push(recordRb5.combo)
                paramArray.push(recordRb5.param)
                missCountArray.push(recordRb5.missCount)
                arTimes100Array.push(recordRb5.achievementRateTimes100)
                playCountArray.push(recordRb5.playCount)
                break
        }
    }
    if ((scoreArray.length === 0) || (clearTypeArray.length === 0) || (comboArray.length === 0) || (arTimes100Array.length === 0) || (missCountArray.length === 0)) return undefined
    const sum = (array: number[]) => array.reduce((p, c) => c + p)

    const maxClearType = Math.max(...clearTypeArray)
    const minMissCount = missCountArray.reduce((p, c) => (p >= 0) ? ((c < p) && (c >= 0)) ? c : p : (c >= 0) ? c : -1)

    return {
        musicId: mid,
        chartType: chartType,
        clearType: maxClearType,
        gaugeType: (gaugeTypeArray.length === 0) ? RbBestMusicRecordGaugeType.normal : Math.max(...gaugeTypeArray),
        score: Math.max(...scoreArray),
        combo: Math.max(...comboArray),
        achievementRateTimes100: Math.max(...arTimes100Array),
        missCount: minMissCount,
        param: (paramArray.length === 0) ? (Math.max(...clearTypeArray) >= RbBestMusicRecordClearType.fullCombo) ? 1 : 0 : Math.max(...paramArray),
        playCount: sum(playCountArray),
        winCount: sum(winCountArray),
        drawCount: sum(drawCountArray),
        loseCount: sum(loseCountArray),
        scoreVersion: scoreArray.indexOf(Math.max(...scoreArray)),
        comboVersion: comboArray.indexOf(Math.max(...comboArray)),
        achievementRateVersion: arTimes100Array.indexOf(Math.max(...arTimes100Array)),
        clearTypeVersion: scoreArray.indexOf(maxClearType),
        missCountVersion: scoreArray.indexOf(minMissCount)
    }
}

export async function findAllBestMusicRecord(rid: string, version: RbVersion): Promise<RbBestMusicRecord[]> {
    const result: RbBestMusicRecord[] = []
    const resultMap: Record<number, RbBestMusicRecord[]> = {}
    const max = Math.max
    const min = Math.min
    const updateScore = (prev: RbBestMusicRecord, next: Partial<RbBestMusicRecord>) => {
        if (next.scoreVersion != undefined) prev.scoreVersion = ((prev.score < next.score) || ((prev.score === next.score) && (prev.scoreVersion > next.scoreVersion))) ? next.scoreVersion : prev.scoreVersion
        if (next.comboVersion != undefined) prev.comboVersion = ((prev.combo < next.combo) || ((prev.combo === next.combo) && (prev.comboVersion > next.comboVersion))) ? next.scoreVersion : prev.comboVersion
        if (next.clearTypeVersion != undefined) prev.clearTypeVersion = ((prev.clearType < next.clearType) || ((prev.clearType === next.clearType) && (prev.clearTypeVersion > next.clearTypeVersion))) ? next.clearTypeVersion : prev.clearTypeVersion
        if (next.missCountVersion != undefined) prev.missCountVersion = ((((prev.missCount > next.missCount) || (prev.missCount < 0)) && (next.missCount >= 0)) || ((prev.missCount === next.missCount) && (prev.missCountVersion > next.missCountVersion))) ? next.missCountVersion : prev.missCountVersion
        if (next.achievementRateVersion != undefined) prev.achievementRateVersion = ((prev.achievementRateTimes100 < next.achievementRateTimes100) || ((prev.achievementRateTimes100 === next.achievementRateTimes100) && (prev.achievementRateVersion > next.achievementRateVersion))) ? next.achievementRateVersion : prev.achievementRateVersion
        if (next.scoreUpdateTime != undefined) prev.scoreUpdateTime = ((prev.score < next.score) || ((prev.score === next.score) && (prev.scoreUpdateTime > next.scoreUpdateTime))) ? next.scoreUpdateTime : prev.scoreUpdateTime
        if (next.comboUpdateTime != undefined) prev.comboUpdateTime = ((prev.combo < next.combo) || ((prev.combo === next.combo) && (prev.comboUpdateTime > next.comboUpdateTime))) ? next.scoreUpdateTime : prev.comboUpdateTime
        if (next.clearTypeUpdateTime != undefined) prev.clearTypeUpdateTime = ((prev.clearType < next.clearType) || ((prev.clearType === next.clearType) && (prev.clearTypeUpdateTime > next.clearTypeUpdateTime))) ? next.clearTypeUpdateTime : prev.clearTypeUpdateTime
        if (next.missCountUpdateTime != undefined) prev.missCountUpdateTime = ((((prev.missCount > next.missCount) || (prev.missCount < 0)) && (next.missCount >= 0)) || ((prev.missCount === next.missCount) && (prev.missCountUpdateTime > next.missCountUpdateTime))) ? next.missCountUpdateTime : prev.missCountUpdateTime
        if (next.achievementRateUpdateTime != undefined) prev.achievementRateUpdateTime = ((prev.achievementRateTimes100 < next.achievementRateTimes100) || ((prev.achievementRateTimes100 === next.achievementRateTimes100) && (prev.achievementRateUpdateTime > next.achievementRateUpdateTime))) ? next.achievementRateUpdateTime : prev.achievementRateUpdateTime
        if (next.clearType != undefined) prev.clearType = max(prev.clearType, next.clearType)
        if (next.gaugeType != undefined) prev.gaugeType = max(prev.gaugeType, next.gaugeType)
        if (next.score != undefined) prev.score = max(prev.score, next.score)
        if (next.combo != undefined) prev.combo = max(prev.score, next.combo)
        if (next.missCount != undefined) prev.missCount = next.missCount === -1 ? prev.missCount : prev.missCount === -1 ? next.missCount : min(next.missCount, prev.missCount)
        if (next.achievementRateTimes100 != undefined) prev.achievementRateTimes100 = max(next.achievementRateTimes100, prev.achievementRateTimes100)
        if (next.playCount != undefined) prev.playCount += next.playCount
        if (next.winCount != undefined) prev.winCount += next.winCount
        if (next.loseCount != undefined) prev.loseCount += next.loseCount
        if (next.drawCount != undefined) prev.drawCount += next.drawCount
        if (next.param != undefined) prev.param = max(prev.param, next.param)
    }
    for (const v of [1, 2, 3, 4, 5] as const) {
        if (version === v) continue
        for (const rv of await DB.Find(rid, { collection: `rb.rb${v}.playData.musicRecord` }) as RbMusicRecord[]) {
            if ((version === 1 || version === 2 || version === 3) && (rv.chartType === Rb4ChartType.special)) continue
            const info = await findChartInfo(rv.musicId, v, rv.chartType)
            const musicIdCurrentVersion = await convertMusicId(rv.musicId, v, version)
            if (musicIdCurrentVersion == undefined) continue
            const infoCurrentVersion = await findChartInfo(musicIdCurrentVersion, v, rv.chartType)
            if (!info || !infoCurrentVersion || info.version !== infoCurrentVersion.version) continue
            const records = resultMap[musicIdCurrentVersion] ?? []
            resultMap[musicIdCurrentVersion] = records
            const record = records[rv.chartType] ?? RbBestMusicRecord(musicIdCurrentVersion, rv.chartType)
            if (v === 1) {
                const r = rv as Rb1MusicRecord
                updateScore(record, {
                    clearType: convertFromRb1ClearType(r.clearType, r.achievementRateTimes10 * 10),
                    gaugeType: RbBestMusicRecordGaugeType.normal,
                    score: r.score,
                    combo: r.combo,
                    missCount: r.missCount,
                    achievementRateTimes100: r.achievementRateTimes10 * 10,
                    playCount: r.playCount,
                    winCount: r.winCount,
                    loseCount: r.loseCount,
                    drawCount: r.drawCount,
                    comboVersion: v,
                    scoreVersion: v,
                    missCountVersion: v,
                    clearTypeVersion: v,
                    achievementRateVersion: v
                })
            } else if (v === 2) {
                const r = rv as Rb2MusicRecord
                updateScore(record, {
                    clearType: convertFromRb2ClearType(r.newRecord.clearType, r.newRecord.achievementRateTimes10 * 10),
                    gaugeType: RbBestMusicRecordGaugeType.normal,
                    score: r.newRecord.score,
                    combo: r.newRecord.combo,
                    missCount: r.newRecord.missCount,
                    achievementRateTimes100: r.newRecord.achievementRateTimes10 * 10,
                    playCount: r.newRecord.playCount,
                    winCount: r.newRecord.winCount,
                    loseCount: r.newRecord.loseCount,
                    drawCount: r.newRecord.drawCount,
                    comboVersion: v,
                    scoreVersion: v,
                    missCountVersion: v,
                    clearTypeVersion: v,
                    achievementRateVersion: v
                })
            } else if (v === 3) {
                const r = rv as Rb3MusicRecord
                updateScore(record, {
                    clearType: convertFromRb3ClearType(r.clearType, r.missCount, r.achievementRateTimes100),
                    gaugeType: RbBestMusicRecordGaugeType.normal,
                    score: r.score,
                    combo: r.combo,
                    missCount: r.missCount,
                    achievementRateTimes100: r.achievementRateTimes100,
                    playCount: r.playCount,
                    comboVersion: v,
                    scoreVersion: v,
                    missCountVersion: v,
                    clearTypeVersion: v,
                    achievementRateVersion: v,
                    comboUpdateTime: r.bestComboUpdateTime,
                    scoreUpdateTime: r.bestScoreUpdateTime,
                    achievementRateUpdateTime: r.bestAchievementRateUpdateTime,
                    missCountUpdateTime: r.bestMissCountUpdateTime
                })
            } else {
                const r = rv as Rb4MusicRecord | Rb5MusicRecord
                updateScore(record, {
                    clearType: convertFromRb4ClearType(r.clearType, r.missCount, r.achievementRateTimes100),
                    gaugeType: convertGaugeTypeFromRb4ClearType(r.clearType),
                    score: r.score,
                    combo: r.combo,
                    missCount: r.missCount,
                    achievementRateTimes100: r.achievementRateTimes100,
                    playCount: r.playCount,
                    comboVersion: v,
                    scoreVersion: v,
                    missCountVersion: v,
                    clearTypeVersion: v,
                    achievementRateVersion: v,
                    comboUpdateTime: r.bestComboUpdateTime,
                    scoreUpdateTime: r.bestScoreUpdateTime,
                    achievementRateUpdateTime: r.bestAchievementRateUpdateTime,
                    missCountUpdateTime: r.bestMissCountUpdateTime
                })
            }
            records[rv.chartType] = record
        }
    }
    for (const k in resultMap) result.push(...resultMap[k].filter((v) => v))
    return result
}

export function convertToRb1ClearType(clearType: RbBestMusicRecordClearType): Rb1ClearType {
    switch (clearType) {
        case RbBestMusicRecordClearType.failed: return Rb1ClearType.failed
        case RbBestMusicRecordClearType.clear:
        case RbBestMusicRecordClearType.hardClear:
        case RbBestMusicRecordClearType.sHardClear: return Rb1ClearType.clear
        case RbBestMusicRecordClearType.fullCombo:
        case RbBestMusicRecordClearType.excellent:
        case RbBestMusicRecordClearType.allJustReflecFullCombo: return Rb1ClearType.fullCombo
        default: return Rb1ClearType.none
    }
}
export function convertToRb2ClearType(clearType: RbBestMusicRecordClearType): Rb2ClearType {
    switch (clearType) {
        case RbBestMusicRecordClearType.failed: return Rb2ClearType.failed
        case RbBestMusicRecordClearType.clear:
        case RbBestMusicRecordClearType.hardClear:
        case RbBestMusicRecordClearType.sHardClear: return Rb2ClearType.clear
        case RbBestMusicRecordClearType.fullCombo:
        case RbBestMusicRecordClearType.excellent:
        case RbBestMusicRecordClearType.allJustReflecFullCombo: return Rb2ClearType.fullCombo
        default: return Rb2ClearType.none
    }
}
export function convertToRb3ClearType(clearType: RbBestMusicRecordClearType): Rb3ClearType {
    switch (clearType) {
        case RbBestMusicRecordClearType.failed: return Rb3ClearType.failed
        case RbBestMusicRecordClearType.clear:
        case RbBestMusicRecordClearType.hardClear:
        case RbBestMusicRecordClearType.sHardClear:
        case RbBestMusicRecordClearType.fullCombo:
        case RbBestMusicRecordClearType.excellent:
        case RbBestMusicRecordClearType.allJustReflecFullCombo: return Rb3ClearType.clear
        default: return Rb3ClearType.none
    }
}
export function convertToRb4ClearType(clearType: RbBestMusicRecordClearType, gaugeType: RbBestMusicRecordGaugeType): Rb4ClearType {
    switch (clearType) {
        case RbBestMusicRecordClearType.failed:
            switch (gaugeType) {
                case RbBestMusicRecordGaugeType.normal: return Rb4ClearType.failed
                case RbBestMusicRecordGaugeType.hard: return Rb4ClearType.hardFailed
                case RbBestMusicRecordGaugeType.sHard: return Rb4ClearType.sHardFailed
            }
        case RbBestMusicRecordClearType.clear: return Rb4ClearType.clear
        case RbBestMusicRecordClearType.hardClear: return Rb4ClearType.hardClear
        case RbBestMusicRecordClearType.sHardClear: return Rb4ClearType.sHardClear
        case RbBestMusicRecordClearType.fullCombo:
        case RbBestMusicRecordClearType.excellent:
        case RbBestMusicRecordClearType.allJustReflecFullCombo:
            switch (gaugeType) {
                case RbBestMusicRecordGaugeType.normal: return Rb4ClearType.clear
                case RbBestMusicRecordGaugeType.hard: return Rb4ClearType.hardClear
                case RbBestMusicRecordGaugeType.sHard: return Rb4ClearType.sHardClear
            }
        default: return Rb4ClearType.none
    }
}
export function convertFromRb1ClearType(clearType: Rb1ClearType, ar100: number): RbBestMusicRecordClearType {
    if (ar100 === 10000) return RbBestMusicRecordClearType.excellent
    switch (clearType) {
        case Rb1ClearType.failed:
        case Rb1ClearType.clear: return RbBestMusicRecordClearType.clear
        case Rb1ClearType.fullCombo: return RbBestMusicRecordClearType.fullCombo
        default: return RbBestMusicRecordClearType.none
    }
}
export function convertFromRb2ClearType(clearType: Rb2ClearType, ar100: number): RbBestMusicRecordClearType {
    if (ar100 === 10000) return RbBestMusicRecordClearType.excellent
    switch (clearType) {
        case Rb2ClearType.failed:
        case Rb2ClearType.clear: return RbBestMusicRecordClearType.clear
        case Rb2ClearType.fullCombo: return RbBestMusicRecordClearType.fullCombo
        default: return RbBestMusicRecordClearType.none
    }
}
export function convertFromRb3ClearType(clearType: Rb3ClearType, missCount: number, ar100: number): RbBestMusicRecordClearType {
    if (ar100 === 10000) return RbBestMusicRecordClearType.excellent
    if (missCount === 0) return RbBestMusicRecordClearType.fullCombo
    switch (clearType) {
        case Rb3ClearType.failed:
        case Rb3ClearType.battleFailed: return RbBestMusicRecordClearType.failed
        case Rb3ClearType.clear: return RbBestMusicRecordClearType.clear
        default: return RbBestMusicRecordClearType.none
    }
}
export function convertFromRb4ClearType(clearType: Rb4ClearType, missCount: number, ar100: number): RbBestMusicRecordClearType {
    if (ar100 === 10000) return RbBestMusicRecordClearType.excellent
    if (missCount === 0) return RbBestMusicRecordClearType.fullCombo
    switch (clearType) {
        case Rb4ClearType.failed:
        case Rb4ClearType.hardFailed:
        case Rb4ClearType.sHardFailed: return RbBestMusicRecordClearType.failed
        case Rb4ClearType.clear: return RbBestMusicRecordClearType.clear
        case Rb4ClearType.hardClear: return RbBestMusicRecordClearType.hardClear
        case Rb4ClearType.sHardClear: return RbBestMusicRecordClearType.sHardClear
        default: return RbBestMusicRecordClearType.none
    }
}
export function convertGaugeTypeFromRb4ClearType(clearType: Rb4ClearType): RbBestMusicRecordGaugeType {
    switch (clearType) {
        case Rb4ClearType.hardFailed:
        case Rb4ClearType.hardClear: return RbBestMusicRecordGaugeType.hard
        case Rb4ClearType.sHardFailed:
        case Rb4ClearType.sHardClear: return RbBestMusicRecordGaugeType.sHard
        default: return RbBestMusicRecordGaugeType.normal
    }
}