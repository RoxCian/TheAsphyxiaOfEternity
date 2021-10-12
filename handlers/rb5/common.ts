import { generateRb5ClasscheckRecord, IRb5ClasscheckRecord } from "../../models/rb5/classcheck_record"
import { getExampleEventControl, Rb5EventControlMap } from "../../models/rb5/event_control"
import { initializePlayer } from "./initialize_player"
import { generateRb5MusicRecord, IRb5MusicRecord, Rb5MusicRecordMap, Rb5OldMusicRecordMap } from "../../models/rb5/music_record"
import { IRb5Mylist } from "../../models/rb5/mylist"
import { generateRb5BattleRoyale, generateRb5MyCourseLog, IRb5BattleRoyale, IRb5Derby, IRb5Minigame, IRb5MyCourseLog, IRb5Player, IRb5PlayerAccount, IRb5PlayerBase, IRb5PlayerClasscheckLog, IRb5PlayerConfig, IRb5PlayerCustom, IRb5PlayerParameters, IRb5PlayerReleasedInfo, IRb5PlayerStageLog, Rb5PlayerReadMap, Rb5PlayerWriteMap } from "../../models/rb5/profile"
import { KRb5ShopInfo } from "../../models/rb5/shop_info"
import { KITEM2, KObjectMappingRecord, mapBackKObject, mapKObject, toBigInt } from "../../utility/mapping"
import { readPlayerPostProcess, writePlayerPreProcess } from "./processing"
import { generateRb5Profile } from "../../models/rb5/profile"
import { DBM } from "../utility/db_manager"
import { tryFindPlayer } from "../utility/try_find_player"
import { ClearType, findAllBestMusicRecord, GaugeType } from "../utility/find_music_record"
import { isToday } from "../../utility/utility_functions"
import { generateUserId } from "../utility/generate_user_id"

export namespace Rb5HandlersCommon {
    export const BootPcb: EPR = async (_, _data, send) => {
        send.object({ sinfo: KRb5ShopInfo })
    }

    export const ReadHitChartInfo: EPR = async (_, _data, send) => {
        send.object({ ver: {} })
    }

    export const StartPlayer: EPR = async (_, _data, send) => {
        let data = getExampleEventControl()
        let result = {
            plyid: 0,
            start_time: BigInt(Date.now() * 1000),
            event_ctrl: { data: data },
            item_lock_ctrl: {},
        }

        let map = {
            plyid: { $type: <"s32">"s32" },
            nm: { $type: <"s32">"s32" },
            start_time: { $type: <"u64">"u64" },
            event_ctrl: {
                data: { 0: Rb5EventControlMap }
            },
            item_lock_ctrl: {},
        }
        send.object(mapKObject(result, map))
    }

    export const ReadPlayer: EPR = async (_, data: KITEM2<IPlayerReadParameters>, send) => {
        let readParam: IPlayerReadParameters = mapBackKObject(data, PlayerReadParametersMap)[0]
        let result: IRb5Player
        let account: IRb5PlayerAccount = await DB.FindOne<IRb5PlayerAccount>(readParam.rid, { collection: "rb.rb5.player.account" })
        if (account == null) {
            let rbPlayer = await tryFindPlayer(readParam.rid, 5)
            if (rbPlayer != null) {
                result = generateRb5Profile(readParam.rid, rbPlayer.userId)
                result.pdata.base.name = rbPlayer.name
            } else {
                result = generateRb5Profile(readParam.rid, await generateUserId())
                result.pdata.account.isFirstFree = true
                result.pdata.base.name = "RBPlayer"
                initializePlayer(result)
            }
            await writePlayerInternal(result)
        } else {
            let base: IRb5PlayerBase = await DB.FindOne<IRb5PlayerBase>(readParam.rid, { collection: "rb.rb5.player.base" })
            let config: IRb5PlayerConfig = await DB.FindOne<IRb5PlayerConfig>(readParam.rid, { collection: "rb.rb5.player.config" })
            let custom: IRb5PlayerCustom = await DB.FindOne<IRb5PlayerCustom>(readParam.rid, { collection: "rb.rb5.player.custom" })
            let released: IRb5PlayerReleasedInfo[] = await DB.Find<IRb5PlayerReleasedInfo>(readParam.rid, { collection: "rb.rb5.player.releasedInfo" })
            let classcheck: IRb5ClasscheckRecord[] = await DB.Find<IRb5ClasscheckRecord>(readParam.rid, { collection: "rb.rb5.playData.classcheck" })
            let playerParam: IRb5PlayerParameters[] = await DB.Find<IRb5PlayerParameters>(readParam.rid, { collection: "rb.rb5.player.parameters" })
            let mylist: IRb5Mylist = await DB.FindOne<IRb5Mylist>(readParam.rid, { collection: "rb.rb5.player.mylist" })
            let minigame: IRb5Minigame = await DB.FindOne<IRb5Minigame>(readParam.rid, { collection: "rb.rb5.playData.minigame" })
            let battleRoyale: IRb5BattleRoyale = await DB.FindOne<IRb5BattleRoyale>(readParam.rid, { collection: "rb.rb5.playData.battleRoyale" })
            let derby: IRb5Derby = await DB.FindOne<IRb5Derby>(readParam.rid, { collection: "rb.rb5.player.derby" })
            let myCourse: IRb5MyCourseLog = await DB.FindOne<IRb5MyCourseLog>(readParam.rid, { collection: "rb.rb5.playData.myCourse" })

            let init = (v, i) => (v == null) ? i : v
            if (account.intrvld == null) account.intrvld = 0
            if (account.succeed == null) account.succeed = true
            if (account.pst == null) account.pst = BigInt(0)
            if (account.st == null) account.st = BigInt(0)
            if (account.opc == null) account.opc = 0
            if (account.dayCount == null) account.dayCount = 0
            if (account.playCountToday == null) account.playCountToday = 0
            if (!isToday(toBigInt(account.st))) account.playCountToday = 1
            else account.playCountToday++
            if (account.lpc == null) account.lpc = 0
            if (account.cpc == null) account.cpc = 0
            if (account.mpc == null) account.mpc = 0
            if ((base.comment == null) || (base.comment == "")) base.comment = "Welcome to REFLEC BEAT VOLZZA!"
            if (base.abilityPointTimes100 == null) base.abilityPointTimes100 = base["averagePrecisionTimes100"] // For compatibility
            if (base.mlog == null) base.mlog = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            if (battleRoyale == null) battleRoyale = generateRb5BattleRoyale()
            if (myCourse == null) myCourse = generateRb5MyCourseLog()
            if (mylist.index < 0) mylist.index = 0
            for (let i of released) if (i.insertTime == null) i.insertTime = Date.now()
            let scores: IRb5MusicRecord[] = await DB.Find<IRb5MusicRecord>(readParam.rid, { collection: "rb.rb5.playData.musicRecord" })

            base.totalBestScore = 0
            base.totalBestScoreEachChartType = [0, 0, 0, 0]
            for (let s of scores) {
                base.totalBestScore += s.score
                base.totalBestScoreEachChartType[s.chartType] += s.score
            }
            base.totalBestScoreV2 = base.totalBestScore
            base.totalBestScoreEachChartTypeV2 = base.totalBestScoreEachChartType

            config.randomEntryWork = init(config.randomEntryWork, BigInt(Math.trunc(Math.random() * 99999999)))
            config.customFolderWork = init(config.randomEntryWork, BigInt(Math.trunc(Math.random() * 9999999999999)))

            // TODO: Yurukome

            result = {
                pdata: {
                    account: account,
                    base: base,
                    config: config,
                    custom: custom,
                    rival: {},
                    pickupRival: {},
                    classcheck: (classcheck.length > 0) ? { rec: classcheck } : <any>{},
                    released: (released.length > 0) ? { info: released } : <any>{},
                    announce: {},
                    playerParam: (playerParam.length > 0) ? { item: playerParam } : <any>{},
                    mylist: { list: mylist },
                    musicRankPoint: {},
                    ghost: {},
                    ghostWinCount: {},
                    purpose: {},
                    minigame: minigame,
                    share: {},
                    battleRoyale: battleRoyale,
                    derby: derby,
                    yurukomeList: [0, 0, 0, 0],
                    myCourse: myCourse,
                    myCourseF: myCourse,
                    challengeEventCard: { setId: 0 }
                }
            }
        }
        send.object(readPlayerPostProcess(mapKObject(result, Rb5PlayerReadMap)))
    }

    export const DeletePlayer: EPR = async (_, data: KITEM2<{ rid: string }>, send) => {
        try {
            let rid = data.rid["@content"]
            let account = await DB.FindOne<IRb5PlayerAccount>(rid, { collection: "rb.rb5.player.account" })
            await DBM.overall(rid, account?.userId, "rb.rb5", "delete")

            send.success()
        } catch (e) {
            console.log((<Error>e).message)
            send.deny()
        }
    }

    export const WritePlayer: EPR = async (_, data: KITEM2<IRb5Player>, send) => {
        data = await writePlayerPreProcess(data)
        let player: IRb5Player = mapBackKObject(data, Rb5PlayerWriteMap)[0]
        await writePlayerInternal(player)
        send.object({ uid: K.ITEM("s32", player.pdata.account.userId) })
    }
    async function writePlayerInternal(player: IRb5Player) {
        let opm = new DBM.DBOperationManager()
        let playCountQuery: Query<IRb5PlayerAccount> = { collection: "rb.rb5.player.account" }
        let playerAccountForPlayCountQuery: IRb5PlayerAccount = await opm.findOne(player.pdata.account.rid, playCountQuery)
        if (player?.pdata?.account?.rid) {
            let rid = player.pdata.account.rid
            if (rid == "") throw new Error("rid is empty")
            if (playerAccountForPlayCountQuery == null) { // save the new player
                if (player.pdata.account.userId <= 0) {
                    player.pdata.account.userId = await generateUserId()
                    player.pdata.account.isFirstFree = true
                    initializePlayer(player)
                }
                opm.upsert(rid, { collection: "rb.rb5.player.account" }, player.pdata.account)
            } else {
                playerAccountForPlayCountQuery.isFirstFree = false
                playerAccountForPlayCountQuery.playCount++
                if (!isToday(toBigInt(playerAccountForPlayCountQuery.st))) {
                    playerAccountForPlayCountQuery.dayCount++
                    playerAccountForPlayCountQuery.playCountToday = 0
                }
                playerAccountForPlayCountQuery.st = player.pdata.account.st
                playerAccountForPlayCountQuery.playCountToday++

                opm.update(rid, { collection: "rb.rb5.player.account" }, playerAccountForPlayCountQuery)
            }
            if (player.pdata.base) {
                let oldBase = await opm.findOne<IRb5PlayerBase>(rid, { collection: "rb.rb5.player.base" })
                if (oldBase != null) {
                    if (oldBase.name) player.pdata.base.name = oldBase.name
                    player.pdata.base.comment = oldBase.comment
                    if (player.pdata.base.skillPointTimes10 == null) player.pdata.base.skillPointTimes10 = oldBase.skillPointTimes10 // VOLZZA 2
                } else {
                    if (player.pdata.base.comment == "Welcome to REFLEC BEAT VOLZZA!") player.pdata.base.comment = ""

                }
                opm.upsert<IRb5PlayerBase>(rid, { collection: "rb.rb5.player.base" }, player.pdata.base)
            }
            if (player.pdata.config) opm.upsert<IRb5PlayerConfig>(rid, { collection: "rb.rb5.player.config" }, player.pdata.config)
            if (player.pdata.custom) {
                let oldCustom = await opm.findOne<IRb5PlayerCustom>(rid, { collection: "rb.rb5.player.custom" })
                if (oldCustom != null) {
                    // VOLZZA 2
                    if (player.pdata.custom.stageSameTimeObjectsDisplayingType == null) player.pdata.custom.stageSameTimeObjectsDisplayingType == oldCustom.stageSameTimeObjectsDisplayingType
                    if (player.pdata.custom.stageScoreDisplayingType == null) player.pdata.custom.stageScoreDisplayingType == oldCustom.stageScoreDisplayingType
                    if (player.pdata.custom.stageBonusType == null) player.pdata.custom.stageBonusType == oldCustom.stageBonusType
                    if (player.pdata.custom.stageRivalObjectsDisplayingType == null) player.pdata.custom.stageRivalObjectsDisplayingType == oldCustom.stageRivalObjectsDisplayingType
                    if (player.pdata.custom.stageTopAssistDisplayingType == null) player.pdata.custom.stageTopAssistDisplayingType == oldCustom.stageTopAssistDisplayingType
                    if (player.pdata.custom.stageHighSpeed == null) player.pdata.custom.stageHighSpeed = oldCustom.stageHighSpeed
                }
                opm.upsert<IRb5PlayerCustom>(rid, { collection: "rb.rb5.player.custom" }, player.pdata.custom)
            }
            if (player.pdata.stageLogs?.log?.length > 0) for (let i of player.pdata.stageLogs.log) await updateMusicRecordFromStageLog(rid, i, opm)
            if ((<IRb5PlayerClasscheckLog>player.pdata.classcheck)?.class != null) {
                (player.pdata.classcheck as IRb5PlayerClasscheckLog).totalScore = player.pdata.stageLogs.log[0].score + (player.pdata.stageLogs.log[1] == null ? 0 : player.pdata.stageLogs.log[1].score) + (player.pdata.stageLogs.log[2] == null ? 0 : player.pdata.stageLogs.log[2].score)
                await updateClasscheckRecordFromLog(rid, <IRb5PlayerClasscheckLog>player.pdata.classcheck, player.pdata.stageLogs.log[player.pdata.stageLogs.log.length - 1].time, opm)
            }
            if (player.pdata.released?.info?.length > 0) for (let i of player.pdata.released.info) opm.upsert<IRb5PlayerReleasedInfo>(rid, { collection: "rb.rb5.player.releasedInfo", type: i.type, id: i.id }, i)
            if (player.pdata.playerParam?.item?.length > 0) for (let i of player.pdata.playerParam.item) opm.upsert<IRb5PlayerParameters>(rid, { collection: "rb.rb5.player.parameters", type: i.type, bank: i.bank }, i)
            if (player.pdata.mylist?.list != null) opm.upsert<IRb5Mylist>(rid, { collection: "rb.rb5.player.mylist", index: player.pdata.mylist.list.index }, player.pdata.mylist.list)
            if (player.pdata.minigame != null) opm.upsert<IRb5Minigame>(rid, { collection: "rb.rb5.playData.minigame", minigameId: player.pdata.minigame.minigameId }, player.pdata.minigame)
            if (player.pdata.myCourse?.courseId >= 0) opm.upsert<IRb5MyCourseLog>(rid, { collection: "rb.rb5.playData.myCourse", courseId: player.pdata.myCourse.courseId }, player.pdata.myCourse)
            if (player.pdata.derby != null) opm.upsert<IRb5Derby>(rid, { collection: "rb.rb5.player.derby" }, player.pdata.derby)
            if (player.pdata.battleRoyale != null) opm.upsert<IRb5BattleRoyale>(rid, { collection: "rb.rb5.playData.battleRoyale", battleId: player.pdata.battleRoyale.battleId }, player.pdata.battleRoyale)
        }

        DBM.operate(opm)
    }

    export const ReadPlayerScore: EPR = async (_, data, send) => {
        let rid: string = $(data).str("rid")

        let scores: IRb5MusicRecord[] = await DB.Find<IRb5MusicRecord>(rid, { collection: "rb.rb5.playData.musicRecord" })
        let result = {
            pdata: { record: (scores?.length > 0) ? { rec: scores } : {} }
        }

        send.object(mapKObject(result, {
            pdata: { record: { rec: { 0: Rb5MusicRecordMap } } }
        }))
    }
    export const ReadPlayerScoreOldVersion: EPR = async (_, data, send) => {
        let rid: string = $(data).str("rid")

        let result = {
            pdata: {
                recordOld: { rec: <IRb5MusicRecord[]>[] }
            }
        }

        let oldRecords = await findAllBestMusicRecord(rid, 5)
        for (let r of oldRecords) {
            result.pdata.recordOld.rec.push({
                collection: "rb.rb5.playData.musicRecord",
                musicId: r.musicId,
                chartType: r.chartType,
                playCount: r.playCount,
                clearType: translateRb5ClearType(r.clearType, r.gaugeType),
                achievementRateTimes100: r.achievementRateTimes100,
                score: r.score,
                combo: r.combo,
                missCount: r.missCount,
                param: r.param,
                bestAchievementRateUpdateTime: r.achievementRateUpdateTime,
                bestComboUpdateTime: r.comboUpdateTime,
                bestScoreUpdateTime: r.scoreUpdateTime,
                bestMissCountUpdateTime: r.missCountUpdateTime,
                version: r.scoreVersion,
                time: r.comboUpdateTime,
                kFlag: 0,
                isHasGhostBlue: false,
                isHasGhostRed: false
            })
        }
        send.object(mapKObject(result, {
            pdata: {
                recordOld: {
                    rec: { 0: Rb5OldMusicRecordMap },
                    $targetKey: "record_old"
                }
            }
        }))
    }

    function translateRb5ClearType(clearType: ClearType, gaugeType: GaugeType): number {
        switch (clearType) {
            case ClearType.notPlayed: return 0
            case ClearType.failed:
                switch (gaugeType) {
                    case GaugeType.normal: return 1
                    case GaugeType.hard: return 2
                    case GaugeType.sHard: return 3
                }
            case ClearType.cleared: return 9
            case ClearType.hardCleared: return 10
            case ClearType.sHardCleared: return 11
            case ClearType.fullCombo:
                switch (gaugeType) {
                    case GaugeType.normal: return 9
                    case GaugeType.hard: return 10
                    case GaugeType.sHard: return 11
                }
            case ClearType.excellent:
                switch (gaugeType) {
                    case GaugeType.normal: return 9
                    case GaugeType.hard: return 10
                    case GaugeType.sHard: return 11
                }
            case ClearType.allJustReflecFullCombo:
                switch (gaugeType) {
                    case GaugeType.normal: return 9
                    case GaugeType.hard: return 10
                    case GaugeType.sHard: return 11
                }
        }
    }

    export const WriteComment: EPR = async (_, data, send) => {

    }

    interface IPlayerReadParameters {
        rid: string
        lid: string
        ver: number
        card_id: string
        card_type: number
    }
    const PlayerReadParametersMap: KObjectMappingRecord<IPlayerReadParameters> = {
        rid: { $type: "str" },
        lid: { $type: "str" },
        ver: { $type: "s16" },
        card_id: { $type: "str" },
        card_type: { $type: "s16" }
    }

    async function updateMusicRecordFromStageLog(rid: string, stageLog: IRb5PlayerStageLog, opm: DBM.DBOperationManager): Promise<void> {
        let query: Query<IRb5MusicRecord> = { $and: [{ collection: "rb.rb5.playData.musicRecord" }, { musicId: stageLog.musicId }, { chartType: stageLog.chartType }] }
        let musicRecord = await opm.findOne<IRb5MusicRecord>(rid, query)

        let newFlag = getClearTypeIndex(stageLog)
        if (newFlag < 0) return

        if (musicRecord == null) {

            musicRecord = generateRb5MusicRecord(stageLog.musicId, stageLog.chartType)
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
        opm.upsert(rid, query, musicRecord)
        opm.insert(rid, stageLog)
    }

    async function updateClasscheckRecordFromLog(rid: string, log: IRb5PlayerClasscheckLog, time: number, opm: DBM.DBOperationManager): Promise<void> {
        let query: Query<IRb5ClasscheckRecord> = { collection: "rb.rb5.playData.classcheck", class: log.class }
        let classRecord = (await DB.Find<IRb5ClasscheckRecord>(rid, query))[0]
        let isNeedUpdate = false
        let isInitial = false

        if (classRecord == null) {
            classRecord = generateRb5ClasscheckRecord(log.class)
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
        opm.upsert(rid, query, classRecord)
    }

    function getClearTypeIndex(record: IRb5PlayerStageLog | IRb5MusicRecord): number {
        let excFlag = record.achievementRateTimes100 == 10000
        let fcFlag = record.missCount == 0
        if (excFlag && !fcFlag) return -1
        else if (excFlag) return 0
        else if (fcFlag) return 1
        else if (record.clearType == 4) return 2
        else if (record.clearType == 3) return 3
        else return 4
    }
}