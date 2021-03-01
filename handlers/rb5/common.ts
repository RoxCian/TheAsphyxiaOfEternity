import { generateRb5ClasscheckRecord, IRb5ClasscheckRecord } from "../../models/rb5/classcheck_record"
import { getExampleEventControl, Rb5EventControlMap } from "../../models/rb5/event_control"
import { initializePlayer } from "./initialize_player"
import { generateRb5MusicRecord, IRb5MusicRecord, Rb5MusicRecordMap } from "../../models/rb5/music_record"
import { IRb5Mylist } from "../../models/rb5/mylist"
import { generateRb5BattleRoyale, generateRb5MyCourseLog, IRb5BattleRoyale, IRb5Derby, IRb5Minigame, IRb5MyCourseLog, IRb5Player, IRb5PlayerAccount, IRb5PlayerBase, IRb5PlayerClasscheckLog, IRb5PlayerConfig, IRb5PlayerCustom, IRb5PlayerParameters, IRb5PlayerReleasedInfo, IRb5PlayerStageLog, Rb5PlayerReadMap, Rb5PlayerWriteMap } from "../../models/rb5/profile"
import { KRb5ShopInfo } from "../../models/rb5/shop_info"
import { KITEM2, KObjectMappingRecord, mapBackKObject, mapKObject } from "../../utility/mapping"
import { readPlayerPostTask, writePlayerPredecessor } from "./system_parameter_controller"
import { generateRb5Profile } from "../../models/rb5/profile"
import { IRb6PlayerAccount, IRb6PlayerBase } from "../../models/rb6/profile"
import { DBM } from "../../utility/db_manager"
import { generateKRb5LobbyController } from "../../models/rb5/lobby_entry_controller"
import { tryFindPlayer } from "../utility/try_find_player"
import { ClearType, findBestMusicRecord, findMusicRecordMetadatas, GaugeType } from "../utility/find_music_record"
import { getMusicId } from "../../data/musicinfo/rb_music_info"
import { networkInterfaces } from "os"

export namespace Rb5HandlersCommon {
    export const ReadInfo: EPR = async (info: EamuseInfo, data, send) => {
        switch (info.method) {

        }
        send.success()
    }

    export const BootPcb: EPR = async (_info: EamuseInfo, _data: any, send: EamuseSend) => {
        send.object({ sinfo: KRb5ShopInfo })
    }

    export const ReadHitChartInfo: EPR = async (_info: EamuseInfo, _data: any, send: EamuseSend) => {
        send.object({ ver: {} })
    }

    export const StartPlayer: EPR = async (info: EamuseInfo, _data: any, send: EamuseSend) => {
        let data = <any>getExampleEventControl()
        data.nm = 0
        let result = {
            plyid: 0,
            nm: 0,
            start_time: BigInt(0),
            event_ctrl: { data: data },
            item_lock_ctrl: {},
        }

        let datamap: any = {}
        Object.assign(datamap, Rb5EventControlMap)
        datamap.nm = { $type: "s32" }
        let map = {
            plyid: { $type: <"s32">"s32" },
            nm: { $type: <"s32">"s32" },
            start_time: { $type: <"u64">"u64" },
            event_ctrl: {
                data: datamap
            },
            item_lock_ctrl: {},
        }
        send.object(mapKObject(result, map))
    }

    export const ReadPlayer: EPR = async (info: EamuseInfo, data: KITEM2<IPlayerReadParameters>, send: EamuseSend) => {
        let readParam: IPlayerReadParameters = mapBackKObject(data, PlayerReadParametersMap)[0]
        let result: IRb5Player
        let account: IRb5PlayerAccount = await DB.FindOne<IRb5PlayerAccount>(readParam.rid, { collection: "rb.rb5.player.account" })
        if (account == null) {
            let rbPlayer = await tryFindPlayer(readParam.rid, 5)
            if (rbPlayer != null) {
                result = generateRb5Profile(readParam.rid, rbPlayer.userId)
                result.pdata.base.name = rbPlayer.name
            } else {
                let userId

                do userId = Math.trunc(Math.random() * 99999999)
                while ((await DB.Find<IRb5PlayerAccount>({ collection: "rb.rb5.player.account", userId: userId })).length > 0)

                result = generateRb5Profile(readParam.rid, rbPlayer.userId)
                result.pdata.account.isFirstFree = true
                result.pdata.base.name = "RBPlayer"
                initializePlayer(result)
            }
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
            account.tpc = 1000
            if (account.lpc == null) account.lpc = 0
            if (account.cpc == null) account.cpc = 0
            if (account.mpc == null) account.mpc = 0
            if (base.comment == null) base.comment = "Welcome to REFLEC BEAT VOLZZA!"
            if (base.abilityPointTimes100 == null) base.abilityPointTimes100 = base["averagePrecisionTimes100"] // For compatibility
            if (base.mlog == null) base.mlog = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            if (battleRoyale == null) battleRoyale = generateRb5BattleRoyale()
            if (myCourse == null) myCourse = generateRb5MyCourseLog()
            if (mylist.index < 0) mylist.index = 0
            let scores: IRb5MusicRecord[] = await DB.Find<IRb5MusicRecord>(readParam.rid, { collection: "rb.rb5.playData.musicRecord" })

            base.totalBestScore = 0
            base.totalBestScoreEachChartType = [0, 0, 0, 0]
            for (let s of scores) {
                base.totalBestScore += s.score
                base.totalBestScoreEachChartType[s.chartType] += s.score
            }

            config.randomEntryWork = init(config.randomEntryWork, BigInt(Math.trunc(Math.random() * 99999999)))
            config.customFolderWork = init(config.randomEntryWork, BigInt(Math.trunc(Math.random() * 9999999999999)))


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
        send.object(readPlayerPostTask(mapKObject(result, Rb5PlayerReadMap)))
    }

    export async function log(data: any, file?: string) {
        if (file == null) file = "./rb5log.txt"
        let s = IO.Exists(file) ? await IO.ReadFile(file, "") : ""
        if (typeof data == "string") s += data + "\n"
        else {
            let n = ""
            try {
                n = JSON.stringify(data)
            } catch { }
            s += n + "\n"
        }
        await IO.WriteFile(file, s)
    }

    export const DeletePlayer: EPR = async (info: EamuseInfo, data: KITEM2<{ rid: string }>, send: EamuseSend) => {
        try {
            let rid = data.rid["@content"]
            let ridqueries: Query<any>[] = [
                { collection: "rb.rb5.player.account" },
                { collection: "rb.rb5.player.base" },
                { collection: "rb.rb5.player.characterCard" },
                { collection: "rb.rb5.player.config" },
                { collection: "rb.rb5.player.custom" },
                { collection: "rb.rb5.playData.musicRecord" },
                { collection: "rb.rb5.playData.classcheck" },
                { collection: "rb.rb5.player.mylist" },
                { collection: "rb.rb5.player.parameters" },
            ]
            let uid = ridqueries[0].userId
            let uidqueries: Query<any>[] = [
                { collection: "rb.rb5.playData.justCollection", userId: uid }
            ]
            for (let q of ridqueries) {
                DB.Remove(rid, q)
            }
            for (let q of uidqueries) {
                DB.Remove(q)
            }

            send.success()
        } catch (e) {
            console.log((<Error>e).message)
            send.deny()
        }
    }

    export const WritePlayer: EPR = async (info: EamuseInfo, data: KITEM2<IRb5Player>, send: EamuseSend) => {
        // try {
        data = writePlayerPredecessor(data)
        let player: IRb5Player = mapBackKObject(data, Rb5PlayerWriteMap)[0]
        let playCountQuery: Query<IRb5PlayerAccount> = { collection: "rb.rb5.player.account" }
        let playerAccountForPlayCountQuery: IRb5PlayerAccount = await DB.FindOne(player.pdata.account.rid, playCountQuery)
        if (player?.pdata?.account?.rid) {
            let rid = player.pdata.account.rid
            if (rid == "") throw new Error("rid is empty")
            if (playerAccountForPlayCountQuery == null) { // save the new player
                if (player.pdata.account.userId <= 0) {
                    let userId

                    do userId = Math.trunc(Math.random() * 99999999)
                    while ((await DB.Find<IRb5PlayerAccount>({ collection: "rb.rb5.player.account", userId: userId })).length > 0)

                    player.pdata.account.userId = userId
                    player.pdata.account.isFirstFree = true
                    initializePlayer(player)
                }
                await DBM.upsert(rid, { collection: "rb.rb5.player.account" }, player.pdata.account)
            } else {
                playerAccountForPlayCountQuery.isFirstFree = false
                playerAccountForPlayCountQuery.playCount++
                await DBM.update(rid, { collection: "rb.rb5.player.account" }, playerAccountForPlayCountQuery)
            }
            if (player.pdata.base) await DBM.upsert<IRb5PlayerBase>(rid, { collection: "rb.rb5.player.base" }, player.pdata.base)
            if (player.pdata.config) await DBM.upsert<IRb5PlayerConfig>(rid, { collection: "rb.rb5.player.config" }, player.pdata.config)
            if (player.pdata.custom) await DBM.upsert<IRb5PlayerCustom>(rid, { collection: "rb.rb5.player.custom" }, player.pdata.custom)
            if (player.pdata.stageLogs?.log?.length > 0) for (let i of player.pdata.stageLogs.log) await updateMusicRecordFromStageLog(rid, i)
            if ((<IRb5PlayerClasscheckLog>player.pdata.classcheck)?.class) {
                (player.pdata.classcheck as IRb5PlayerClasscheckLog).totalScore = player.pdata.stageLogs.log[0].score + player.pdata.stageLogs.log[1]?.score + player.pdata.stageLogs.log[2]?.score
                await updateClasscheckRecordFromLog(rid, <IRb5PlayerClasscheckLog>player.pdata.classcheck, player.pdata.stageLogs.log[player.pdata.stageLogs.log.length - 1].time)
            }
            if (player.pdata.released?.info?.length > 0) await updateReleasedInfos(rid, player.pdata.released)
            if (player.pdata.playerParam?.item?.length > 0) await updatePlayerParameters(rid, player.pdata.playerParam)
            if (player.pdata.mylist?.list != null) await DBM.upsert<IRb5Mylist>(rid, { collection: "rb.rb5.player.mylist", index: player.pdata.mylist.list.index }, player.pdata.mylist.list)
            if (player.pdata.minigame != null) await DBM.upsert<IRb5Minigame>(rid, { collection: "rb.rb5.playData.minigame", minigameId: player.pdata.minigame.minigameId }, player.pdata.minigame)
            if (player.pdata.myCourse?.courseId >= 0) await DBM.upsert<IRb5MyCourseLog>(rid, { collection: "rb.rb5.playData.myCourse", courseId: player.pdata.myCourse.courseId }, player.pdata.myCourse)
            if (player.pdata.derby != null) await DBM.upsert<IRb5Derby>(rid, { collection: "rb.rb5.player.derby" }, player.pdata.derby)
            if (player.pdata.battleRoyale != null) await DBM.upsert<IRb5BattleRoyale>(rid, { collection: "rb.rb5.playData.battleRoyale", battleId: player.pdata.battleRoyale.battleId }, player.pdata.battleRoyale)
        }
        send.object({ uid: K.ITEM("s32", player.pdata.account.userId) })
        // }
        // catch (e) {
        //     console.log((<Error>e).message)
        //     send.deny()
        // }
    }

    export const ReadLobby: EPR = async (info: EamuseInfo, data: object, send: EamuseSend) => {
        send.object(generateKRb5LobbyController())
    }

    export const ReadPlayerScore: EPR = async (info: EamuseInfo, data: object, send: EamuseSend) => {
        let rid: string = $(data).str("rid")

        let scores: IRb5MusicRecord[] = await DB.Find<IRb5MusicRecord>(rid, { collection: "rb.rb5.playData.musicRecord" })
        let result = {
            pdata: { record: (scores?.length > 0) ? { rec: scores } : {} }
        }

        send.object(mapKObject(result, {
            pdata: { record: { rec: { 0: Rb5MusicRecordMap } } }
        }))
    }
    export const ReadPlayerScoreOldVersion: EPR = async (info: EamuseInfo, data: object, send: EamuseSend) => {
        let rid: string = $(data).str("rid")
        let metas = await findMusicRecordMetadatas(rid)

        let result = {
            pdata: { record: { rec: <IRb5MusicRecord[]>[] } }
        }

        for (let mk of metas) {
            let midstr = mk.split(":")[0]
            let chart = parseInt(mk.split(":")[1])
            let mid = getMusicId(midstr, 5)
            let bestRecord = await findBestMusicRecord(rid, midstr, chart, 5)
            if (bestRecord == null) continue
            result.pdata.record.rec.push({
                collection: "rb.rb5.playData.musicRecord",
                musicId: mid,
                chartType: chart,
                playCount: bestRecord.playCount,
                param: bestRecord.param,
                clearType: translateRb5ClearType(bestRecord.clearType, bestRecord.gaugeType),
                achievementRateTimes100: bestRecord.achievementRateTimes100,
                score: bestRecord.score,
                missCount: bestRecord.missCount,
                combo: bestRecord.combo,
                time: Math.trunc(Date.now() / 1000),
                bestAchievementRateUpdateTime: Math.trunc(Date.now() / 1000),
                bestComboUpdateTime: Math.trunc(Date.now() / 1000),
                bestMissCountUpdateTime: Math.trunc(Date.now() / 1000),
                bestScoreUpdateTime: Math.trunc(Date.now() / 1000),
                kFlag: 0,
                isHasGhostBlue: false,
                isHasGhostRed: false
            })
        }
        if (result.pdata.record.rec.length == 0) delete result.pdata.record.rec
        send.object(mapKObject(result, {
            pdata: { record: { rec: { 0: Rb5MusicRecordMap }, $targetKey: "record_old" } }
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

    export const WriteComment: EPR = async (req, data, send) => {

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

    async function updateMusicRecordFromStageLog(rid: string, stageLog: IRb5PlayerStageLog): Promise<void> {
        let query: Query<IRb5MusicRecord> = { $and: [{ collection: "rb.rb5.playData.musicRecord" }, { musicId: stageLog.musicId }, { chartType: stageLog.chartType }] }
        let musicRecord = await DB.FindOne<IRb5MusicRecord>(rid, query)

        let newFlag = getClearTypeIndex(stageLog)
        if (newFlag < 0) return

        if (musicRecord == null) {

            musicRecord = generateRb5MusicRecord(stageLog.musicId, stageLog.chartType)
            musicRecord.clearType = stageLog.clearType
            musicRecord.achievementRateTimes100 = stageLog.achievementRateTimes100
            musicRecord.score = stageLog.score
            musicRecord.missCount = stageLog.missCount
            musicRecord.param = stageLog.param
            musicRecord.time = stageLog.time
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

        musicRecord.playCount++
        await DBM.upsert(rid, query, musicRecord)
        await DBM.insert(rid, stageLog)
    }

    async function updateClasscheckRecordFromLog(rid: string, log: IRb5PlayerClasscheckLog, time: number): Promise<void> {
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
        if (isInitial || (log.totalScore > classRecord.totalScore)) {
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
        await DBM.upsert(rid, query, classRecord)
    }

    async function updateReleasedInfos(rid: string, infos: { info: IRb5PlayerReleasedInfo[] }) {
        for (let i of infos.info) await DBM.upsert<IRb5PlayerReleasedInfo>(rid, { collection: "rb.rb5.player.releasedInfo", type: i.type, id: i.id }, i)
    }

    async function updatePlayerParameters(rid: string, params: { item: IRb5PlayerParameters[] }) {
        for (let i of params.item) await DBM.upsert<IRb5PlayerParameters>(rid, { collection: "rb.rb5.player.parameters", type: i.type, bank: i.bank }, i)
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