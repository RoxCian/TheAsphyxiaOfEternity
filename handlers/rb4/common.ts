import { generateRb4ClasscheckRecord, IRb4ClasscheckRecord } from "../../models/rb4/classcheck_record"
import { getExampleEventControl, Rb4EventControlMap } from "../../models/rb4/event_control"
import { initializePlayer } from "./initialize_player"
import { generateRb4MusicRecord, IRb4MusicRecord, Rb4MusicRecordMap, Rb4OldMusicRecordMap } from "../../models/rb4/music_record"
import { IRb4Mylist } from "../../models/rb4/mylist"
import { generateRb4Episode, IRb4Episode, IRb4Player, IRb4PlayerAccount, IRb4PlayerBase, IRb4PlayerClasscheckLog, IRb4PlayerConfig, IRb4PlayerCustom, IRb4PlayerParameters, IRb4PlayerReleasedInfo, IRb4PlayerStageLog, IRb4Quest, IRb4Stamp, Rb4EpisodeMap, Rb4PlayerReadMap, Rb4PlayerReleasedInfoMap, Rb4PlayerWriteMap } from "../../models/rb4/profile"
import { KRb4ShopInfo } from "../../models/rb4/shop_info"
import { KITEM2, KObjectMappingRecord, mapBackKObject, mapKObject, toBigInt } from "../../utility/mapping"
import { readPlayerPostProcess, writePlayerPreProcess } from "./processing"
import { generateRb4Profile } from "../../models/rb4/profile"
import { DBM } from "../utility/db_manager"
import { tryFindPlayer } from "../utility/try_find_player"
import { ClearType, findAllBestMusicRecord, GaugeType } from "../utility/find_music_record"
import { isNewMusic } from "../../data/musicinfo/rb_music_info"
import { isToday, shiftjisToUtf8 } from "../../utility/utility_functions"
import { generateUserId } from "../utility/generate_user_id"

export namespace Rb4HandlersCommon {
    export const BootPcb: EPR = async (__, _data, send) => {
        send.object({ sinfo: KRb4ShopInfo })
    }

    export const ReadHitChartInfo: EPR = async (__, _data, send) => {
        send.object({ ver: {} })
    }
    export const PlayerSucceeded: EPR = async (_, data, send) => {
        let rid = $(data).str("rid")
        let player = await tryFindPlayer(rid, 4)
        let result
        if (player == null) {
            result = {
                name: "",
                lv: -1,
                exp: -1,
                grd: -1,
                ap: -1,
                money: -1,
                released: {},
                mrecord: {}
            }
        } else {
            let player: IRb4PlayerBase = await DB.FindOne<IRb4PlayerBase>(rid, { collection: "rb.rb4.player.base" })
            let released: IRb4PlayerReleasedInfo[] = await DB.Find<IRb4PlayerReleasedInfo>(rid, { collection: "rb.rb4.player.releasedInfo" })
            let record: IRb4MusicRecord[] = await DB.Find<IRb4MusicRecord>(rid, { collection: "rb.rb4.playData.musicRecord" })
            result = {
                name: player.name,
                lv: 0,
                exp: 0,
                grd: 0,
                ap: 0,
                money: 0,
                released: (released.length == 0) ? {} : { i: released },
                mrecord: (record.length == 0) ? {} : { mrec: record }
            }
        }
        send.object(mapKObject(result, {
            name: { $type: "str" },
            lv: { $type: "s16" },
            exp: { $type: "s32" },
            grd: { $type: "s32" },
            ap: { $type: "s32" },
            money: { $type: "s32" },
            released: { i: { 0: Rb4PlayerReleasedInfoMap } },
            mrecord: { mrec: { 0: Rb4MusicRecordMap } }
        }))
    }

    export const StartPlayer: EPR = async (_, _data, send) => {
        let data = getExampleEventControl()
        let rid = $(_data).str("rid")
        let account = (rid == null) ? null : await DB.FindOne<IRb4PlayerAccount>(rid, { collection: "rb.rb4.player.account" })

        let result = {
            plyid: (account == null) ? -1 : account.playerId,
            nm: 0,
            start_time: BigInt(0),
            event_ctrl: { data: data },
            item_lock_ctrl: {},
        }

        let map = {
            plyid: { $type: <"s32">"s32" },
            nm: { $type: <"s32">"s32" },
            start_time: { $type: <"u64">"u64" },
            event_ctrl: {
                data: { 0: Rb4EventControlMap }
            },
            item_lock_ctrl: {},
        }
        send.object(mapKObject(result, map))
    }

    export const ReadPlayer: EPR = async (_, data: KITEM2<IPlayerReadParameters>, send) => {
        let readParam: IPlayerReadParameters = mapBackKObject(data, PlayerReadParametersMap)[0]
        let result: IRb4Player
        let account: IRb4PlayerAccount = await DB.FindOne<IRb4PlayerAccount>(readParam.rid, { collection: "rb.rb4.player.account" })
        if (account == null) {
            let rbPlayer = await tryFindPlayer(readParam.rid, 4)
            if (rbPlayer != null) {
                result = generateRb4Profile(readParam.rid, rbPlayer.userId, rbPlayer.version)
                result.pdata.base.name = rbPlayer.name
            } else {
                result = generateRb4Profile(readParam.rid, await generateUserId())
                result.pdata.account.isFirstFree = true
                result.pdata.base.name = "RBPlayer"
                initializePlayer(result)
            }
            await writePlayerInternal(result)
        } else {
            let base: IRb4PlayerBase = await DB.FindOne<IRb4PlayerBase>(readParam.rid, { collection: "rb.rb4.player.base" })
            let config: IRb4PlayerConfig = await DB.FindOne<IRb4PlayerConfig>(readParam.rid, { collection: "rb.rb4.player.config" })
            let custom: IRb4PlayerCustom = await DB.FindOne<IRb4PlayerCustom>(readParam.rid, { collection: "rb.rb4.player.custom" })
            let stamp: IRb4Stamp = await DB.FindOne<IRb4Stamp>(readParam.rid, { collection: "rb.rb4.player.stamp" })
            let released: IRb4PlayerReleasedInfo[] = await DB.Find<IRb4PlayerReleasedInfo>(readParam.rid, { collection: "rb.rb4.player.releasedInfo" })
            let classcheck: IRb4ClasscheckRecord[] = await DB.Find<IRb4ClasscheckRecord>(readParam.rid, { collection: "rb.rb4.playData.classcheck" })
            let playerParam: IRb4PlayerParameters[] = await DB.Find<IRb4PlayerParameters>(readParam.rid, { collection: "rb.rb4.player.parameters" })
            let mylist: IRb4Mylist = await DB.FindOne<IRb4Mylist>(readParam.rid, { collection: "rb.rb4.player.mylist" })
            let quest: IRb4Quest = await DB.FindOne<IRb4Quest>(readParam.rid, { collection: "rb.rb4.player.quest" })
            let episode: IRb4Episode = await DB.FindOne<IRb4Episode>({ collection: "rb.rb4.player.episode#userId", userId: account.userId })

            let init = (v, i) => (v == null) ? i : v
            if (account.intrvld == null) account.intrvld = 0
            if (account.succeed == null) account.succeed = true
            if (account.pst == null) account.pst = BigInt(0)
            if (account.st == null) account.st = BigInt(0)
            if (!isToday(toBigInt(account.st))) account.playCountToday = 1
            else account.playCountToday = (account.playCountToday == null) ? 1 : (account.playCountToday + 1)
            if (account.opc == null) account.opc = 0
            if (account.lpc == null) account.lpc = 0
            if (account.cpc == null) account.cpc = 0
            if (account.mpc == null) account.mpc = 0
            if ((base.comment == null) || (base.comment == "")) base.comment = "Welcome to REFLEC BEAT groovin'!"
            if (base.uattr == null) base.uattr = 0
            if (base.mlog == null) base.mlog = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            if (mylist?.index < 0) mylist.index = 0
            let scores: IRb4MusicRecord[] = await DB.Find<IRb4MusicRecord>(readParam.rid, { collection: "rb.rb4.playData.musicRecord" })

            base.totalBestScore = 0
            base.totalBestScoreRival = 0
            base.totalBestScoreEachChartType = [0, 0, 0, 0]
            base.totalBestScoreEachChartTypeRival = [0, 0, 0, 0]
            base.totalBestScoreNewMusics = 0
            base.totalBestScoreNewMusicsRival = 0
            for (let s of scores) {
                base.totalBestScore += s.score
                base.totalBestScoreEachChartType[s.chartType] += s.score
                if (isNewMusic(s.musicId, 4)) base.totalBestScoreNewMusics += s.score
            }

            config.randomEntryWork = init(config.randomEntryWork, BigInt(Math.trunc(Math.random() * 99999999)))
            config.customFolderWork = init(config.randomEntryWork, BigInt(Math.trunc(Math.random() * 9999999999999)))

            if (episode == null) episode = generateRb4Episode(account.userId)
            if (episode.text == null) episode.text = ""

            if (episode.text == "") episode.text = "Hello there!"

            result = {
                pdata: {
                    account: account,
                    base: base,
                    config: config,
                    custom: custom,
                    rival: {},
                    stamp: stamp,
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
                    share: {},
                    episode: { info: (episode == null) ? generateRb4Episode(account.userId) : episode },
                    quest: (quest == null) ? { collection: "rb.rb4.player.quest", eyeColor: 0, bodyColor: 0, item: 0, comment: "" } : quest
                }
            }
        }
        send.object(readPlayerPostProcess(mapKObject(result, Rb4PlayerReadMap)))
    }

    export const DeletePlayer: EPR = async (_, data: KITEM2<{ rid: string }>, send) => {
        try {
            let rid = data.rid["@content"]
            let account = await DB.FindOne<IRb4PlayerAccount>(rid, { collection: "rb.rb4.player.account" })
            await DBM.overall(rid, account?.userId, "rb.rb4", "delete")

            send.success()
        } catch (e) {
            console.log((<Error>e).message)
            send.deny()
        }
    }

    export const WritePlayer: EPR = async (_, data: KITEM2<IRb4Player>, send) => {
        data = await writePlayerPreProcess(data)
        let player: IRb4Player = mapBackKObject(data, Rb4PlayerWriteMap)[0]
        await writePlayerInternal(player)
        send.object({ uid: K.ITEM("s32", player.pdata.account.userId) })
    }
    async function writePlayerInternal(player: IRb4Player) {
        let opm = new DBM.DBOperationManager()
        let playCountQuery: Query<IRb4PlayerAccount> = { collection: "rb.rb4.player.account" }
        let playerAccountForPlayCountQuery: IRb4PlayerAccount = await opm.findOne(player.pdata.account.rid, playCountQuery)
        if (player?.pdata?.account?.rid) {
            let rid = player.pdata.account.rid
            if (rid == "") throw new Error("rid is empty")
            if (playerAccountForPlayCountQuery == null) { // save the new player
                if (player.pdata.account.userId <= 0) {
                    player.pdata.account.userId = await generateUserId()
                    player.pdata.account.isFirstFree = true
                    initializePlayer(player)
                }
                if (player.pdata.base) {
                    let n = shiftjisToUtf8(player.pdata.base.name)
                    if ((n.length == 0) || (n.length > 8) || (n == "-")) player.pdata.base.name = player.pdata.account.userId.toString()
                }
                opm.upsert(rid, { collection: "rb.rb4.player.account" }, player.pdata.account)
            } else {
                playerAccountForPlayCountQuery.isFirstFree = false
                playerAccountForPlayCountQuery.playCount++
                if (!isToday(toBigInt(playerAccountForPlayCountQuery.st))) {
                    playerAccountForPlayCountQuery.dayCount++
                    playerAccountForPlayCountQuery.playCountToday = 0
                }
                playerAccountForPlayCountQuery.st = player.pdata.account.st
                playerAccountForPlayCountQuery.playCountToday++
                if (player.pdata.base) player.pdata.base.name = (await opm.findOne<IRb4PlayerBase>(rid, { collection: "rb.rb4.player.base" })).name

                opm.update(rid, { collection: "rb.rb4.player.account" }, playerAccountForPlayCountQuery)
            }
            if (player.pdata.base) {
                let oldBase = await opm.findOne<IRb4PlayerBase>(rid, { collection: "rb.rb4.player.base" })
                if (oldBase != null) {
                    if (oldBase.name) player.pdata.base.name = oldBase.name
                    player.pdata.base.comment = oldBase.comment
                } else {
                    if (player.pdata.base.comment == "Welcome to REFLEC BEAT groovin!!") player.pdata.base.comment = ""
                }
                opm.upsert<IRb4PlayerBase>(rid, { collection: "rb.rb4.player.base" }, player.pdata.base)
            }
            if (player.pdata.config) opm.upsert<IRb4PlayerConfig>(rid, { collection: "rb.rb4.player.config" }, player.pdata.config)
            if (player.pdata.custom) opm.upsert<IRb4PlayerCustom>(rid, { collection: "rb.rb4.player.custom" }, player.pdata.custom)
            if ((<IRb4PlayerClasscheckLog>player.pdata.classcheck)?.class != null) {
                let musicsId: number[] = [player.pdata.stageLogs.log[0].musicId, (player.pdata.stageLogs.log[1] == null ? -1 : player.pdata.stageLogs.log[1].musicId), (player.pdata.stageLogs.log[2] == null ? -1 : player.pdata.stageLogs.log[2].musicId)]
                let chartsType: number[] = [player.pdata.stageLogs.log[0].chartType, (player.pdata.stageLogs.log[1] == null ? -1 : player.pdata.stageLogs.log[1].chartType), (player.pdata.stageLogs.log[2] == null ? -1 : player.pdata.stageLogs.log[2].chartType)]
                await updateClasscheckRecordFromLog(rid, <IRb4PlayerClasscheckLog>player.pdata.classcheck, player.pdata.stageLogs.log[player.pdata.stageLogs.log.length - 1].time, musicsId, chartsType, opm)
                if ((<IRb4PlayerClasscheckLog>player.pdata.classcheck).clearType == 1) { // For webui
                    if (musicsId[0] >= 0) {
                        if (musicsId[1] >= 0) {
                            player.pdata.stageLogs.log[0].clearTypeForClasscheck == "Win"
                            if (musicsId[2] >= 0) {
                                player.pdata.stageLogs.log[1].clearTypeForClasscheck == "Win"
                                player.pdata.stageLogs.log[2].clearTypeForClasscheck = (player.pdata.stageLogs.log[2].clearType >= 9) ? "Draw" : "Lose"
                            } else player.pdata.stageLogs.log[1].clearTypeForClasscheck = (player.pdata.stageLogs.log[1].clearType >= 9) ? "Draw" : "Lose"
                        } else player.pdata.stageLogs.log[0].clearTypeForClasscheck = (player.pdata.stageLogs.log[0].clearType >= 9) ? "Draw" : "Lose"
                    }
                } else {
                    player.pdata.stageLogs.log[0].clearTypeForClasscheck == "Win"
                    player.pdata.stageLogs.log[1].clearTypeForClasscheck == "Win"
                    player.pdata.stageLogs.log[2].clearTypeForClasscheck == "Win"
                }
            }
            if (player.pdata.stageLogs?.log?.length > 0) for (let i of player.pdata.stageLogs.log) await updateMusicRecordFromStageLog(rid, i, opm)
            if (player.pdata.released?.info?.length > 0) for (let i of player.pdata.released.info) opm.upsert<IRb4PlayerReleasedInfo>(rid, { collection: "rb.rb4.player.releasedInfo", type: i.type, id: i.id }, i)
            if (player.pdata.playerParam?.item?.length > 0) for (let i of player.pdata.playerParam.item) opm.upsert<IRb4PlayerParameters>(rid, { collection: "rb.rb4.player.parameters", type: i.type, bank: i.bank }, i)
            if (player.pdata.mylist?.list != null) opm.upsert<IRb4Mylist>(rid, { collection: "rb.rb4.player.mylist", index: player.pdata.mylist.list.index }, player.pdata.mylist.list)
            if (player.pdata.quest != null) await updateQuest(rid, player.pdata.quest, opm)
            if (player.pdata.stamp != null) opm.upsert<IRb4Stamp>(rid, { collection: "rb.rb4.player.stamp" }, player.pdata.stamp)
            if (player.pdata.episode.info != null) opm.upsert<IRb4Episode>(null, { collection: "rb.rb4.player.episode#userId", type: player.pdata.episode.info.type }, player.pdata.episode.info)
        }

        DBM.operate(opm)
    }

    export const ReadEpisode: EPR = async (_, data, send) => {
        let userId = $(data).number("user_id")
        let episodes = await DB.Find<IRb4Episode>({ collection: "rb.rb4.player.episode#userId", userId: userId })
        for (let e of episodes) if (e.text == null) e.text = ""
        let result: { pdata: { episode: { info?: IRb4Episode[] } } } = (episodes.length == 0) ? { pdata: { episode: {} } } : {
            pdata: { episode: { info: episodes } }
        }

        send.object(mapKObject(result, { pdata: { episode: { info: { 0: Rb4EpisodeMap } } } }))
    }

    export const ReadPlayerScore: EPR = async (_, data, send) => {
        let rid: string = $(data).str("rid")

        let scores: IRb4MusicRecord[] = await DB.Find<IRb4MusicRecord>(rid, { collection: "rb.rb4.playData.musicRecord" })
        let result = {
            pdata: {
                record: (scores?.length > 0) ? { rec: scores } : {}, recordOld: { rec: [] }
            }
        }

        let oldRecords = await findAllBestMusicRecord(rid, 4)
        for (let r of oldRecords) {
            result.pdata.recordOld.rec.push({
                collection: "rb.rb4.playData.musicRecord",
                musicId: r.musicId,
                chartType: r.chartType,
                playCount: r.playCount,
                clearType: translateRb4ClearType(r.clearType, r.gaugeType),
                achievementRateTimes100: r.achievementRateTimes100,
                score: r.score,
                combo: r.combo,
                missCount: r.missCount,
                param: r.param,
                bestAchievementRateUpdateTime: r.achievementRateUpdateTime,
                bestComboUpdateTime: r.comboUpdateTime,
                bestScoreUpdateTime: r.scoreUpdateTime,
                bestMissCountUpdateTime: r.missCountUpdateTime,
                version: (r.scoreVersion >= 4) ? 1 : r.scoreVersion,
                time: r.comboUpdateTime,
                kFlag: 0,
                isHasGhostBlue: false,
                isHasGhostRed: false
            })
        }

        if (result.pdata.recordOld.rec.length == 0) delete result.pdata.recordOld.rec

        send.object(mapKObject(result, {
            pdata: {
                record: { rec: { 0: Rb4MusicRecordMap } },
                recordOld: { rec: { 0: Rb4OldMusicRecordMap }, $targetKey: "record_old" }
            }
        }))
    }

    function translateRb4ClearType(clearType: ClearType, gaugeType: GaugeType): number {
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

    async function updateMusicRecordFromStageLog(rid: string, stageLog: IRb4PlayerStageLog, opm: DBM.DBOperationManager): Promise<void> {
        let query: Query<IRb4MusicRecord> = { $and: [{ collection: "rb.rb4.playData.musicRecord" }, { musicId: stageLog.musicId }, { chartType: stageLog.chartType }] }
        let musicRecord = await opm.findOne<IRb4MusicRecord>(rid, query)

        let newFlag = getClearTypeIndex(stageLog)
        if (newFlag < 0) return

        if (musicRecord == null) {
            musicRecord = generateRb4MusicRecord(stageLog.musicId, stageLog.chartType)
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

    async function updateClasscheckRecordFromLog(rid: string, log: IRb4PlayerClasscheckLog, time: number, musicsId: number[], chartsType: number[], opm: DBM.DBOperationManager): Promise<void> {
        let query: Query<IRb4ClasscheckRecord> = { collection: "rb.rb4.playData.classcheck", class: log.class }
        let classRecord = (await DB.Find<IRb4ClasscheckRecord>(rid, query))[0]
        let isNeedUpdate = false
        let isInitial = false

        if (classRecord == null) {
            classRecord = generateRb4ClasscheckRecord(log.class)
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
        if (isNeedUpdate) {
            classRecord.recordUpdateTime = time
        }
        classRecord.playCount++
        opm.upsert(rid, query, classRecord)
    }

    async function updateQuest(rid: string, quest: IRb4Quest, opm: DBM.DBOperationManager) {
        let old = await opm.findOne<IRb4Quest>(rid, { collection: "rb.rb4.player.quest" })
        if (old != null) quest.comment = old.comment
        if (quest.comment == null) quest.comment = ""
        opm.upsert<IRb4Quest>(rid, { collection: "rb.rb4.player.quest" }, quest)
    }

    function getClearTypeIndex(record: IRb4PlayerStageLog | IRb4MusicRecord): number {
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