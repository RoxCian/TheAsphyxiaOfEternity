import { generateRb6CharactorCard, IRb6CharacterCard } from "../../models/rb6/character_card"
import { generateRb6ClasscheckRecord, IRb6ClasscheckRecord } from "../../models/rb6/classcheck_record"
import { getExampleCourse, Rb6QuestMap } from "../../models/rb6/course"
import { getExampleEventControl, Rb6EventControlMap } from "../../models/rb6/event_control"
import { initializePlayer } from "./initialize_player"
import { IRb6JustCollection, IRb6ReadJustCollection, Rb6ReadJustCollectionMap } from "../../models/rb6/just_collection"
import { generateRb6MusicRecord, IRb6MusicRecord, Rb6MusicRecordMap } from "../../models/rb6/music_record"
import { IRb6Mylist } from "../../models/rb6/mylist"
import { generateRb6PlayerConfig, generateRb6PlayerCustom, generateRb6Profile, IRb6Ghost, IRb6Player, IRb6PlayerAccount, IRb6PlayerBase, IRb6PlayerClasscheckLog, IRb6PlayerConfig, IRb6PlayerCustom, IRb6PlayerParameters, IRb6PlayerReleasedInfo, IRb6PlayerStageLog, IRb6QuestRecord, Rb6GhostMap, Rb6PlayerReadMap, Rb6PlayerReleasedInfoMap, Rb6PlayerWriteMap } from "../../models/rb6/profile"
import { KRb6ShopInfo } from "../../models/rb6/shop_info"
import { KITEM2, KObjectMappingRecord, mapBackKObject, mapKObject, s32me, strme, toBigInt, u8me } from "../../utility/mapping"
import { readPlayerPostProcess, writePlayerPreProcess } from "./processing"
import { DBM } from "../utility/db_manager"
import { tryFindPlayer } from "../utility/try_find_player"
import { base64ToBuffer, bufferToBase64, isToday } from "../../utility/utility_functions"
import { generateUserId } from "../utility/generate_user_id"
import { BigIntProxy, s8me } from "../../utility/mapping"

export namespace Rb6HandlersCommon {
    export const BootPcb: EPR = async (_, _data, send) => {
        send.object({ sinfo: KRb6ShopInfo })
    }

    export const ReadHitChartInfo: EPR = async (_, _data, send) => {
        send.object({ ver: {} })
    }

    export const PlayerSucceeded: EPR = async (_, data, send) => {
        let rid = $(data).str("rid")
        let account: IRb6PlayerAccount = await DB.FindOne<IRb6PlayerAccount>(rid, { collection: "rb.rb6.player.account" })
        let result
        if (account == null) {
            result = {
                name: "",
                lv: -1,
                exp: -1,
                grd: -1,
                ap: -1,
                released: {},
                mrecord: {}
            }
        } else {
            let base: IRb6PlayerBase = await DB.FindOne<IRb6PlayerBase>(rid, { collection: "rb.rb6.player.base" })
            let released: IRb6PlayerReleasedInfo[] = await DB.Find<IRb6PlayerReleasedInfo>(rid, { collection: "rb.rb6.player.releasedInfo" })
            let record: IRb6MusicRecord[] = await DB.Find<IRb6MusicRecord>(rid, { collection: "rb.rb6.playData.musicRecord" })
            result = {
                name: base.name,
                lv: 0,
                exp: 0,
                grd: base.matchingGrade,
                ap: base.abilityPointTimes100,
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
            released: { i: { 0: Rb6PlayerReleasedInfoMap } },
            mrecord: { mrec: { 0: Rb6MusicRecordMap } }
        }))
    }


    export const StartPlayer: EPR = async (_, _data, send) => {
        // await Rb6HandlersCommon.bat()
        let rid = $(_data).str("rid")
        let account: IRb6PlayerAccount = await DB.FindOne<IRb6PlayerAccount>(rid, { collection: "rb.rb6.player.account" })
        let result = {
            plyid: (account != null) ? account.playerId : -1,
            start_time: BigInt(0),
            event_ctrl: { data: getExampleEventControl() },
            item_lock_ctrl: {
                data: {
                    type: 0,
                    id: 0,
                    param: 15
                }
            },
            quest_ctrl: { data: getExampleCourse() },
        }

        let map = {
            plyid: { $type: <"s32">"s32" },
            start_time: { $type: <"u64">"u64" },
            event_ctrl: {
                data: { 0: Rb6EventControlMap }
            },
            item_lock_ctrl: {
                data: {
                    type: { $type: <"u8">"u8" },
                    id: { $type: <"u8">"u8" },
                    param: { $type: <"u8">"u8" }
                }
            },
            quest_ctrl: {
                data: { 0: Rb6QuestMap }
            }
        }
        send.object(mapKObject(result, map))
    }

    export const ReadPlayer: EPR = async (_, data: KITEM2<IPlayerReadParameters>, send) => {
        let readParam: IPlayerReadParameters = mapBackKObject(data, PlayerReadParametersMap)[0]

        let account: IRb6PlayerAccount = await DB.FindOne<IRb6PlayerAccount>(readParam.rid, { collection: "rb.rb6.player.account" })
        let result: IRb6Player
        if (account == null) {
            let rbPlayer = await tryFindPlayer(readParam.rid, 6)
            if (rbPlayer != null) {
                result = generateRb6Profile(readParam.rid, rbPlayer.userId)
                result.pdata.base.name = rbPlayer.name
            } else {
                result = generateRb6Profile(readParam.rid, await generateUserId())
                result.pdata.account.isFirstFree = true
                result.pdata.base.name = "RBPlayer"
                initializePlayer(result)
            }
            await writePlayerInternal(result)
            result.pdata.account.playCount = 1
        } else {
            let base: Doc<IRb6PlayerBase> = await DB.FindOne<IRb6PlayerBase>(readParam.rid, { collection: "rb.rb6.player.base" })
            let config: Doc<IRb6PlayerConfig> = await DB.FindOne<IRb6PlayerConfig>(readParam.rid, { collection: "rb.rb6.player.config" })
            let custom: Doc<IRb6PlayerCustom> = await DB.FindOne<IRb6PlayerCustom>(readParam.rid, { collection: "rb.rb6.player.custom" })
            let classcheckRecords: Doc<IRb6ClasscheckRecord>[] = await DB.Find<IRb6ClasscheckRecord>(readParam.rid, { collection: "rb.rb6.playData.classcheck" })
            let characterCards: Doc<IRb6CharacterCard>[] = await DB.Find<IRb6CharacterCard>(readParam.rid, { collection: "rb.rb6.player.characterCard" })
            let releasedInfos = (await DB.Find<IRb6PlayerReleasedInfo>(readParam.rid, { collection: "rb.rb6.player.releasedInfo" }))
            let param = (await DB.Find<IRb6PlayerParameters>(readParam.rid, { collection: "rb.rb6.player.parameters" }))
            let mylist = await DB.FindOne<IRb6Mylist>(readParam.rid, { collection: "rb.rb6.player.mylist" })
            let questRecords = await DB.Find<IRb6QuestRecord>(readParam.rid, { collection: "rb.rb6.playData.quest" })
            let ghosts = [] // await DB.Find<IRb6Ghost>({ collection: "rb.rb6.playData.ghost#userId", userId: account.userId })
            if (mylist?.index < 0) mylist.index = 0

            if (!account) {
                throw new Error("no player account for rid=" + readParam.rid)
            }
            if (!base) {
                throw new Error("no player base data for rid=" + readParam.rid)
            }
            if (!config) {
                config = generateRb6PlayerConfig()
                await DBM.insert(readParam.rid, config)
            }
            if (!custom) {
                custom = generateRb6PlayerCustom()
                await DBM.insert(readParam.rid, custom)
            }
            if (characterCards.length < 1) {
                let newCard = generateRb6CharactorCard(0)
                characterCards.push(newCard)
                await DBM.insert(readParam.rid, newCard)
            }
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
            account.playCount++
            if (account.lpc == null) account.lpc = 0
            if (account.cpc == null) account.cpc = 0
            if (account.mpc == null) account.mpc = 0
            if ((base.comment == null) || (base?.comment == "")) base.comment = "Welcome to the land of Reflesia!"
            if (base.abilityPointTimes100 == null) base.abilityPointTimes100 = base["averagePrecisionTimes100"]  // For compatibility
            for (let c of characterCards) if (c.level == null) c.level = 0

            let scores: IRb6MusicRecord[] = await DB.Find<IRb6MusicRecord>(readParam.rid, { collection: "rb.rb6.playData.musicRecord" })

            base.totalBestScore = 0
            base.totalBestScoreEachChartType = [0, 0, 0, 0]
            for (let s of scores) {
                base.totalBestScore += s.score
                base.totalBestScoreEachChartType[s.chartType] += s.score
            }

            config.randomEntryWork = init(config.randomEntryWork, BigInt(Math.trunc(Math.random() * 99999999)))
            config.customFolderWork = init(config.randomEntryWork, BigInt(Math.trunc(Math.random() * 9999999999999)))

            // Twitter support test
            config.isTwitterLinked = true
            config.isTweet = true
            //

            // Classcheck unlock test
            base.uattr = 2
            account.crd = 3
            account.playCountToday = 3
            account.brd = 3
            account.dayCount = 3
            //

            // Ghost binary data
            for (let g of ghosts) {
                if (g.blueDataBase64) g.blueData = base64ToBuffer(g.blueDataBase64, 10240)
                if (g.redDataBase64) g.redData = base64ToBuffer(g.redDataBase64, 10240)
            }
            //

            result = {
                pdata: {
                    account: account,
                    base: base,
                    config: config,
                    custom: custom,
                    classcheck: (classcheckRecords?.length == 0) ? <any>{} : { rec: classcheckRecords },
                    characterCards: (characterCards?.length == 0) ? <any>{} : { list: characterCards },
                    released: (releasedInfos?.length == 0) ? <any>{} : { info: releasedInfos },
                    rival: {},
                    pickupRival: {},
                    announce: {},
                    playerParam: (param?.length == 0) ? <any>{} : { item: param },
                    mylist: (mylist == null) ? {} : { list: mylist },
                    musicRankPoint: {},
                    quest: (questRecords?.length == 0) ? {} : { list: questRecords },
                    ghost: (ghosts?.length == 0) ? {} : { list: ghosts },
                    ghostWinCount: { info: base.ghostWinCount },
                    purpose: {}
                }
            }
        }
        let k = mapKObject(result, Rb6PlayerReadMap)
        k = readPlayerPostProcess(k)
        send.object(k)
    }

    export const DeletePlayer: EPR = async (_, data: KITEM2<{ rid: string }>, send) => {
        try {
            let rid = data.rid["@content"]
            let account = await DB.FindOne<IRb6PlayerAccount>(rid, { collection: "rb.rb6.player.account" })
            await DBM.overall(rid, account?.userId, "rb.rb6", "delete")

            send.success()
        } catch (e) {
            console.log((<Error>e).message)
            send.deny()
        }
    }

    export const WritePlayer: EPR = async (_, data: KITEM2<IRb6Player>, send) => {
        data = writePlayerPreProcess(data)
        let player: IRb6Player = mapBackKObject(data, Rb6PlayerWriteMap)[0]
        await writePlayerInternal(player)
        send.object({ uid: K.ITEM("s32", player.pdata.account.userId) })
    }
    async function writePlayerInternal(player: IRb6Player) {
        let opm = new DBM.DBOperationManager()
        let playCountQuery: Query<IRb6PlayerAccount> = { collection: "rb.rb6.player.account" }
        let playerAccountForPlayCountQuery: IRb6PlayerAccount = await opm.findOne(player.pdata.account.rid, playCountQuery)
        if (player?.pdata?.account?.rid) {
            let rid = player.pdata.account.rid
            if (rid == "") throw new Error("rid is empty")
            if (playerAccountForPlayCountQuery == null) { // save the new player
                player.pdata.account.userId = await generateUserId()
                player.pdata.account.isFirstFree = true
                initializePlayer(player)
                opm.upsert(rid, { collection: "rb.rb6.player.account" }, player.pdata.account)
                opm.upsert(rid, { collection: "rb.rb6.player.base" }, player.pdata.base)
                opm.upsert(rid, { collection: "rb.rb6.player.config" }, player.pdata.config)
                opm.upsert(rid, { collection: "rb.rb6.player.custom" }, player.pdata.custom)
            } else {
                playerAccountForPlayCountQuery.isFirstFree = false
                playerAccountForPlayCountQuery.playCount++
                if (!isToday(toBigInt(playerAccountForPlayCountQuery.st))) {
                    playerAccountForPlayCountQuery.dayCount++
                    playerAccountForPlayCountQuery.playCountToday = 0
                }
                playerAccountForPlayCountQuery.playCountToday++
                playerAccountForPlayCountQuery.st = BigIntProxy(BigInt(Date.now()))

                opm.update(rid, { collection: "rb.rb6.player.account" }, playerAccountForPlayCountQuery)
            }
            if (player.pdata.stageLogs?.log?.length > 0) for (let i of player.pdata.stageLogs.log) await updateMusicRecordFromStageLog(rid, i, opm)
            if (player.pdata.justCollections?.list?.length > 0) for (let i of player.pdata.justCollections.list) await updateJustCollection(player.pdata.account.userId, i, opm)
            if (player.pdata.characterCards?.list?.length > 0) for (let i of player.pdata.characterCards.list) opm.upsert<IRb6CharacterCard>(rid, { collection: "rb.rb6.player.characterCard", characterCardId: i.characterCardId }, i)
            if (player.pdata.base) {
                let init = (v, i) => (v == null) ? i : v

                player.pdata.base.rankQuestScore = init(player.pdata.base.rankQuestScore, [0, 0, 0])
                player.pdata.base.rankQuestRank = init(player.pdata.base.rankQuestRank, [0, 0, 0])
                player.pdata.base.mLog = init(player.pdata.base.mLog, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
                player.pdata.base.ghostWinCount = init(player.pdata.base.ghostWinCount, 0)
                let oldBase = await opm.findOne<IRb6PlayerBase>(rid, { collection: "rb.rb6.player.base" })
                if (oldBase != null) {
                    if (oldBase.name != null) player.pdata.base.name = oldBase.name
                    player.pdata.base.comment = oldBase.comment
                } else {
                    if (player.pdata.base.comment == "Welcome to the land of Reflesia!") player.pdata.base.comment = ""
                }
                opm.upsert<IRb6PlayerBase>(rid, { collection: "rb.rb6.player.base" }, player.pdata.base)
            }
            if (player.pdata.config) opm.upsert<IRb6PlayerConfig>(rid, { collection: "rb.rb6.player.config" }, player.pdata.config)
            if (player.pdata.custom) opm.upsert<IRb6PlayerCustom>(rid, { collection: "rb.rb6.player.custom" }, player.pdata.custom)
            if ((<IRb6PlayerClasscheckLog>player.pdata.classcheck)?.class) {
                (player.pdata.classcheck as IRb6PlayerClasscheckLog).totalScore = player.pdata.stageLogs.log[0].score + (player.pdata.stageLogs.log[1] == null ? 0 : player.pdata.stageLogs.log[1].score) + (player.pdata.stageLogs.log[2] == null ? 0 : player.pdata.stageLogs.log[2].score)
                await updateClasscheckRecordFromLog(rid, <IRb6PlayerClasscheckLog>player.pdata.classcheck, player.pdata.stageLogs.log[player.pdata.stageLogs.log.length - 1].time, opm)
            }
            if (player.pdata.released?.info?.length > 0) for (let i of player.pdata.released.info) opm.upsert<IRb6PlayerReleasedInfo>(rid, { collection: "rb.rb6.player.releasedInfo", type: i.type, id: i.id }, i)
            if (player.pdata.playerParam?.item?.length > 0) for (let i of player.pdata.playerParam.item) opm.upsert<IRb6PlayerParameters>(rid, { collection: "rb.rb6.player.parameters", type: i.type, bank: i.bank }, i)
            if (player.pdata.mylist?.list != null) opm.upsert<IRb6Mylist>(rid, { collection: "rb.rb6.player.mylist", index: player.pdata.mylist.list.index }, player.pdata.mylist.list)
            if (player.pdata.quest?.list?.length > 0) for (let q of player.pdata.quest.list) opm.upsert<IRb6QuestRecord>(rid, { collection: "rb.rb6.playData.quest", dungeonId: q.dungeonId, dungeonGrade: q.dungeonGrade }, q)
            if (player.pdata.ghost?.list?.length > 0) for (let g of player.pdata.ghost.list) await updateGhostScore(player.pdata.account.userId, g, opm)
        }

        await DBM.operate(opm)
    }

    export const ReadPlayerScore: EPR = async (_, data, send) => {
        let rid: string = $(data).str("rid")

        let scores: IRb6MusicRecord[] = await DB.Find<IRb6MusicRecord>(rid, { collection: "rb.rb6.playData.musicRecord" })
        let result = {
            pdata: { record: (scores?.length > 0) ? { rec: scores } : {} }
        }

        send.object(mapKObject(result, {
            pdata: { record: { rec: { 0: Rb6MusicRecordMap } } }
        }))
    }
    export const ReadPlayerJustCollections: EPR = async (_, data: KITEM2<IPlayerReadJustCollectionParameters>, send) => {
        let param = mapBackKObject(data, PlayerReadJustCollectioParametersMap)[0]
        if (param.userId == 1500008 && param.musicId == 1 && param.chartType == 2) {
            let k = {
                justcollection: {
                    list: {
                        music_id: K.ITEM("s32", 1),
                        note_grade: K.ITEM("s32", 2)
                    }
                }
            }
            send.object(k)
            return
        }
        let element: IRb6JustCollection = await DB.FindOne<IRb6JustCollection>({ collection: "rb.rb6.playData.justCollection#userId", userId: param.userId, musicId: param.musicId, chartType: param.chartType })
        let result = <IRb6ReadJustCollection>{}
        if (element == null) result.list = { musicId: param.musicId, chartType: param.chartType }
        else {
            if (element.blueDataBase64 != null) result.blueData = base64ToBuffer(element.blueDataBase64, 10240)
            if (element.redDataBase64 != null) result.redData = base64ToBuffer(element.redDataBase64, 10240)
        }
        send.object(mapKObject({ justcollection: result }, { justcollection: Rb6ReadJustCollectionMap }))
    }

    export const ReadGhostScore: EPR = async (_, data, send) => {
        let param = mapBackKObject(data, ReadGhostScoreParamMap)[0]
        let redQuery: Query<IRb6Ghost> = { collection: "rb.rb6.playData.ghost#userId", musicId: param.musicId, chartType: param.chartType, redDataBase64: { $exists: true }, matchingGrade: { $gte: param.matchingGrade - 5, $lte: param.matchingGrade + 5 } }
        let blueQuery: Query<IRb6Ghost> = { collection: "rb.rb6.playData.ghost#userId", musicId: param.musicId, chartType: param.chartType, blueDataBase64: { $exists: true }, matchingGrade: { $gte: param.matchingGrade - 5, $lte: param.matchingGrade + 5 } }
        if (param.redUserId >= 0) redQuery.userId = param.redUserId
        if (param.blueUserId >= 0) blueQuery.userId = param.blueUserId
        let redDatas = await DB.Find(redQuery)
        let blueDatas = await DB.Find(blueQuery)
        let randomRedData: IRb6Ghost = (redDatas.length > 0) ? redDatas[Math.round((redDatas.length - 1) * Math.random())] : null
        let randomBlueData: IRb6Ghost = (blueDatas.length > 0) ? blueDatas[Math.round((blueDatas.length - 1) * Math.random())] : null
        let randomData: IRb6Ghost = (randomBlueData || randomRedData) ? Object.assign(randomRedData || <IRb6Ghost>{}, randomBlueData || <IRb6Ghost>{}) : { characterCardId: 0, musicId: param.musicId, chartType: param.chartType, collection: "rb.rb6.playData.ghost#userId", matchingGrade: param.matchingGrade }
        // if (randomData.redDataBase64) randomData.redData = base64ToBuffer(randomData.redDataBase64, 10240)
        // if (randomData.blueDataBase64) randomData.blueData = base64ToBuffer(randomData.blueDataBase64, 10240)

        let k = mapKObject({ ghost: randomData }, { ghost: Rb6GhostMap })
        /* @ts-ignore **/
        k.ghost.win_count_blue = K.ITEM("s32", 5)
        /* @ts-ignore **/
        k.ghost.win_count_red = K.ITEM("s32", 5)
        // /* @ts-ignore **/
        // k.ghost.item_red_data_bin = K.ITEM("bin", Buffer.alloc(10240))
        // /* @ts-ignore **/
        // k.ghost.item_blue_data_bin = K.ITEM("bin", Buffer.alloc(10240))
        /* @ts-ignore **/
        k.ghost.red_id = K.ITEM("s32", 0)
        /* @ts-ignore **/
        k.ghost.blue_id = K.ITEM("s32", 0)
        send.object(k)
    }

    type ReadGhostScoreParam = {
        redUserId: number
        blueUserId: number
        musicId: number
        chartType: number
        matchingGrade: number
        composerType: number
    }
    const ReadGhostScoreParamMap: KObjectMappingRecord<ReadGhostScoreParam> = {
        redUserId: s32me("red_user_id"),
        blueUserId: s32me("blue_user_id"),
        musicId: s32me("music_id"),
        chartType: s8me("note_grade"),
        matchingGrade: s32me("matching_greade"), // greade!
        composerType: s32me("composer_type")
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

    interface IPlayerReadJustCollectionParameters {
        userId: number
        musicId: number
        chartType: number
    }
    const PlayerReadJustCollectioParametersMap: KObjectMappingRecord<IPlayerReadJustCollectionParameters> = {
        userId: { $type: "s32", $targetKey: "user_id" },
        musicId: { $type: "s32", $targetKey: "music_id" },
        chartType: { $type: "s8", $targetKey: "note_grade" }
    }

    async function updateMusicRecordFromStageLog(rid: string, stageLog: IRb6PlayerStageLog, opm: DBM.DBOperationManager): Promise<void> {
        let query: Query<IRb6MusicRecord> = { $and: [{ collection: "rb.rb6.playData.musicRecord" }, { musicId: stageLog.musicId }, { chartType: stageLog.chartType }] }
        let musicRecord = await opm.findOne<IRb6MusicRecord>(rid, query)

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
            if ((stageLog.color == 0) && (musicRecord.justCollectionRateTimes100Red < stageLog.justCollectionRateTimes100)) { // just collectioin red
                musicRecord.justCollectionRateTimes100Red = stageLog.justCollectionRateTimes100
            }
            if ((stageLog.color == 1) && (musicRecord.justCollectionRateTimes100Blue < stageLog.justCollectionRateTimes100)) { // just collectioin blue
                musicRecord.justCollectionRateTimes100Blue = stageLog.justCollectionRateTimes100
            }
        }

        musicRecord.time = stageLog.time
        musicRecord.playCount++
        opm.upsert(rid, query, musicRecord)
        opm.insert(rid, stageLog)
    }

    async function updateGhostScore(userId: number, ghost: IRb6Ghost, opm: DBM.DBOperationManager): Promise<void> {
        ghost.userId = userId
        if (ghost.redData != null) ghost.redDataBase64 = bufferToBase64(ghost.redData)
        if (ghost.blueData != null) ghost.blueDataBase64 = bufferToBase64(ghost.blueData)
        delete ghost.redData
        delete ghost.blueData
        opm.upsert<IRb6Ghost>(null, { collection: "rb.rb6.playData.ghost#userId", musicId: ghost.musicId, chartType: ghost.chartType, userId: userId }, ghost)
    }

    async function updateClasscheckRecordFromLog(rid: string, log: IRb6PlayerClasscheckLog, time: number, opm: DBM.DBOperationManager): Promise<void> {
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

    async function updateJustCollection(userId: number, justColElement: IRb6JustCollection, opm: DBM.DBOperationManager): Promise<void> {
        let query: Query<IRb6JustCollection> = { collection: "rb.rb6.playData.justCollection#userId", userId: userId, musicId: justColElement.musicId, chartType: justColElement.chartType }
        let old = await opm.findOne(null, query)
        justColElement.userId = userId
        if (old == null) {
            old = justColElement
        }

        if (justColElement.redData != null) old.redDataBase64 = bufferToBase64(justColElement.redData)
        delete old.redData
        if (justColElement.blueData != null) old.blueDataBase64 = bufferToBase64(justColElement.blueData)
        delete old.blueData

        opm.upsert(null, query, old)
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