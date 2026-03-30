import { H } from "../../utils/handler"
import { XF } from "../../utils/x"
import { DBH } from "../../utils/db/dbh"
import { readPlayerPostProcess, writePlayerPreProcess } from "./processing"
import { Rb1PlayerStart } from "../../models/rb1/common"
import { Rb1MusicRecord, Rb1Player, Rb1PlayerBase, Rb1PlayerCustom, Rb1PlayerReleasedInfo, Rb1PlayerStat } from "../../models/rb1/profile"
import { RbStageLogStandalone } from "../../models/shared/stage_log"
import { findPlayerFromOtherVersion } from "../shared_game/find_player"
import { generateUserId } from "../shared_game/generate_user_id"
import { StageLogManager } from "../shared_game/stage_log_manager"
import { createAddLobbyHandler, createReadLobbyHandler, createDeleteLobbyHandler } from "../shared_game/lobby"
import { RbPlayerRead } from "../../models/shared/common"
import { createSession, getSession, removeSession } from "../shared_game/session"

export function registerRb1Handlers() {
    H.route("player.start?model=KBR", startPlayer)
    H.route("player.read?model=KBR", readPlayer)
    H.route("player.write?model=KBR", writePlayer)
    H.route("player.end?model=KBR", endPlayer)
    H.route("log.player?model=KBR", logPlayer)
    H.route("lobby.entry?model=KBR", createAddLobbyHandler(1))
    H.route("lobby.read?model=KBR", createReadLobbyHandler(1))
    H.route("lobby.delete?model=KBR", createDeleteLobbyHandler(1))
}

const startPlayer: H.H = async data => {
    const rid = $(data).str("rid")
    if (!await createSession(rid, 1)) return H.deny
    return XF.x(new Rb1PlayerStart())
}

const readPlayer: H.H<RbPlayerRead> = async data => {
    const read = XF.o(data, RbPlayerRead)
    const result = new Rb1Player(read.rid)
    const base = await DBH.findOne<Rb1PlayerBase>(read.rid, Rb1PlayerBase, { collection: "rb.rb1.player.base" })
    if (!base) {
        const rbPlayer = await findPlayerFromOtherVersion(read.rid, 1)
        if (!rbPlayer) {
            result.pdata.base.userId = rbPlayer.userId
            result.pdata.base.name = rbPlayer.name
        } else {
            result.pdata.base.name = "RBPlayer"
        }
        await writePlayerCore(result)
    } else {
        if (base.level > 5) base.tutorialFlag = 0
        const stat = await DBH.findOne(read.rid, Rb1PlayerStat, { collection: "rb.rb1.player.stat" })
        const custom = await DBH.findOne(read.rid, Rb1PlayerCustom, { collection: "rb.rb1.player.custom" })
        const released = await DBH.find(read.rid, Rb1PlayerReleasedInfo, { collection: "rb.rb1.player.releasedInfo" })

        const scores = await DBH.find(read.rid, Rb1MusicRecord, { collection: "rb.rb1.playData.musicRecord" })

        result.pdata.comment = ((base.comment == undefined) || (base.comment == "")) ? "Welcome to REFLEC BEAT!" : base.comment
        result.pdata.base = base
        result.pdata.custom = custom
        result.pdata.released = { info: released.length > 0 ? released : undefined }
        result.pdata.record = { rec: scores.length > 0 ? scores : undefined }
        result.pdata.stat = stat
    }
    await readPlayerPostProcess(result)
    return XF.x(result)
}
const writePlayer: H.H<Rb1Player> = async data => {
    const player = XF.o(data, Rb1Player)
    if (!await getSession(player.rid, 1)) return H.deny
    await writePlayerPreProcess(player)
    await writePlayerCore(player)
    return { uid: K.ITEM("s32", player.pdata.base.userId) }
}
const endPlayer: H.H = async data => {
    const rid = $(data).str("rid")
    await removeSession(rid, 1)
    return H.success
}
const logPlayer: H.H<RbStageLogStandalone> = async data => {
    const log = XF.o(data, RbStageLogStandalone)
    StageLogManager.pushStandaloneStageLog(log, 1)
    StageLogManager.update()
    return H.success
}

async function writePlayerCore(player: Rb1Player) {
    const rid = player.rid
    if (!rid) throw new Error("rid is empty")

    const t = new DBH.T()
    const baseQuery: Query<Rb1PlayerBase> = { collection: "rb.rb1.player.base" }
    const baseSaved: Rb1PlayerBase = await t.findOne(player.rid, baseQuery)
    if (!baseSaved) { // after a new player set their name, the save procedure will be triggered, so skip saving player base here
        if (player.pdata.base.userId <= 0) player.pdata.base.userId = await generateUserId()
        player.pdata.base.playCount = 0
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

    if (player.pdata.custom) t.upsert(rid, { collection: "rb.rb1.player.custom" }, player.pdata.custom)
    if (player.pdata.stat) t.upsert(rid, { collection: "rb.rb1.player.stat" }, player.pdata.stat)
    if (player.pdata.stageLogs.log?.length > 0) for (const l of player.pdata.stageLogs.log) StageLogManager.pushStageLog(rid, player.pdata.base.userId, l, 1)
    if (player.pdata.record.rec?.length > 0) for (const r of player.pdata.record.rec) await updateMusicRecord(rid, r, t)
    if (player.pdata.released.info?.length > 0) for (const i of player.pdata.released.info) t.upsert(rid, { collection: "rb.rb1.player.releasedInfo", type: i.type, id: i.id }, i)

    await t.commit()
}

async function updateMusicRecord(rid: string, newRecord: Rb1MusicRecord, t: DBH.T) {
    const query: Query<Rb1MusicRecord> = { collection: "rb.rb1.playData.musicRecord", musicId: newRecord.musicId, chartType: newRecord.chartType }
    const oldRecord = await t.findOne(rid, query) ?? new Rb1MusicRecord(newRecord.musicId, newRecord.chartType)
    oldRecord.clearType = newRecord.clearType
    oldRecord.achievementRateTimes10 = newRecord.achievementRateTimes10
    oldRecord.score = newRecord.score
    oldRecord.combo = newRecord.combo
    oldRecord.missCount = newRecord.missCount
    oldRecord.winCount = newRecord.winCount
    oldRecord.drawCount = newRecord.drawCount
    oldRecord.loseCount = newRecord.loseCount

    oldRecord.playCount++
    t.upsert(rid, query, oldRecord)
}
