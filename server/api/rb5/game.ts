import { H } from "../../utils/handler"
import { XF } from "../../utils/x"
import { DBH } from "../../utils/db/dbh"
import { Rb5Classcheck } from "../../models/rb5/classcheck"
import { Rb5MusicOldRecord, Rb5MusicRecord, Rb5MusicRecords } from "../../models/rb5/music_record"
import { Rb5Mylist } from "../../models/rb5/mylist"
import { Rb5BattleRoyale, Rb5Derby, Rb5Minigame, Rb5MyCourseLog, Rb5Player, Rb5PlayerAccount, Rb5PlayerBase, Rb5PlayerConfig, Rb5PlayerCustom, Rb5PlayerParameters, Rb5PlayerReleasedInfo, Rb5PlayerStageLog } from "../../models/rb5/profile"
import { Rb5ShopInfo } from "../../models/rb5/shop_info"
import { readPlayerPostProcess, writePlayerPreProcess } from "./processing"
import { findPlayerFromOtherVersion } from "../shared_game/find_player"
import { findAllBestMusicRecord, convertToRb4ClearType } from "../shared_game/find_music_record"
import { isToday } from "../../utils/utility_functions"
import { generateUserId } from "../shared_game/generate_user_id"
import { createReadCommentHandler, createWriteCommentHandler } from "../shared_game/comment"
import { createReadLobbyHandler, createDeleteLobbyHandler, createAddLobbyHandler } from "../shared_game/lobby"
import { Rb5PlayerStart } from "../../models/rb5/common"
import { Rb4ChartType, Rb5ClasscheckIndex } from "../../models/shared/rb_types"
import { toBigInt } from "../../utils/db/db_types"
import { RbPlayerRead } from "../../models/shared/common"

export function registerRb5Handlers() {
    H.route("pcb.rb5boot", bootPcb)
    H.route("player.rb5_player_start", startPlayer)
    H.route("player.rb5_player_write", writePlayer)
    H.route("player.rb5_player_write_5", writePlayer2) // VOLZZA 2
    H.route("player.rb5_player_read", readPlayer)
    H.route("player.rb5_player_read_5", readPlayer) // VOLZZA 2
    H.route("player.rb5_player_read_score", readPlayerScore)
    H.route("player.rb5_player_read_score_5", readPlayerScore) // VOLZZA 2
    H.route("player.rb5_player_read_score_old_5", readPlayerScoreOldVersion) // VOLZZA 2
    H.route("lobby.rb5_lobby_entry", createAddLobbyHandler(5))
    H.route("lobby.rb5_lobby_read", createReadLobbyHandler(5))
    H.route("lobby.rb5_lobby_delete", createDeleteLobbyHandler(5))
    H.route("info.rb5pzlcmt_read", createReadCommentHandler(5))
    H.route("info.rb5pzlcmt_write", createWriteCommentHandler(5))
}

const bootPcb: H.H = () => XF.x(new Rb5ShopInfo())

const readHitChartInfo: H.H = () => ({ ver: {} })

const startPlayer: H.H = async data => {
    const rid = $(data).str("rid")
    const account = rid == undefined ? undefined : await DB.FindOne<Rb5PlayerAccount>(rid, { collection: "rb.rb5.player.account" })
    const result = new Rb5PlayerStart(account?.playerId)
    return XF.x(result)
}

const readPlayer: H.H<RbPlayerRead> = async data => {
    const read = XF.o(data, RbPlayerRead)
    const result = new Rb5Player(read.rid)
    const account = await DBH.findOne(read.rid, Rb5PlayerAccount, { collection: "rb.rb5.player.account" })
    if (!account) {
        const rbPlayer = await findPlayerFromOtherVersion(read.rid, 5)
        if (rbPlayer) {
            result.pdata.account.userId = rbPlayer.userId
            result.pdata.base.name = rbPlayer.name
        } else {
            result.pdata.base.name = "RBPlayer"
        }
        await writePlayerCore(result, false)
    } else {
        const base = await DBH.findOne(read.rid, Rb5PlayerBase, { collection: "rb.rb5.player.base" })
        const config = await DBH.findOne(read.rid, Rb5PlayerConfig, { collection: "rb.rb5.player.config" })
        const custom = await DBH.findOne(read.rid, Rb5PlayerCustom, { collection: "rb.rb5.player.custom" })
        const released = await DBH.find(read.rid, Rb5PlayerReleasedInfo, { collection: "rb.rb5.player.releasedInfo" })
        const classcheck = await DBH.find(read.rid, Rb5Classcheck, { collection: "rb.rb5.playData.classcheck" })
        const playerParam = await DBH.find(read.rid, Rb5PlayerParameters, { collection: "rb.rb5.player.parameters" })
        const mylist = await DBH.findOne(read.rid, Rb5Mylist, { collection: "rb.rb5.player.mylist" })
        const minigame = await DBH.findOne(read.rid, Rb5Minigame, { collection: "rb.rb5.playData.minigame" })
        const battleRoyale = await DBH.findOne(read.rid, Rb5BattleRoyale, { collection: "rb.rb5.playData.battleRoyale" }) ?? new Rb5BattleRoyale()
        const derby = await DBH.findOne(read.rid, Rb5Derby, { collection: "rb.rb5.player.derby" })
        const myCourse = await DBH.findOne(read.rid, Rb5MyCourseLog, { collection: "rb.rb5.playData.myCourse" }) ?? new Rb5MyCourseLog()

        account.intrvld ??= 0
        account.succeed ??= true
        account.pst ??= BigInt(0)
        account.st ??= BigInt(0)
        account.opc ??= 0
        account.dayCount ??= 0
        account.playCountToday ??= 0
        if (!isToday(toBigInt(account.st))) account.playCountToday = 1
        else account.playCountToday++
        account.lpc ??= 0
        account.cpc ??= 0
        account.mpc ??= 0
        if (!base.comment) base.comment = "Welcome to REFLEC BEAT VOLZZA!"
        base.abilityPointTimes100 ??= base["averagePrecisionTimes100"] // For compatibility
        base.mlog ??= [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        if (mylist.index < 0) mylist.index = 0
        for (const i of released) i.insertTime ??= Date.now()
        const scores = await DBH.find(read.rid, Rb5MusicRecord, { collection: "rb.rb5.playData.musicRecord" })

        base.totalBestScore = 0
        base.totalBestScoreEachChartType = [0, 0, 0, 0]
        for (const s of scores) {
            base.totalBestScore += s.score
            base.totalBestScoreEachChartType[s.chartType] += s.score
        }
        base.totalBestScoreV2 = base.totalBestScore
        base.totalBestScoreEachChartTypeV2 = base.totalBestScoreEachChartType

        // TODO: Yurukome

        const p = result.pdata

        p.account = account
        p.base = base
        p.config = config
        p.custom = custom
        if (classcheck.length > 0) p.classcheck = { rec: classcheck }
        if (released.length > 0) p.released.info = released
        if (playerParam.length > 0) p.playerParam.item = playerParam
        p.mylist.list = [mylist]
        p.minigame = minigame
        p.battleRoyale = battleRoyale
        p.derby = derby
        p.yurukomeList = [0, 0, 0, 0]
        p.myCourse = myCourse
        p.myCourseF = myCourse
    }
    readPlayerPostProcess(result)
    return XF.x(result)
}
const deletePlayer: H.H = async data => {
    try {
        const rid = $(data).str("rid")
        const account = await DB.FindOne<Rb5PlayerAccount>(rid, { collection: "rb.rb5.player.account" })
        if (!account?.userId) return H.deny
        await DBH.overall(rid, account?.userId, "rb.rb5", "delete")
        return H.success
    } catch (e) {
        console.log((<Error>e).message)
        return H.deny
    }
}

const writePlayer: H.H<Rb5Player> = async data => {
    const player = XF.o(data, Rb5Player)
    await writePlayerPreProcess(player)
    await writePlayerCore(player, false)
    return { uid: K.ITEM("s32", player.pdata.account.userId) }
}

const writePlayer2: H.H<Rb5Player> = async data => {
    const player = XF.o(data, Rb5Player)
    writePlayerPreProcess(player)
    await writePlayerCore(player, true)
    return { uid: K.ITEM("s32", player.pdata.account.userId) }
}

const readPlayerScore: H.H = async data => {
    const rid = $(data).str("rid")
    const result = new Rb5MusicRecords()
    const records = await DBH.find(rid, Rb5MusicRecord, { collection: "rb.rb5.playData.musicRecord" })
    result.pdata.record = records.length > 0 ? { rec: records } : {}
    return XF.x(result)
}

const readPlayerScoreOldVersion: H.H = async data => {
    const rid = $(data).str("rid")
    const result = new Rb5MusicRecords()
    const bestRecords = await findAllBestMusicRecord(rid, 5)
    const oldRecords: Rb5MusicOldRecord[] = []
    for (const b of bestRecords) {
        const o = new Rb5MusicOldRecord(b.musicId, b.chartType as Rb4ChartType)
        o.musicId = b.musicId
        o.chartType = b.chartType as Rb4ChartType
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
        o.version = b.scoreVersion
        oldRecords.push(o)
    }
    result.pdata.recordOld = oldRecords.length > 0 ? { rec: oldRecords } : {}
    return XF.x(result)
}

async function writePlayerCore(player: Rb5Player, isVolzza2: boolean) {
    const rid = player.pdata.account.rid
    if (!rid) throw new Error("rid is empty")

    const t = new DBH.T()
    const accountQuery: Query<Rb5PlayerAccount> = { collection: "rb.rb5.player.account" }
    const accountSaved = await t.findOne(player.pdata.account.rid, accountQuery)

    if (!accountSaved) { // save the new player
        if (player.pdata.account.userId <= 0) player.pdata.account.userId = await generateUserId()
        player.pdata.account.playCount = 0
        player.pdata.account.isFirstFree = true
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
        const baseQuery: Query<Rb5PlayerBase> = { collection: "rb.rb5.player.base" }
        const baseSaved = await t.findOne(rid, baseQuery)
        if (baseSaved) {
            if (baseSaved.name) player.pdata.base.name = baseSaved.name
            player.pdata.base.comment = baseSaved.comment
            player.pdata.base.skillPointTimes10 = baseSaved.skillPointTimes10 // VOLZZA 2
        } else {
            if (player.pdata.base.comment === "Welcome to REFLEC BEAT VOLZZA!") player.pdata.base.comment = ""
        }
        t.upsert(rid, baseQuery, player.pdata.base)
    }
    if (player.pdata.config) t.upsert(rid, { collection: "rb.rb5.player.config" }, player.pdata.config)
    if (player.pdata.custom) {
        const customQuery: Query<Rb5PlayerCustom> = { collection: "rb.rb5.player.custom" }
        if (!isVolzza2) {
            const customSaved = await t.findOne(rid, customQuery)
            if (customSaved) {
                // Don't overwrite VOLZZA 2 configs
                player.pdata.custom.stageSameTimeObjectsDisplayingType = customSaved.stageSameTimeObjectsDisplayingType
                player.pdata.custom.stageScoreDisplayingType = customSaved.stageScoreDisplayingType
                player.pdata.custom.stageBonusType = customSaved.stageBonusType
                player.pdata.custom.stageRivalObjectsDisplayingType = customSaved.stageRivalObjectsDisplayingType
                player.pdata.custom.stageTopAssistDisplayingType = customSaved.stageTopAssistDisplayingType
                player.pdata.custom.stageHighSpeed = customSaved.stageHighSpeed
            }
        }
        t.upsert(rid, customQuery, player.pdata.custom)
    }
    if (player.pdata.stageLogs?.log?.length > 0) for (const i of player.pdata.stageLogs.log) await updateMusicRecordFromStageLog(rid, i, t)
    if (((player.pdata.classcheck as Rb5Classcheck)?.class ?? Rb5ClasscheckIndex.none) > Rb5ClasscheckIndex.none) {
        (player.pdata.classcheck as Rb5Classcheck).totalScore = player.pdata.stageLogs.log[0].score + player.pdata.stageLogs.log[1]?.score + player.pdata.stageLogs.log[2]?.score
        await updateClasscheck(rid, player.pdata.classcheck as Rb5Classcheck, player.pdata.stageLogs.log[player.pdata.stageLogs.log.length - 1].time, t)
    }
    if (player.pdata.released?.info?.length > 0) for (const i of player.pdata.released.info) t.upsert(rid, { collection: "rb.rb5.player.releasedInfo", type: i.type, id: i.id }, i)
    if (player.pdata.playerParam?.item?.length > 0) for (const i of player.pdata.playerParam.item) t.upsert(rid, { collection: "rb.rb5.player.parameters", type: i.type, bank: i.bank }, i)
    if (player.pdata.mylist?.list?.[0]) t.upsert(rid, { collection: "rb.rb5.player.mylist", index: player.pdata.mylist.list[0].index }, player.pdata.mylist.list[0])
    if (player.pdata.minigame) t.upsert(rid, { collection: "rb.rb5.playData.minigame", minigameId: player.pdata.minigame.minigameId }, player.pdata.minigame)
    if (player.pdata.myCourse?.courseId >= 0) t.upsert(rid, { collection: "rb.rb5.playData.myCourse", courseId: player.pdata.myCourse.courseId }, player.pdata.myCourse)
    if (player.pdata.derby) t.upsert(rid, { collection: "rb.rb5.player.derby" }, player.pdata.derby)
    if (player.pdata.battleRoyale) t.upsert(rid, { collection: "rb.rb5.playData.battleRoyale", battleId: player.pdata.battleRoyale.battleId }, player.pdata.battleRoyale)

    await t.commit()
}
async function updateMusicRecordFromStageLog(rid: string, stageLog: Rb5PlayerStageLog, t: DBH.T): Promise<void> {
    const query: Query<Rb5MusicRecord> = { collection: "rb.rb5.playData.musicRecord", musicId: stageLog.musicId, chartType: stageLog.chartType }
    let musicRecord = await t.findOne(rid, query)

    if (!checkRecord(stageLog)) return

    if (!musicRecord) {
        musicRecord = new Rb5MusicRecord(stageLog.musicId, stageLog.chartType)
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

async function updateClasscheck(rid: string, log: Rb5Classcheck, time: number, t: DBH.T): Promise<void> {
    const query: Query<Rb5Classcheck> = { collection: "rb.rb5.playData.classcheck", class: log.class }
    let classRecord = await DB.FindOne(rid, query)
    let isNeedUpdate = false
    let isInitial = false

    if (!classRecord) {
        classRecord = new Rb5Classcheck(log.class)
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
    if (isInitial || (classRecord.totalScore == null) || (log.totalScore > classRecord.totalScore)) {
        isNeedUpdate = true
        classRecord.totalScore = log.totalScore
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

function checkRecord(record: Rb5PlayerStageLog | Rb5MusicRecord): boolean {
    const excFlag = record.achievementRateTimes100 === 10000
    const fcFlag = record.missCount === 0
    if (excFlag && !fcFlag) return false
    return true
}
