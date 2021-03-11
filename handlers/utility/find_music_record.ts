import { getAvaliableMusicChartInfo, getMusicId, getMusicIdStr, RbMusicChartInfoElement } from "../../data/musicinfo/rb_music_info"
import { IRb1MusicRecord } from "../../models/rb1/profile"
import { IRb2MusicRecord } from "../../models/rb2/profile"
import { IRb3MusicRecord } from "../../models/rb3/music_record"
import { IRb5MusicRecord } from "../../models/rb5/music_record"
import { Rb6HandlersCommon } from "../rb6/common"

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
    for (let r of await DB.Find<IRb5MusicRecord>(rid, { collection: "rb.rb5.playData.musicRecord" })) {
        let musicIdStr = getMusicIdStr(r.musicId, 5)
        if (!result.includes(musicIdStr + ":" + r.chartType)) result.push(musicIdStr + ":" + r.chartType)
    }
    return result
}