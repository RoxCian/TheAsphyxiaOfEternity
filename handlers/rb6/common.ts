import { generateRb6CharactorCard, IRb6CharacterCard } from "../../models/rb6/character_card"
import { generateRb6ClasscheckRecord, IRb6ClasscheckRecord } from "../../models/rb6/classcheck_record"
import { getExampleCourse, Rb6QuestMap } from "../../models/rb6/course"
import { getExampleEventControl, Rb6EventControlMap } from "../../models/rb6/event_control"
import { initializePlayer } from "./initialize_player"
import { IRb6JustCollection, IRb6ReadJustCollection, Rb6ReadJustCollectionMap } from "../../models/rb6/just_collection"
import { generateRb6MusicRecord, IRb6MusicRecord, Rb6MusicRecordMap } from "../../models/rb6/music_record"
import { IRb6Mylist } from "../../models/rb6/mylist"
import { generateRb6PlayerConfig, generateRb6PlayerCustom, generateRb6Profile, IRb6Player, IRb6PlayerAccount, IRb6PlayerBase, IRb6PlayerClasscheckLog, IRb6PlayerConfig, IRb6PlayerCustom, IRb6PlayerParameters, IRb6PlayerReleasedInfo, IRb6PlayerStageLog, IRb6QuestRecord, Rb6PlayerReadMap, Rb6PlayerWriteMap } from "../../models/rb6/profile"
import { KRb6ShopInfo } from "../../models/rb6/shop_info"
import { KITEM2, KObjectMappingRecord, mapBackKObject, mapKObject, s32me, strme, toBigInt, u8me } from "../../utility/mapping"
import { readPlayerPostTask, writePlayerPredecessor } from "./system_parameter_controller"
import { DBM } from "../utility/db_manager"
import { operateDataInternal } from "./data"
import { tryFindPlayer } from "../utility/try_find_player"
import { base64ToBuffer, bufferToBase64, isToday } from "../../utility/utility_functions"
import { Rb6LobbyEntryMap, generateRb6LobbyEntry, IRb6LobbyEntryElement, IRb6LobbyEntry } from "../../models/rb6/lobby"

export namespace Rb6HandlersCommon {
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
        // await Rb6HandlersCommon.bat()

        let result = {
            plyid: 0,
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

    export const ReadPlayer: EPR = async (info: EamuseInfo, data: KITEM2<IPlayerReadParameters>, send: EamuseSend) => {
        let readParam: IPlayerReadParameters = mapBackKObject(data, PlayerReadParametersMap)[0]

        let account: IRb6PlayerAccount = await DB.FindOne<IRb6PlayerAccount>(readParam.rid, { collection: "rb.rb6.player.account" })
        let result: IRb6Player
        if (account == null) {
            let rbPlayer = await tryFindPlayer(readParam.rid, 6)
            if (rbPlayer != null) {
                result = generateRb6Profile(readParam.rid, rbPlayer.userId)
                result.pdata.base.name = rbPlayer.name
            } else {
                let userId

                do userId = Math.trunc(Math.random() * 99999999)
                while ((await DB.Find<IRb6PlayerAccount>({ collection: "rb.rb6.player.account", userId: userId })).length > 0)

                result = generateRb6Profile(readParam.rid, rbPlayer.userId)
                result.pdata.account.isFirstFree = true
                result.pdata.base.name = "RBPlayer"
                initializePlayer(result)
            }
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
                    ghost: {},
                    ghostWinCount: {},
                    purpose: {}
                }
            }
        }
        let k = mapKObject(result, Rb6PlayerReadMap)
        k = readPlayerPostTask(k)
        send.object(k)
    }

    export const DeletePlayer: EPR = async (info: EamuseInfo, data: KITEM2<{ rid: string }>, send: EamuseSend) => {
        try {
            let rid = data.rid["@content"]
            await operateDataInternal(rid, "delete")

            send.success()
        } catch (e) {
            console.log((<Error>e).message)
            send.deny()
        }
    }

    export const WritePlayer: EPR = async (info: EamuseInfo, data: KITEM2<IRb6Player>, send: EamuseSend) => {
        // try {
        data = writePlayerPredecessor(data)
        let player: IRb6Player = mapBackKObject(data, Rb6PlayerWriteMap)[0]
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
                await DBM.upsert(rid, { collection: "rb.rb6.player.account" }, player.pdata.account)
                await DBM.upsert(rid, { collection: "rb.rb6.player.base" }, player.pdata.base)
                await DBM.upsert(rid, { collection: "rb.rb6.player.config" }, player.pdata.config)
                await DBM.upsert(rid, { collection: "rb.rb6.player.custom" }, player.pdata.custom)
            } else {
                playerAccountForPlayCountQuery.isFirstFree = false
                playerAccountForPlayCountQuery.playCount++
                if (!isToday(toBigInt(playerAccountForPlayCountQuery.st))) {
                    playerAccountForPlayCountQuery.dayCount++
                    playerAccountForPlayCountQuery.playCountToday = 0
                }
                playerAccountForPlayCountQuery.playCountToday++

                await DBM.update(rid, { collection: "rb.rb6.player.account" }, playerAccountForPlayCountQuery)
            }
            if (player.pdata.stageLogs?.log?.length > 0) for (let i of player.pdata.stageLogs.log) await updateMusicRecordFromStageLog(rid, i)
            if (player.pdata.justCollections?.list?.length > 0) for (let i of player.pdata.justCollections.list) await updateJustCollection(player.pdata.account.userId, i)
            if (player.pdata.characterCards?.list?.length > 0) for (let i of player.pdata.characterCards.list) await DBM.upsert<IRb6CharacterCard>(rid, { collection: "rb.rb6.player.characterCard", characterCardId: i.characterCardId }, i)
            if (player.pdata.base) {
                let init = (v, i) => (v == null) ? i : v

                player.pdata.base.rankQuestScore = init(player.pdata.base.rankQuestScore, [0, 0, 0])
                player.pdata.base.rankQuestRank = init(player.pdata.base.rankQuestRank, [0, 0, 0])
                player.pdata.base.mLog = init(player.pdata.base.mLog, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
                player.pdata.base.ghostWinCount = init(player.pdata.base.ghostWinCount, 0)
                await DBM.upsert<IRb6PlayerBase>(rid, { collection: "rb.rb6.player.base" }, player.pdata.base)
            }
            if (player.pdata.config) await DBM.upsert<IRb6PlayerConfig>(rid, { collection: "rb.rb6.player.config" }, player.pdata.config)
            if (player.pdata.custom) await DBM.upsert<IRb6PlayerCustom>(rid, { collection: "rb.rb6.player.custom" }, player.pdata.custom)
            if ((<IRb6PlayerClasscheckLog>player.pdata.classcheck)?.class) {
                (player.pdata.classcheck as IRb6PlayerClasscheckLog).totalScore = player.pdata.stageLogs.log[0].score + (player.pdata.stageLogs.log[1] == null ? 0 : player.pdata.stageLogs.log[1].score) + (player.pdata.stageLogs.log[2] == null ? 0 : player.pdata.stageLogs.log[2].score)
                await updateClasscheckRecordFromLog(rid, <IRb6PlayerClasscheckLog>player.pdata.classcheck, player.pdata.stageLogs.log[player.pdata.stageLogs.log.length - 1].time)
            }
            if (player.pdata.released?.info?.length > 0) await updateReleasedInfos(rid, player.pdata.released)
            if (player.pdata.playerParam?.item?.length > 0) await updatePlayerParameters(rid, player.pdata.playerParam)
            if (player.pdata.mylist?.list != null) await DBM.upsert<IRb6Mylist>(rid, { collection: "rb.rb6.player.mylist", index: player.pdata.mylist.list.index }, player.pdata.mylist.list)
            if (player.pdata.quest?.list?.length > 0) for (let q of player.pdata.quest.list) await DBM.upsert<IRb6QuestRecord>(rid, { collection: "rb.rb6.playData.quest", dungeonId: q.dungeonId, dungeonGrade: q.dungeonGrade }, q)
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
            pdata: { record: { rec: { 0: Rb6MusicRecordMap } } }
        }))
    }
    export const ReadPlayerJustCollections: EPR = async (info: EamuseInfo, data: KITEM2<IPlayerReadJustCollectionParameters>, send: EamuseSend) => {
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

    // Waiting for template literal types support.

    // export const AddLobby: EPR = async (req, data, send) => {
    //     let readParam = mapBackKObject(data, getRbLobbyEntryMap<6>(6))[0]
    //     let result = await generateRbLobbyEntry<6>(6, readParam.entry[0])
    //     await DBM.upsert<IRbLobbyEntryElement<6>>(null, { userId: result.entry[0].userId, collection: "rb.rb6.temporary.lobbyEntry" }, result.entry[0])
    //     send.object(mapKObject(result, getRbLobbyEntryMap<6>(6)))
    // }
    // export const ReadLobby: EPR = async (req, data, send) => {
    //     let readParam = mapBackKObject(data, ReadLobbyParamMap)[0]
    //     let result: IRbLobbyEntry<6>
    //     let flag = false
    //     for (let i = 0; i <= 12; i++) {
    //         setTimeout(async () => {
    //             if (flag) return
    //             result = await readLobbyEntity(readParam)
    //             if (!flag && (result.entry.length >= readParam.maxRivalCount)) {
    //                 flag = true
    //                 returnLobby(result, send)
    //             }
    //         }, 500 * i)
    //     }
    // }
    // async function returnLobby(result: IRbLobbyEntry<6>, send: EamuseSend) {
    //     send.object(mapKObject(result, getRbLobbyEntryMap<6>(6)))
    // }
    // async function readLobbyEntity(param: ReadLobbyParam): Promise<IRbLobbyEntry<6>> {
    //     let result = await generateRbLobbyEntry<6>(6)
    //     let lobbies: IRbLobbyEntryElement<6>[] = await DB.Find<IRbLobbyEntryElement<6>>({ $not: { userId: param.userId }, $and: [{ collection: "rb.rb6.temporary.lobbyEntry" }] })
    //     result.entry = lobbies.slice(0, param.maxRivalCount)
    //     return result
    // }
    // export const DeleteLobby: EPR = async (req, data, send) => {
    //     let entryId = $(data).number("eid")
    //     await DBM.remove<IRbLobbyEntryElement<6>>(null, { collection: "rb.rb6.temporary.lobbyEntry", entryId: entryId })
    // }
    let lobbyPendingMap = new Map<number, { send: EamuseSend, obj: KITEM2<IRb6LobbyEntry> }>()
    export const AddLobby: EPR = async (req, data, send) => {
        let readParam = mapBackKObject(data, Rb6LobbyEntryMap)[0]
        let result = await generateRb6LobbyEntry(readParam.entry[0])
        await DBM.upsert<IRb6LobbyEntryElement>(null, { userId: result.entry[0].userId, collection: "rb.rb6.temporary.lobbyEntry" }, result.entry[0])
        lobbyPendingMap.set(readParam.entry[0].userId, { send: send, obj: mapKObject(result, Rb6LobbyEntryMap) })
        setTimeout(() => {
            if (lobbyPendingMap.has(readParam.entry[0].userId)) {
                let l = lobbyPendingMap.get(readParam.entry[0].userId)
                l.send.object(l.obj)
                lobbyPendingMap.delete(readParam.entry[0].userId)
            }
        }, 24000)
    }
    export const ReadLobby: EPR = async (req, data, send) => {
        let readParam = mapBackKObject(data, ReadLobbyParamMap)[0]
        if (lobbyPendingMap.has(readParam.userId)) {
            let l = lobbyPendingMap.get(readParam.userId)
            l.send.object(l.obj)
            lobbyPendingMap.delete(readParam.userId)
        }
        let result: IRb6LobbyEntry
        result = await readLobbyEntity(readParam)
        returnLobby(result, send)
    }
    async function returnLobby(result: IRb6LobbyEntry, send: EamuseSend) {
        send.object(mapKObject(result, Rb6LobbyEntryMap))
    }
    async function readLobbyEntity(param: ReadLobbyParam): Promise<IRb6LobbyEntry> {
        let result = await generateRb6LobbyEntry()
        let lobbies: IRb6LobbyEntryElement[] = await DB.Find<IRb6LobbyEntryElement>({ $not: { userId: param.userId }, $and: [{ collection: "rb.rb6.temporary.lobbyEntry" }] })
        result.entry = lobbies.slice(0, param.maxRivalCount)
        return result
    }
    export const DeleteLobby: EPR = async (req, data, send) => {
        let entryId = $(data).number("eid")
        await DBM.remove<IRb6LobbyEntryElement>(null, { collection: "rb.rb6.temporary.lobbyEntry", entryId: entryId })
    }

    type ReadLobbyParam = {
        userId: number
        matchingGrade: number
        lobbyId: string
        maxRivalCount: number
        friend: number[]
        version: number
    }
    const ReadLobbyParamMap: KObjectMappingRecord<ReadLobbyParam> = {
        userId: s32me("uid"),
        matchingGrade: u8me("m_grade"),
        lobbyId: strme("lid"),
        maxRivalCount: s32me("max"),
        friend: s32me(),
        version: u8me("var")
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
        await DBM.upsert(rid, query, musicRecord)
        await DBM.insert(rid, stageLog)
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
        await DBM.upsert(rid, query, classRecord)
    }

    async function updateJustCollection(userId: number, justColElement: IRb6JustCollection): Promise<void> {
        let query: Query<IRb6JustCollection> = { collection: "rb.rb6.playData.justCollection#userId", userId: userId, musicId: justColElement.musicId, chartType: justColElement.chartType }
        let old = await DB.FindOne(query)
        justColElement.userId = userId
        if (old == null) {
            old = justColElement
        }

        if (justColElement.redData != null) old.redDataBase64 = bufferToBase64(justColElement.redData)
        delete old.redData
        if (justColElement.blueData != null) old.blueDataBase64 = bufferToBase64(justColElement.blueData)
        delete old.blueData

        await DBM.upsert(null, query, old)
    }

    async function updateReleasedInfos(rid: string, infos: { info: IRb6PlayerReleasedInfo[] }) {
        for (let i of infos.info) await DBM.upsert<IRb6PlayerReleasedInfo>(rid, { collection: "rb.rb6.player.releasedInfo", type: i.type, id: i.id }, i)
    }

    async function updatePlayerParameters(rid: string, params: { item: IRb6PlayerParameters[] }) {
        for (let i of params.item) await DBM.upsert<IRb6PlayerParameters>(rid, { collection: "rb.rb6.player.parameters", type: i.type, bank: i.bank }, i)
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