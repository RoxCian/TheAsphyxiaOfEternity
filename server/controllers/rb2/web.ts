import { C } from "../../utils/controller"
import { DBH } from "../../utils/db/dbh"
import { findChartInfoResponse, findCharts } from "../../data/tables/rb_chart_info"
import { findMusicInfo } from "../../data/tables/rb_music_info"
import { Rb2MusicRecord, Rb2Mylist, Rb2MylistElement, Rb2PlayerBase, Rb2PlayerCustom, Rb2PlayerReleasedInfo, Rb2StageLog } from "../../models/rb2/profile"
import { RbPlayerResponse, RbRequest, RbMusicRecordResponse, RbStageLogResponse, RbColor, Rb1ChartType, RbPlayerPerformanceResponse, RbAvailableItemResponse, Rb2SettingsResponse, RbWriteSettingsResponse } from "../../models/shared/web"
import { toLiteralClearType } from "../../utils/rb_functions"
import { getRbByword } from "../../data/tables/rb_bywords"
import { hasLeapDay } from "../../utils/utility_functions"
import { RbLobbySettings } from "../../models/shared/lobby"
import { RbSettingsFactory, contextQueryElement, readSettingsUsingFactory, writeSettingsUsingFactory } from "../shared/settings"
import { readAvailableItemsShared } from "../shared/available_items"

type V = 2
const version = 2 as const

export function registerRb2Controllers() {
    C.route("rb2ReadPlayer", readPlayer)
    C.route("rb2ReadPlayerPerformance", readPlayerPerformance)
    C.route("rb2ReadRecords", readRecords)
    C.route("rb2ReadStageLogs", readStageLogs)
    C.route("rb2ReadAvailableItems", readAvailableItems)
    C.route("rb2ReadSettings", readSettings)
    C.route("rb2WriteSettings", writeSettings)
}

const readPlayer: C.C<RbRequest, RbPlayerResponse> = async data => {
    const result = {} as RbPlayerResponse
    const base = await DBH.findOne<Rb2PlayerBase>(data.rid, { collection: "rb.rb2.player.base" })
    if (!base) return undefined
    const custom = await DBH.findOne<Rb2PlayerCustom>(data.rid, { collection: "rb.rb2.player.custom" })
    result.version = version
    result.userId = base.userId
    result.name = base.name
    result.comment = base.comment
    result.iconOrCharacter = base.iconId
    result.abilityPoint = base.abilityPointTimes100 / 100
    result.matchingGrade = base.matchingGrade
    result.playCount = base.playCount
    result.level = base.level
    result.extraValues = [base.experience / 12 /** Limes */]
    result.bywords = {
        left: await getRbByword(version, RbColor.red, custom.byword[0]),
        right: await getRbByword(version, RbColor.blue, custom.byword[1])
    }
    return result
}
const readPlayerPerformance: C.C<RbRequest, RbPlayerPerformanceResponse<V>> = async data => {
    const activity = await statActivity(data.rid)
    const recentHighlightPlay = await Promise.all((await DBH.find<Rb2StageLog>(data.rid, { collection: "rb.rb2.playData.stageLog", time: { $exists: true, $gte: Date.now() / 1000 - 14 * 86400 } }))
        .sort((l, r) => r.log.achievementRateTimes10 - l.log.achievementRateTimes10 || r.time - l.time)
        .slice(0, 5)
        .map(toStageLogResponse))
    let totalScore = 0
    const totalScoreSeparated = [0, 0, 0]
    const records = await DBH.find<Rb2MusicRecord>(data.rid, { collection: "rb.rb2.playData.musicRecord" })
    for (const r of records) {
        totalScore += r.newRecord.score
        totalScoreSeparated[r.chartType] += r.newRecord.score
    }
    return { activity, recentHighlightPlay, totalScore, totalScoreSeparated }
}
const readRecords: C.C<RbRequest, RbMusicRecordResponse<V>[]> = async data => {
    const result: { [K in number]: RbMusicRecordResponse<V> } = {}
    const records = await DBH.find<Rb2MusicRecord>(data.rid, { collection: "rb.rb2.playData.musicRecord" })
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
            score: record.newRecord.score,
            clearType: toLiteralClearType(version, record.newRecord.clearType, record.newRecord.missCount, undefined),
            achievementRate: record.newRecord.achievementRateTimes10 / 10,
            combo: record.newRecord.combo,
            miss: record.newRecord.missCount,
            playCount: record.newRecord.playCount,
            battleStat: {
                win: record.newRecord.winCount,
                lose: record.newRecord.loseCount,
                draw: record.newRecord.drawCount
            },
            justCollectRate: undefined
        }
    }
    return Object.keys(result).map(k => result[k])
}
const readStageLogs: C.C<RbRequest, RbStageLogResponse<V, Rb1ChartType>[]> = async data => await Promise.all((await DBH.find<Rb2StageLog>(data.rid, { collection: "rb.rb2.playData.stageLog" }))
    .sort((l, r) => r.time - l.time || r.stageIndex - l.stageIndex)
    .map(toStageLogResponse))

const readAvailableItems: C.C<RbRequest, RbAvailableItemResponse[]> = async data => {
    const released = await DBH.find<Rb2PlayerReleasedInfo>(data.rid, { collection: "rb.rb2.player.releasedInfo" })
    return await readAvailableItemsShared(version, released, [{ type: 7, id: [0] }, { type: 8, id: [0] }]) // bywordLeft, bywordRight
}

type Rb2SettingsContext = {
    base: Rb2PlayerBase
    custom: Rb2PlayerCustom
    lobbySettings: RbLobbySettings<V>
    mylist?: Rb2Mylist
}
const rb2SettingsFactory: RbSettingsFactory<Rb2SettingsResponse, Rb2SettingsContext> = {
    contextQuery: {
        base: { collection: "rb.rb2.player.base" },
        custom: { collection: "rb.rb2.player.custom" },
        lobbySettings: contextQueryElement(ctx => ({ collection: "rb.rb2.player.lobbySettings#userId", userId: ctx.base.userId }), "non-rid", ctx => new RbLobbySettings(version, ctx.base.userId)),
        mylist: contextQueryElement({ collection: "rb.rb2.player.mylist" }, "rid", () => new Rb2Mylist())
    },
    factory: {
        name: "base.name",
        comment: {
            read: ctx => ctx.base.comment ?? "",
            write: (v, ctx) => ctx.base.comment = !v ? "" : v
        },
        bywordLeft: {
            read: ctx => ctx.custom.byword?.[0] ?? 0,
            write: (v, ctx) => Array.isArray(ctx.custom.byword) ? ctx.custom.byword[0] = v : ctx.custom.byword = [v, 0]
        },
        bywordRight: {
            read: ctx => ctx.custom.byword?.[1] ?? 0,
            write: (v, ctx) => Array.isArray(ctx.custom.byword) ? ctx.custom.byword[1] = v : ctx.custom.byword = [0, v]
        },
        isAutoBywordLeft: {
            read: ctx => ctx.custom.isAutoByword[0] ?? true,
            write: (v, ctx) => Array.isArray(ctx.custom.isAutoByword) ? ctx.custom.isAutoByword[0] = v : ctx.custom.isAutoByword = [v, true]
        },
        isAutoBywordRight: {
            read: ctx => ctx.custom.isAutoByword[1] ?? true,
            write: (v, ctx) => ctx.custom.isAutoByword ? ctx.custom.isAutoByword[1] = v : ctx.custom.isAutoByword = [true, v]
        },
        mainGaugeType: "custom.gaugeStyle",
        shotSound: "custom.stageShotSound",
        shotVolume: "custom.stageShotVolume",
        explodeEffect: "custom.stageExplodeType",
        frame: "custom.stageFrameType",
        background: "custom.stageBackground",
        backgroundBrightness: "custom.stageBackgroundBrightness",
        backgroundMusic: "custom.stageBackgroundMusic",
        isLobbyEnabled: "lobbySettings.isEnabled",
        mylist: {
            read: ctx => {
                const result: [number, number, number, number, number] = [-1, -1, -1, -1, -1]
                for (const m of ctx.mylist?.slot ?? []) result[m.slotId] = m.musicId
                return result
            },
            write: (v, ctx) => {
                ctx.mylist.slot ??= []
                for (let i = 0; i < 5; i++) {
                    let slot = ctx.mylist.slot.find(s => s.slotId === i)
                    if (!slot) {
                        slot = new Rb2MylistElement()
                        slot.slotId = i
                        ctx.mylist.slot.push(slot)
                    }
                    slot.musicId = v[i]
                }
            }
        }
    }
}

const readSettings: C.C<RbRequest, Rb2SettingsResponse> = async data => readSettingsUsingFactory(data.rid, rb2SettingsFactory)
const writeSettings: C.C<RbRequest & Rb2SettingsResponse, RbWriteSettingsResponse> = data => writeSettingsUsingFactory(data.rid, data, rb2SettingsFactory)

async function toStageLogResponse(l: Rb2StageLog): Promise<RbStageLogResponse<V, Rb1ChartType>> {
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
    const logs = await DBH.find<Rb2StageLog>(rid, { collection: "rb.rb2.playData.stageLog", stageIndex: 0, time: { $exists: true, $gte: queryStartDate.valueOf() / 1000 } })
    const offset = 86400 - (now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds() + now.getMilliseconds() / 1000)
    for (const l of logs) {
        const d = Math.floor((now.valueOf() / 1000 + offset - l.time) / 86400)
        if (result[d] === undefined) result[d] = 1
        else result[d]++
    }
    return result
}
