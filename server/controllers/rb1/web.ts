import { C } from "../../utils/controller"
import { DBH } from "../../utils/db/dbh"
import { findChartInfoResponse, findCharts } from "../../data/tables/rb_chart_info"
import { findMusicInfo } from "../../data/tables/rb_music_info"
import { Rb1MusicRecord, Rb1PlayerBase, Rb1PlayerCustom, Rb1PlayerReleasedInfo, Rb1StageLog } from "../../models/rb1/profile"
import { RbPlayerResponse, RbRequest, RbMusicRecordResponse, RbStageLogResponse, Rb1ChartType, RbColor, Rb1SettingsResponse, RbPlayerPerformanceResponse, RbItemResponse, RbAvailableItemResponse } from "../../models/shared/web"
import { toLiteralClearType } from "../../utils/rb_functions"
import { hasLeapDay } from "../../utils/utility_functions"
import { RbLobbySettings } from "../../models/shared/lobby"
import { rbItems } from "../../data/tables/rb_items"

type V = 1
const version = 1 as const

export function registerRb1Controllers() {
    C.route("rb1ReadPlayer", readPlayer)
    C.route("rb1ReadPlayerPerformance", readPlayerPerformance)
    C.route("rb1ReadRecords", readRecords)
    C.route("rb1ReadStageLogs", readStageLogs)
    C.route("rb1ReadSettings", readSettings)
    C.route("rb1ReadAvailableItems", readAvailableItems)
}

const readPlayer: C.C<RbRequest, RbPlayerResponse> = async data => {
    const result = {} as RbPlayerResponse
    const base = await DBH.findOne<Rb1PlayerBase>(data.rid, { collection: "rb.rb1.player.base" })
    if (!base) return undefined
    result.version = version
    result.userId = base.userId
    result.name = base.name
    result.comment = base.comment
    result.iconOrCharacter = undefined
    result.abilityPoint = base.abilityPointTimes10 / 10
    result.matchingGrade = base.matchingGrade
    result.playCount = base.playCount
    result.level = base.level
    return result
}
const readPlayerPerformance: C.C<RbRequest, RbPlayerPerformanceResponse<V>> = async data => {
    const activity = await statActivity(data.rid)
    const recentHighlightPlay = await Promise.all((await DBH.find<Rb1StageLog>(data.rid, { collection: "rb.rb1.playData.stageLog", time: { $exists: true, $gte: Date.now() / 1000 - 14 * 86400 } }))
        .sort((l, r) => r.log.achievementRateTimes10 - l.log.achievementRateTimes10 || r.time - l.time)
        .slice(0, 5)
        .map(toStageLogResponse))
    let totalScore = 0
    const totalScoreSeparated = [0, 0, 0]
    const records = await DBH.find<Rb1MusicRecord>(data.rid, { collection: "rb.rb1.playData.musicRecord" })
    for (const r of records) {
        totalScore += r.score
        totalScoreSeparated[r.chartType] += r.score
    }
    return { activity, recentHighlightPlay, totalScore, totalScoreSeparated }
}
const readRecords: C.C<RbRequest, RbMusicRecordResponse<V>[]> = async data => {
    const result: { [K in number]: RbMusicRecordResponse<V> } = {}
    const records = await DBH.find<Rb1MusicRecord>(data.rid, { collection: "rb.rb1.playData.musicRecord" })
    for (const record of records) {
        const el: RbMusicRecordResponse<V> = result[record.musicId] ?? {
            version,
            musicId: record.musicId,
            music: await findMusicInfo(record.musicId, version),
            charts: await findCharts(record.musicId, version),
            scores: {}
        }
        if (!el.music) continue
        result[record.musicId] = el
        el.scores[record.chartType] = {
            score: record.score,
            clearType: toLiteralClearType(version, record.clearType, record.missCount, undefined),
            achievementRate: record.achievementRateTimes10 / 10,
            combo: record.combo,
            miss: record.missCount,
            playCount: record.playCount,
            battleStat: {
                win: record.winCount,
                lose: record.loseCount,
                draw: record.drawCount
            },
            justCollectRate: undefined
        }
    }
    return Object.keys(result).map(k => result[k])
}
const readStageLogs: C.C<RbRequest, RbStageLogResponse<V, Rb1ChartType>[]> = async data => await Promise.all((await DBH.find<Rb1StageLog>(data.rid, { collection: "rb.rb1.playData.stageLog" }))
    .sort((l, r) => r.time - l.time || r.stageIndex - l.stageIndex)
    .map(toStageLogResponse))

const readSettings: C.C<RbRequest, Rb1SettingsResponse> = async data => {
    const base = await DBH.findOne<Rb1PlayerBase>(data.rid, { collection: "rb.rb1.player.base" })
    const custom = await DBH.findOne<Rb1PlayerCustom>(data.rid, { collection: "rb.rb1.player.custom" })
    const lobbySettings = await DBH.findOne<RbLobbySettings<1>>(undefined, { collection: "rb.rb1.player.lobbySettings#userId", userId: base.userId }) ?? new RbLobbySettings(version, base.userId)
    return {
        name: base.name,
        comment: base.comment ?? "",
        shotSound: custom.stageShotSound,
        shotVolume: custom.stageShotVolume,
        explodeEffect: custom.stageExplodeType,
        frame: custom.stageFrameType,
        background: custom.stageBackground,
        backgroundBrightness: custom.stageBackgroundBrightness,
        backgroundMusic: custom.stageBackgroundMusic,
        isLobbyEnabled: lobbySettings.isEnabled
    } as Rb1SettingsResponse
}
const readAvailableItems: C.C<RbRequest, RbAvailableItemResponse[]> = async data => {
    const released = await DBH.find<Rb1PlayerReleasedInfo>(data.rid, { collection: "rb.rb1.player.releasedInfo" })
    return (await rbItems).filter(i => i.version === version && (i.isUnlockedByDefault || released.some(r => r.type === i.typeId && r.id === i.value))).map(i => ({ typeId: i.typeId, value: i.value }))
}

async function toStageLogResponse(l: Rb1StageLog): Promise<RbStageLogResponse<V, Rb1ChartType>> {
    return {
        version,
        stageIndex: l.stageIndex,
        musicId: l.musicId,
        chartType: l.chartType,
        music: await findMusicInfo(l.musicId, version),
        chart: await findChartInfoResponse(l.musicId, version, l.chartType),
        color: l.standalone?.color ?? RbColor.red,
        matchingGrade: l.log.matchingGrade,
        score: l.log.score,
        achievementRate: l.log.achievementRateTimes10 / 10,
        clearType: toLiteralClearType(version, l.log.clearType, l.standalone?.missCount ?? -version, undefined),
        combo: l.standalone?.combo ?? 0,
        justCount: l.standalone?.justCount ?? 0,
        justReflecCount: l.standalone?.justReflecCount ?? 0,
        greatCount: l.standalone?.greatCount ?? 0,
        goodCount: l.standalone?.goodCount ?? 0,
        missCount: l.standalone?.missCount ?? -1,
        keepCount: undefined,

        rivalStageIndex: l.stageIndex,
        rivalCpuId: l.rivalUserId === 0 ? 0 : undefined,
        rivalUserId: l.rivalUserId,
        rivalPlayerId: 0,
        rivalUserName: l.rivalUserId.toString(),
        rivalMatchingGrade: l.rivalLog.matchingGrade,
        rivalClearType: toLiteralClearType(version, l.rivalLog.clearType, "RIVAL", undefined),
        rivalScore: l.rivalLog.score,
        rivalAchievementRate: l.rivalLog.achievementRateTimes10 / 10,

        time: new Date(l.time * 1000)
    }
}
async function statActivity(rid: string): Promise<Record<number, number>> {
    const result: Record<number, number> = {}
    const now = new Date()
    const queryStartDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (hasLeapDay() ? 365 : 364))
    const logs = await DBH.find<Rb1StageLog>(rid, { collection: "rb.rb1.playData.stageLog", stageIndex: 0, time: { $exists: true, $gte: queryStartDate.valueOf() / 1000 } })
    const offset = 86400 - (now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds() + now.getMilliseconds() / 1000)
    for (const l of logs) {
        const d = Math.floor((now.valueOf() / 1000 + offset - l.time) / 86400)
        if (result[d] === undefined) result[d] = 1
        else result[d]++
    }
    return result
}
