import { H } from "../../utils/handler"
import { XF } from "../../utils/x"
import { DBH } from "../../utils/db/dbh"
import { Rb6CharacterCard } from "../../models/rb6/character_card"
import { Rb6Classcheck } from "../../models/rb6/classcheck"
import { Rb6Quest } from "../../models/rb6/quest"
import { Rb6MusicRecord, Rb6MusicRecords } from "../../models/rb6/music_record"
import { Rb6Mylist } from "../../models/rb6/mylist"
import { Rb6Player, Rb6PlayerAccount, Rb6PlayerBase, Rb6PlayerConfig, Rb6PlayerCustom, Rb6PlayerParameters, Rb6PlayerReleasedInfo, Rb6PlayerStageLog, Rb6QuestRecord } from "../../models/rb6/profile"
import { Rb6ShopInfo } from "../../models/rb6/shop_info"
import { readPlayerPostProcess, writePlayerPreProcess } from "./processing"
import { findPlayerFromOtherVersion } from "../shared_game/find_player"
import { isToday } from "../../utils/utility_functions"
import { generateUserId } from "../shared_game/generate_user_id"
import { Rb6MiscSettings } from "../../models/rb6/misc_settings"
import { Rb6PlayerStart, Rb6PlayerSucceed } from "../../models/rb6/common"
import { rb6UnlockItems } from "../../data/tables/rb6_unlock_items"
import { toBigInt } from "../../utils/db/db_types"
import { RbPlayerRead } from "../../models/shared/common"
import { Rb6ChartType, Rb6ClasscheckIndex } from "../../models/shared/rb_types"
import { Rb6JustCollection, Rb6ReadJustCollection, Rb6ReadJustCollectionParameters } from "../../models/rb6/just_collection"
import { Rb6Ghost, Rb6ReadGhost, Rb6ReadGhostParam } from "../../models/rb6/ghost"
import { createReadCommentHandler, createWriteCommentHandler } from "../shared_game/comment"
import { createAddLobbyHandler, createReadLobbyHandler, createDeleteLobbyHandler } from "../shared_game/lobby"

export function registerRb6Handlers() {
    H.route("info.rb6_info_read", readInfo)
    H.route("info.rb6_info_read_hit_chart", readHitChartInfo)
    H.route("pcb.rb6_pcb_boot", bootPcb)
    H.route("player.rb6_player_start", startPlayer)
    H.route("player.rb6_player_read", readPlayer)
    H.route("player.rb6_player_write", writePlayer)
    H.route("player.rb6_player_delete", deletePlayer)
    H.route("player.rb6_player_read_score", readPlayerScore)
    H.route("player.rb6_player_read_jc", readPlayerJustCollections)
    H.route("player.rb6_player_succeed", playerSucceeded)
    H.route("player.rb6_player_read_gs", readGhost)
    H.route("player.rb6_player_read_rank", readRank)
    H.route("lobby.rb6_lobby_entry", createAddLobbyHandler(6))
    H.route("lobby.rb6_lobby_read", createReadLobbyHandler(6))
    H.route("lobby.rb6_lobby_delete_entry", createDeleteLobbyHandler(6))
    // H.route("shop.rb6_shop_write_info", writeShopInfo)
    H.route("info.rb6pzlcmt_read", createReadCommentHandler(6))
    H.route("info.rb6pzlcmt_write", createWriteCommentHandler(6))
}


const bootPcb: H.H = () => XF.x(new Rb6ShopInfo())

const bypassMethod: H.H = () => H.success

const readHitChartInfo: H.H = () => ({ ver: {} })

const readInfo: H.H = () => ({
    sinfo: {
        lid: K.ITEM("str", "ea"),
        nm: K.ITEM("str", "Asphyxia shop"),
        cntry: K.ITEM("str", "Japan"),
        rgn: K.ITEM("str", "1"),
        prf: K.ITEM("s16", 13),
        cl_enbl: K.ITEM("bool", 0),
        cl_h: K.ITEM("u8", 8),
        cl_m: K.ITEM("u8", 0)
    }
})

const playerSucceeded: H.H = async data => {
    const rid = $(data).str("rid")
    const result = new Rb6PlayerSucceed()
    const account = await DB.FindOne<Rb6PlayerAccount>(rid, { collection: "rb.rb6.player.account" })
    if (account) {
        const base = await DB.FindOne<Rb6PlayerBase>(rid, { collection: "rb.rb6.player.base" })
        const released = await DBH.find(rid, Rb6PlayerReleasedInfo, { collection: "rb.rb6.player.releasedInfo" })
        const record = await DBH.find(rid, Rb6MusicRecord, { collection: "rb.rb6.playData.musicRecord" })
        result.name = base.name
        result.lv = 0
        result.exp = 0
        result.grd = base.matchingGrade
        result.ap = base.abilityPointTimes100
        if (released.length > 0) result.released.i = released
        if (record.length > 0) result.mrecord.mrec = record
    }
    return XF.x(result)
}

const startPlayer: H.H = async data => {
    const rid = $(data).str("rid")
    const account = await DB.FindOne<Rb6PlayerAccount>(rid, { collection: "rb.rb6.player.account" })
    const misc = await DB.FindOne<Rb6MiscSettings>(rid, { collection: "rb.rb6.player.misc" })
    const result = new Rb6PlayerStart(account?.playerId ?? -1)
    result.questCtrl.data = await Rb6Quest.createExamples(misc?.rankingQuestIndex ?? 0)
    const today = new Date()
    result.itemCtrl.data = (await rb6UnlockItems).filter(i => {
        if (!i.unlockableTimeStart || !i.unlockableTimeEnd) return true
        let startTime = new Date(today.getFullYear(), i.unlockableTimeStart.month, i.unlockableTimeStart.date)
        let endTime = new Date(today.getFullYear() + (i.unlockableTimeEnd.nextYear ? 1 : 0), i.unlockableTimeEnd.month, i.unlockableTimeEnd.date)
        if (today >= startTime && today <= endTime) return true
        else if (!i.unlockableTimeEnd.nextYear) return false
        startTime = new Date(today.getFullYear() - 1, i.unlockableTimeStart.month, i.unlockableTimeStart.date)
        endTime = new Date(today.getFullYear(), i.unlockableTimeEnd.month, i.unlockableTimeEnd.date)
        return today >= startTime && today <= endTime
    })
    return XF.x(result)
}

const readPlayer: H.H<RbPlayerRead> = async data => {
    const read = XF.o(data, RbPlayerRead)

    const account = await DBH.findOne(read.rid, Rb6PlayerAccount, { collection: "rb.rb6.player.account" })
    const result = new Rb6Player(read.rid)
    if (!account) {
        const rbPlayer = await findPlayerFromOtherVersion(read.rid, 6)
        if (rbPlayer) {
            result.pdata.account.userId = rbPlayer.userId
            result.pdata.base.name = rbPlayer.name
        } else {
            result.pdata.base.name = "RBPlayer"
        }
        await writePlayerCore(result)
        result.pdata.account.playCount = 1
    } else {
        const base = await DBH.findOne(read.rid, Rb6PlayerBase, { collection: "rb.rb6.player.base" })
        const config = await DBH.findOne(read.rid, Rb6PlayerConfig, { collection: "rb.rb6.player.config" })
        const custom = await DBH.findOne(read.rid, Rb6PlayerCustom, { collection: "rb.rb6.player.custom" })
        const classcheck = await DBH.find(read.rid, Rb6Classcheck, { collection: "rb.rb6.playData.classcheck" })
        const characterCards = await DBH.find(read.rid, Rb6CharacterCard, { collection: "rb.rb6.player.characterCard" })
        const releasedInfos = await DBH.find(read.rid, Rb6PlayerReleasedInfo, { collection: "rb.rb6.player.releasedInfo" })
        const param = await DBH.find(read.rid, Rb6PlayerParameters, { collection: "rb.rb6.player.parameters" })
        const mylist = await DBH.findOne(read.rid, Rb6Mylist, { collection: "rb.rb6.player.mylist" })
        const misc = await DB.FindOne<Rb6MiscSettings>(read.rid, { collection: "rb.rb6.player.misc" })
        const questRecords = await DBH.find(read.rid, Rb6QuestRecord, {
            collection: "rb.rb6.playData.quest", $or: [
                { dungeonId: { $ne: 47 } },
                { dungeonId: 47, rankingId: misc?.rankingQuestIndex ?? 0 }
            ]
        })
        if (mylist?.index < 0) mylist.index = 0

        if (!account || !base) throw new Error("no player data for rid=" + read.rid)
        if (characterCards.length < 1) {
            const newCard = new Rb6CharacterCard(0)
            characterCards.push(newCard)
            await DBH.insert(read.rid, newCard)
        }
        account.intrvld ??= 0
        account.succeed ??= true
        account.pst ??= BigInt(0)
        account.st ??= BigInt(0)
        account.opc ??= 0
        account.dayCount ??= 0
        account.playCountToday ??= 0
        if (!isToday(toBigInt(account.st))) account.playCountToday = 1
        else account.playCountToday++
        account.playCount++
        account.lpc ??= 0
        account.cpc ??= 0
        account.mpc ??= 0
        base.comment ||= "Welcome to the land of Reflesia!"
        base.abilityPointTimes100 ??= base["averagePrecisionTimes100"]  // For compatibility
        for (const c of characterCards) if (c.level == undefined) c.level = 0
        base.rankQuestScore = [0, 0, 0]
        base.rankQuestRank = [-1, -1, -1]
        const rankingId = misc?.rankingQuestIndex ?? 0
        const rankQuestRecords = questRecords.filter((q) => (q.dungeonId == 47) && (q.rankingId == rankingId))
        if (rankQuestRecords) for (const r of rankQuestRecords) {
            base.rankQuestScore[r.dungeonGrade] = r.score
            base.rankQuestRank[r.dungeonGrade] = 1
        }

        const scores = await DBH.find(read.rid, Rb6MusicRecord, { collection: "rb.rb6.playData.musicRecord" })

        for (const s of scores) {
            base.totalBestScore += s.score
            base.totalBestScoreEachChartType[s.chartType] += s.score
        }

        const p = result.pdata

        p.account = account
        p.base = base
        p.config = config
        p.custom = custom
        if (classcheck?.length > 0) p.classcheck = { rec: classcheck }
        if (characterCards?.length > 0) p.characterCards.list = characterCards
        if (releasedInfos?.length > 0) p.released.info = releasedInfos
        if (param.length > 0) p.playerParam.item = param
        if (mylist) p.mylist.list = [mylist]
        if (questRecords?.length > 0) p.quest.list = questRecords
        p.ghostWinCount.info = base.ghostWinCount
    }
    readPlayerPostProcess(result)
    return XF.x(result)
}

const deletePlayer: H.H = async data => {
    try {
        const rid = $(data).str("rid")
        const account = await DB.FindOne<Rb6PlayerAccount>(rid, { collection: "rb.rb6.player.account" })
        await DBH.overall(rid, account?.userId, "rb.rb6", "delete")
        return H.success
    } catch (e) {
        console.log((<Error>e).message)
        return H.deny
    }
}

const writePlayer: H.H<Rb6Player> = async data => {
    const player = XF.o(data, Rb6Player)
    await writePlayerPreProcess(player)
    await writePlayerCore(player)
    return { uid: K.ITEM("s32", player.pdata.account.userId) }
}

const readPlayerScore: H.H = async data => {
    const rid = $(data).str("rid")

    const scores = await DBH.find(rid, Rb6MusicRecord, { collection: "rb.rb6.playData.musicRecord" })
    const result = new Rb6MusicRecords()
    if (scores.length > 0) result.pdata.record.rec = scores

    return XF.x(result)
}

const readPlayerJustCollections: H.H<Rb6ReadJustCollectionParameters> = async data => {
    const param = XF.o(data, Rb6ReadJustCollectionParameters)
    const result = new Rb6ReadJustCollection()
    if (param.userId === 1500008 && param.musicId === 1 && param.chartType === Rb6ChartType.hard) {
        result.justcollection.asEmptyData()
        return XF.x(result)
    }
    const element = await DBH.findOne(Rb6JustCollection, { collection: "rb.rb6.playData.justCollection#userId", userId: param.userId, musicId: param.musicId, chartType: param.chartType })
    if (element) {
        result.justcollection.blueData = element.blueData
        result.justcollection.redData = element.redData
    }
    // console.log(JSON.stringify(XF.x(result)))
    return XF.x(result)
}

const readGhost: H.H<Rb6ReadGhostParam> = async data => {
    const param = XF.o(data, Rb6ReadGhostParam)
    const redQuery: Query<Rb6Ghost> = { collection: "rb.rb6.playData.ghost#userId", musicId: param.musicId, chartType: param.chartType, redDataBase64: { $exists: true }/*, matchingGrade: { $gte: param.matchingGrade - 5, $lte: param.matchingGrade + 5 }**/ }
    const blueQuery: Query<Rb6Ghost> = { collection: "rb.rb6.playData.ghost#userId", musicId: param.musicId, chartType: param.chartType, blueDataBase64: { $exists: true }/*, matchingGrade: { $gte: param.matchingGrade - 5, $lte: param.matchingGrade + 5 }**/ }
    if (param.redUserId >= 0) redQuery.userId = param.redUserId
    if (param.blueUserId >= 0) blueQuery.userId = param.blueUserId
    const redDatas = await DBH.find(Rb6Ghost, redQuery)
    const blueDatas = await DBH.find(Rb6Ghost, blueQuery)
    const randomRedData = (redDatas.length > 0) ? redDatas[Math.round((redDatas.length - 1) * Math.random())] : new Rb6Ghost(param.musicId, param.chartType)
    const randomBlueData = (blueDatas.length > 0) ? blueDatas[Math.round((blueDatas.length - 1) * Math.random())] : new Rb6Ghost(param.musicId, param.chartType)
    const randomData = Object.assign(randomRedData, randomBlueData)

    // let k = mapKObject({ ghost: randomData }, { ghost: Rb6GhostMap })
    // /* @ts-ignore **/
    // if (k.ghost.item_red_data_bin) k.ghost.win_count_red = K.ITEM("s32", 5)
    // /* @ts-ignore **/
    // if (k.ghost.item_blue_data_bin) k.ghost.win_count_blue = K.ITEM("s32", 5)
    // /* @ts-ignore **/
    // if (k.ghost.item_red_data_bin) k.ghost.red_id = K.ITEM("s32", 0)
    // /* @ts-ignore **/
    // if (k.ghost.item_blue_data_bin) k.ghost.blue_id = K.ITEM("s32", 0)
    // await log(k)
    // send.object(k)

    const result = new Rb6ReadGhost()
    result.ghost = randomData
    return XF.x(result)
}

async function writePlayerCore(player: Rb6Player) {
    const rid = player.pdata.account.rid
    if (!rid) throw new Error("rid is empty")

    const t = new DBH.T()
    const accountQuery: Query<Rb6PlayerAccount> = { collection: "rb.rb6.player.account" }
    const accountSaved = await t.findOne(player.pdata.account.rid, accountQuery)

    if (!accountSaved) { // save the new player
        player.pdata.account.userId = await generateUserId()
        player.pdata.account.isFirstFree = true
        t.upsert(rid, { collection: "rb.rb6.player.account" }, player.pdata.account)
        t.upsert(rid, { collection: "rb.rb6.player.base" }, player.pdata.base)
        t.upsert(rid, { collection: "rb.rb6.player.config" }, player.pdata.config)
        t.upsert(rid, { collection: "rb.rb6.player.custom" }, player.pdata.custom)
    } else {
        accountSaved.isFirstFree = false
        accountSaved.playCount++
        if (!isToday(toBigInt(accountSaved.st))) {
            accountSaved.dayCount++
            accountSaved.playCountToday = 0
        }
        accountSaved.st = player.pdata.account.st
        accountSaved.playCountToday++

        t.update(rid, { collection: "rb.rb6.player.account" }, accountSaved)
    }
    if (player.pdata.stageLogs?.log?.length > 0) for (const l of player.pdata.stageLogs.log) await updateMusicRecordFromStageLog(rid, l, t, player.pdata.ghost?.list)
    if (player.pdata.justCollections?.list?.length > 0) for (const j of player.pdata.justCollections.list) await updateJustCollection(player.pdata.account.userId, j, t)
    if (player.pdata.characterCards?.list?.length > 0) for (const c of player.pdata.characterCards.list) t.upsert(rid, { collection: "rb.rb6.player.characterCard", characterCardId: c.characterCardId }, c)
    if (player.pdata.base) {
        player.pdata.base.rankQuestScore ??= [0, 0, 0]
        player.pdata.base.rankQuestRank ??= [0, 0, 0]
        player.pdata.base.mLog ??= [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        player.pdata.base.ghostWinCount ??= 0
        const baseQuery: Query<Rb6PlayerBase> = { collection: "rb.rb6.player.base" }
        const baseSaved = await t.findOne(rid, baseQuery)
        if (baseSaved) {
            if (baseSaved.name) player.pdata.base.name = baseSaved.name
            player.pdata.base.comment = baseSaved.comment
        } else {
            if (player.pdata.base.comment === "Welcome to the land of Reflesia!") player.pdata.base.comment = ""
        }
        t.upsert(rid, baseQuery, player.pdata.base)
    }
    t.upsert(rid, { collection: "rb.rb6.player.config" }, player.pdata.config)
    t.upsert(rid, { collection: "rb.rb6.player.custom" }, player.pdata.custom)
    if (((player.pdata.classcheck as Rb6Classcheck)?.class ?? Rb6ClasscheckIndex.none) > Rb6ClasscheckIndex.none) {
        (player.pdata.classcheck as Rb6Classcheck).totalScore = player.pdata.stageLogs.log.reduce((total, curr) => curr.score + total, 0)
        await updateClasscheckRecordFromLog(rid, player.pdata.classcheck as Rb6Classcheck, player.pdata.stageLogs.log[player.pdata.stageLogs.log.length - 1].time, t)
    }
    if (player.pdata.released?.info?.length > 0) for (const r of player.pdata.released.info) t.upsert(rid, { collection: "rb.rb6.player.releasedInfo", type: r.type, id: r.id }, r)
    if (player.pdata.playerParam?.item?.length > 0) for (const p of player.pdata.playerParam.item) t.upsert(rid, { collection: "rb.rb6.player.parameters", type: p.type, bank: p.bank }, p)
    if (player.pdata.mylist?.list) for (const l of player.pdata.mylist.list) t.upsert(rid, { collection: "rb.rb6.player.mylist", index: l.index }, l)
    if (player.pdata.quest?.list?.length > 0) for (const q of player.pdata.quest.list) {
        const now = player.pdata.stageLogs.log[player.pdata.stageLogs.log.length - 1].time
        if ((q.dungeonId === 47) && player.pdata?.stageLogs?.log) { // Ranking Quest
            const misc = await DB.FindOne<Rb6MiscSettings>(rid, { collection: "rb.rb6.player.misc" })
            const score = player.pdata.stageLogs.log.reduce((total, curr) => curr.score + total, 0)
            q.rankingId = misc ? misc.rankingQuestIndex || 0 : 0
            const oldRecord = await DB.FindOne<Rb6QuestRecord>(rid, { collection: "rb.rb6.playData.quest", dungeonId: 47, dungeonGrade: q.dungeonGrade, rankingId: q.rankingId })
            if (!oldRecord || (oldRecord.score < score)) {
                q.updateTime = now
                q.score = score
            } else q.score = oldRecord.score
        }
        q.lastPlayTime = now
        t.upsert(rid, { collection: "rb.rb6.playData.quest", dungeonId: q.dungeonId, dungeonGrade: q.dungeonGrade, $and: (q.dungeonId === 47) ? [{ rankingId: q.rankingId }] : [] }, q)
    }
    if (player.pdata.ghost?.list?.length > 0) for (const g of player.pdata.ghost.list) await updateGhostScore(player.pdata.account.userId, g, t)

    await t.commit()
}

export const readRank: H.H = () => ({
    tbs: {
        new_rank: K.ARRAY("s32", [1, 1, 1, 1, 1]),
        old_rank: K.ARRAY("s32", [1, 1, 1, 1, 1])
    },
    drank: {
        new_dungeon_rank: K.ARRAY("s32", [1, 1, 1])
    }
}) // TODO: Implement ranking features

async function updateMusicRecordFromStageLog(rid: string, stageLog: Rb6PlayerStageLog, t: DBH.T, ghostList: Rb6Ghost[]): Promise<void> {
    if (!checkRecord(stageLog)) return

    const query: Query<Rb6MusicRecord> = { $and: [{ collection: "rb.rb6.playData.musicRecord" }, { musicId: stageLog.musicId }, { chartType: stageLog.chartType }] }
    let musicRecord = await t.findOne(rid, query)
    if (!musicRecord) {
        musicRecord = new Rb6MusicRecord(stageLog.musicId, stageLog.chartType)
        musicRecord.clearType = stageLog.clearType
        musicRecord.achievementRateTimes100 = stageLog.achievementRateTimes100
        musicRecord.score = stageLog.score
        musicRecord.combo = stageLog.combo
        musicRecord.missCount = stageLog.missCount
        musicRecord.param = stageLog.param
        musicRecord.justCollectionRateTimes100Red = (stageLog.color == 0) ? stageLog.justCollectionRateTimes100 : null
        musicRecord.justCollectionRateTimes100Blue = (stageLog.color == 1) ? stageLog.justCollectionRateTimes100 : null
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
        if (musicRecord.combo < stageLog.combo) {
            musicRecord.bestComboUpdateTime = stageLog.time
            musicRecord.combo = stageLog.combo
        }
        if ((stageLog.missCount >= 0) && ((musicRecord.missCount > stageLog.missCount) || (musicRecord.missCount < 0))) {
            musicRecord.bestMissCountUpdateTime = stageLog.time
            musicRecord.missCount = stageLog.missCount
        }
        if ((stageLog.color == 0) && (musicRecord.justCollectionRateTimes100Red < stageLog.justCollectionRateTimes100)) { // just collection red
            musicRecord.justCollectionRateTimes100Red = stageLog.justCollectionRateTimes100
        }
        if ((stageLog.color == 1) && (musicRecord.justCollectionRateTimes100Blue < stageLog.justCollectionRateTimes100)) { // just collection blue
            musicRecord.justCollectionRateTimes100Blue = stageLog.justCollectionRateTimes100
        }
    }

    musicRecord.time = stageLog.time
    musicRecord.playCount++
    if (ghostList) for (const g of ghostList) if ((g.musicId === musicRecord.musicId) && (g.chartType === musicRecord.chartType)) {
        if (g.blueDataBase64) musicRecord.isHasGhostBlue = true
        if (g.redDataBase64) musicRecord.isHasGhostRed = true
    }
    t.upsert(rid, query, musicRecord)
    t.insert(rid, stageLog)
}

async function updateGhostScore(userId: number, ghost: Rb6Ghost, t: DBH.T): Promise<void> {
    ghost.userId = userId
    t.upsert(undefined, { collection: "rb.rb6.playData.ghost#userId", musicId: ghost.musicId, chartType: ghost.chartType, userId: userId }, ghost)
}

async function updateClasscheckRecordFromLog(rid: string, log: Rb6Classcheck, time: number, t: DBH.T): Promise<void> {
    const query: Query<Rb6Classcheck> = { collection: "rb.rb6.playData.classcheck", class: log.class }
    let classRecord = await DB.FindOne(rid, query)
    let isNeedUpdate = false
    let isInitial = false

    if (!classRecord) {
        classRecord = new Rb6Classcheck(log.class)
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

async function updateJustCollection(userId: number, justColElement: Rb6JustCollection, t: DBH.T): Promise<void> {
    justColElement.userId = userId
    t.upsert(undefined, { collection: "rb.rb6.playData.justCollection#userId", userId: userId, musicId: justColElement.musicId, chartType: justColElement.chartType }, justColElement)
}

function checkRecord(record: Rb6PlayerStageLog | Rb6MusicRecord): boolean {
    const excFlag = record.achievementRateTimes100 === 10000
    const fcFlag = record.missCount === 0
    if (excFlag && !fcFlag) return false
    return true
}
