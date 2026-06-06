import { C } from "../../utils/controller"
import { DBH } from "../../utils/db/dbh"
import { findChartInfoResponse, findCharts } from "../../data/tables/rb_chart_info"
import { findMusicInfo } from "../../data/tables/rb_music_info"
import { Rb3PlayerAccount, Rb3PlayerBase, Rb3PlayerConfig, Rb3PlayerCustom, Rb3PlayerReleasedInfo, Rb3PlayerStageLog } from "../../models/rb3/profile"
import { RbPlayerResponse, RbRequest, RbMusicRecordResponse, RbStageLogResponse, RbClasscheckResponse, Rb1ChartType, RbColor, RbPlayerPerformanceResponse, Rb3SettingsResponse, RbAvailableItemResponse, RbWriteSettingsResponse, Rb3VerdetDesKriegesContent, Rb3VerdetDesKriegesPageRequest, Rb3VerdetDesKriegesUnlockRequest, Rb3VerdetDesKriegesUnlockRequestType, Rb3VerdetDesKriegesNote } from "../../models/shared/web"
import { toLiteralClearType } from "../../utils/rb_functions"
import { Rb3MusicRecord } from "../../models/rb3/music_record"
import { getRbByword } from "../../data/tables/rb_bywords"
import { hasLeapDay } from "../../utils/utility_functions"
import { Rb3Mylist } from "../../models/rb3/mylist"
import { RbLobbySettings } from "../../models/shared/lobby"
import { contextQueryElement, RbSettingsFactory, readSettingsUsingFactory, writeSettingsUsingFactory } from "../shared_web/settings"
import { readAvailableItemsShared } from "../shared_web/available_items"
import { Rb3VerdetDesKrieges } from "../../models/rb3/event"
import { getVerdetDesKriegesPage, getVerdetDesKriegesPageCount, rb3VerdetDesKriegesNotes } from "../../data/tables/rb3_verdet_des_krieges"

type V = 3
const version = 3 as const

export function registerRb3Controllers() {
    C.route("rb3ReadPlayer", readPlayer)
    C.route("rb3ReadPlayerPerformance", readPlayerPerformance)
    C.route("rb3ReadRecords", readRecords)
    C.route("rb3ReadStageLogs", readStageLogs)
    C.route("rb3ReadVerdetDesKrieges", readVerdetDesKrieges)
    C.route("rb3ReadVerdetDesKriegesPageCount", readVerdetDesKriegesPageCount)
    C.route("rb3ReadVerdetDesKriegesPage", readVerdetDesKriegesPage)
    C.route("rb3ReadVerdetDesKriegesNotes", readVerdetDesKriegesNotes)
    C.route("rb3UnlockVerdetDesKrieges", unlockVerdetDesKrieges)
    C.route("rb3ReadAvailableItems", readAvailableItems)
    C.route("rb3ReadSettings", readSettings)
    C.route("rb3WriteSettings", writeSettings)
}

const readPlayer: C.C<RbRequest, RbPlayerResponse> = async data => {
    const result = {} as RbPlayerResponse
    const account = await DBH.findOne<Rb3PlayerAccount>(data.rid, { collection: "rb.rb3.player.account" })
    const base = await DBH.findOne<Rb3PlayerBase>(data.rid, { collection: "rb.rb3.player.base" })
    if (!account || !base) return undefined
    const config = await DBH.findOne<Rb3PlayerConfig>(data.rid, { collection: "rb.rb3.player.config" }) ?? new Rb3PlayerConfig()
    result.version = version
    result.userId = account.userId
    result.name = base.name
    result.comment = base.comment
    result.iconOrCharacter = config.iconId
    result.abilityPoint = base.abilityPointTimes100 / 100
    result.matchingGrade = base.matchingGrade
    result.playCount = account.playCount
    const eventUnlocked = await DBH.find<Rb3PlayerReleasedInfo>(data.rid, { collection: "rb.rb3.player.releasedInfo", type: 0, id: { $in: [217, 265, 336, 380, 416] } })
    let eventProgressFlag = 0
    for (const u of eventUnlocked) {
        switch (u.id) {
            case 217:
                eventProgressFlag += 1 // Valanga
                break
            case 265:
                eventProgressFlag += 2 // ストレイ・マーチ
                break
            case 336:
                eventProgressFlag += 4 // 海神
                break
            case 380:
                eventProgressFlag += 8 // fallen leaves
                break
            case 416:
                eventProgressFlag += 16 // CLAMARE
                break
        }
    }
    result.extraValues = [base.onigiriTimes10 / 10, eventProgressFlag]
    result.bywords = {
        left: await getRbByword(version, RbColor.red, config.bywordLeft),
        right: await getRbByword(version, RbColor.blue, config.bywordRight)
    }
    return result
}
const readPlayerPerformance: C.C<RbRequest, RbPlayerPerformanceResponse<V>> = async data => {
    const activity = await statActivity(data.rid)
    const recentHighlightPlay = await Promise.all((await DBH.find<Rb3PlayerStageLog>(data.rid, { collection: "rb.rb3.playData.stageLog", time: { $exists: true, $gte: Date.now() / 1000 - 14 * 86400 } }))
        .sort((l, r) => r.achievementRateTimes100 - l.achievementRateTimes100 || r.time - l.time)
        .slice(0, 5)
        .map(toStageLogResponse))
    let totalScore = 0
    const totalScoreSeparated = [0, 0, 0]
    const records = await DBH.find<Rb3MusicRecord>(data.rid, { collection: "rb.rb3.playData.musicRecord" })
    for (const r of records) {
        totalScore += r.score
        totalScoreSeparated[r.chartType] += r.score
    }
    return { activity, recentHighlightPlay, totalScore, totalScoreSeparated }
}
const readRecords: C.C<RbRequest, RbMusicRecordResponse<V>[]> = async data => {
    const result: { [K in number]: RbMusicRecordResponse<V> } = {}
    const records = await DBH.find<Rb3MusicRecord>(data.rid, { collection: "rb.rb3.playData.musicRecord" })
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
const readStageLogs: C.C<RbRequest, RbStageLogResponse<V, Rb1ChartType>[]> = async data => await Promise.all((await DBH.find<Rb3PlayerStageLog>(data.rid, { collection: "rb.rb3.playData.stageLog" }))
    .sort((l, r) => r.time - l.time || r.stageIndex - l.stageIndex)
    .map(toStageLogResponse))

const readVerdetDesKrieges: C.C<RbRequest, Rb3VerdetDesKrieges> = async data => await DBH.findOne<Rb3VerdetDesKrieges>(data.rid, { collection: "rb.rb3.event.verdetDesKrieges" })
const readVerdetDesKriegesPageCount: C.C<{ chapter: number }, { pageCount: number }> = async data => {
    return { pageCount: await getVerdetDesKriegesPageCount(data.chapter) }
}
const readVerdetDesKriegesPage: C.C<RbRequest & Rb3VerdetDesKriegesPageRequest, Rb3VerdetDesKriegesContent[]> = async data => {
    if (data.chapter === 0 && data.page === 0) return await getVerdetDesKriegesPage(0, 0)
    const event = await DBH.findOne<Rb3VerdetDesKrieges>(data.rid, { collection: "rb.rb3.event.verdetDesKrieges" })
    if (!event) return C.error(401, "Progress not reached")
    if (data.chapter > event.chapter) return C.error(401, "Progress not reached")
    if (data.page >= await getVerdetDesKriegesPageCount(data.chapter)) C.error(401, "Page number overflow")
    if (data.chapter === event.chapter) {
        if (data.page === 4 && event.page === 3) {
            if (!event.progress.slice(0, 4).every(p => p < 15)) return C.error(401, "Progress not reached")
            event.page = 4
        } else if (data.page > event.page + 1) return C.error(401, "Progress not reached")
        else if (data.page === event.page + 1) {
            event.page = data.page
        }
    }
    event.lastReadChapter = data.chapter
    event.lastReadPage = data.page
    await DBH.update(data.rid, { collection: "rb.rb3.event.verdetDesKrieges" }, event)
    return await getVerdetDesKriegesPage(data.chapter, data.page)
}
const readVerdetDesKriegesNotes: C.C<{}, Rb3VerdetDesKriegesNote[]> = () => rb3VerdetDesKriegesNotes
const unlockVerdetDesKrieges: C.C<RbRequest & Rb3VerdetDesKriegesUnlockRequest, { modified: boolean }> = async data => {
    const t = new DBH.T()
    const event = await t.findOne<Rb3VerdetDesKrieges>(data.rid, { collection: "rb.rb3.event.verdetDesKrieges" })
    const result = { modified: false }
    if (!event) {
        if (data.type === Rb3VerdetDesKriegesUnlockRequestType.start) {
            await DBH.insert(data.rid, new Rb3VerdetDesKrieges())
            result.modified = true
        }
        return result
    }
    switch (data.type) {
        case Rb3VerdetDesKriegesUnlockRequestType.hiddenLink1:
            if (event.chapter === 1 && event.progress[3] !== 15) {
                event.progress[3] = 15
                result.modified = true
            }
            break
        case Rb3VerdetDesKriegesUnlockRequestType.hiddenLink2:
            if (event.chapter === 2 && event.progress[0] !== 15) {
                event.progress[0] = 15
                result.modified = true
            }
            break
        case Rb3VerdetDesKriegesUnlockRequestType.chapterFinish1:
            if (event.chapter === 1 && event.progress.every(l => l === 15)) {
                event.chapter = 2
                event.progress.fill(0)
                await addMusicUnlockInfo(t, data.rid, 385) // 385: 双璧のVANESSA
                result.modified = true
            }
            break
        case Rb3VerdetDesKriegesUnlockRequestType.chapterFinish2:
            if (event.chapter === 2 && event.progress.every(l => l === 15)) {
                event.chapter = 3
                event.progress.fill(0)
                await addMusicUnlockInfo(t, data.rid, 386) // 386: Vanity shadow
                result.modified = true
            }
            break
        case Rb3VerdetDesKriegesUnlockRequestType.chapterFinish3:
            if (event.chapter === 3 && event.progress.every(l => l === 15)) {
                event.completed = true
                await addMusicUnlockInfo(t, data.rid, 387) // 387: 終焔のClaudia
                result.modified = true
            }
            break
    }
    if (result.modified) t.update(data.rid, { collection: "rb.rb3.event.verdetDesKrieges" }, event)
    await t.commit()
    return result
}

const readAvailableItems: C.C<RbRequest, RbAvailableItemResponse[]> = async data => {
    const released = await DBH.find<Rb3PlayerReleasedInfo>(data.rid, { collection: "rb.rb3.player.releasedInfo" })
    return await readAvailableItemsShared(version, released, [{ type: 7, id: [0] }, { type: 8, id: [0] }]) // bywordLeft, bywordRight
}

type Rb3SettingsContext = {
    account: Rb3PlayerAccount
    base: Rb3PlayerBase
    custom: Rb3PlayerCustom
    config: Rb3PlayerConfig
    lobbySettings: RbLobbySettings<V>
    mylist?: Rb3Mylist
}
const rb3SettingsFactory: RbSettingsFactory<Rb3SettingsResponse, Rb3SettingsContext> = {
    contextQuery: {
        account: { collection: "rb.rb3.player.account" },
        base: { collection: "rb.rb3.player.base" },
        custom: { collection: "rb.rb3.player.custom" },
        config: { collection: "rb.rb3.player.config" },
        lobbySettings: contextQueryElement(ctx => ({ collection: "rb.rb3.player.lobbySettings#userId", userId: ctx.account.userId }), "public", ctx => new RbLobbySettings(version, ctx.account.userId)),
        mylist: contextQueryElement({ collection: "rb.rb3.player.mylist" }, "rid", () => new Rb3Mylist())
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
        objectSize: "custom.stageObjectSize",
        shotSound: "custom.stageShotSound",
        shotVolume: "custom.stageShotVolume",
        explodeEffect: "custom.stageExplodeType",
        frame: "custom.stageFrameType",
        background: "custom.stageBackground",
        backgroundBrightness: "custom.stageBackgroundBrightness",
        backgroundMusic: "config.musicSelectBgm",
        touchMarkerDisplayingType: "custom.stageTouchMarkerDisplayingType",
        isLobbyEnabled: "lobbySettings.isEnabled",
        mylist: {
            read: ctx => ctx.mylist?.slot?.map(m => m.musicId) ?? [],
            write: (v, ctx) => ctx.mylist = { collection: "rb.rb3.player.mylist", slot: v.filter(m => m >= 0).map((m, i) => ({ slotId: i, musicId: m })) }
        }
    }
}

const readSettings: C.C<RbRequest, Rb3SettingsResponse> = data => readSettingsUsingFactory(data.rid, rb3SettingsFactory)
const writeSettings: C.C<RbRequest & Rb3SettingsResponse, RbWriteSettingsResponse> = data => writeSettingsUsingFactory(data.rid, data, rb3SettingsFactory)

async function toStageLogResponse(l: Rb3PlayerStageLog): Promise<RbStageLogResponse<V, Rb1ChartType>> {
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
        combo: l.combo,
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
    const logs = await DBH.find<Rb3PlayerStageLog>(rid, { collection: "rb.rb3.playData.stageLog", stageIndex: 0, time: { $exists: true, $gte: queryStartDate.valueOf() / 1000 } })
    const offset = 86400 - (now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds() + now.getMilliseconds() / 1000)
    for (const l of logs) {
        const d = Math.floor((now.valueOf() / 1000 + offset - l.time) / 86400)
        if (result[d] === undefined) result[d] = 1
        else result[d]++
    }
    return result
}
async function addMusicUnlockInfo(t: DBH.T, rid: string, musicId: number) {
    if (await t.findOne<Rb3PlayerReleasedInfo>(rid, { collection: "rb.rb3.player.releasedInfo", type: 0, id: musicId })) return
    const release = new Rb3PlayerReleasedInfo()
    release.type = 0
    release.id = musicId
    release.param = 15
    t.insert(rid, release)
}