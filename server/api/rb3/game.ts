import { H } from "../../utils/handler"
import { XF } from "../../utils/x"
import { DBH } from "../../utils/db/dbh"
import { Rb3MusicRecord } from "../../models/rb3/music_record"
import { Rb3Mylist } from "../../models/rb3/mylist"
import { Rb3Equip, Rb3EventProgress, Rb3Order, Rb3OrderDetails, Rb3Player, Rb3PlayerAccount, Rb3PlayerBase, Rb3PlayerConfig, Rb3PlayerCustom, Rb3PlayerReleasedInfo, Rb3PlayerStageLog, Rb3SeedPod, Rb3Stamp, Rb3TricolettePark } from "../../models/rb3/profile"
import { readPlayerPostProcess, writePlayerPreProcess } from "./processing"
import { findPlayerFromOtherVersion } from "../shared_game/find_player"
import { convertToRb3ClearType, findAllBestMusicRecord } from "../shared_game/find_music_record"
import { Rb2LincleLink } from "../../models/rb2/profile"
import { hasAny, hasFlag, isToday } from "../../utils/utility_functions"
import { generateUserId } from "../shared_game/generate_user_id"
import { Rb3ItemLockCtrl, Rb3PlayerStart, Rb3PlayerSucceed } from "../../models/rb3/common"
import { Rb3ShopInfo } from "../../models/rb3/shop_info"
import { DBBigInt, toBigInt } from "../../utils/db/db_types"
import { Rb1ChartType, Rb1ClearType, Rb3ClearType, Rb3OrderDetailsParamFlag, RbSession } from "../../models/shared/rb_types"
import { createAddLobbyHandler, createReadLobbyHandler, createDeleteLobbyHandler } from "../shared_game/lobby"
import { createReadCommentHandler, createWriteCommentHandler } from "../shared_game/comment"
import { RbPlayerRead } from "../../models/shared/common"
import { createSession, getSession, removeSession } from "../shared_game/session"
import { Rb3VerdetDesKrieges } from "../../models/rb3/event"
import { inspect } from "util"

export function registerRb3Handlers() {
    H.route("read.info?model=MBR", readInfo)
    H.route("player.start?model=MBR", startPlayer)
    H.route("player.succeed?model=MBR", succeedPlayer)
    H.route("player.read?model=MBR", readPlayer)
    H.route("player.write?model=MBR", writePlayer)
    H.route("player.end?model=MBR", endPlayer)
    H.route("lobby.entry?model=MBR", createAddLobbyHandler(3))
    H.route("lobby.read?model=MBR", createReadLobbyHandler(3))
    H.route("lobby.delete?model=MBR", createDeleteLobbyHandler(3))
    H.route("info.pzlcmt_read?model=MBR", createReadCommentHandler(3))
    H.route("info.pzlcmt_write?model=MBR", createWriteCommentHandler(3))
}

const readInfo: H.H = () => H.success

const bootPcb: H.H = () => XF.x(new Rb3ShopInfo())

const readHitChartInfo: H.H = () => ({ ver: {} })

const startPlayer: H.H = async data => {
    const rid = $(data).str("rid")
    const session = await createSession(rid, 3)
    if (!session) return H.deny
    const result = new Rb3PlayerStart(session.sessionId)
    const lincleLink = await DBH.findOne(rid, Rb2LincleLink, { collection: "rb.rb2.player.lincleLink" }, true)
    result.lincleLink = lincleLink
    result.itemLockCtrl.item = []
    const music = new Rb3ItemLockCtrl()
    music.type = 0
    music.id = 386
    music.param = 2
    result.itemLockCtrl.item.push(music)
    return XF.x(result)
}

const succeedPlayer: H.H = async data => {
    const rid = $(data).str("rid")
    const account = await DBH.findOne(rid, Rb3PlayerAccount, { collection: "rb.rb3.player.account" })
    const result = new Rb3PlayerSucceed()
    if (!account) return XF.x(result)

    const base = await DBH.findOne(rid, Rb3PlayerBase, { collection: "rb.rb3.player.base" }, true)
    const released = await DBH.find(rid, Rb3PlayerReleasedInfo, { collection: "rb.rb3.player.releasedInfo" })
    const record = await DBH.find(rid, Rb3MusicRecord, { collection: "rb.rb3.playData.musicRecord" })
    result.name = base.name
    result.lv = base.level
    result.exp = base.onigiriTimes10
    result.grd = base.matchingGrade
    result.ap = base.abilityPointTimes100
    if (released.length > 0) result.released = { i: released }
    if (record.length > 0) result.mrecord = { mrec: record }
    return XF.x(result)
}
const readPlayer: H.H<RbPlayerRead> = async data => {
    const read = XF.o(data, RbPlayerRead)
    const result = new Rb3Player(read.rid)
    const session = await getSession(read.rid, 3)
    if (!session) return H.deny
    const account = await DBH.findOne(read.rid, Rb3PlayerAccount, { collection: "rb.rb3.player.account" }) ?? new Rb3PlayerAccount()
    if (!account) {
        const player = await findPlayerFromOtherVersion(read.rid, 3)
        if (!player) return H.deny
        result.pdata.account.sessionId = session.sessionId
        result.pdata.account.isFirstFree = true
        result.pdata.account.userId = player.userId
        result.pdata.base.name = player.name
        return XF.x(result)
    }
    const base = await DBH.findOne(read.rid, Rb3PlayerBase, { collection: "rb.rb3.player.base" }, true)
    const config = await DBH.findOne(read.rid, Rb3PlayerConfig, { collection: "rb.rb3.player.config" }, true)
    const custom = await DBH.findOne(read.rid, Rb3PlayerCustom, { collection: "rb.rb3.player.custom" }, true)
    const released = await DBH.find(read.rid, Rb3PlayerReleasedInfo, { collection: "rb.rb3.player.releasedInfo" })
    const mylist = await DBH.findOne(read.rid, Rb3Mylist, { collection: "rb.rb3.player.mylist" }, true)
    const lincleLink = await DBH.findOne(read.rid, Rb2LincleLink, { collection: "rb.rb2.player.lincleLink" }, true)
    const tricolettePark = await DBH.findOne(read.rid, Rb3TricolettePark, { collection: "rb.rb3.player.tricolettePark" }, true)
    const eventProgress = await DBH.find(read.rid, Rb3EventProgress, { collection: "rb.rb3.player.event.eventProgress" })
    const equip = await DBH.find(read.rid, Rb3Equip, { collection: "rb.rb3.player.equip" })
    const seedPod = await DBH.find(read.rid, Rb3SeedPod, { collection: "rb.rb3.player.event.seedPod" })
    const order = await DBH.findOne(read.rid, Rb3Order, { collection: "rb.rb3.player.order" }, true)
    const stamp = await DBH.findOne(read.rid, Rb3Stamp, { collection: "rb.rb3.player.stamp" }, true)
    
    account.sessionId = session.sessionId

    if (!isToday(toBigInt(account.st))) account.playCountToday = 1
    else account.playCountToday = (account.playCountToday ?? 0) + 1
    account.intrvld ??= 0
    account.succeed ??= true
    account.pst ??= DBBigInt(0)
    account.st ??= DBBigInt(0)

    if (!base.comment) base.comment = "Welcome to REFLEC BEAT colette!"
    base.abilityPointTimes100 ??= base["averagePrecisionTimes100"] // For compatibility
    custom.stageClearGaugeType ??= 0 // Fix for v1.1.0
    const scores = await DBH.find(read.rid, Rb3MusicRecord, { collection: "rb.rb3.playData.musicRecord" })

    base.totalBestScore = 0
    for (const s of scores) base.totalBestScore += s.score
    base.totalBestScoreRival = 0

    const bestRecords = await findAllBestMusicRecord(read.rid, 3)
    const oldRecords: Rb3MusicRecord[] = []
    for (const b of bestRecords) {
        const o = new Rb3MusicRecord(b.musicId, b.chartType as Rb1ChartType)
        o.playCount = b.playCount
        o.clearType = convertToRb3ClearType(b.clearType)
        o.achievementRateTimes100 = b.achievementRateTimes100
        o.score = b.score
        o.combo = b.combo
        o.missCount = b.missCount
        o.bestAchievementRateUpdateTime = b.achievementRateUpdateTime ?? 0
        o.bestComboUpdateTime = b.comboUpdateTime ?? 0
        o.bestScoreUpdateTime = b.scoreUpdateTime ?? 0
        o.bestMissCountUpdateTime = b.missCountUpdateTime ?? 0
        o.version = (b.scoreVersion ?? 3 >= 3) ? 3 : b.scoreVersion
        o.time = b.comboUpdateTime ?? 0
        oldRecords.push(o)
    }
    config.randomEntryWork ??= DBBigInt(Math.trunc(Math.random() * 99999999))
    config.customFolderWork ??= DBBigInt(Math.trunc(Math.random() * 9999999999999))

    const p = result.pdata

    p.account = account
    p.base = base
    p.config = config
    p.custom = custom
    if (released.length > 0) p.released.info = released
    p.lincleLink = lincleLink
    p.tricolettePark = tricolettePark
    p.stamp = stamp
    if (eventProgress.length > 0) p.eventProgress.data = eventProgress
    if (equip.length > 0) p.equip.data = equip
    if (seedPod.length > 0) p.seedPod.data = seedPod
    p.order = order
    p.mylist = mylist
    if (scores.length > 0) p.record = { rec: scores }
    if (oldRecords.length > 0) p.recordOld = { rec: oldRecords }

    await readPlayerPostProcess(result)
    return XF.x(result)
}
const writePlayer: H.H<Rb3Player> = async data => {
    console.log(inspect((data as any).pdata.base.hidden_param))
    const player = XF.o(data, Rb3Player)
    console.log(inspect(player.pdata.base.hiddenParam))

    const session = await getSession(player.pdata.account.rid, 3)
    if (!session || session.sessionId !== player.pdata.account.sessionId) return H.deny
    await writePlayerPreProcess(player)
    await writePlayerCore(player, session)
    return { uid: K.ITEM("s32", player.pdata.account.userId) }
}
const endPlayer: H.H = async data => {
    const rid = $(data).str("rid")
    await removeSession(rid, 3)
    return H.success
}
const deletePlayer: H.H = async data => {
    try {
        const rid = $(data).str("rid")
        await DBH.removeAll(rid, /^rb\.rb3\./)
        return H.success
    } catch (e) {
        console.log((e as Error).message)
        return H.deny
    }
}

async function writePlayerCore(player: Rb3Player, session: RbSession) {
    const rid = player.pdata.account.rid
    if (!rid) throw new Error("rid is empty")

    const t = new DBH.T()
    const accountQuery: Query<Rb3PlayerAccount> = { collection: "rb.rb3.player.account" }
    const accountSaved = await t.findOne(player.pdata.account.rid, accountQuery)

    if (!accountSaved) { // save the new player
        const rbPlayer = await findPlayerFromOtherVersion(rid, 3)
        if (rbPlayer) player.pdata.account.userId = rbPlayer.userId
        else player.pdata.account.userId = await generateUserId()
        player.pdata.account.isFirstFree = false
        const isPlayed = hasAny(player.pdata.stageLogs?.log)
        player.pdata.account.playCount = isPlayed ? 1 : 0
        player.pdata.account.playCountToday = isPlayed ? 1 : 0
        player.pdata.account.st = DBBigInt(session.time)
        t.upsert(rid, accountQuery, player.pdata.account)
    } else {
        accountSaved.isFirstFree = false
        accountSaved.playCount++
        if (!isToday(BigInt(session.time))) {
            accountSaved.dayCount++
            accountSaved.playCountToday = 0
        }
        accountSaved.st = DBBigInt(session.time)
        accountSaved.playCountToday++

        t.update(rid, accountQuery, accountSaved)
    }
    if (player.pdata.base) {
        const baseQuery: Query<Rb3PlayerBase> = { collection: "rb.rb3.player.base" }
        const baseSaved = await t.findOne(rid, baseQuery)
        if (baseSaved) {
            if (baseSaved.name) player.pdata.base.name = baseSaved.name
            player.pdata.base.comment = baseSaved.comment
        } else {
            if (player.pdata.base.comment === "Welcome to REFLEC BEAT colette!") player.pdata.base.comment = ""
        }
        t.upsert(rid, baseQuery, player.pdata.base)
    }
    if (player.pdata.config) t.upsert(rid, { collection: "rb.rb3.player.config" }, player.pdata.config)
    if (player.pdata.custom) t.upsert(rid, { collection: "rb.rb3.player.custom" }, player.pdata.custom)
    if (hasAny(player.pdata.stageLogs?.log)) for (const i of player.pdata.stageLogs.log) await updateMusicRecordFromStageLog(rid, i, t)
    if (hasAny(player.pdata.released?.info)) for (const i of player.pdata.released.info) t.upsert(rid, { collection: "rb.rb3.player.releasedInfo", type: i.type, id: i.id }, i)
    if (player.pdata.mylist?.slot) t.upsert(rid, { collection: "rb.rb3.player.mylist" }, player.pdata.mylist)
    if (player.pdata.lincleLink) t.upsert<Rb2LincleLink>(rid, { collection: "rb.rb2.player.lincleLink" }, player.pdata.lincleLink)
    if (player.pdata.tricolettePark) t.upsert<Rb3TricolettePark>(rid, { collection: "rb.rb3.player.tricolettePark" }, player.pdata.tricolettePark)
    if (hasAny(player.pdata.eventProgress?.data)) for (const d of player.pdata.eventProgress.data) await updateEventProgress(rid, d, t)
    if (hasAny(player.pdata.equip?.data)) for (const e of player.pdata.equip.data) {
        const equipQuery: Query<Rb3Equip> = { collection: "rb.rb3.player.equip", index: e.index, stype: e.stype }
        const equipSaved = await t.findOne(rid, equipQuery)
        if (equipSaved) e.experience += equipSaved.experience
        t.upsert(rid, equipQuery, e)
    }
    if (hasAny(player.pdata.seedPod?.data)) for (const s of player.pdata.seedPod.data) t.upsert(rid, { collection: "rb.rb3.player.event.seedPod", index: s.index }, s)
    await updateVerdetDesKrieges(rid, player.pdata.order, player.pdata.stageLogs?.log, session, t)
    if (player.pdata.order) await updateOrder(rid, player.pdata.order, player.pdata.account.version, player.pdata.stageLogs?.log, t)
    if (player.pdata.stamp) t.upsert(rid, { collection: "rb.rb3.player.stamp" }, player.pdata.stamp)

    await t.commit()
}
async function updateMusicRecordFromStageLog(rid: string, stageLog: Rb3PlayerStageLog, t: DBH.T): Promise<void> {
    if ((stageLog.musicId === 0) && (stageLog.clearType < Rb1ClearType.none)) return
    const query: Query<Rb3MusicRecord> = { collection: "rb.rb3.playData.musicRecord", musicId: stageLog.musicId, chartType: stageLog.chartType }
    let musicRecord = await t.findOne<Rb3MusicRecord>(rid, query)

    const newFlag = getClearTypeIndex(stageLog)
    if (newFlag < 0) return

    if (!musicRecord) {
        musicRecord = new Rb3MusicRecord(stageLog.musicId, stageLog.chartType)
        musicRecord.clearType = stageLog.clearType
        musicRecord.achievementRateTimes100 = stageLog.achievementRateTimes100
        musicRecord.score = stageLog.score
        musicRecord.missCount = stageLog.missCount
        musicRecord.bestScoreUpdateTime = stageLog.time
        musicRecord.bestMissCountUpdateTime = stageLog.time
        musicRecord.bestAchievementRateUpdateTime = stageLog.time
        musicRecord.bestComboUpdateTime = stageLog.time
    } else {
        if (musicRecord.achievementRateTimes100 < stageLog.achievementRateTimes100) {
            musicRecord.bestAchievementRateUpdateTime = stageLog.time
            musicRecord.achievementRateTimes100 = stageLog.achievementRateTimes100
        }
        if (musicRecord.clearType < stageLog.clearType) musicRecord.clearType = stageLog.clearType
        if (musicRecord.score < stageLog.score) {
            musicRecord.bestScoreUpdateTime = stageLog.time
            musicRecord.score = stageLog.score
        }
        if (musicRecord.combo < stageLog.combo) {
            musicRecord.bestComboUpdateTime = stageLog.time
            musicRecord.combo = stageLog.combo
        }
        if ((stageLog.missCount >= 0) && ((musicRecord.missCount > stageLog.missCount) || (musicRecord.missCount < 0))) {
            musicRecord.bestMissCountUpdateTime = stageLog.time
            musicRecord.missCount = stageLog.missCount
        }
    }

    musicRecord.time = stageLog.time
    musicRecord.playCount++
    t.upsert(rid, query, musicRecord)
    t.insert(rid, stageLog)
}

async function updateVerdetDesKrieges(rid: string, order: Rb3Order, stageLogs: Rb3PlayerStageLog[] | undefined, session: RbSession, t: DBH.T) {
    const data = await t.findOne<Rb3VerdetDesKrieges>(rid, { collection: "rb.rb3.event.verdetDesKrieges" })
    if (!data) return
    let modified = false
    function canModify(clueId: number, page?: number) {
        page ??= clueId
        return data && data.page >= page && data.progress[clueId] < 60
    }
    function increaseProgress(clueId: number, count: number) {
        modified = true
        if (data) data.progress[clueId] = Math.min(60, data.progress[clueId] + count)
    }
    if (data.chapter === 1) {
        // clue 1
        if (canModify(0)) {
            const order1 = order.details?.find(o => o.index === 19) // レベル編 ☆7
            if (order1 && order1.clearedCount > 0) {
                increaseProgress(0, 60)
            }
        }
        // clue 2
        if (canModify(1)) {
            if (stageLogs && stageLogs.length > 0) {
                const time = new Date(session.time)
                if (time.getHours() >= 7 && time.getHours() < 12) {
                    increaseProgress(1, 20)
                }
            }
        }
        // clue 3
        if (canModify(2)) {
            if (stageLogs && stageLogs.length > 0) {
                const hinabitaMusics = [236, 276, 306, 342, 343, 344, 399, 400]
                const playCount = stageLogs.filter(log => hinabitaMusics.includes(log.musicId)).length
                if (playCount > 0) {
                    increaseProgress(2, 12 * playCount)
                }
            }
        }
        // clue 5
        if (canModify(4)) {
            const orderHeroesOfTwo = order.details?.find(o => o.index === 174)
            if (orderHeroesOfTwo) {
                const count = countHeroesOfTwo(orderHeroesOfTwo, stageLogs)
                console.log("heroes of two count:", count)
                if (count > 0) {
                    increaseProgress(4, count * 3)
                }
            } else {
                const orderSaved = await t.findOne<Rb3Order>(rid, { collection: "rb.rb3.player.order" })
                const orderHeroesOfTwoSaved = orderSaved?.details?.find(o => o.index === 174)
                if (orderHeroesOfTwoSaved && orderHeroesOfTwoSaved.slot >= 0) {
                    const count = countHeroesOfTwo(undefined, stageLogs)
                    if (count > 0) {
                        increaseProgress(4, count * 3)
                        // if order state has not changed, it completely won't appear in the write method. Let's manually create one
                        order.details ??= []
                        const details = new Rb3OrderDetails(174)
                        details.param = orderHeroesOfTwoSaved.param
                        details.slot = orderHeroesOfTwoSaved.slot
                        order.details.push(details)
                    }
                }
            }
        }
    } else if (data.chapter === 2) {
        // clue 2 (in page 3)
        if (canModify(1, 2)) {
            if (stageLogs && stageLogs.length > 0) {
                const fcCount = stageLogs.filter(log => log.clearType === Rb3ClearType.fullCombo).length
                if (fcCount > 0) {
                    increaseProgress(1, fcCount * 12)
                }
            }
        }
        // clue 3 (in page 3)
        if (canModify(2)) {
            if (stageLogs && stageLogs.length > 0 && stageLogs[stageLogs.length - 1].musicId === 73) { // Anisakis -somatic mutation type'Forza'-
                increaseProgress(2, 60)
            }
        }
        // clue 4
        if (canModify(3)) {
            const orderA = order.details?.find(o => o.index === 58) // アーティスト編 あ行推し
            if (orderA && orderA.clearedCount > 0) {
                increaseProgress(3, 60)
            }
        }
        // clue 5
        if (canModify(4)) {
            const orderDetails = order.details && order.details.find(o => o.index === 175)
            if (orderDetails && orderDetails.fragmentsCount0 > 0) {
                increaseProgress(4, orderDetails.fragmentsCount0 * 3)
            }
        }
    } else if (data.chapter === 3) {
        // clue 1 (in page 2)
        if (canModify(0, 1)) {
            const venusMusics = [33, 99, 125, 247, 272, 374, 396, 397, 434]
            if (stageLogs && stageLogs.length > 0 && venusMusics.includes(stageLogs[stageLogs.length - 1].musicId)) {
                increaseProgress(0, 60)
            }
        }
        // clue 2 (in page 3)
        if (canModify(1, 2)) {
            const musicsWithStar = [16, 19, 30, 50, 103, 118, 148, 152, 162, 167, 188, 302, 310, 320, 372, 374, 399]
            const count = stageLogs?.filter(log => musicsWithStar.includes(log.musicId)).length ?? 0
            if (count > 0) {
                increaseProgress(1, count * 12)
            }
        }
        // clue 3 (in page 3)
        if (canModify(2)) {
            const qrispyMusics = [22, 104, 105, 108, 133, 146, 152, 160, 199, 215, 222, 266, 268, 372]
            const count = stageLogs?.filter(log => qrispyMusics.includes(log.musicId)).length ?? 0
            if (count > 0) {
                increaseProgress(2, count * 12)
            }
        }
        // clue 4
        if (canModify(3)) {
            const matchingOrders = [34, 177, 178, 179, 180, 181, 182]
            if (order.details?.find(o => matchingOrders.includes(o.index) && (o.slot >= 0 || o.clearedCount > 0))) {
                increaseProgress(3, 60)
            }
        }
        // clue 5
        if (canModify(4)) {
            const orderPhonix = order.details?.find(o => o.index === 176)
            if (orderPhonix) {
                const count = countPhonix(orderPhonix, stageLogs)
                if (count > 0) {
                    increaseProgress(4, count * 3)
                }
            } else {
                const orderSaved = await t.findOne<Rb3Order>(rid, { collection: "rb.rb3.player.order" })
                const orderPhonixSaved = orderSaved?.details?.find(o => o.index === 174)
                if (orderPhonixSaved && orderPhonixSaved.slot >= 0) {
                    const count = countPhonix(undefined, stageLogs)
                    if (count > 0) {
                        increaseProgress(4, count * 3)
                        // if order state has not changed, it completely won't appear in the write method. Let's manually create one
                        order.details ??= []
                        const details = new Rb3OrderDetails(176)
                        details.param = orderPhonixSaved.param
                        details.slot = orderPhonixSaved.slot
                        order.details.push(details)
                    }
                }
            }
        }
    }
    if (modified) t.upsert(rid, { collection: "rb.rb3.event.verdetDesKrieges" }, data)
}

async function updateOrder(rid: string, order: Rb3Order, currentVersion: number, stageLogs: Rb3PlayerStageLog[] | undefined, t: DBH.T) {
    const ordersSaved = await t.findOne<Rb3Order>(rid, { collection: "rb.rb3.player.order" })

    const playerBase = await t.findOne<Rb3PlayerBase>(rid, { collection: "rb.rb3.player.base" })
    const stamp = await t.findOne<Rb3Stamp>(rid, { collection: "rb.rb3.player.stamp" })
    const equips = await t.find<Rb3Equip>(rid, { collection: "rb.rb3.player.equip" })
    const changedEquips: Rb3Equip[] = []
    const newReleases: Rb3PlayerReleasedInfo[] = []
    console.log(inspect(order))
    if (!playerBase || !stamp) {
        console.warn("Data not found when update order.")
        return
    }
    if (!ordersSaved) t.upsert(rid, { collection: "rb.rb3.player.order" }, order)
    else {
        ordersSaved.experience = Math.min(order.experience, 120_000_000) // max exp is 1.2e8 (lv 999), don't think anyone can achieve that

        function isCleared(orderIndex: number): boolean {
            return (ordersSaved!.details?.find(o => o.index == orderIndex)?.clearedCount ?? 0) > 0
        }
        function addClearedCount(orderIndex: number, clearedCount: number, fragmentsCount: number, fragmentsCount1: number = 0, slot: number = -1, param: Rb3OrderDetailsParamFlag = Rb3OrderDetailsParamFlag.unlocked): void {
            if (slot >= 0) {
                for (const o of ordersSaved!.details ?? []) if (o.slot === slot) {
                    o.slot = -1
                    break
                }
            }
            let order = ordersSaved!.details?.find(o => o.index == orderIndex)
            if (!order) {
                order = {
                    index: orderIndex,
                    clearedCount: clearedCount,
                    fragmentsCount0: fragmentsCount,
                    fragmentsCount1: fragmentsCount1,
                    slot,
                    param
                }
                if (!ordersSaved!.details) ordersSaved!.details = []
                ordersSaved!.details.push(order)
            } else {
                order.clearedCount += clearedCount
                order.fragmentsCount0 += fragmentsCount
                order.fragmentsCount1 += fragmentsCount1
                order.slot = slot
                order.param = param
            }
        }
        function setEquipExp(index: number, season: number, experience: number): void {
            const e = equips.find(e => e.index === index && e.stype === season) ?? {
                collection: "rb.rb3.player.equip",
                index: index,
                stype: season,
                experience: 0
            }
            if (e && e.experience < experience) {
                e.experience = experience
                changedEquips.push(e)
            }
        }

        if (order.details) {
            for (const o of order.details) {
                ordersSaved.experience += 2788 // amount of order complete experience
                switch (o.index) { // mark online matching orders as completed
                    case 2:
                        if (!isCleared(o.index)) {
                            stamp.ticketCount[currentVersion - 1] += 3
                            addClearedCount(o.index, 1, 1, 0, -1)
                        }
                        // the first matching order cannot be accepted again
                        break
                    case 34:
                        if (!isCleared(o.index)) stamp.ticketCount[currentVersion - 1] += 5
                        else stamp.ticketCount[currentVersion - 1] += 2
                        addClearedCount(o.index, 1, 12, 0, hasFlag(o.param, Rb3OrderDetailsParamFlag.lockedToSlot) ? o.slot: -1, o.param)
                        break
                    case 35:
                        if (!isCleared(o.index)) stamp.ticketCount[currentVersion - 1] += 6
                        else stamp.ticketCount[currentVersion - 1] += 3
                        addClearedCount(o.index, 1, 12, 0, hasFlag(o.param, Rb3OrderDetailsParamFlag.lockedToSlot) ? o.slot : -1, o.param)
                        break
                    case 36:
                        if (!isCleared(o.index)) stamp.ticketCount[currentVersion - 1] += 7
                        else stamp.ticketCount[currentVersion - 1] += 4
                        addClearedCount(o.index, 1, 14, 0, hasFlag(o.param, Rb3OrderDetailsParamFlag.lockedToSlot) ? o.slot : -1, o.param)
                        break
                    case 135: case 136: case 137: case 138: case 139: case 140: case 141:
                        if (!isCleared(o.index)) stamp.ticketCount[currentVersion - 1] += 3
                        else stamp.ticketCount[currentVersion - 1] += 2
                        addClearedCount(o.index, 1, 15, 0, hasFlag(o.param, Rb3OrderDetailsParamFlag.lockedToSlot) ? o.slot : -1, o.param)
                        break
                    case 174: // 二人の英雄
                        if (isCleared(o.index)) break
                        if (o.slot >= 0) {
                            const fragsBase = countHeroesOfTwo(o, stageLogs)
                            let orderSaved = ordersSaved!.details?.find(os => os.index == o.index)
                            if (!orderSaved) {
                                if (fragsBase >= 20) stamp.ticketCount[currentVersion - 1] += 4
                                else ordersSaved.experience -= 2788
                                orderSaved = {
                                    index: o.index,
                                    clearedCount: fragsBase >= 20 ? 1 : 0,
                                    fragmentsCount0: fragsBase,
                                    fragmentsCount1: 0,
                                    slot: o.slot,
                                    param: o.param
                                }
                                if (!ordersSaved!.details) ordersSaved!.details = []
                                ordersSaved!.details.push(orderSaved)
                            } else {
                                const frags = fragsBase + orderSaved.fragmentsCount0
                                if (frags >= 20) {
                                    orderSaved.clearedCount = 1
                                    orderSaved.slot = -1
                                    orderSaved.fragmentsCount0 = 0
                                    stamp.ticketCount[currentVersion - 1] += 4
                                } else {
                                    orderSaved.slot = o.slot
                                    orderSaved.fragmentsCount0 = frags
                                    ordersSaved.experience -= 2788
                                }
                            }
                        } else addClearedCount(o.index, o.clearedCount, o.fragmentsCount0, o.fragmentsCount1, o.slot)
                        break
                    case 176: // 朱雀の姿
                        if (isCleared(o.index)) break
                        if (o.slot >= 0) {
                            const fragsBase = countPhonix(o, stageLogs)
                            let orderSaved = ordersSaved!.details?.find(os => os.index === o.index)
                            if (!orderSaved) {
                                if (fragsBase >= 20) {
                                    newReleases.push({
                                        collection: "rb.rb3.player.releasedInfo",
                                        type: 7,
                                        id: 82, // left byword "Red"
                                        param: 0,
                                    })
                                }
                                orderSaved = {
                                    index: o.index,
                                    clearedCount: fragsBase >= 20 ? 1 : 0,
                                    fragmentsCount0: fragsBase,
                                    fragmentsCount1: 0,
                                    slot: o.slot,
                                    param: o.param
                                }
                                if (!ordersSaved!.details) ordersSaved!.details = []
                                ordersSaved!.details.push(orderSaved)
                            } else {
                                const frags = fragsBase + orderSaved.fragmentsCount0
                                if (frags >= 20) {
                                    orderSaved.clearedCount = 1
                                    orderSaved.slot = -1
                                    orderSaved.fragmentsCount0 = 0
                                    newReleases.push({
                                        collection: "rb.rb3.player.releasedInfo",
                                        type: 7,
                                        id: 82,
                                        param: 0,
                                        // insertTime: Date.now()
                                    })
                                } else {
                                    orderSaved.slot = o.slot
                                    orderSaved.fragmentsCount0 = frags
                                    ordersSaved.experience -= 2788
                                }
                            }
                        } else addClearedCount(o.index, o.clearedCount, o.fragmentsCount0, o.fragmentsCount1, o.slot)
                        break
                    // start of seasonal equips / inventories
                    // winter ver.
                    case 42:
                        if (!isCleared(o.index)) {
                            setEquipExp(0, 0, 12)
                            addClearedCount(o.index, 1, 14)
                        }
                        // orders about equipments cannot be accepted again
                        break
                    case 48:
                        if (!isCleared(o.index)) {
                            setEquipExp(1, 0, 12)
                            addClearedCount(o.index, 1, 14)
                        }
                        break
                    case 54:
                        if (!isCleared(o.index)) {
                            setEquipExp(2, 0, 12)
                            addClearedCount(o.index, 1, 14)
                        }
                        break
                    // spring ver.
                    case 105:
                        if (!isCleared(o.index)) {
                            setEquipExp(0, 1, 12)
                            addClearedCount(o.index, 1, 14)
                        }
                        break
                    case 111:
                        if (!isCleared(o.index)) {
                            setEquipExp(1, 1, 12)
                            addClearedCount(o.index, 1, 14)
                        }
                        break
                    case 117:
                        if (!isCleared(o.index)) {
                            setEquipExp(2, 1, 12)
                            addClearedCount(o.index, 1, 14)
                        }
                        break
                    // summer ver.
                    case 119:
                        if (!isCleared(o.index) && stageLogs?.some(l => l.musicId >= 314 && l.musicId <= 364)) playerBase.hiddenParam[14] += 3 // summer ver. inventory: golden lure
                        else playerBase.hiddenParam[14] += 1
                        addClearedCount(o.index, 1, 15)
                        break
                    case 161:
                        if (!isCleared(o.index)) {
                            setEquipExp(0, 2, 12)
                            addClearedCount(o.index, 1, 14)
                        }
                        break
                    case 167:
                        if (!isCleared(o.index)) {
                            setEquipExp(1, 2, 12)
                            addClearedCount(o.index, 1, 14)
                        }
                        break
                    case 173:
                        if (!isCleared(o.index)) {
                            setEquipExp(2, 2, 12)
                            addClearedCount(o.index, 1, 14)
                        }
                        break
                    // autumn ver.
                    case 186:
                        if (!isCleared(o.index)) playerBase.hiddenParam[18] += 2 // autumn ver. inventory: magical clock
                        else playerBase.hiddenParam[18] += 1
                        addClearedCount(o.index, 1, 25)
                        break
                    case 206:
                        if (!isCleared(o.index)) {
                            setEquipExp(0, 3, 12)
                            addClearedCount(o.index, 1, 14)
                        }
                        break
                    case 212:
                        if (!isCleared(o.index)) {
                            setEquipExp(1, 3, 12)
                            addClearedCount(o.index, 1, 14)
                        }
                        break
                    case 218:
                        if (!isCleared(o.index)) {
                            setEquipExp(2, 3, 12)
                            addClearedCount(o.index, 1, 14)
                        }
                        break
                    // end of seasonal equips / inventories
                    default:
                        addClearedCount(o.index, o.clearedCount, o.fragmentsCount0, o.fragmentsCount1, o.slot, o.param)
                        ordersSaved.experience -= 2788
                        break
                }
            }
            t.upsert(rid, { collection: "rb.rb3.player.order" }, ordersSaved)
            t.upsert(rid, { collection: "rb.rb3.player.stamp" }, stamp)
            t.update(rid, { collection: "rb.rb3.player.base" }, playerBase)
            for (const e of changedEquips) t.upsert(rid, { collection: "rb.rb3.player.equip", index: e.index, stype: e.stype }, e)
            for (const r of newReleases) t.upsert(rid, { collection: "rb.rb3.player.releasedInfo", id: r.id, type: r.type }, r)
        }
    }
}

function countHeroesOfTwo(order: Rb3OrderDetails | undefined, stageLogs: Rb3PlayerStageLog[] | undefined): number {
    return (order && order.index === 174 && (order.slot >= 0 || order.clearedCount > 0 || order.fragmentsCount0 > 0) ? order.fragmentsCount0 : 0) + (stageLogs?.filter(log => log.rivalCpuId > 0)?.length ?? 0)
}

function countPhonix(order: Rb3OrderDetails | undefined, stageLogs: Rb3PlayerStageLog[] | undefined): number { // Phonix, not Phoenix
    const phonixMusics = [54, 73, 110, 156, 171, 200, 208, 262, 274, 303, 325, 382, 387]
    return (order && order.index === 176 && (order.slot >= 0 || order.clearedCount > 0 || order.fragmentsCount0 > 0) ? order.fragmentsCount0 : 0) + (stageLogs?.filter(log => phonixMusics.includes(log.musicId) && log.rivalCpuId > 0)?.length ?? 0)
}

async function updateEventProgress(rid: string, e: Rb3EventProgress, t: DBH.T) {
    const progressSaved = await t.findOne<Rb3EventProgress>(rid, { collection: "rb.rb3.player.event.eventProgress", index: e.index })
    if (!progressSaved) t.upsert(rid, { collection: "rb.rb3.player.event.eventProgress", index: e.index }, e)
    else {
        progressSaved.experience += e.experience
        t.update(rid, { collection: "rb.rb3.player.event.eventProgress", index: progressSaved.index }, progressSaved)
    }
}

function getClearTypeIndex(record: Rb3PlayerStageLog | Rb3MusicRecord): number {
    const excFlag = record.achievementRateTimes100 == 10000
    const fcFlag = record.missCount == 0
    if (excFlag && !fcFlag) return -1
    else if (excFlag) return 0
    else if (fcFlag) return 1
    else if (record.clearType == 4) return 2
    else if (record.clearType == 3) return 3
    else return 4
}
