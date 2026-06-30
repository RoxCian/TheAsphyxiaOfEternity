import { H } from "../../utils/handler"
import { XF } from "../../utils/x"
import { DBH } from "../../utils/db/dbh"
import { readPlayerPostProcess, writePlayerPreProcess } from "./processing"
import { StageLogManager } from "../shared_game/stage_log_manager"
import { Rb2PlayerStart, Rb2PlayerSucceed } from "../../models/rb2/common"
import { Rb2Glass, Rb2LincleLink, Rb2MusicRecord, Rb2MusicRecordElement, Rb2Mylist, Rb2Player, Rb2PlayerBase, Rb2PlayerCustom, Rb2PlayerReleasedInfo, Rb2PlayerStat } from "../../models/rb2/profile"
import { Rb2EventStatus } from "../../models/rb2/event"
import { RbStageLogStandalone } from "../../models/shared/stage_log"
import { findPlayerFromOtherVersion } from "../shared_game/find_player"
import { convertToRb2ClearType, findAllBestMusicRecord } from "../shared_game/find_music_record"
import { generateUserId } from "../shared_game/generate_user_id"
import { createAddLobbyHandler, createReadLobbyHandler, createDeleteLobbyHandler } from "../shared_game/lobby"
import { createReadCommentHandler, createWriteCommentHandler } from "../shared_game/comment"
import { Rb1ChartType } from "../../models/shared/rb_types"
import { RbPlayerRead } from "../../models/shared/common"
import { createSession, getSession, removeSession } from "../shared_game/session"
import { hasAny, toFullWidth } from "../../utils/utility_functions"

export function registerRb2Handlers() {
    H.route("read.info?model=LBR", readInfo)
    H.route("player.start?model=LBR", startPlayer)
    H.route("player.succeed?model=LBR", succeedPlayer)
    H.route("player.read?model=LBR", readPlayer)
    H.route("player.write?model=LBR", writePlayer)
    H.route("player.end?model=LBR", endPlayer)
    H.route("log.play?model=LBR", logPlay)
    H.route("event_w.update_status?model=LBR", updateEventStatus)
    H.route("lobby.entry?model=LBR", createAddLobbyHandler(2))
    H.route("lobby.read?model=LBR", createReadLobbyHandler(2))
    H.route("lobby.delete?model=LBR", createDeleteLobbyHandler(2))
    H.route("event_r.get_all?model=LBR", createReadCommentHandler(2))
    H.route("event_w.add_comment?model=LBR", createWriteCommentHandler(2))
}

const readInfo: H.H = () => H.success

const startPlayer: H.H = async data => {
    const rid = $(data).str("rid")
    const session = await createSession(rid, 2)
    if (!session) return H.deny
    const start = new Rb2PlayerStart(session.sessionId)
    // Lincle Link with IIDX
    const lincleLink = await DBH.findOne(rid, Rb2LincleLink, { collection: "rb.rb2.player.lincleLink" }, true)
    start.lincleLink = lincleLink
    // Append Travel with jubeat
    const clocheUnlock = new Rb2PlayerReleasedInfo()
    clocheUnlock.id = 164
    start.unlockItem = { item: [clocheUnlock] }
    return XF.x(start)
}

const succeedPlayer: H.H = async data => {
    const rid = $(data).str("rid")
    const base = await DBH.findOne(rid, Rb2PlayerBase, { collection: "rb.rb2.player.base" }, true)
    const result = new Rb2PlayerSucceed()
    if (!base) return XF.x(result)

    const released = await DBH.find(rid, Rb2PlayerReleasedInfo, { collection: "rb.rb2.player.releasedInfo" })
    const record = await DBH.find(rid, Rb2MusicRecord, { collection: "rb.rb2.playData.musicRecord" })
    result.name = toFullWidth(base.name.toUpperCase())
    result.lv = base.level
    result.exp = base.experience
    result.grd = base.matchingGrade
    result.ap = base.abilityPointTimes100
    if (released.length > 0) result.released = { i: released }
    result.addMusicRecords(record)
    return XF.x(result)
}

const readPlayer: H.H<RbPlayerRead> = async data => {
    const read = XF.o(data, RbPlayerRead)
    const result = new Rb2Player(read.rid)
    const base = await DBH.findOne(read.rid, Rb2PlayerBase, { collection: "rb.rb2.player.base" }, true)
    result.rid = read.rid
    if (!base) {
        const player = await findPlayerFromOtherVersion(read.rid, 2)
        if (!player) return H.deny
        result.pdata.base.userId = player.userId
        result.pdata.base.name = player.name
        if (player) {
            const scores = await pullMusicRecords(read.rid, true)
            if (scores.length > 0) result.pdata.record.rec = scores
        }
        return XF.x(result)
    }
    const stat = await DBH.findOne(read.rid, Rb2PlayerStat, { collection: "rb.rb2.player.stat" }, true)
    const custom = await DBH.findOne(read.rid, Rb2PlayerCustom, { collection: "rb.rb2.player.custom" }, true)
    const released = await DBH.find(read.rid, Rb2PlayerReleasedInfo, { collection: "rb.rb2.player.releasedInfo" })
    const glass = await DBH.find(read.rid, Rb2Glass, { collection: "rb.rb2.player.glass" })
    const mylist = await DBH.findOne(read.rid, Rb2Mylist, { collection: "rb.rb2.player.mylist" }, true)
    const scores = await pullMusicRecords(read.rid)

    if (base.level > 1) custom.isBeginner = false
    if (base.playCount > 3) custom.isTutorialEnabled = false

    // Append Travel, jubeat glass
    if ((scores.find(i => i.musicId === 164)?.newRecord?.playCount ?? 0) > 0 && !glass.find(g => g.id === 21)) {
        glass.push(new Rb2Glass(21))
    }
    if (scores.filter(i => [157, 158, 159].includes(i.musicId)).find(i => i.newRecord.playCount > 0) && !glass.find(g => g.id === 22)) {
        glass.push(new Rb2Glass(22))
    }
    if (scores.filter(i => [161, 163].includes(i.musicId)).find(i => i.newRecord.playCount > 0) && !glass.find(g => g.id === 23)) {
        glass.push(new Rb2Glass(23))
    }
    // Glasses of customizable items
    if (!glass.find(g => g.id === 24)) glass.push(new Rb2Glass(24))
    if (!glass.find(g => g.id === 25)) glass.push(new Rb2Glass(25))

    result.pdata.comment = base.comment || "Enjoy limelight world!"
    result.pdata.base = base
    result.pdata.stat = stat
    result.pdata.custom = custom
    if (released.length > 0) result.pdata.released.info = released
    if (scores.length > 0) result.pdata.record.rec = scores
    if (glass.length > 0) result.pdata.glass.g = glass
    result.pdata.mylist = mylist
    
    await readPlayerPostProcess(result)
    return XF.x(result)
}

const writePlayer: H.H<Rb2Player> = async data => {
    const player = XF.o(data, Rb2Player)
    if (!await getSession(player.rid, 2)) return H.deny
    await writePlayerPreProcess(player)
    await writePlayerCore(player)
    return {
        uid: K.ITEM("s32", player.pdata.base.userId),
        time: K.ITEM("s32", Math.trunc(Date.now() / 1000))
    }
}

const endPlayer: H.H = async data => {
    const rid = $(data).str("rid")
    await removeSession(rid, 2)
    return H.success
}

const logPlay: H.H<RbStageLogStandalone> = async data => {
    const log = XF.o(data, RbStageLogStandalone)
    StageLogManager.pushStandaloneStageLog(log, 2)
    StageLogManager.update()
    return H.success
}

const updateEventStatus: H.H<Rb2EventStatus> = async data => {
    const status = XF.o(data, Rb2EventStatus)
    await DBH.upsert({ collection: "rb.rb2.player.event.status#userId", userId: status.userId }, status)
    return H.success
}

async function writePlayerCore(player: Rb2Player) {
    const rid = player.rid
    if (!rid) throw new Error("rid is empty")

    const t = new DBH.T()
    const baseQuery: Query<Rb2PlayerBase> = { collection: "rb.rb2.player.base" }
    const baseSaved: Rb2PlayerBase | undefined = await t.findOne(player.rid, baseQuery)
    if (!baseSaved) {
        const rbPlayer = await findPlayerFromOtherVersion(rid, 2)
        if (rbPlayer) player.pdata.base.userId = rbPlayer.userId
        else player.pdata.base.userId = await generateUserId()
        const isPlayed = hasAny(player.pdata.stageLogs?.log)
        player.pdata.base.playCount = isPlayed ? 1 : 0
        t.upsert(rid, baseQuery, player.pdata.base)
    } else {
        if (baseSaved.playCount == undefined) baseSaved.playCount = 1
        else baseSaved.playCount++

        if (player.pdata.base) {
            if (baseSaved.name) player.pdata.base.name = baseSaved.name
            player.pdata.base.comment = baseSaved.comment
            player.pdata.base.playCount = baseSaved.playCount
            t.upsert(rid, baseQuery, player.pdata.base)
        } else t.upsert(rid, baseQuery, baseSaved)
    }

    if (player.pdata.custom) t.upsert(rid, { collection: "rb.rb2.player.custom" }, player.pdata.custom)
    if (player.pdata.stat) t.upsert(rid, { collection: "rb.rb2.player.stat" }, player.pdata.stat)
    if (hasAny(player.pdata.stageLogs?.log)) for (const l of player.pdata.stageLogs.log) StageLogManager.pushStageLog(rid, player.pdata.base.userId, l, 2)
    if (hasAny(player.pdata.record?.rec)) for (const r of player.pdata.record.rec) updateMusicRecord(rid, r, t)
    if (hasAny(player.pdata.released?.info)) for (const i of player.pdata.released.info) t.upsert(rid, { collection: "rb.rb2.player.releasedInfo", type: i.type, id: i.id }, i)
    if (player.pdata.stageLogs?.log?.find(l => l.musicId === 164) && !player.pdata.glass.g?.find(g => g.id === 21)) {
        // Append Travel, jubeat glass 1. If you played cloche, the jubeat glass 1 should be unlocked
        player.pdata.glass ??= { g: [] }
        player.pdata.glass.g ??= []
        player.pdata.glass.g.push(new Rb2Glass(21))
    }
    if ((player.pdata.glass.g?.find(g => g.id === 21)?.experience ?? 0) >= 2500 && !player.pdata.glass.g?.find(g => g.id === 22)) {
        // Append Travel, jubeat glass 2. If you played any music unlocked in jubeat glass 1, the jubeat glass 2 should be unlocked
        const record = await DBH.findOne<Rb2MusicRecord>(rid, { collection: "rb.rb2.playData.musicRecord", musicId: { $in: [157, 158, 159] }, newRecord: { playCount: { $gt: 0 } } })
        if (record) {
            player.pdata.glass ??= { g: [] }
            player.pdata.glass.g ??= []
            player.pdata.glass.g.push(new Rb2Glass(22))
        }
    }
    if ((player.pdata.glass.g?.find(g => g.id === 22)?.experience ?? 0) >= 6000 && !player.pdata.glass.g?.find(g => g.id === 23)) {
        // Append Travel, jubeat glass 3. If you played any music unlocked in jubeat glass 2, the jubeat glass 3 should be unlocked
        const record = await DBH.findOne<Rb2MusicRecord>(rid, { collection: "rb.rb2.playData.musicRecord", musicId: { $in: [161, 163] } })
        if (record) {
            player.pdata.glass ??= { g: [] }
            player.pdata.glass.g ??= []
            player.pdata.glass.g.push(new Rb2Glass(23))
        }
    }
    if (hasAny(player.pdata.glass?.g)) for (const g of player.pdata.glass.g) t.upsert(rid, { collection: "rb.rb2.player.glass", id: g.id }, g)
    if (hasAny(player.pdata.mylist?.slot)) t.upsert(rid, { collection: "rb.rb2.player.mylist" }, player.pdata.mylist)
    if (player.pdata.lincleLink) t.upsert(rid, { collection: "rb.rb2.player.lincleLink" }, player.pdata.lincleLink)

    await t.commit()
}

async function updateMusicRecord(rid: string, update: Rb2MusicRecord, t: DBH.T): Promise<void> {
    const query: Query<Rb2MusicRecord> = { collection: "rb.rb2.playData.musicRecord", musicId: update.musicId, chartType: update.chartType }
    const record = await t.findOne(rid, query)

    if (!record) {
        t.upsert(rid, query, update)
        update.newRecord.playCount++
        return
    }
    if (record.newRecord.clearType < update.newRecord.clearType) {
        record.newRecord.clearType = update.newRecord.clearType
    }
    if (record.newRecord.achievementRateTimes10 < update.newRecord.achievementRateTimes10) {
        record.newRecord.achievementRateTimes10 = update.newRecord.achievementRateTimes10
    }
    if (record.newRecord.score < update.newRecord.score) {
        record.newRecord.score = update.newRecord.score
    }
    if (record.newRecord.combo < update.newRecord.combo) {
        record.newRecord.combo = update.newRecord.combo
    }
    if ((record.newRecord.missCount < 0 && update.newRecord.missCount >= 0) || (update.newRecord.missCount >= 0 && record.newRecord.missCount > update.newRecord.missCount)) {
        record.newRecord.missCount = update.newRecord.missCount
    }
    record.newRecord.winCount = update.newRecord.winCount
    record.newRecord.drawCount = update.newRecord.drawCount
    record.newRecord.loseCount = update.newRecord.loseCount
    record.point = update.point

    record.time = update.time
    record.newRecord.playCount++
    t.upsert(rid, query, record)
}

async function pullMusicRecords(rid: string, isAlwaysCreateRecord: boolean = false): Promise<Rb2MusicRecord[]> {
    const result = await DBH.find(rid, Rb2MusicRecord, { collection: "rb.rb2.playData.musicRecord" })
    const bestRecords = await findAllBestMusicRecord(rid, 2)
    for (const bestRecord of bestRecords) {
        const currentRecord = isAlwaysCreateRecord ? new Rb2MusicRecord(bestRecord.musicId, bestRecord.chartType as Rb1ChartType) : (result.find(r => r.musicId === bestRecord.musicId && r.chartType === bestRecord.chartType) ?? new Rb2MusicRecord(bestRecord.musicId, bestRecord.chartType as Rb1ChartType))
        currentRecord.oldRecord.winCount = bestRecord.winCount
        currentRecord.oldRecord.drawCount = bestRecord.drawCount
        currentRecord.oldRecord.loseCount = bestRecord.loseCount
        currentRecord.oldRecord.score = bestRecord.score
        currentRecord.oldRecord.clearType = convertToRb2ClearType(bestRecord.clearType)
        currentRecord.oldRecord.achievementRateTimes10 = Math.trunc(bestRecord.achievementRateTimes100 / 10)
        currentRecord.oldRecord.combo = bestRecord.combo
        currentRecord.oldRecord.missCount = bestRecord.missCount
        currentRecord.oldRecord.playCount = bestRecord.playCount
        result.push(currentRecord)
    }
    return result
}
