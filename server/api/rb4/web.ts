import { C } from "../../utils/controller"
import { DBH } from "../../utils/db/dbh"
import { findChartInfoResponse, findCharts } from "../../data/tables/rb_chart_info"
import { findMusicInfo } from "../../data/tables/rb_music_info"
import { Rb4PlayerAccount, Rb4PlayerBase, Rb4PlayerConfig, Rb4PlayerCustom, Rb4PlayerReleasedInfo, Rb4PlayerStageLog } from "../../models/rb4/profile"
import { RbPlayerResponse, RbRequest, RbMusicRecordResponse, RbStageLogResponse, Rb4ChartType, RbColor, RbClasscheckResponse, Rb4DojoIndex, RbPlayerPerformanceResponse, Rb4SettingsResponse, RbAvailableItemResponse, RbWriteSettingsResponse } from "../../models/shared/web"
import { toLiteralClearType } from "../../utils/rb_functions"
import { Rb4MusicRecord } from "../../models/rb4/music_record"
import { Rb4Classcheck } from "../../models/rb4/classcheck"
import { rb4Examination } from "../../data/tables/rb4_examination"
import { getRbByword } from "../../data/tables/rb_bywords"
import { hasLeapDay } from "../../utils/utility_functions"
import { Rb4Mylist } from "../../models/rb4/mylist"
import { RbLobbySettings } from "../../models/shared/lobby"
import { contextQueryElement, RbSettingsFactory, readSettingsUsingFactory, writeSettingsUsingFactory } from "../shared_web/settings"
import { readAvailableItemsShared } from "../shared_web/available_items"

type V = 4
const version = 4 as const

export function registerRb4Controllers() {
    C.route("rb4ReadPlayer", readPlayer)
    C.route("rb4ReadPlayerPerformance", readPlayerPerformance)
    C.route("rb4ReadRecords", readRecords)
    C.route("rb4ReadClasschecks", readClasschecks)
    C.route("rb4ReadStageLogs", readStageLogs)
    C.route("rb4ReadAvailableItems", readAvailableItems)
    C.route("rb4ReadSettings", readSettings)
    C.route("rb4WriteSettings", writeSettings)
}

const readPlayer: C.C<RbRequest, RbPlayerResponse> = async data => {
    const result = {} as RbPlayerResponse
    const account = await DBH.findOne<Rb4PlayerAccount>(data.rid, { collection: "rb.rb4.player.account" })
    const base = await DBH.findOne<Rb4PlayerBase>(data.rid, { collection: "rb.rb4.player.base" })
    if (!account || !base) return undefined
    const config = await DBH.findOne<Rb4PlayerConfig>(data.rid, { collection: "rb.rb4.player.config" })
    result.version = version
    result.userId = account.userId
    result.name = base.name
    result.comment = base.comment
    result.iconOrCharacter = config.iconId
    result.class = base.class
    result.classAchievementRate = base.classAchievementRateTimes100 / 100
    result.abilityPoint = base.abilityPointTimes100 / 100
    result.matchingGrade = base.matchingGrade
    result.playCount = account.playCount
    result.level = base.level
    result.extraValues = [base.money /* Refle **/]
    result.bywords = {
        left: await getRbByword(version, RbColor.red, config.bywordLeft),
        right: await getRbByword(version, RbColor.blue, config.bywordRight)
    }
    return result
}
const readPlayerPerformance: C.C<RbRequest, RbPlayerPerformanceResponse<V>> = async data => {
    const activity = await statActivity(data.rid)
    const recentHighlightPlay = await Promise.all((await DBH.find<Rb4PlayerStageLog>(data.rid, { collection: "rb.rb4.playData.stageLog", time: { $exists: true, $gte: Date.now() / 1000 - 14 * 86400 } }))
        .sort((l, r) => r.achievementRateTimes100 - l.achievementRateTimes100 || r.time - l.time)
        .slice(0, 5)
        .map(toStageLogResponse))
    let totalScore = 0
    const totalScoreSeparated = [0, 0, 0, 0]
    const records = await DBH.find<Rb4MusicRecord>(data.rid, { collection: "rb.rb4.playData.musicRecord" })
    for (const r of records) {
        totalScore += r.score
        totalScoreSeparated[r.chartType] += r.score
    }
    return { activity, recentHighlightPlay, totalScore, totalScoreSeparated }
}
const readRecords: C.C<RbRequest, RbMusicRecordResponse<V>[]> = async data => {
    const result: { [K in number]: RbMusicRecordResponse<V> } = {}
    const records = await DBH.find<Rb4MusicRecord>(data.rid, { collection: "rb.rb4.playData.musicRecord" })
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
            clearType: toLiteralClearType(version, record.clearType, record.missCount, record.achievementRateTimes100),
            achievementRate: record.achievementRateTimes100 / 100,
            combo: record.combo,
            miss: record.missCount,
            playCount: record.playCount,
            battleStat: undefined,
            justCollectRate: undefined,
            lastPlay: new Date(record.time * 1000),
            update: new Date(Math.max(record.bestComboUpdateTime, record.bestScoreUpdateTime, record.bestMissCountUpdateTime, record.bestAchievementRateUpdateTime) * 1000)
        }
    }
    return Object.keys(result).map(k => result[k])
}
const readClasschecks: C.C<RbRequest, RbClasscheckResponse<V>[]> = async data => {
    const result: RbClasscheckResponse<V>[] = []
    const classchecks = await DBH.find<Rb4Classcheck>(data.rid, { collection: "rb.rb4.playData.classcheck" })
    classchecks.sort((l, r) => r.class - l.class)
    for (const c of classchecks) {
        const examination = c.class >= Rb4DojoIndex.examination ? (await rb4Examination).find(e => e.id === c.class) : undefined
        const r: RbClasscheckResponse<V> = {
            version,
            class: c.class,
            clearType: c.clearType,
            totalScore: c.totalScore,
            averageAchievementRate: c.averageAchievementRateTimes100 / 100,
            playCount: c.playCount,
            lastPlay: new Date(c.lastPlayTime * 1000),
            update: new Date(c.recordUpdateTime * 1000),
            examination: c.class >= Rb4DojoIndex.examination ? examination : undefined
        }
        result.push(r)
    }
    return result
}
const readStageLogs: C.C<RbRequest, RbStageLogResponse<V, Rb4ChartType>[]> = async data => await Promise.all((await DBH.find<Rb4PlayerStageLog>(data.rid, { collection: "rb.rb4.playData.stageLog" }))
    .sort((l, r) => r.time - l.time || r.stageIndex - l.stageIndex)
    .map(toStageLogResponse))

const readAvailableItems: C.C<RbRequest, RbAvailableItemResponse[]> = async data => {
    const released = await DBH.find<Rb4PlayerReleasedInfo>(data.rid, { collection: "rb.rb4.player.releasedInfo" })
    return await readAvailableItemsShared(version, released, [{ type: 7, id: [0, 1] }]) // byword
}

type Rb4SettingsContext = {
    account: Rb4PlayerAccount
    base: Rb4PlayerBase
    custom: Rb4PlayerCustom
    config: Rb4PlayerConfig
    lobbySettings: RbLobbySettings<V>
    mylist: Rb4Mylist
}
const rb4SettingsFactory: RbSettingsFactory<Rb4SettingsResponse, Rb4SettingsContext> = {
    contextQuery: {
        account: { collection: "rb.rb4.player.account" },
        base: { collection: "rb.rb4.player.base" },
        custom: { collection: "rb.rb4.player.custom" },
        config: { collection: "rb.rb4.player.config" },
        lobbySettings: contextQueryElement(ctx => ({ collection: "rb.rb4.player.lobbySettings#userId", userId: ctx.account.userId }), "non-rid", ctx => new RbLobbySettings(version, ctx.account.userId)),
        mylist: contextQueryElement({ collection: "rb.rb4.player.mylist" }, "rid", () => new Rb4Mylist())
    },
    factory: {
        name: "base.name",
        comment: {
            read: ctx => ctx.base.comment ?? "",
            write: (v, ctx) => ctx.base.comment = !v ? "" : v
        },
        bywordLeft: "config.bywordLeft",
        bywordRight: "config.bywordRight",
        isAutoBywordLeft: "config.isAutoBywordLeft",
        isAutoBywordRight: "config.isAutoBywordRight",
        mainGaugeType: "custom.stageMainGaugeType",
        clearGaugeType: "custom.stageClearGaugeType",
        achievementRateDisplayingType: "custom.stageAchievementRateDisplayingType",
        objectSize: "custom.stageObjectSize",
        sameTimeObjectsDisplayingType: "custom.stageSameTimeObjectsDisplayingType",
        shotSound: "custom.stageShotSound",
        shotVolume: "custom.stageShotVolume",
        explodeEffect: "custom.stageExplodeType",
        frame: "custom.stageFrameType",
        background: "custom.stageBackground",
        backgroundBrightness: "custom.stageBackgroundBrightness",
        backgroundMusic: "config.musicSelectBgm",
        touchMarkerDisplayingType: "custom.stageTouchMarkerDisplayingType",
        isLobbyEnabled: "lobbySettings.isEnabled",
        mylist: "mylist.mylist"
    }
}

const readSettings: C.C<RbRequest, Rb4SettingsResponse> = data => readSettingsUsingFactory(data.rid, rb4SettingsFactory)
const writeSettings: C.C<RbRequest & Rb4SettingsResponse, RbWriteSettingsResponse> = data => writeSettingsUsingFactory(data.rid, data, rb4SettingsFactory)

async function toStageLogResponse(l: Rb4PlayerStageLog): Promise<RbStageLogResponse<V, Rb4ChartType>> {
    return {
        version,
        stageIndex: l.stageIndex,
        musicId: l.musicId,
        chartType: l.chartType,
        music: await findMusicInfo(l.musicId, version),
        chart: await findChartInfoResponse(l.musicId, version, l.chartType),
        color: l.color,
        matchingGrade: l.matchingGrade,
        score: l.score,
        achievementRate: l.achievementRateTimes100 / 100,
        clearType: toLiteralClearType(version, l.clearType, l.missCount, l.achievementRateTimes100),
        combo: undefined,
        justCount: l.justCount,
        justReflecCount: l.justReflecCount,
        greatCount: l.greatCount,
        goodCount: l.goodCount,
        missCount: l.missCount,
        keepCount: undefined,

        rivalStageIndex: l.stageIndex,
        rivalCpuId: l.rivalCpuId,
        rivalUserId: l.rivalUserId,
        rivalPlayerId: l.rivalPlayerId,
        rivalUserName: l.rivalUserId.toString(),
        rivalMatchingGrade: l.rivalMatchingGrade,
        rivalClearType: toLiteralClearType(version, l.rivalClearType, "RIVAL", l.rivalAchievementRateTimes100),
        rivalScore: l.rivalScore,
        rivalAchievementRate: l.rivalAchievementRateTimes100 / 100,

        time: new Date(l.time * 1000)
    }
}
async function statActivity(rid: string): Promise<Record<number, number>> {
    const result: Record<number, number> = {}
    const now = new Date()
    const queryStartDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (hasLeapDay() ? 365 : 364))
    const logs = await DBH.find<Rb4PlayerStageLog>(rid, { collection: "rb.rb4.playData.stageLog", stageIndex: 0, time: { $exists: true, $gte: queryStartDate.valueOf() / 1000 } })
    const offset = 86400 - (now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds() + now.getMilliseconds() / 1000)
    for (const l of logs) {
        const d = Math.floor((now.valueOf() / 1000 + offset - l.time) / 86400)
        if (result[d] === undefined) result[d] = 1
        else result[d]++
    }
    return result
}
