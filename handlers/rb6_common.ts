import { generateRb6CharactorCard, IRb6CharacterCard } from "../models/rb6/character_card"
import { generateRb6ClasscheckRecord, IRb6ClasscheckRecord } from "../models/rb6/classcheck_record"
import { getExampleCourse, Rb6CourseMappingRecord } from "../models/rb6/course"
import { getExampleEventControl, Rb6EventControlMappingRecord } from "../models/rb6/event_control"
import { initializePlayer } from "./initialize_player"
import { IRb6JustCollectionElement, Rb6JustCollectionElementMappingRecord } from "../models/rb6/just_collection"
import { generateRb6MusicRecord, IRb6MusicRecord, Rb6MusicRecordMappingRecord } from "../models/rb6/music_record"
import { IRb6Mylist } from "../models/rb6/mylist"
import { generateRb6PlayerConfig, generateRb6PlayerCustom, IRb6Player, IRb6PlayerAccount, IRb6PlayerBase, IRb6PlayerClasscheckLog, IRb6PlayerConfig, IRb6PlayerCustom, IRb6PlayerParameters, IRb6PlayerReleasedInfo, IRb6PlayerStageLog, IRb6QuestRecord, Rb6PlayerReadMappingRecord, Rb6PlayerWriteMappingRecord } from "../models/rb6/profile"
import { KRb6ShopInfo } from "../models/rb6/shop_info"
import { KITEM2, KObjectMappingRecord, mapBackKObject, mapKObject } from "../utility/mapping"
import { readPlayerPostTask, writePlayerPredecessor } from "./system_parameter_controller"

export namespace Rb6Common {
    export const ReadInfo: EPR = async (info: EamuseInfo, data, send) => {
        switch (info.method) {

        }
        send.success()
    }

    export const BootPcb: EPR = async (_info: EamuseInfo, _data: any, send: EamuseSend) => {
        send.object({ sinfo: KRb6ShopInfo })
    }

    export const ReadHitChartInfo: EPR = async (_info: EamuseInfo, _data: any, send: EamuseSend) => {
        send.object({ ver: {} })
    }

    export const StartPlayer: EPR = async (info: EamuseInfo, _data: any, send: EamuseSend) => {
        let result = {
            plyid: 0,
            start_time: BigInt(0),
            event_ctrl: { data: getExampleEventControl() },
            item_lock_ctrl: {},
            quest_ctrl: { data: getExampleCourse() },
        }

        let map = {
            plyid: { $type: <"s32">"s32" },
            start_time: { $type: <"u64">"u64" },
            event_ctrl: {
                data: Rb6EventControlMappingRecord
            },
            item_lock_ctrl: {},
            quest_ctrl: {
                data: Rb6CourseMappingRecord
            }
        }
        send.object(mapKObject(result, map))
    }

    export const ReadPlayer: EPR = async (info: EamuseInfo, data: KITEM2<IPlayerReadParameters>, send: EamuseSend) => {
        let readParam: IPlayerReadParameters = mapBackKObject(data, PlayerReadParametersMappingRecord)[0]

        let playerAccount: Doc<IRb6PlayerAccount> = await DB.FindOne<IRb6PlayerAccount>(readParam.rid, { collection: "rb.rb6.player.account" })
        let playerBase: Doc<IRb6PlayerBase> = await DB.FindOne<IRb6PlayerBase>(readParam.rid, { collection: "rb.rb6.player.base" })
        let playerConfig: Doc<IRb6PlayerConfig> = await DB.FindOne<IRb6PlayerConfig>(readParam.rid, { collection: "rb.rb6.player.config" })
        let playerCustom: Doc<IRb6PlayerCustom> = await DB.FindOne<IRb6PlayerCustom>(readParam.rid, { collection: "rb.rb6.player.custom" })
        let classcheckRecords: Doc<IRb6ClasscheckRecord>[] = await DB.Find<IRb6ClasscheckRecord>(readParam.rid, { collection: "rb.rb6.playData.classcheck" })
        let characterCards: Doc<IRb6CharacterCard>[] = await DB.Find<IRb6CharacterCard>(readParam.rid, { collection: "rb.rb6.player.characterCard" })
        let releasedInfos = (await DB.Find<IRb6PlayerReleasedInfo>(readParam.rid, { collection: "rb.rb6.player.releasedInfo" }))
        let playerParam = (await DB.Find<IRb6PlayerParameters>(readParam.rid, { collection: "rb.rb6.player.parameters" }))
        let mylist = await DB.FindOne<IRb6Mylist>(readParam.rid, { collection: "rb.rb6.player.mylist" })
        let questRecords = await DB.Find<IRb6QuestRecord>(readParam.rid, { collection: "rb.rb6.playData.quest" })
        if (mylist?.index < 0) mylist.index = 0

        if (!playerAccount) {
            throw new Error("no player account for rid=" + readParam.rid)
        }
        if (!playerBase) {
            throw new Error("no player base data for rid=" + readParam.rid)
        }
        if (!playerConfig) {
            playerConfig = generateRb6PlayerConfig()
            await DB.Insert(readParam.rid, playerConfig)
        }
        if (!playerCustom) {
            playerCustom = generateRb6PlayerCustom()
            await DB.Insert(readParam.rid, playerCustom)
        }
        if (characterCards.length < 1) {
            let newCard = generateRb6CharactorCard(0)
            characterCards.push(newCard)
            await DB.Insert(readParam.rid, newCard)
        }
        let init = (v, i) => (v == null) ? i : v
        if (playerAccount.intrvld == null) playerAccount.intrvld = 0
        if (playerAccount.succeed == null) playerAccount.succeed = true
        if (playerAccount.pst == null) playerAccount.pst = BigInt(0)
        if (playerAccount.st == null) playerAccount.st = BigInt(0)
        if (playerAccount.opc == null) playerAccount.opc = 0
        playerAccount.tpc = 1000
        if (playerAccount.lpc == null) playerAccount.lpc = 0
        if (playerAccount.cpc == null) playerAccount.cpc = 0
        if (playerAccount.mpc == null) playerAccount.mpc = 0
        if (playerBase.comment == null) playerBase.comment = ""
        let scores: IRb6MusicRecord[] = await DB.Find<IRb6MusicRecord>(readParam.rid, { collection: "rb.rb6.playData.musicRecord" })

        playerBase.totalBestScore = 0
        playerBase.totalBestScoreEachChartType = [0, 0, 0, 0]
        for (let s of scores) {
            playerBase.totalBestScore += s.score
            playerBase.totalBestScoreEachChartType[s.chartType] += s.score
        }

        playerConfig.randomEntryWork = init(playerConfig.randomEntryWork, BigInt(Math.trunc(Math.random() * 99999999)))
        playerConfig.customFolderWork = init(playerConfig.randomEntryWork, BigInt(Math.trunc(Math.random() * 9999999999999)))

        let player: IRb6Player = {
            pdata: {
                account: playerAccount,
                base: playerBase,
                config: playerConfig,
                custom: playerCustom,
                classcheck: (classcheckRecords?.length == 0) ? <any>{} : { rec: classcheckRecords },
                characterCards: (characterCards?.length == 0) ? <any>{} : { list: characterCards },
                released: (releasedInfos?.length == 0) ? <any>{} : { info: releasedInfos },
                rival: {},
                pickupRival: {},
                announce: {},
                playerParam: (playerParam?.length == 0) ? <any>{} : { item: playerParam },
                mylist: (mylist == null) ? {} : { list: mylist },
                musicRankPoint: {},
                quest: (questRecords?.length == 0) ? {} : { list: questRecords },
                ghost: {},
                ghostWinCount: {},
                purpose: {}
            }
        }
        let k = mapKObject(player, Rb6PlayerReadMappingRecord)
        k = readPlayerPostTask(k)
        send.object(k)
    }

    export async function log(data: any, file?: string) {
        if (file == null) file = "./rb6log.txt"
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
                { collection: "rb.rb6.player.account" },
                { collection: "rb.rb6.player.base" },
                { collection: "rb.rb6.player.characterCard" },
                { collection: "rb.rb6.player.config" },
                { collection: "rb.rb6.player.custom" },
                { collection: "rb.rb6.playData.musicRecord" },
                { collection: "rb.rb6.playData.classcheck" },
                { collection: "rb.rb6.player.mylist" },
                { collection: "rb.rb6.player.parameters" },
            ]
            let uid = ridqueries[0].userId
            let uidqueries: Query<any>[] = [
                { collection: "rb.rb6.playData.justCollection", userId: uid }
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

    export const WritePlayer: EPR = async (info: EamuseInfo, data: KITEM2<IRb6Player>, send: EamuseSend) => {
        // try {
        data = writePlayerPredecessor(data)
        let player: IRb6Player = mapBackKObject(data, Rb6PlayerWriteMappingRecord)[0]
        let playCountQuery: Query<IRb6PlayerAccount> = { collection: "rb.rb6.player.account" }
        let playerAccountForPlayCountQuery: IRb6PlayerAccount = await DB.FindOne(player.pdata.account.rid, playCountQuery)
        if (player?.pdata?.account?.rid) {
            let rid = player.pdata.account.rid
            if (rid == "") throw new Error("rid is empty")
            if (playerAccountForPlayCountQuery == null) { // save the new player

                let userId

                do userId = Math.trunc(Math.random() * 99999999)
                while ((await DB.Find<IRb6PlayerAccount>({ collection: "rb.rb6.player.account", userId: userId })).length > 0)

                player.pdata.account.userId = userId
                player.pdata.account.isFirstFree = true
                initializePlayer(player)
                await DB.Upsert(rid, { collection: "rb.rb6.player.account" }, player.pdata.account)
                await DB.Upsert(rid, { collection: "rb.rb6.player.base" }, player.pdata.base)
                await DB.Upsert(rid, { collection: "rb.rb6.player.config" }, player.pdata.config)
                await DB.Upsert(rid, { collection: "rb.rb6.player.custom" }, player.pdata.custom)
            } else {
                playerAccountForPlayCountQuery.isFirstFree = false
                playerAccountForPlayCountQuery.playCount++
                await DB.Update(rid, { collection: "rb.rb6.player.account" }, playerAccountForPlayCountQuery)
            }
            if (player.pdata.stageLogs?.log?.length > 0) for (let i of player.pdata.stageLogs.log) await updateMusicRecordFromStageLog(rid, i)
            if (player.pdata.justCollections?.list?.length > 0) for (let i of player.pdata.justCollections.list) await updateJustCollection(player.pdata.account.userId, i)
            if (player.pdata.characterCards?.list?.length > 0) for (let i of player.pdata.characterCards.list) await DB.Upsert<IRb6CharacterCard>(rid, { collection: "rb.rb6.player.characterCard", charactorCardId: i.charactorCardId }, i)
            if (player.pdata.base) {
                let init = (v, i) => (v == null) ? i : v

                player.pdata.base.rankQuestScore = init(player.pdata.base.rankQuestScore, [0, 0, 0])
                player.pdata.base.rankQuestRank = init(player.pdata.base.rankQuestRank, [0, 0, 0])
                player.pdata.base.mLog = init(player.pdata.base.mLog, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
                player.pdata.base.ghostWinCount = init(player.pdata.base.ghostWinCount, 0)
                await DB.Upsert<IRb6PlayerBase>(rid, { collection: "rb.rb6.player.base" }, player.pdata.base)
            }
            if (player.pdata.config) await DB.Upsert<IRb6PlayerConfig>(rid, { collection: "rb.rb6.player.config" }, player.pdata.config)
            if (player.pdata.custom) await DB.Upsert<IRb6PlayerCustom>(rid, { collection: "rb.rb6.player.custom" }, player.pdata.custom)
            if ((<IRb6PlayerClasscheckLog>player.pdata.classcheck)?.class) {
                (player.pdata.classcheck as IRb6PlayerClasscheckLog).totalScore = player.pdata.stageLogs.log[0].score + player.pdata.stageLogs.log[1]?.score + player.pdata.stageLogs.log[2]?.score
                await updateClasscheckRecordFromLog(rid, <IRb6PlayerClasscheckLog>player.pdata.classcheck, player.pdata.stageLogs.log[player.pdata.stageLogs.log.length - 1].time)
            }
            if (player.pdata.released?.info?.length > 0) await updateReleasedInfos(rid, player.pdata.released)
            if (player.pdata.playerParam?.item?.length > 0) await updatePlayerParameters(rid, player.pdata.playerParam)
            if (player.pdata.mylist?.list != null) await DB.Upsert<IRb6Mylist>(rid, { collection: "rb.rb6.player.mylist", index: player.pdata.mylist.list.index }, player.pdata.mylist.list)
            if (player.pdata.quest?.list?.length > 0) for (let q of player.pdata.quest.list) await DB.Upsert<IRb6QuestRecord>(rid, { collection: "rb.rb6.playData.quest", dungeonId: q.dungeonId, dungeonGrade: q.dungeonGrade }, q)
        }
        send.object({ uid: K.ITEM("s32", player.pdata.account.userId) })
        // }
        // catch (e) {
        //     console.log((<Error>e).message)
        //     send.deny()
        // }
    }

    export const ReadPlayerScore: EPR = async (info: EamuseInfo, data: object, send: EamuseSend) => {
        let rid: string = $(data).str("rid")

        let scores: IRb6MusicRecord[] = await DB.Find<IRb6MusicRecord>(rid, { collection: "rb.rb6.playData.musicRecord" })
        let result = {
            pdata: { record: (scores?.length > 0) ? { rec: scores } : {} }
        }

        send.object(mapKObject(result, {
            pdata: { record: { rec: { 0: Rb6MusicRecordMappingRecord } } }
        }))
    }
    let defaultJcArray = null
    export const ReadPlayerJustCollections: EPR = async (info: EamuseInfo, data: KITEM2<IPlayerReadJustCollectionParameters>, send: EamuseSend) => {
        if (defaultJcArray == null) {
            defaultJcArray = []
            for (let i = 0; i < 20480; i++) defaultJcArray[i] = 0
        }
        let param = mapBackKObject(data, PlayerReadJustCollectioParametersMappingRecord)[0]
        if (param.userId == 15000008 && param.musicId == 1 && param.chartType == 2) {

            let k2
            k2 = {
                justcollection: {
                    list: {
                        music_id: K.ITEM("s32", 1),
                        note_grade: K.ITEM("s32", 2),
                        item_blue_data_bin: K.ITEM("bin", Buffer.from(defaultJcArray)),
                        item_red_data_bin: K.ITEM("bin", Buffer.from(defaultJcArray))
                    }
                }
            }
            send.object(k2)
            return
        }
        let element: IRb6JustCollectionElement = await DB.FindOne<IRb6JustCollectionElement>({ collection: "rb.rb6.playData.justCollection", userId: param.userId, musicId: param.musicId, chartType: param.chartType })
        if (element == null) element = { collection: "rb.rb6.playData.justCollection", musicId: param.musicId, chartType: param.chartType }
        else {
            if (element.blueDataArray != null) element.blueData = Buffer.from(element.blueDataArray)
            if (element.redDataArray != null) element.redData = Buffer.from(element.redDataArray)
            log(element)
        }
        let m = <KObjectMappingRecord<IRb6JustCollectionElement>>{}
        Object.assign(m, Rb6JustCollectionElementMappingRecord)
        m.userId.$type = "kignore"
        let k = mapKObject({ justcollection: { list: element } }, { justcollection: { list: m } })

        let k2
        k2 = {
            justcollection: {
                list: {
                    music_id: K.ITEM("s32", element.musicId),
                    note_grade: K.ITEM("s32", element.chartType)
                }
            }
        }
        if (element.blueDataArray != null) k2.justcollection.list.item_blue_data_bin = K.ITEM("bin", Buffer.from(element.blueDataArray))
        if (element.redDataArray != null) k2.justcollection.list.item_red_data_bin = K.ITEM("bin", Buffer.from(element.redDataArray))

        send.object(k2)
    }

    interface IPlayerReadParameters {
        rid: string
        lid: string
        ver: number
        card_id: string
        card_type: number
    }
    const PlayerReadParametersMappingRecord: KObjectMappingRecord<IPlayerReadParameters> = {
        rid: { $type: "str" },
        lid: { $type: "str" },
        ver: { $type: "s16" },
        card_id: { $type: "str" },
        card_type: { $type: "s16" }
    }

    interface IPlayerReadJustCollectionParameters {
        userId: number
        musicId: number
        chartType: number
    }
    const PlayerReadJustCollectioParametersMappingRecord: KObjectMappingRecord<IPlayerReadJustCollectionParameters> = {
        userId: { $type: "s32", $targetKey: "user_id" },
        musicId: { $type: "s32", $targetKey: "music_id" },
        chartType: { $type: "s8", $targetKey: "note_grade" }
    }

    async function updateMusicRecordFromStageLog(rid: string, stageLog: IRb6PlayerStageLog): Promise<void> {
        let query: Query<IRb6MusicRecord> = { $and: [{ collection: "rb.rb6.playData.musicRecord" }, { musicId: stageLog.musicId }, { chartType: stageLog.chartType }] }
        let musicRecord = await DB.FindOne<IRb6MusicRecord>(rid, query)

        let newFlag = getClearTypeIndex(stageLog)
        if (newFlag < 0) return

        if (musicRecord == null) {

            musicRecord = generateRb6MusicRecord(stageLog.musicId, stageLog.chartType)
            musicRecord.clearType = stageLog.clearType
            musicRecord.achievementRateTimes100 = stageLog.achievementRateTimes100
            musicRecord.score = stageLog.score
            musicRecord.combo = stageLog.combo
            musicRecord.missCount = stageLog.missCount
            musicRecord.param = stageLog.param
            musicRecord.time = stageLog.time
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
            if ((stageLog.color = 0) && (musicRecord.justCollectionRateTimes100Red < stageLog.justCollectionRateTimes100)) { // just collectioin red
                musicRecord.justCollectionRateTimes100Red = stageLog.justCollectionRateTimes100
            }
            if ((stageLog.color = 1) && (musicRecord.justCollectionRateTimes100Blue < stageLog.justCollectionRateTimes100)) { // just collectioin blue
                musicRecord.justCollectionRateTimes100Blue = stageLog.justCollectionRateTimes100
            }
        }

        musicRecord.playCount++
        await DB.Upsert(rid, query, musicRecord)
        await DB.Insert(rid, stageLog)
    }

    async function updateClasscheckRecordFromLog(rid: string, log: IRb6PlayerClasscheckLog, time: number): Promise<void> {
        let query: Query<IRb6ClasscheckRecord> = { collection: "rb.rb6.playData.classcheck", class: log.class }
        let classRecord = (await DB.Find<IRb6ClasscheckRecord>(rid, query))[0]
        let isNeedUpdate = false
        let isInitial = false

        if (classRecord == null) {
            classRecord = generateRb6ClasscheckRecord(log.class)
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
        await DB.Upsert(rid, query, classRecord)
    }

    async function updateJustCollection(userId: number, justColElement: IRb6JustCollectionElement): Promise<void> {
        let query: Query<IRb6JustCollectionElement> = { collection: "rb.rb6.playData.justCollection", userId: userId, musicId: justColElement.musicId, chartType: justColElement.chartType }
        let old = await DB.FindOne(query)
        justColElement.userId = userId
        if (old == null) {
            old = justColElement
        }
        if (justColElement.redData != null) {
            old.redDataArray = justColElement.redData.toJSON().data
        }
        if (justColElement.blueData != null) {
            old.blueDataArray = justColElement.blueData.toJSON().data
        }
        await DB.Upsert(query, old)
    }

    async function updateReleasedInfos(rid: string, infos: { info: IRb6PlayerReleasedInfo[] }) {
        for (let i of infos.info) await DB.Upsert<IRb6PlayerReleasedInfo>(rid, { collection: "rb.rb6.player.releasedInfo", type: i.type, id: i.id }, i)
    }

    async function updatePlayerParameters(rid: string, params: { item: IRb6PlayerParameters[] }) {
        for (let i of params.item) await DB.Upsert<IRb6PlayerParameters>(rid, { collection: "rb.rb6.player.parameters", type: i.type, bank: i.bank }, i)
    }

    function getClearTypeIndex(record: IRb6PlayerStageLog | IRb6MusicRecord): number {
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