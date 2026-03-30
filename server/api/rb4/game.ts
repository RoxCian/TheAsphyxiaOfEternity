import { H } from "../../utils/handler"
import { XF } from "../../utils/x"
import { DBH } from "../../utils/db/dbh"
import { Rb4MusicOldRecord, Rb4MusicRecord, Rb4MusicRecords } from "../../models/rb4/music_record"
import { Rb4Mylist } from "../../models/rb4/mylist"
import { Rb4Episode, Rb4Episodes, Rb4Player, Rb4PlayerAccount, Rb4PlayerBase, Rb4PlayerConfig, Rb4PlayerCustom, Rb4PlayerParameters, Rb4PlayerReleasedInfo, Rb4PlayerStageLog, Rb4Quest, Rb4Stamp } from "../../models/rb4/profile"
import { Rb4ShopInfo } from "../../models/rb4/shop_info"
import { readPlayerPostProcess, writePlayerPreProcess } from "./processing"
import { findPlayerFromOtherVersion } from "../shared_game/find_player"
import { findAllBestMusicRecord, convertToRb4ClearType } from "../shared_game/find_music_record"
import { isToday, shiftjisToUtf8 } from "../../utils/utility_functions"
import { generateUserId } from "../shared_game/generate_user_id"
import { toBigInt } from "../../utils/db/db_types"
import { Rb4PlayerStart, Rb4PlayerSucceed } from "../../models/rb4/common"
import { isArrayWrapper } from "../../utils/types"
import { Rb4Classcheck } from "../../models/rb4/classcheck"
import { Rb4ChartType, Rb4ClearType, Rb4DojoIndex } from "../../models/shared/rb_types"
import { createAddLobbyHandler, createDeleteLobbyHandler, createReadLobbyHandler } from "../shared_game/lobby"
import { createReadCommentHandler, createWriteCommentHandler } from "../shared_game/comment"
import { RbPlayerRead } from "../../models/shared/common"
import { isNewMusic } from "../../data/tables/rb_music_id"
import { createSession, getSession, removeSession } from "../shared_game/session"

export function registerRb4Handlers() {
    H.route("pcb.rb4boot", bootPcb)
    H.route("player.rb4start", startPlayer)
    H.route("player.rb4succeed", succeedPlayer)
    H.route("player.rb4read", readPlayer)
    H.route("player.rb4write", writePlayer)
    H.route("player.rb4end", endPlayer)
    H.route("player.rb4readepisode", readEpisode)
    H.route("player.rb4readscore", readPlayerScore)
    H.route("lobby.rb4entry", createAddLobbyHandler(4))
    H.route("lobby.rb4read", createReadLobbyHandler(4))
    H.route("lobby.rb4delete", createDeleteLobbyHandler(4))
    H.route("info.rb4pzlcmt_read", createReadCommentHandler(4))
    H.route("info.rb4pzlcmt_write", createWriteCommentHandler(4))
}

const bootPcb: H.H = () => XF.x(new Rb4ShopInfo())

const readHitChartInfo: H.H = () => ({ ver: {} })

const succeedPlayer: H.H = async data => {
    const rid = $(data).str("rid")
    const rbPlayer = await findPlayerFromOtherVersion(rid, 4)
    const result = new Rb4PlayerSucceed()
    if (rbPlayer) {
        const player = await DBH.findOne(rid, Rb4PlayerBase, { collection: "rb.rb4.player.base" })
        const released = await DBH.find(rid, Rb4PlayerReleasedInfo, { collection: "rb.rb4.player.releasedInfo" })
        const record = await DBH.find(rid, Rb4MusicRecord, { collection: "rb.rb4.playData.musicRecord" })
        result.name = player.name
        result.lv = 0
        result.exp = 0
        result.grd = 0
        result.ap = 0
        result.money = 0
        if (released.length > 0) result.released.i = released
        if (record.length > 0) result.mrecord.mrec = record
    }
    return XF.x(result)
}
const startPlayer: H.H = async data => {
    const rid = $(data).str("rid")
    if (rid && !await createSession(rid, 4)) return H.deny
    const account = rid == undefined ? undefined : await DB.FindOne<Rb4PlayerAccount>(rid, { collection: "rb.rb4.player.account" })
    const result = new Rb4PlayerStart(account?.playerId)
    return XF.x(result)
}
const readPlayer: H.H<RbPlayerRead> = async data => {
    const read = XF.o(data, RbPlayerRead)
    if (!read.rid) return H.success
    const result = new Rb4Player(read.rid)
    const account = await DBH.findOne(read.rid, Rb4PlayerAccount, { collection: "rb.rb4.player.account" })
    if (!account) {
        const rbPlayer = await findPlayerFromOtherVersion(read.rid, 4)
        if (rbPlayer) {
            result.pdata.account.userId = rbPlayer.userId
            result.pdata.base.name = rbPlayer.name
        } else {
            result.pdata.base.name = "RBPlayer"
        }
        await writePlayerCore(result)
    } else {
        const base = await DBH.findOne(read.rid, Rb4PlayerBase, { collection: "rb.rb4.player.base" })
        const config = await DBH.findOne(read.rid, Rb4PlayerConfig, { collection: "rb.rb4.player.config" })
        const custom = await DBH.findOne(read.rid, Rb4PlayerCustom, { collection: "rb.rb4.player.custom" })
        const stamp = await DBH.findOne(read.rid, Rb4Stamp, { collection: "rb.rb4.player.stamp" })
        const released = await DBH.find(read.rid, Rb4PlayerReleasedInfo, { collection: "rb.rb4.player.releasedInfo" })
        const classcheck = await DBH.find(read.rid, Rb4Classcheck, { collection: "rb.rb4.playData.classcheck" })
        const playerParam = await DBH.find(read.rid, Rb4PlayerParameters, { collection: "rb.rb4.player.parameters" })
        const mylist = await DBH.findOne(read.rid, Rb4Mylist, { collection: "rb.rb4.player.mylist" })
        const quest = await DBH.findOne(read.rid, Rb4Quest, { collection: "rb.rb4.player.quest" }) ?? new Rb4Quest()
        const episodes = await DBH.find(Rb4Episode, { collection: "rb.rb4.player.episode#userId", userId: account.userId })

        account.intrvld ??= 0
        account.succeed ??= true
        account.pst ??= BigInt(0)
        account.st ??= BigInt(0)
        if (!isToday(toBigInt(account.st))) account.playCountToday = 1
        else account.playCountToday = (account.playCountToday ?? 0) + 1
        account.opc ??= 0
        account.lpc ??= 0
        account.cpc ??= 0
        account.mpc ??= 0
        if (!base.comment) base.comment = "Welcome to REFLEC BEAT groovin'!"
        base.uattr ??= 0
        base.mlog ??= [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        if ((mylist?.index ?? -1) < 0) mylist.index = 0

        const scores = await DB.Find<Rb4MusicRecord>(read.rid, { collection: "rb.rb4.playData.musicRecord" })

        base.totalBestScore = 0
        base.totalBestScoreRival = 0
        base.totalBestScoreEachChartType = [0, 0, 0, 0]
        base.totalBestScoreEachChartTypeRival = [0, 0, 0, 0]
        base.totalBestScoreNewMusics = 0
        base.totalBestScoreNewMusicsRival = 0
        for (const s of scores) {
            base.totalBestScore += s.score
            base.totalBestScoreEachChartType[s.chartType] += s.score
            if (isNewMusic(s.musicId, 4)) base.totalBestScoreNewMusics += s.score
        }

        const p = result.pdata
        p.account = account
        p.base = base
        p.config = config
        p.custom = custom
        p.stamp = stamp
        if (classcheck.length > 0) p.classcheck = { rec: classcheck }
        if (released.length > 0) p.released.info = released
        if (playerParam.length > 0) p.playerParam.item = playerParam
        p.mylist.list = [mylist]
        p.episode.info = episodes
        p.quest = quest
    }
    await readPlayerPostProcess(result)
    return XF.x(result)
}
const writePlayer: H.H<Rb4Player> = async data => {
    const player = XF.o(data, Rb4Player)
    if (!await getSession(player.pdata.account.rid, 4)) return H.deny
    await writePlayerPreProcess(player)
    await writePlayerCore(player)
    return { uid: K.ITEM("s32", player.pdata.account.userId) }
}
const endPlayer: H.H = async data => {
    const rid = $(data).str("rid")
    await removeSession(rid, 4)
    return H.success
}
const readEpisode: H.H = async data => {
    const userId = $(data).number("user_id")
    const episodes = await DBH.find(Rb4Episode, { collection: "rb.rb4.player.episode#userId", userId: userId })
    for (const e of episodes) e.text ??= ""
    const result = new Rb4Episodes()
    result.pdata.episode.info = episodes
    return XF.x(result)
}

const readPlayerScore: H.H = async data => {
    const rid = $(data).str("rid")
    const result = new Rb4MusicRecords()

    const records = await DBH.find(rid, Rb4MusicRecord, { collection: "rb.rb4.playData.musicRecord" })
    if (records.length > 0) result.pdata.record.rec = records
    const bestRecords = await findAllBestMusicRecord(rid, 4)
    const oldRecords: Rb4MusicOldRecord[] = []
    for (const b of bestRecords) {
        const o = new Rb4MusicOldRecord(b.musicId, b.chartType as Rb4ChartType)
        o.playCount = b.playCount
        o.clearType = convertToRb4ClearType(b.clearType, b.gaugeType)
        o.achievementRateTimes100 = b.achievementRateTimes100
        o.score = b.score
        o.combo = b.combo
        o.missCount = b.missCount
        o.param = b.param
        o.bestAchievementRateUpdateTime = b.achievementRateUpdateTime
        o.bestComboUpdateTime = b.comboUpdateTime
        o.bestScoreUpdateTime = b.scoreUpdateTime
        o.bestMissCountUpdateTime = b.missCountUpdateTime
        o.version = b.scoreVersion >= 4 ? 3 : b.scoreVersion
        oldRecords.push(o)
    }
    if (oldRecords.length > 0) result.pdata.recordOld.rec = oldRecords

    return XF.x(result)
}

async function writePlayerCore(player: Rb4Player) {
    const rid = player.pdata.account.rid
    if (!rid) throw new Error("rid is empty")

    const t = new DBH.T()
    const accountQuery: Query<Rb4PlayerAccount> = { collection: "rb.rb4.player.account" }
    const accountSaved = await t.findOne(player.pdata.account.rid, accountQuery)

    if (!accountSaved) { // save the new player
        if (player.pdata.account.userId <= 0) player.pdata.account.userId = await generateUserId()
        player.pdata.account.isFirstFree = true
        if (player.pdata.base) {
            const n = shiftjisToUtf8(player.pdata.base.name)
            if ((n.length == 0) || (n.length > 8) || (n == "-")) player.pdata.base.name = player.pdata.account.userId.toString()
        }
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

        t.update(rid, accountQuery, accountSaved)
    }
    if (player.pdata.base) {
        const baseQuery: Query<Rb4PlayerBase> = { collection: "rb.rb4.player.base" }
        const baseSaved = await t.findOne(rid, baseQuery)
        if (baseSaved) {
            if (baseSaved.name) player.pdata.base.name = baseSaved.name
            player.pdata.base.comment = baseSaved.comment
        } else {
            if (player.pdata.base.comment === "Welcome to REFLEC BEAT groovin!!") player.pdata.base.comment = ""
        }
        t.upsert(rid, baseQuery, player.pdata.base)
    }
    if (player.pdata.config) t.upsert(rid, { collection: "rb.rb4.player.config" }, player.pdata.config)
    if (player.pdata.custom) t.upsert(rid, { collection: "rb.rb4.player.custom" }, player.pdata.custom)
    if (!isArrayWrapper(player.pdata.classcheck, "rec") && (player.pdata.classcheck?.class ?? Rb4DojoIndex.none) > Rb4DojoIndex.none) {
        const musicsId = [player.pdata.stageLogs.log[0].musicId, player.pdata.stageLogs.log[1]?.musicId ?? -1, player.pdata.stageLogs.log[2]?.musicId ?? -1]
        const chartsType = [player.pdata.stageLogs.log[0].chartType, player.pdata.stageLogs.log[1]?.chartType ?? Rb4ChartType.basic, player.pdata.stageLogs.log[2]?.chartType ?? -1 as Rb4ChartType.basic]
        await updateClasscheck(rid, player.pdata.classcheck, player.pdata.stageLogs.log[player.pdata.stageLogs.log.length - 1].time, musicsId, chartsType, t)
        if (player.pdata.classcheck.clearType === 1) { // Stage log mark for webui
            // Classcheck failed
            if (musicsId[1] >= 0) {
                player.pdata.stageLogs.log[0].clearTypeForClasscheck = "Win"
                if (musicsId[2] >= 0) {
                    player.pdata.stageLogs.log[1].clearTypeForClasscheck = "Win"
                    player.pdata.stageLogs.log[2].clearTypeForClasscheck = (player.pdata.stageLogs.log[2].clearType >= Rb4ClearType.clear) ? "Draw" : "Lose"
                } else player.pdata.stageLogs.log[1].clearTypeForClasscheck = (player.pdata.stageLogs.log[1].clearType >= Rb4ClearType.clear) ? "Draw" : "Lose"
            } else player.pdata.stageLogs.log[0].clearTypeForClasscheck = (player.pdata.stageLogs.log[0].clearType >= Rb4ClearType.clear) ? "Draw" : "Lose"
        } else {
            player.pdata.stageLogs.log[0].clearTypeForClasscheck = "Win"
            if (player.pdata.stageLogs.log[1]) player.pdata.stageLogs.log[1].clearTypeForClasscheck = "Win"
            if (player.pdata.stageLogs.log[2]) player.pdata.stageLogs.log[2].clearTypeForClasscheck = "Win"
        }
    }
    if (player.pdata.stageLogs?.log?.length > 0) for (const i of player.pdata.stageLogs.log) await updateMusicRecordFromStageLog(rid, i, t)
    if (player.pdata.released?.info?.length > 0) for (const i of player.pdata.released.info) t.upsert(rid, { collection: "rb.rb4.player.releasedInfo", type: i.type, id: i.id }, i)
    if (player.pdata.playerParam?.item?.length > 0) for (const i of player.pdata.playerParam.item) t.upsert(rid, { collection: "rb.rb4.player.parameters", type: i.type, bank: i.bank }, i)
    if (player.pdata.mylist?.list) for (const l of player.pdata.mylist.list) t.upsert(rid, { collection: "rb.rb4.player.mylist", index: l.index }, l)
    if (player.pdata.quest) await updateQuest(rid, player.pdata.quest, t)
    if (player.pdata.stamp) t.upsert(rid, { collection: "rb.rb4.player.stamp" }, player.pdata.stamp)
    if (player.pdata.episode.info) for (const i of player.pdata.episode.info) t.upsert(undefined, { collection: "rb.rb4.player.episode#userId", type: i.type }, i)

    await t.commit()
}

async function updateClasscheck(rid: string, log: Rb4Classcheck, time: number, musicsId: number[], chartsType: Rb4ChartType[], t: DBH.T) {
    const query: Query<Rb4Classcheck> = { collection: "rb.rb4.playData.classcheck", class: log.class }
    let classRecord = await DB.FindOne(rid, query)
    let isNeedUpdate = false
    let isInitial = false

    if (!classRecord) {
        classRecord = new Rb4Classcheck(log.class)
        isNeedUpdate = true
        isInitial = true
    }
    if (isInitial || (log.clearType > classRecord.clearType)) {
        isNeedUpdate = true
        classRecord.clearType = log.clearType
    }
    if (isInitial || (log.rank > classRecord.rank)) {
        isNeedUpdate = true
        classRecord.rank = log.rank
    }
    if (isInitial || !classRecord.totalScore || (log.totalScore > classRecord.totalScore)) {
        isNeedUpdate = true
        classRecord.totalScore = log.totalScore
        classRecord.seperateScore = log.seperateScore
        classRecord.seperateAchievementRateTimes100 = log.seperateAchievementRateTimes100
        classRecord.musicsId = musicsId
        classRecord.chartsType = chartsType
    }
    if (isInitial || (log.averageAchievementRateTimes100 > classRecord.averageAchievementRateTimes100)) {
        isNeedUpdate = true
        classRecord.averageAchievementRateTimes100 = log.averageAchievementRateTimes100
    }
    classRecord.lastPlayTime = time
    if (isNeedUpdate) classRecord.recordUpdateTime = time
    classRecord.playCount++
    t.upsert(rid, query, classRecord)
}
async function updateMusicRecordFromStageLog(rid: string, stageLog: Rb4PlayerStageLog, t: DBH.T) {
    const query: Query<Rb4MusicRecord> = { collection: "rb.rb4.playData.musicRecord", musicId: stageLog.musicId, chartType: stageLog.chartType }
    let musicRecord = await t.findOne(rid, query)

    if (!checkRecord(stageLog)) return

    if (!musicRecord) {
        musicRecord = new Rb4MusicRecord(stageLog.musicId, stageLog.chartType)
        musicRecord.clearType = stageLog.clearType
        musicRecord.achievementRateTimes100 = stageLog.achievementRateTimes100
        musicRecord.score = stageLog.score
        musicRecord.missCount = stageLog.missCount
        musicRecord.param = stageLog.param
        musicRecord.bestScoreUpdateTime = stageLog.time
        musicRecord.bestMissCountUpdateTime = stageLog.time
        musicRecord.bestAchievementRateUpdateTime = stageLog.time
        musicRecord.bestComboUpdateTime = stageLog.time
    } else {
        if ((musicRecord.param < stageLog.param) || (musicRecord.clearType < stageLog.clearType)) {
            if (musicRecord.param < stageLog.param) musicRecord.param = stageLog.param
            if (musicRecord.clearType < stageLog.clearType) musicRecord.clearType = stageLog.clearType
        }
        if (musicRecord.achievementRateTimes100 < stageLog.achievementRateTimes100) {
            musicRecord.bestAchievementRateUpdateTime = stageLog.time
            musicRecord.achievementRateTimes100 = stageLog.achievementRateTimes100
        }
        if (musicRecord.score < stageLog.score) {
            musicRecord.bestScoreUpdateTime = stageLog.time
            musicRecord.score = stageLog.score
        }
        if ((stageLog.missCount >= 0) && ((musicRecord.missCount > stageLog.missCount) || ((musicRecord.missCount < 0)))) {
            musicRecord.bestMissCountUpdateTime = stageLog.time
            musicRecord.missCount = stageLog.missCount
        }
    }

    musicRecord.time = stageLog.time
    musicRecord.playCount++
    t.upsert(rid, query, musicRecord)
    t.insert(rid, stageLog)
}

async function updateQuest(rid: string, quest: Rb4Quest, t: DBH.T) {
    const questQuery: Query<Rb4Quest> = { collection: "rb.rb4.player.quest" }
    const questSaved = await t.findOne(rid, questQuery)
    quest.comment = questSaved?.comment ?? quest.comment ?? ""
    t.upsert(rid, questQuery, quest)
}

function checkRecord(record: Rb4PlayerStageLog | Rb4MusicRecord): boolean {
    const excFlag = record.achievementRateTimes100 === 10000
    const fcFlag = record.missCount === 0
    if (excFlag && !fcFlag) return false
    return true
}

