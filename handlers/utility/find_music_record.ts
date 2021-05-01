import { getAvaliableMusicChartInfo, getAvaliableMusicChartInfoFromMusicId, getMusicId, getMusicIdStr, rbMusicChartInfo, RbMusicChartInfoElement } from "../../data/musicinfo/rb_music_info"
import { IRb1MusicRecord } from "../../models/rb1/profile"
import { IRb2MusicRecord } from "../../models/rb2/profile"
import { IRb3MusicRecord } from "../../models/rb3/music_record"
import { IRb4MusicRecord } from "../../models/rb4/music_record"
import { IRb5MusicRecord } from "../../models/rb5/music_record"

export interface IRbBestMusicRecord {
    musicId: number
    chartType: number
    // max
    clearType: ClearType
    gaugeType: GaugeType
    score: number
    combo: ClearType
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
export function rbr(musicId: number, chartType: number): IRbBestMusicRecord {
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

export enum ClearType {
    notPlayed = 0,
    failed = 1,
    cleared = 2,
    hardCleared,
    sHardCleared,
    fullCombo,
    allJustReflecFullCombo,
    excellent
}
export enum GaugeType {
    normal = 0,
    hard = 1,
    sHard = 2
}

export async function findBestMusicRecord(rid: string, musicIdStr: string, chartType: number, forVersion: 1 | 2 | 3 | 4 | 5): Promise<IRbBestMusicRecord> {
    let chartName = <"basic" | "medium" | "hard" | "special">["basic", "medium", "hard", "special"][chartType]
    let musicInfo = getAvaliableMusicChartInfo(musicIdStr)
    let currentInfo: RbMusicChartInfoElement = musicInfo["rb" + forVersion]
    if ((currentInfo == null) || (currentInfo.chartsInfo[chartName] == null)) return null // deleted
    let clearTypeArray: ClearType[] = []
    let gaugeTypeArray: GaugeType[] = []
    let scoreArray: number[] = []
    let comboArray: ClearType[] = []
    let missCountArray: number[] = []
    let arTimes100Array: number[] = []
    let paramArray: number[] = []
    let playCountArray: number[] = []
    let winCountArray: number[] = []
    let loseCountArray: number[] = []
    let drawCountArray: number[] = []

    for (let i of [1, 2, 3, 4, 5]) if (i != forVersion) {
        let comparingInfo: RbMusicChartInfoElement = musicInfo["rb" + i]
        if (comparingInfo == null) continue
        if (comparingInfo.chartsInfo[chartName]?.version == currentInfo.chartsInfo[chartName].version) {
            switch (i) {
                case 1:
                    let midRb1 = getMusicId(musicIdStr, 1)
                    let recordRb1: IRb1MusicRecord = await DB.FindOne<IRb1MusicRecord>(rid, { collection: "rb.rb1.playData.musicRecord", musicId: midRb1, chartType: chartType })
                    if (recordRb1 == null) break

                    if (recordRb1.clearType == 2) clearTypeArray.push(ClearType.cleared)
                    else if (recordRb1.clearType == 3) clearTypeArray.push(ClearType.fullCombo)
                    else (clearTypeArray.push(ClearType.notPlayed))

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
                    let midRb2 = getMusicId(musicIdStr, 2)
                    let recordRb2: IRb2MusicRecord = await DB.FindOne<IRb2MusicRecord>(rid, { collection: "rb.rb2.playData.musicRecord", musicId: midRb2, chartType: chartType })
                    if (recordRb2 == null) break

                    if (recordRb2.newRecord.clearType == 2) clearTypeArray.push(ClearType.failed)
                    else if (recordRb2.newRecord.clearType == 3) clearTypeArray.push(ClearType.cleared)
                    else if (recordRb2.newRecord.clearType == 4) clearTypeArray.push(ClearType.fullCombo)
                    else (clearTypeArray.push(ClearType.notPlayed))

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
                    let midRb3 = getMusicId(musicIdStr, 3)
                    let recordRb3: IRb3MusicRecord = await DB.FindOne<IRb3MusicRecord>(rid, { collection: "rb.rb3.playData.musicRecord", musicId: midRb3, chartType: chartType })
                    if (recordRb3 == null) break

                    if (recordRb3.missCount == 0) clearTypeArray.push(ClearType.fullCombo)
                    else if ((recordRb3.clearType == 1) || (recordRb3.clearType == 2)) clearTypeArray.push(ClearType.failed)
                    else (clearTypeArray.push(ClearType.notPlayed))

                    scoreArray.push(recordRb3.score)
                    comboArray.push(recordRb3.combo)
                    missCountArray.push(recordRb3.missCount)
                    arTimes100Array.push(recordRb3.achievementRateTimes100)
                    playCountArray.push(recordRb3.playCount)
                    break
                case 4:
                    let midRb4 = getMusicId(musicIdStr, 4)
                    let recordRb4: IRb4MusicRecord = await DB.FindOne<IRb4MusicRecord>(rid, { collection: "rb.rb4.playData.musicRecord", musicId: midRb4, chartType: chartType })
                    if (recordRb4 == null) break

                    if (recordRb4.missCount == 0) clearTypeArray.push(ClearType.fullCombo)
                    else if ((recordRb4.clearType == 1) || (recordRb4.clearType == 2) || (recordRb4.clearType == 3)) clearTypeArray.push(ClearType.failed)
                    else if (recordRb4.clearType == 9) clearTypeArray.push(ClearType.cleared)
                    else if (recordRb4.clearType == 10) clearTypeArray.push(ClearType.hardCleared)
                    else if (recordRb4.clearType == 11) clearTypeArray.push(ClearType.sHardCleared)
                    else (clearTypeArray.push(ClearType.notPlayed))

                    if ((recordRb4.clearType == 1) || (recordRb4.clearType == 9)) gaugeTypeArray.push(GaugeType.normal)
                    else if ((recordRb4.clearType == 2) || (recordRb4.clearType == 10)) gaugeTypeArray.push(GaugeType.hard)
                    else if ((recordRb4.clearType == 3) || (recordRb4.clearType == 11)) gaugeTypeArray.push(GaugeType.sHard)

                    scoreArray.push(recordRb4.score)
                    comboArray.push(recordRb4.combo)
                    paramArray.push(recordRb4.param)
                    missCountArray.push(recordRb4.missCount)
                    arTimes100Array.push(recordRb4.achievementRateTimes100)
                    playCountArray.push(recordRb4.playCount)
                    break
                case 5:
                    let midRb5 = getMusicId(musicIdStr, 5)
                    let recordRb5: IRb5MusicRecord = await DB.FindOne<IRb5MusicRecord>(rid, { collection: "rb.rb5.playData.musicRecord", musicId: midRb5, chartType: chartType })
                    if (recordRb5 == null) break

                    if (recordRb5.missCount == 0) clearTypeArray.push(ClearType.fullCombo)
                    else if ((recordRb5.clearType == 1) || (recordRb5.clearType == 2) || (recordRb5.clearType == 3)) clearTypeArray.push(ClearType.failed)
                    else if (recordRb5.clearType == 9) clearTypeArray.push(ClearType.cleared)
                    else if (recordRb5.clearType == 10) clearTypeArray.push(ClearType.hardCleared)
                    else if (recordRb5.clearType == 11) clearTypeArray.push(ClearType.sHardCleared)
                    else (clearTypeArray.push(ClearType.notPlayed))

                    if ((recordRb5.clearType == 1) || (recordRb5.clearType == 9)) gaugeTypeArray.push(GaugeType.normal)
                    else if ((recordRb5.clearType == 2) || (recordRb5.clearType == 10)) gaugeTypeArray.push(GaugeType.hard)
                    else if ((recordRb5.clearType == 3) || (recordRb5.clearType == 11)) gaugeTypeArray.push(GaugeType.sHard)

                    scoreArray.push(recordRb5.score)
                    comboArray.push(recordRb5.combo)
                    paramArray.push(recordRb5.param)
                    missCountArray.push(recordRb5.missCount)
                    arTimes100Array.push(recordRb5.achievementRateTimes100)
                    playCountArray.push(recordRb5.playCount)
                    break
            }
        }
    }
    if ((scoreArray.length == 0) || (clearTypeArray.length == 0) || (comboArray.length == 0) || (arTimes100Array.length == 0) || (missCountArray.length == 0)) return null
    let sum = (p, c) => c + p
    let minMissCount = (p, c) => (p >= 0) ? ((c < p) && (c >= 0)) ? c : p : (c >= 0) ? c : -1
    let count = (array: number[]) => (array.length == 0) ? 0 : array.reduce(sum)
    return {
        musicId: getMusicId(musicIdStr, forVersion),
        chartType: chartType,
        clearType: Math.max(...clearTypeArray),
        gaugeType: (gaugeTypeArray.length == 0) ? GaugeType.normal : Math.max(...gaugeTypeArray),
        score: Math.max(...scoreArray),
        combo: Math.max(...comboArray),
        achievementRateTimes100: Math.max(...arTimes100Array),
        missCount: missCountArray.reduce(minMissCount),
        param: (paramArray.length == 0) ? (Math.max(...clearTypeArray) >= ClearType.fullCombo) ? 1 : 0 : Math.max(...paramArray),
        playCount: count(playCountArray),
        winCount: count(winCountArray),
        drawCount: count(drawCountArray),
        loseCount: count(loseCountArray),
        scoreVersion: scoreArray.indexOf(Math.max(...scoreArray)),
        comboVersion: comboArray.indexOf(Math.max(...comboArray)),
        achievementRateVersion: arTimes100Array.indexOf(Math.max(...arTimes100Array)),
        clearTypeVersion: scoreArray.indexOf(Math.max(...clearTypeArray)),
        missCountVersion: scoreArray.indexOf(Math.max(...missCountArray))
    }
}

export async function findAllBestMusicRecord(rid: string, forVersion: 1 | 2 | 3 | 4 | 5): Promise<IRbBestMusicRecord[]> {
    let result: IRbBestMusicRecord[] = []
    let map: { [key: string]: IRbBestMusicRecord[] } = {}
    let keys: ["basic", "medium", "hard", "special"] = ["basic", "medium", "hard", "special"]
    let max = Math.max
    let min = Math.min
    let updateScore = (prev: IRbBestMusicRecord, next: Partial<IRbBestMusicRecord>) => {
        if (next.scoreVersion != null) prev.scoreVersion = ((prev.score < next.score) || ((prev.score == next.score) && (prev.scoreVersion > next.scoreVersion))) ? next.scoreVersion : prev.scoreVersion
        if (next.comboVersion != null) prev.comboVersion = ((prev.combo < next.combo) || ((prev.combo == next.combo) && (prev.comboVersion > next.comboVersion))) ? next.scoreVersion : prev.comboVersion
        if (next.clearTypeVersion != null) prev.clearTypeVersion = ((prev.clearType < next.clearType) || ((prev.clearType == next.clearType) && (prev.clearTypeVersion > next.clearTypeVersion))) ? next.clearTypeVersion : prev.clearTypeVersion
        if (next.missCountVersion != null) prev.missCountVersion = ((((prev.missCount > next.missCount) || (prev.missCount < 0)) && (next.missCount >= 0)) || ((prev.missCount == next.missCount) && (prev.missCountVersion > next.missCountVersion))) ? next.missCountVersion : prev.missCountVersion
        if (next.achievementRateVersion != null) prev.achievementRateVersion = ((prev.achievementRateTimes100 < next.achievementRateTimes100) || ((prev.achievementRateTimes100 == next.achievementRateTimes100) && (prev.achievementRateVersion > next.achievementRateVersion))) ? next.achievementRateVersion : prev.achievementRateVersion
        if (next.scoreUpdateTime != null) prev.scoreUpdateTime = ((prev.score < next.score) || ((prev.score == next.score) && (prev.scoreUpdateTime > next.scoreUpdateTime))) ? next.scoreUpdateTime : prev.scoreUpdateTime
        if (next.comboUpdateTime != null) prev.comboUpdateTime = ((prev.combo < next.combo) || ((prev.combo == next.combo) && (prev.comboUpdateTime > next.comboUpdateTime))) ? next.scoreUpdateTime : prev.comboUpdateTime
        if (next.clearTypeUpdateTime != null) prev.clearTypeUpdateTime = ((prev.clearType < next.clearType) || ((prev.clearType == next.clearType) && (prev.clearTypeUpdateTime > next.clearTypeUpdateTime))) ? next.clearTypeUpdateTime : prev.clearTypeUpdateTime
        if (next.missCountUpdateTime != null) prev.missCountUpdateTime = ((((prev.missCount > next.missCount) || (prev.missCount < 0)) && (next.missCount >= 0)) || ((prev.missCount == next.missCount) && (prev.missCountUpdateTime > next.missCountUpdateTime))) ? next.missCountUpdateTime : prev.missCountUpdateTime
        if (next.achievementRateUpdateTime != null) prev.achievementRateUpdateTime = ((prev.achievementRateTimes100 < next.achievementRateTimes100) || ((prev.achievementRateTimes100 == next.achievementRateTimes100) && (prev.achievementRateUpdateTime > next.achievementRateUpdateTime))) ? next.achievementRateUpdateTime : prev.achievementRateUpdateTime
        if (next.clearType != null) prev.clearType = max(prev.clearType, next.clearType)
        if (next.gaugeType != null) prev.gaugeType = max(prev.gaugeType, next.gaugeType)
        if (next.score != null) prev.score = max(prev.score, next.score)
        if (next.combo != null) prev.combo = max(prev.score, next.combo)
        if (next.missCount != null) prev.missCount = next.missCount == -1 ? prev.missCount : min(next.missCount, prev.missCount)
        if (next.achievementRateTimes100 != null) prev.achievementRateTimes100 = max(next.achievementRateTimes100, prev.achievementRateTimes100)
        if (next.playCount != null) prev.playCount += next.playCount
        if (next.winCount != null) prev.winCount += next.winCount
        if (next.loseCount != null) prev.loseCount += next.loseCount
        if (next.drawCount != null) prev.drawCount += next.drawCount
        if (next.param != null) prev.param = max(prev.param, next.param)
    }
    let version: number
    version = 1
    if (forVersion != version) for (let r of await DB.Find<IRb1MusicRecord>(rid, { collection: "rb.rb1.playData.musicRecord" })) {
        let infos = getAvaliableMusicChartInfoFromMusicId(r.musicId, version)
        let thisInfo: RbMusicChartInfoElement = infos[`rb${forVersion}`]
        if ((thisInfo == null) || (thisInfo.chartsInfo[keys[r.chartType]] == null) || (infos[`rb${version}`] == null) || (infos[`rb${version}`].chartsInfo[keys[r.chartType]] == null) || (thisInfo.status != "avaliable")) continue
        let key = keys[r.chartType]
        let ctTranslate = (clearType: number) => {
            switch (clearType) {
                case 2: return ClearType.cleared
                case 3: return ClearType.fullCombo
                default: return ClearType.notPlayed
            }
        }
        if (infos[`rb${version}`].chartsInfo[key].version == thisInfo.chartsInfo[key].version) {
            let records = map[thisInfo.id]
            if (records == null) {
                records = []
                map[thisInfo.id] = records
            }
            let record: IRbBestMusicRecord = records[r.chartType] || rbr(thisInfo.order, r.chartType)
            updateScore(record, {
                clearType: ctTranslate(r.clearType),
                gaugeType: GaugeType.normal,
                score: r.score,
                combo: r.combo,
                missCount: r.missCount,
                achievementRateTimes100: r.achievementRateTimes10 * 10,
                playCount: r.playCount,
                winCount: r.winCount,
                loseCount: r.loseCount,
                drawCount: r.drawCount,
                comboVersion: version,
                scoreVersion: version,
                missCountVersion: version,
                clearTypeVersion: version,
                achievementRateVersion: version
            })
            records[r.chartType] = record
        }
    }
    version = 2
    if (forVersion != version) for (let r of await DB.Find<IRb2MusicRecord>(rid, { collection: "rb.rb2.playData.musicRecord" })) {
        let infos = getAvaliableMusicChartInfoFromMusicId(r.musicId, version)
        let thisInfo: RbMusicChartInfoElement = infos[`rb${forVersion}`]
        if ((thisInfo == null) || (thisInfo.chartsInfo[keys[r.chartType]] == null) || (infos[`rb${version}`] == null) || (infos[`rb${version}`].chartsInfo[keys[r.chartType]] == null) || (thisInfo.status != "avaliable")) continue
        let key = keys[r.chartType]
        let ctTranslate = (clearType: number) => {
            switch (clearType) {
                case 2: return ClearType.failed
                case 3: return ClearType.cleared
                case 4: return ClearType.fullCombo
                default: return ClearType.notPlayed
            }
        }
        if (infos[`rb${version}`].chartsInfo[key].version == thisInfo.chartsInfo[key].version) {
            let records = map[thisInfo.id]
            if (records == null) {
                records = []
                map[thisInfo.id] = records
            }
            let record: IRbBestMusicRecord = records[r.chartType] || rbr(thisInfo.order, r.chartType)
            updateScore(record, {
                clearType: ctTranslate(r.newRecord.clearType),
                gaugeType: GaugeType.normal,
                score: r.newRecord.score,
                combo: r.newRecord.combo,
                missCount: r.newRecord.missCount,
                achievementRateTimes100: r.newRecord.achievementRateTimes10 * 10,
                playCount: r.newRecord.playCount,
                winCount: r.newRecord.winCount,
                loseCount: r.newRecord.loseCount,
                drawCount: r.newRecord.drawCount,
                comboVersion: version,
                scoreVersion: version,
                missCountVersion: version,
                clearTypeVersion: version,
                achievementRateVersion: version
            })
            records[r.chartType] = record
        }
    }
    version = 3
    if (forVersion != version) for (let r of await DB.Find<IRb3MusicRecord>(rid, { collection: "rb.rb3.playData.musicRecord" })) {
        let infos = getAvaliableMusicChartInfoFromMusicId(r.musicId, version)
        let thisInfo: RbMusicChartInfoElement = infos[`rb${forVersion}`]
        if ((thisInfo == null) || (thisInfo.chartsInfo[keys[r.chartType]] == null) || (infos[`rb${version}`] == null) || (infos[`rb${version}`].chartsInfo[keys[r.chartType]] == null) || (thisInfo.status != "avaliable")) continue
        let key = keys[r.chartType]
        let ctTranslate = (clearType: number, missCount: number) => {
            if (missCount == 0) return ClearType.fullCombo
            switch (clearType) {
                case 1: return ClearType.failed
                case 2: return ClearType.failed
                case 3: return ClearType.cleared
                default: return ClearType.notPlayed
            }
        }
        if (infos[`rb${version}`].chartsInfo[key].version == thisInfo.chartsInfo[key].version) {
            let records = map[thisInfo.id]
            if (records == null) {
                records = []
                map[thisInfo.id] = records
            }
            let record: IRbBestMusicRecord = records[r.chartType] || rbr(thisInfo.order, r.chartType)
            updateScore(record, {
                clearType: ctTranslate(r.clearType, r.missCount),
                gaugeType: GaugeType.normal,
                score: r.score,
                combo: r.combo,
                missCount: r.missCount,
                achievementRateTimes100: r.achievementRateTimes100,
                playCount: r.playCount,
                comboVersion: version,
                scoreVersion: version,
                missCountVersion: version,
                clearTypeVersion: version,
                achievementRateVersion: version,
                comboUpdateTime: r.bestComboUpdateTime,
                scoreUpdateTime: r.bestScoreUpdateTime,
                achievementRateUpdateTime: r.bestAchievementRateUpdateTime,
                missCountUpdateTime: r.bestMissCountUpdateTime
            })
            records[r.chartType] = record
        }
    }
    version = 4
    if (forVersion != version) for (let r of await DB.Find<IRb4MusicRecord>(rid, { collection: "rb.rb4.playData.musicRecord" })) {
        let infos = getAvaliableMusicChartInfoFromMusicId(r.musicId, version)
        let thisInfo: RbMusicChartInfoElement = infos[`rb${forVersion}`]
        if ((thisInfo == null) || (thisInfo.chartsInfo[keys[r.chartType]] == null) || (infos[`rb${version}`] == null) || (infos[`rb${version}`].chartsInfo[keys[r.chartType]] == null) || (thisInfo.status != "avaliable")) continue
        let key = keys[r.chartType]
        let ctTranslate = (clearType: number, missCount: number) => {
            if (missCount == 0) return ClearType.fullCombo
            switch (clearType) {
                case 1: return ClearType.failed
                case 2: return ClearType.failed
                case 3: return ClearType.failed
                case 9: return ClearType.cleared
                case 10: return ClearType.hardCleared
                case 11: return ClearType.sHardCleared
                default: return ClearType.notPlayed
            }
        }
        let ggTranslate = (clearType: number) => {
            switch (clearType) {
                case 2: return GaugeType.hard
                case 3: return GaugeType.sHard
                case 10: return GaugeType.hard
                case 11: return GaugeType.sHard
                default: return GaugeType.normal
            }
        }
        if (infos[`rb${version}`].chartsInfo[key].version == thisInfo.chartsInfo[key].version) {
            let records = map[thisInfo.id]
            if (records == null) {
                records = []
                map[thisInfo.id] = records
            }
            let record: IRbBestMusicRecord = records[r.chartType] || rbr(thisInfo.order, r.chartType)
            updateScore(record, {
                clearType: ctTranslate(r.clearType, r.missCount),
                gaugeType: ggTranslate(r.clearType),
                score: r.score,
                combo: r.combo,
                missCount: r.missCount,
                achievementRateTimes100: r.achievementRateTimes100,
                playCount: r.playCount,
                comboVersion: version,
                scoreVersion: version,
                missCountVersion: version,
                clearTypeVersion: version,
                achievementRateVersion: version,
                comboUpdateTime: r.bestComboUpdateTime,
                scoreUpdateTime: r.bestScoreUpdateTime,
                achievementRateUpdateTime: r.bestAchievementRateUpdateTime,
                missCountUpdateTime: r.bestMissCountUpdateTime
            })
            records[r.chartType] = record
        }
    }
    version = 5
    if (forVersion != version) for (let r of await DB.Find<IRb5MusicRecord>(rid, { collection: "rb.rb5.playData.musicRecord" })) {
        let infos = getAvaliableMusicChartInfoFromMusicId(r.musicId, version)
        let thisInfo: RbMusicChartInfoElement = infos[`rb${forVersion}`]
        if ((thisInfo == null) || (thisInfo.chartsInfo[keys[r.chartType]] == null) || (infos[`rb${version}`] == null) || (infos[`rb${version}`].chartsInfo[keys[r.chartType]] == null) || (thisInfo.status != "avaliable")) continue
        let key = keys[r.chartType]
        let ctTranslate = (clearType: number, missCount: number) => {
            if (missCount == 0) return ClearType.fullCombo
            switch (clearType) {
                case 1: return ClearType.failed
                case 2: return ClearType.failed
                case 3: return ClearType.failed
                case 9: return ClearType.cleared
                case 10: return ClearType.hardCleared
                case 11: return ClearType.sHardCleared
                default: return ClearType.notPlayed
            }
        }
        let ggTranslate = (clearType: number) => {
            switch (clearType) {
                case 2: return GaugeType.hard
                case 3: return GaugeType.sHard
                case 10: return GaugeType.hard
                case 11: return GaugeType.sHard
                default: return GaugeType.normal
            }
        }
        if (infos[`rb${version}`].chartsInfo[key].version == thisInfo.chartsInfo[key].version) {
            let records = map[thisInfo.id]
            if (records == null) {
                records = []
                map[thisInfo.id] = records
            }
            let record: IRbBestMusicRecord = records[r.chartType] || rbr(thisInfo.order, r.chartType)
            updateScore(record, {
                clearType: ctTranslate(r.clearType, r.missCount),
                gaugeType: ggTranslate(r.clearType),
                score: r.score,
                combo: r.combo,
                missCount: r.missCount,
                achievementRateTimes100: r.achievementRateTimes100,
                playCount: r.playCount,
                comboVersion: version,
                scoreVersion: version,
                missCountVersion: version,
                clearTypeVersion: version,
                achievementRateVersion: version,
                comboUpdateTime: r.bestComboUpdateTime,
                scoreUpdateTime: r.bestScoreUpdateTime,
                achievementRateUpdateTime: r.bestAchievementRateUpdateTime,
                missCountUpdateTime: r.bestMissCountUpdateTime
            })
            records[r.chartType] = record
        }
    }
    for (let k in map) result.push(...map[k].filter((v) => v))
    return result
}

export type MusicRecordMetadatas = string[] // `${number}:${number}:${number}`[]

export async function findMusicRecordMetadatas(rid: string): Promise<MusicRecordMetadatas> {
    let result = <MusicRecordMetadatas>[]
    for (let r of await DB.Find<IRb1MusicRecord>(rid, { collection: "rb.rb1.playData.musicRecord" })) {
        let musicIdStr = getMusicIdStr(r.musicId, 1)
        if (!result.includes(musicIdStr + ":" + r.chartType)) result.push(musicIdStr + ":" + r.chartType)
    }
    for (let r of await DB.Find<IRb2MusicRecord>(rid, { collection: "rb.rb2.playData.musicRecord" })) {
        let musicIdStr = getMusicIdStr(r.musicId, 2)
        if (!result.includes(musicIdStr + ":" + r.chartType)) result.push(musicIdStr + ":" + r.chartType)
    }
    for (let r of await DB.Find<IRb3MusicRecord>(rid, { collection: "rb.rb3.playData.musicRecord" })) {
        let musicIdStr = getMusicIdStr(r.musicId, 3)
        if (!result.includes(musicIdStr + ":" + r.chartType)) result.push(musicIdStr + ":" + r.chartType)
    }
    for (let r of await DB.Find<IRb4MusicRecord>(rid, { collection: "rb.rb4.playData.musicRecord" })) {
        let musicIdStr = getMusicIdStr(r.musicId, 4)
        if (!result.includes(musicIdStr + ":" + r.chartType)) result.push(musicIdStr + ":" + r.chartType)
    }
    for (let r of await DB.Find<IRb5MusicRecord>(rid, { collection: "rb.rb5.playData.musicRecord" })) {
        let musicIdStr = getMusicIdStr(r.musicId, 5)
        if (!result.includes(musicIdStr + ":" + r.chartType)) result.push(musicIdStr + ":" + r.chartType)
    }
    return result
}