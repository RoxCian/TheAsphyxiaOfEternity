import { H } from "../../utils/handler"
import { XF } from "../../utils/x"
import { DBH } from "../../utils/db/dbh"
import { readPlayerPostProcess, writePlayerPreProcess } from "./processing"
import { StageLogManager } from "../shared_game/stage_log_manager"
import { Rb2PlayerStart } from "../../models/rb2/common"
import { Rb2Glass, Rb2LincleLink, Rb2MusicRecord, Rb2Mylist, Rb2Player, Rb2PlayerBase, Rb2PlayerCustom, Rb2PlayerReleasedInfo, Rb2PlayerStat } from "../../models/rb2/profile"
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
import { hasAny } from "../../utils/utility_functions"

export function registerRb2Handlers() {
    H.route("read.info?model=LBR", readInfo)
    H.route("player.start?model=LBR", startPlayer)
    H.route("player.read?model=LBR", readPlayer)
    H.route("player.write?model=LBR", writePlayer)
    H.route("player.end?model=LBR", endPlayer)
    H.route("log.player?model=LBR", logPlayer)
    H.route("event_w.update_status?model=LBR", updateEventStatus)
    H.route("lobby.entry?model=LBR", createAddLobbyHandler(2))
    H.route("lobby.read?model=LBR", createReadLobbyHandler(2))
    H.route("lobby.delete?model=LBR", createDeleteLobbyHandler(2))
    H.route("info.pzlcmt_read?model=LBR", createReadCommentHandler(2))
    H.route("info.pzlcmt_write?model=LBR", createWriteCommentHandler(2))
}

const readInfo: H.H = () => H.success

const startPlayer: H.H = async data => {
    const rid = $(data).str("rid")
    if (!await createSession(rid, 2)) return H.deny
    return XF.x(new Rb2PlayerStart())
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
    const lincleLink = await DBH.findOne(read.rid, Rb2LincleLink, { collection: "rb.rb2.player.lincleLink" }, true)
    const mylist = await DBH.findOne(read.rid, Rb2Mylist, { collection: "rb.rb2.player.mylist" }, true)
    const scores = await pullMusicRecords(read.rid)

    if (base.level > 1) custom.isBeginner = false
    if (base.playCount > 3) custom.isTutorialEnabled = false

    result.pdata.comment = base.comment || "Enjoy limelight world!"
    result.pdata.base = base
    result.pdata.stat = stat
    result.pdata.custom = custom
    if (released.length > 0) result.pdata.released.info = released
    if (scores.length > 0) result.pdata.record.rec = scores
    if (glass.length > 0) result.pdata.glass.g = glass
    result.pdata.lincleLink = lincleLink
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

const logPlayer: H.H<RbStageLogStandalone> = async data => {
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
    if (hasAny(player.pdata.glass?.g)) for (const g of player.pdata.glass.g) t.upsert(rid, { collection: "rb.rb2.player.glass", id: g.id }, g)
    if (hasAny(player.pdata.mylist?.slot)) t.upsert(rid, { collection: "rb.rb2.player.mylist" }, player.pdata.mylist)
    if (player.pdata.lincleLink) t.upsert(rid, { collection: "rb.rb2.player.lincleLink" }, player.pdata.lincleLink)

    await t.commit()
}

async function updateMusicRecord(rid: string, update: Rb2MusicRecord, t: DBH.T): Promise<void> {
    const query: Query<Rb2MusicRecord> = { $and: [{ collection: "rb.rb2.playData.musicRecord" }, { musicId: update.musicId }, { chartType: update.chartType }] }
    const record = await t.findOne(rid, query) ?? new Rb2MusicRecord(update.musicId, update.chartType)

    // new
    record.newRecord.clearType = update.newRecord.clearType
    record.newRecord.achievementRateTimes10 = update.newRecord.achievementRateTimes10
    record.newRecord.score = update.newRecord.score
    record.newRecord.combo = update.newRecord.combo
    record.newRecord.missCount = update.newRecord.missCount
    record.newRecord.winCount = update.newRecord.winCount
    record.newRecord.drawCount = update.newRecord.drawCount
    record.newRecord.loseCount = update.newRecord.loseCount

    record.newRecord.playCount++

    // old // TODO: need recheck
    record.oldRecord.clearType = update.oldRecord.clearType
    record.oldRecord.achievementRateTimes10 = update.oldRecord.achievementRateTimes10
    record.oldRecord.score = update.oldRecord.score
    record.oldRecord.combo = update.oldRecord.combo
    record.oldRecord.missCount = update.oldRecord.missCount
    record.oldRecord.winCount = update.oldRecord.winCount
    record.oldRecord.drawCount = update.oldRecord.drawCount
    record.oldRecord.loseCount = update.oldRecord.loseCount

    t.upsert(rid, query, record)
}

async function pullMusicRecords(rid: string, isAlwaysCreateRecord: boolean = false): Promise<Rb2MusicRecord[]> {
    const result: Rb2MusicRecord[] = []
    const bestRecords = await findAllBestMusicRecord(rid, 2)
    for (const bestRecord of bestRecords) {
        const currentRecord = isAlwaysCreateRecord ? new Rb2MusicRecord(bestRecord.musicId, bestRecord.chartType as Rb1ChartType) : (await DBH.findOne(rid, Rb2MusicRecord, { collection: "rb.rb2.playData.musicRecord", musicId: bestRecord.musicId, chartType: bestRecord.chartType as Rb1ChartType }) ?? new Rb2MusicRecord(bestRecord.musicId, bestRecord.chartType as Rb1ChartType))
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
