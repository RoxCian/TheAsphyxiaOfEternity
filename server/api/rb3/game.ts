import { H } from "../../utils/handler"
import { XF } from "../../utils/x"
import { DBH } from "../../utils/db/dbh"
import { Rb3MusicRecord, Rb3ReadPlayerMusicRecord } from "../../models/rb3/music_record"
import { Rb3Mylist } from "../../models/rb3/mylist"
import { Rb3Equip, Rb3EventProgress, Rb3Order, Rb3Player, Rb3PlayerAccount, Rb3PlayerBase, Rb3PlayerConfig, Rb3PlayerCustom, Rb3PlayerReleasedInfo, Rb3PlayerStageLog, Rb3SeedPod, Rb3Stamp, Rb3TricolettePark } from "../../models/rb3/profile"
import { readPlayerPostProcess, writePlayerPreProcess } from "./processing"
import { findPlayerFromOtherVersion } from "../shared_game/find_player"
import { convertToRb3ClearType, findAllBestMusicRecord } from "../shared_game/find_music_record"
import { Rb2LincleLink } from "../../models/rb2/profile"
import { isToday } from "../../utils/utility_functions"
import { generateUserId } from "../shared_game/generate_user_id"
import { Rb3PlayerStart, Rb3PlayerSucceed } from "../../models/rb3/common"
import { Rb3ShopInfo } from "../../models/rb3/shop_info"
import { toBigInt } from "../../utils/db/db_types"
import { Rb1ChartType, Rb1ClearType } from "../../models/shared/rb_types"
import { createAddLobbyHandler, createReadLobbyHandler, createDeleteLobbyHandler } from "../shared_game/lobby"
import { createReadCommentHandler, createWriteCommentHandler } from "../shared_game/comment"
import { RbPlayerRead } from "../../models/shared/common"
import { createSession, getSession, removeSession } from "../shared_game/session"

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
    if (!await createSession(rid, 3)) return H.deny
    return XF.x(new Rb3PlayerStart())
}

const succeedPlayer: H.H = async data => {
    const rid = $(data).str("rid")
    const account = await DBH.findOne(rid, Rb3PlayerAccount, { collection: "rb.rb3.player.account" })
    const result = new Rb3PlayerSucceed()
    if (account) {
        const base = await DBH.findOne(rid, Rb3PlayerBase, { collection: "rb.rb3.player.base" })
        const released = await DBH.find(rid, Rb3PlayerReleasedInfo, { collection: "rb.rb3.player.releasedInfo" })
        const record = await DBH.find(rid, Rb3MusicRecord, { collection: "rb.rb3.playData.musicRecord" })
        result.name = base.name
        result.lv = base.level
        result.exp = base.onigiriTimes10
        result.grd = base.matchingGrade
        result.ap = base.abilityPointTimes100
        if (released.length > 0) result.released = { i: released }
        if (record.length > 0) result.mrecord = { mrec: record }
    }
    return XF.x(result)
}
const readPlayer: H.H<RbPlayerRead> = async data => {
    const read = XF.o(data, RbPlayerRead)
    const result = new Rb3Player(read.rid)
    const account = await DBH.findOne(read.rid, Rb3PlayerAccount, { collection: "rb.rb3.player.account" }) ?? new Rb3PlayerAccount()
    const base = await DBH.findOne(read.rid, Rb3PlayerBase, { collection: "rb.rb3.player.base" })
    if (!base) {
        const rbPlayer = await findPlayerFromOtherVersion(read.rid, 3)
        if (rbPlayer) {
            result.pdata.account.userId = rbPlayer.userId
            result.pdata.base.name = rbPlayer.name
        } else {
            result.pdata.base.name = "RBPlayer"
        }
        await writePlayerCore(result)
    } else {
        const base = await DBH.findOne(read.rid, Rb3PlayerBase, { collection: "rb.rb3.player.base" }) ?? new Rb3PlayerBase()
        const config = await DBH.findOne(read.rid, Rb3PlayerConfig, { collection: "rb.rb3.player.config" })
        const custom = await DBH.findOne(read.rid, Rb3PlayerCustom, { collection: "rb.rb3.player.custom" })
        const released = await DBH.find(read.rid, Rb3PlayerReleasedInfo, { collection: "rb.rb3.player.releasedInfo" })
        const mylist = await DBH.findOne(read.rid, Rb3Mylist, { collection: "rb.rb3.player.mylist" }) ?? new Rb3Mylist()
        const lincleLink = await DBH.findOne(read.rid, Rb2LincleLink, { collection: "rb.rb2.player.lincleLink" }) ?? new Rb2LincleLink()
        const tricolettePark = await DBH.findOne(read.rid, Rb3TricolettePark, { collection: "rb.rb3.player.tricolettePark" }) ?? new Rb3TricolettePark()
        const eventProgress = await DBH.find(read.rid, Rb3EventProgress, { collection: "rb.rb3.player.event.eventProgress" })
        const equip = await DBH.find(read.rid, Rb3Equip, { collection: "rb.rb3.player.equip" })
        const seedPod = await DBH.find(read.rid, Rb3SeedPod, { collection: "rb.rb3.player.event.seedPod" })
        const order = await DBH.findOne(read.rid, Rb3Order, { collection: "rb.rb3.player.order" }) ?? new Rb3Order()
        const stamp = await DBH.findOne(read.rid, Rb3Stamp, { collection: "rb.rb3.player.stamp" }) ?? new Rb3Stamp()

        if (!isToday(toBigInt(account.st))) account.playCountToday = 1
        else account.playCountToday = (account.playCountToday ?? 0) + 1

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
            o.bestAchievementRateUpdateTime = b.achievementRateUpdateTime
            o.bestComboUpdateTime = b.comboUpdateTime
            o.bestScoreUpdateTime = b.scoreUpdateTime
            o.bestMissCountUpdateTime = b.missCountUpdateTime
            o.version = (b.scoreVersion >= 3) ? 3 : b.scoreVersion
            o.time = b.comboUpdateTime
            oldRecords.push(o)
        }
        config.randomEntryWork ??= BigInt(Math.trunc(Math.random() * 99999999))
        config.customFolderWork ??= BigInt(Math.trunc(Math.random() * 9999999999999))

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
        if (scores.length > 0) p.record.rec = scores
        if (oldRecords.length > 0) p.recordOld.rec = oldRecords
    }
    await readPlayerPostProcess(result)
    return XF.x(result)
}
const writePlayer: H.H<Rb3Player> = async data => {
    const player = XF.o(data, Rb3Player)
    if (!await getSession(player.pdata.account.rid, 3)) return H.deny
    await writePlayerPreProcess(player)
    await writePlayerCore(player)
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
        const account = await DBH.findOne<Rb3PlayerAccount>(rid, { collection: "rb.rb3.player.account" })
        await DBH.overall(rid, account?.userId, "rb.rb3", "delete")
        return H.success
    } catch (e) {
        console.log((e as Error).message)
        return H.deny
    }
}
const readPlayerScore: H.H = async data => {
    const rid = $(data).str("rid")
    const scores = await DBH.find(rid, Rb3MusicRecord, { collection: "rb.rb3.playData.musicRecord" })
    const result = new Rb3ReadPlayerMusicRecord()
    if (scores.length > 0) result.pdata.record.rec = scores
    return XF.x(result)
}
// TODO: Verdet des Krieges

async function writePlayerCore(player: Rb3Player) {
    const rid = player.pdata.account.rid
    if (!rid) throw new Error("rid is empty")

    const t = new DBH.T()
    const accountQuery: Query<Rb3PlayerAccount> = { collection: "rb.rb3.player.account" }
    const accountSaved = await t.findOne(player.pdata.account.rid, accountQuery)
    let currentVersion: number

    if (!accountSaved) { // save the new player
        if (player.pdata.account.userId <= 0) player.pdata.account.userId = await generateUserId()
        player.pdata.account.isFirstFree = true
        currentVersion = player.pdata.account.version
        t.upsert(rid, accountQuery, player.pdata.account)
    } else {
        accountSaved.isFirstFree = false
        accountSaved.playCount++
        if (!isToday(toBigInt(accountSaved.st))) {
            accountSaved.dayCount++
            accountSaved.playCountToday = 0
        }
        accountSaved.st = player.pdata.account.st
        accountSaved.playCountToday++
        currentVersion = accountSaved.version

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
    if (player.pdata.config) t.upsert<Rb3PlayerConfig>(rid, { collection: "rb.rb3.player.config" }, player.pdata.config)
    if (player.pdata.custom) t.upsert<Rb3PlayerCustom>(rid, { collection: "rb.rb3.player.custom" }, player.pdata.custom)
    if (player.pdata.stageLogs?.log?.length > 0) for (const i of player.pdata.stageLogs.log) await updateMusicRecordFromStageLog(rid, i, t)
    if (player.pdata.released?.info?.length > 0) for (const i of player.pdata.released.info) t.upsert<Rb3PlayerReleasedInfo>(rid, { collection: "rb.rb3.player.releasedInfo", type: i.type, id: i.id }, i)
    if (player.pdata.mylist?.slot?.length > 0) t.upsert<Rb3Mylist>(rid, { collection: "rb.rb3.player.mylist" }, player.pdata.mylist)
    if (player.pdata.lincleLink) t.upsert<Rb2LincleLink>(rid, { collection: "rb.rb2.player.lincleLink" }, player.pdata.lincleLink)
    if (player.pdata.tricolettePark) t.upsert<Rb3TricolettePark>(rid, { collection: "rb.rb3.player.tricolettePark" }, player.pdata.tricolettePark)
    if (player.pdata.eventProgress?.data?.length > 0) for (const d of player.pdata.eventProgress.data) await updateEventProgress(rid, d, t)
    if (player.pdata.equip?.data?.length > 0) for (const e of player.pdata.equip.data) {
        const equipQuery: Query<Rb3Equip> = { collection: "rb.rb3.player.equip", index: e.index, stype: e.stype }
        const equipSaved = await t.findOne(rid, equipQuery)
        if (equipSaved) e.experience += equipSaved.experience
        t.upsert(rid, equipQuery, e)
    }
    if (player.pdata.seedPod?.data?.length > 0) for (const s of player.pdata.seedPod.data) t.upsert(rid, { collection: "rb.rb3.player.event.seedPod", index: s.index }, s)
    if (player.pdata.order) await updateOrder(rid, player.pdata.order, currentVersion, player.pdata.stageLogs.log, t)
    if (player.pdata.stamp) t.upsert<Rb3Stamp>(rid, { collection: "rb.rb3.player.stamp" }, player.pdata.stamp)

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

async function updateOrder(rid: string, order: Rb3Order, currentVersion: number, stageLogs: Rb3PlayerStageLog[], t: DBH.T) {
    const ordersSaved = await t.findOne<Rb3Order>(rid, { collection: "rb.rb3.player.order" })

    const playerBase = await t.findOne<Rb3PlayerBase>(rid, { collection: "rb.rb3.player.base" })
    const stamp = await t.findOne<Rb3Stamp>(rid, { collection: "rb.rb3.player.stamp" })
    const equips = await t.find<Rb3Equip>(rid, { collection: "rb.rb3.player.equip" })
    const changedEquips: Rb3Equip[] = []
    const newReleases: Rb3PlayerReleasedInfo[] = []
    if (!ordersSaved || !ordersSaved.details) t.upsert(rid, { collection: "rb.rb3.player.order" }, order)
    else {
        ordersSaved.experience = order.experience

        function isCleared(orderIndex: number): boolean {
            return ordersSaved.details?.find(o => o.index == orderIndex)?.clearedCount > 0
        }
        function addClearedCount(orderIndex: number, clearedCount: number, fragmentsCount: number, fragmentsCount1: number = 0, slot: number = -1): void {
            let order = ordersSaved.details?.find(o => o.index == orderIndex)
            if (!order) {
                order = {
                    index: orderIndex,
                    clearedCount: clearedCount,
                    fragmentsCount0: fragmentsCount,
                    fragmentsCount1: fragmentsCount1,
                    slot: slot,
                    param: 1
                }
                if (!ordersSaved.details) ordersSaved.details = []
                ordersSaved.details.push(order)
            } else {
                order.clearedCount += clearedCount
                order.fragmentsCount0 += fragmentsCount
                order.fragmentsCount1 += fragmentsCount1
                order.slot = slot
            }
        }
        function setEquipExp(index: number, season: number, experience: number): void {
            const e = equips.find(e => e.index === index && e.stype === season) ?? {
                collection: "rb.rb3.player.equip",
                index: index,
                stype: season,
                experience: 0
            }
            e.experience = experience
            changedEquips.push(e)
        }

        if (order.details) {
            for (const o of order.details) {
                ordersSaved.experience += 2788 // amount of order complete experience
                switch (o.index) { // mark online matching orders as completed
                    case 2:
                        if (!isCleared(o.index)) {
                            stamp.ticketCount[currentVersion - 1] += 3
                            addClearedCount(o.index, 1, 1)
                        } // the first matching order cannot be accepted again
                        break
                    case 34:
                        if (!isCleared(o.index)) stamp.ticketCount[currentVersion - 1] += 5
                        else stamp.ticketCount[currentVersion - 1] += 2
                        addClearedCount(o.index, 1, 12)
                        break
                    case 35:
                        if (!isCleared(o.index)) stamp.ticketCount[currentVersion - 1] += 6
                        else stamp.ticketCount[currentVersion - 1] += 3
                        addClearedCount(o.index, 1, 12)
                        break
                    case 36:
                        if (!isCleared(o.index)) stamp.ticketCount[currentVersion - 1] += 7
                        else stamp.ticketCount[currentVersion - 1] += 4
                        addClearedCount(o.index, 1, 14)
                        break
                    case 135: case 136: case 137: case 138: case 139: case 140: case 141:
                        if (!isCleared(o.index)) stamp.ticketCount[currentVersion - 1] += 3
                        else stamp.ticketCount[currentVersion - 1] += 2
                        addClearedCount(o.index, 1, 15)
                        break
                    // start of seasonal equips / inventories
                    // winter ver.
                    case 42:
                        if (!isCleared(o.index)) {
                            setEquipExp(0, 0, 12)
                            addClearedCount(o.index, 1, 14)
                        } // orders about equipments cannot be accepted again
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
                        if (!isCleared(o.index) && stageLogs.some(l => l.musicId >= 314 && l.musicId <= 364)) playerBase.hiddenParam[14] += 3 // summer ver. inventory: golden lure
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
                    case 174:
                        if (!isCleared(o.index) && stageLogs && stageLogs[stageLogs.length - 1].chartType >= 2) {
                            stamp.ticketCount[currentVersion - 1] += 3
                            addClearedCount(o.index, 1, 20)
                        }
                        break
                    case 176:
                        if (!isCleared(o.index) && stageLogs?.some(l => l.musicId == 73 || l.musicId == 387)) { // Anisakis -somatic mutation type"Forza"- || 終焔のClaudia
                            newReleases.push({
                                collection: "rb.rb3.player.releasedInfo",
                                type: 7,
                                id: 82,
                                param: 0,
                                insertTime: Date.now()
                            })
                            addClearedCount(o.index, 1, 20)
                        }
                        break
                    default:
                        addClearedCount(o.index, o.clearedCount, o.fragmentsCount0, o.fragmentsCount1, o.slot)
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
