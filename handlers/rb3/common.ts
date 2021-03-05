import { getExampleEventControl, Rb3EventControlMap } from "../../models/rb3/event_control"
import { initializePlayer } from "./initialize_player"
import { generateRb3MusicRecord, IRb3MusicRecord, Rb3MusicRecordMap } from "../../models/rb3/music_record"
import { IRb3Mylist } from "../../models/rb3/mylist"
import { generateRb3Stamp, generateRb3TricolettePark, IRb3Equip, IRb3EventProgress, IRb3Order, IRb3Player, IRb3PlayerAccount, IRb3PlayerBase, IRb3PlayerConfig, IRb3PlayerCustom, IRb3PlayerReleasedInfo, IRb3PlayerStageLog, IRb3SeedPod, IRb3Stamp, IRb3TricolettePark, Rb3PlayerReadMap, Rb3PlayerReleasedInfoMap, Rb3PlayerWriteMap } from "../../models/rb3/profile"
import { KRb3ShopInfo } from "../../models/rb3/shop_info"
import { BigIntProxy, KITEM2, KObjectMappingRecord, mapBackKObject, mapKObject } from "../../utility/mapping"
import { readPlayerPostTask, writePlayerPredecessor } from "./system_parameter_controller"
import { generateRb3Profile } from "../../models/rb3/profile"
import { DBM } from "../../utility/db_manager"
import { tryFindPlayer } from "../utility/try_find_player"
import { ClearType, findBestMusicRecord, findMusicRecordMetadatas, GaugeType } from "../utility/find_music_record"
import { getMusicId } from "../../data/musicinfo/rb_music_info"
import { generateRb2LincleLink, IRb2LincleLink } from "../../models/rb2/profile"

export namespace Rb3HandlersCommon {
    export const ReadInfo: EPR = async (info: EamuseInfo, data, send) => {
        switch (info.method) {

        }
        send.success()
    }

    export const BootPcb: EPR = async (_info: EamuseInfo, _data: any, send: EamuseSend) => {
        send.object({ sinfo: KRb3ShopInfo })
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
        Object.assign(datamap, Rb3EventControlMap)
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

    export const PlayerSucceeded: EPR = async (info, data, send) => {
        let rid = $(data).str("rid")
        let account: IRb3PlayerAccount = await DB.FindOne<IRb3PlayerAccount>(rid, { collection: "rb.rb3.player.account" })
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
            let base: IRb3PlayerBase = await DB.FindOne<IRb3PlayerBase>(rid, { collection: "rb.rb3.player.base" })
            let released: IRb3PlayerReleasedInfo[] = await DB.Find<IRb3PlayerReleasedInfo>(rid, { collection: "rb.rb3.player.releasedInfo" })
            let record: IRb3MusicRecord[] = await DB.Find<IRb3MusicRecord>(rid, { collection: "rb.rb3.playData.musicRecord" })
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
            released: { i: { 0: Rb3PlayerReleasedInfoMap } },
            mrecord: { mrec: { 0: Rb3MusicRecordMap } }
        }))
    }

    export const ReadPlayer: EPR = async (info: EamuseInfo, data: KITEM2<IPlayerReadParameters>, send: EamuseSend) => {
        let readParam: IPlayerReadParameters = mapBackKObject(data, PlayerReadParametersMap)[0]
        let result: IRb3Player
        let account: IRb3PlayerAccount = await DB.FindOne<IRb3PlayerAccount>(readParam.rid, { collection: "rb.rb3.player.account" })
        if (account == null) {
            let rbPlayer = await tryFindPlayer(readParam.rid, 5)
            if (rbPlayer != null) {
                result = generateRb3Profile(readParam.rid, rbPlayer.userId)
                result.pdata.base.name = rbPlayer.name
            } else {
                let userId

                do userId = Math.trunc(Math.random() * 99999999)
                while ((await DB.Find<IRb3PlayerAccount>({ collection: "rb.rb3.player.account", userId: userId })).length > 0)

                result = generateRb3Profile(readParam.rid, rbPlayer.userId)
                result.pdata.account.isFirstFree = true
                result.pdata.base.name = "RBPlayer"
                initializePlayer(result)
            }
        } else {
            let base: IRb3PlayerBase = await DB.FindOne<IRb3PlayerBase>(readParam.rid, { collection: "rb.rb3.player.base" })
            let config: IRb3PlayerConfig = await DB.FindOne<IRb3PlayerConfig>(readParam.rid, { collection: "rb.rb3.player.config" })
            let custom: IRb3PlayerCustom = await DB.FindOne<IRb3PlayerCustom>(readParam.rid, { collection: "rb.rb3.player.custom" })
            let released: IRb3PlayerReleasedInfo[] = await DB.Find<IRb3PlayerReleasedInfo>(readParam.rid, { collection: "rb.rb3.player.releasedInfo" })
            let mylist: IRb3Mylist = await DB.FindOne<IRb3Mylist>(readParam.rid, { collection: "rb.rb3.player.mylist" })
            let lincleLink: IRb2LincleLink = await DB.FindOne<IRb2LincleLink>(readParam.rid, { collection: "rb.rb2.player.lincleLink" })
            let tricolettePark: IRb3TricolettePark = await DB.FindOne<IRb3TricolettePark>(readParam.rid, { collection: "rb.rb3.player.tricolettePark" })
            let eventProgress: IRb3EventProgress[] = await DB.Find<IRb3EventProgress>(readParam.rid, { collection: "rb.rb3.player.event.eventProgress" })
            let equip: IRb3Equip[] = await DB.Find<IRb3Equip>(readParam.rid, { collection: "rb.rb3.player.equip" })
            let seedPod: IRb3SeedPod[] = await DB.Find<IRb3SeedPod>(readParam.rid, { collection: "rb.rb3.player.event.seedPod" })
            let order: IRb3Order = await DB.FindOne<IRb3Order>(readParam.rid, { collection: "rb.rb3.player.order" })
            let stamp: IRb3Stamp = await DB.FindOne<IRb3Stamp>(readParam.rid, { collection: "rb.rb3.player.stamp" })

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
            if (base.comment == null) base.comment = "Welcome to REFLEC BEAT colette!"
            if (base.teamId == null) base.teamId = -1
            if (base.teamName == null) base.teamName = "Asphyxia"
            if (base.uattr == null) base.uattr = 0
            if (base.abilityPointTimes100 == null) base.abilityPointTimes100 = base["averagePrecisionTimes100"] // For compatibility
            let scores: IRb3MusicRecord[] = await DB.Find<IRb3MusicRecord>(readParam.rid, { collection: "rb.rb3.playData.musicRecord" })
            stamp = init(stamp, generateRb3Stamp())

            base.totalBestScore = 0
            for (let s of scores) {
                base.totalBestScore += s.score
            }
            base.totalBestScoreRival = 0

            let metas = await findMusicRecordMetadatas(readParam.rid)

            let recordOld = <IRb3MusicRecord[]>[]

            // for (let mk of metas) {
            //     let midstr = mk.split(":")[0]
            //     let chart = parseInt(mk.split(":")[1])
            //     let mid = getMusicId(midstr, 3)
            //     let bestRecord = await findBestMusicRecord(readParam.rid, midstr, chart, 3)
            //     if (bestRecord == null) continue
            //     recordOld.push({
            //         collection: "rb.rb3.playData.musicRecord",
            //         musicId: mid,
            //         chartType: chart,
            //         playCount: bestRecord.playCount,
            //         param: bestRecord.param,
            //         clearType: translateRb3ClearType(bestRecord.clearType),
            //         achievementRateTimes100: bestRecord.achievementRateTimes100,
            //         score: bestRecord.score,
            //         missCount: bestRecord.missCount,
            //         combo: bestRecord.combo,
            //         time: Math.trunc(Date.now() / 1000),
            //         bestAchievementRateUpdateTime: Math.trunc(Date.now() / 1000),
            //         bestComboUpdateTime: Math.trunc(Date.now() / 1000),
            //         bestMissCountUpdateTime: Math.trunc(Date.now() / 1000),
            //         bestScoreUpdateTime: Math.trunc(Date.now() / 1000),
            //         kFlag: 0,
            //         isHasGhostBlue: false,
            //         isHasGhostRed: false,
            //         version: {
            //             score: 1,
            //             combo: 1,
            //             missCount: 1,
            //             clearType: 1,
            //             achievementRate: 1
            //         }
            //     })
            // }
            config.randomEntryWork = init(config.randomEntryWork, BigInt(Math.trunc(Math.random() * 99999999)))
            config.customFolderWork = init(config.randomEntryWork, BigInt(Math.trunc(Math.random() * 9999999999999)))

            result = {
                pdata: {
                    account: account,
                    base: base,
                    config: config,
                    custom: custom,
                    rival: {},
                    released: (released.length > 0) ? { info: released } : <any>{},
                    lincleLink: lincleLink ? lincleLink : generateRb2LincleLink(),
                    tricolettePark: tricolettePark ? tricolettePark : generateRb3TricolettePark(),
                    stamp: stamp,
                    eventProgress: (eventProgress.length == 0) ? {} : { data: eventProgress },
                    equip: (equip.length == 0) ? {} : { data: equip },
                    seedPod: (seedPod.length == 0) ? {} : { data: seedPod },
                    order: order ? order : { collection: "rb.rb3.player.order", experience: 0 },
                    mylist: mylist ? mylist : { collection: "rb.rb3.player.mylist" },
                    announce: {},
                    musicRankPoint: {},
                    ghost: {},
                    ghostWinCount: {},
                    purpose: {},
                    share: {},
                    record: (scores.length == 0) ? {} : { rec: scores },
                    recordOld: (recordOld.length == 0) ? {} : { rec: recordOld }
                }
            }
        }
        send.object(readPlayerPostTask(mapKObject(result, Rb3PlayerReadMap)))
    }

    export const DeletePlayer: EPR = async (info: EamuseInfo, data: KITEM2<{ rid: string }>, send: EamuseSend) => {
        try {
            let rid = data.rid["@content"]
            let ridqueries: Query<any>[] = [
                { collection: "rb.rb3.player.account" },
                { collection: "rb.rb3.player.base" },
                { collection: "rb.rb3.player.characterCard" },
                { collection: "rb.rb3.player.config" },
                { collection: "rb.rb3.player.custom" },
                { collection: "rb.rb3.playData.musicRecord" },
                { collection: "rb.rb3.playData.classcheck" },
                { collection: "rb.rb3.player.mylist" },
                { collection: "rb.rb3.player.parameters" },
            ]
            let uid = ridqueries[0].userId
            let uidqueries: Query<any>[] = [
                { collection: "rb.rb3.playData.justCollection", userId: uid }
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

    export const WritePlayer: EPR = async (info: EamuseInfo, data: KITEM2<IRb3Player>, send: EamuseSend) => {
        // try {
        data = writePlayerPredecessor(data)
        let player: IRb3Player = mapBackKObject(data, Rb3PlayerWriteMap)[0]
        let playCountQuery: Query<IRb3PlayerAccount> = { collection: "rb.rb3.player.account" }
        let playerAccountForPlayCountQuery: IRb3PlayerAccount = await DB.FindOne(player.pdata.account.rid, playCountQuery)
        if (player?.pdata?.account?.rid) {
            let rid = player.pdata.account.rid
            if (rid == "") throw new Error("rid is empty")
            if (playerAccountForPlayCountQuery == null) { // save the new player
                if (player.pdata.account.userId <= 0) {
                    let userId

                    do userId = Math.trunc(Math.random() * 99999999)
                    while ((await DB.Find<IRb3PlayerAccount>({ collection: "rb.rb3.player.account", userId: userId })).length > 0)

                    player.pdata.account.userId = userId
                    player.pdata.account.isFirstFree = true
                    initializePlayer(player)
                }
                await DBM.upsert(rid, { collection: "rb.rb3.player.account" }, player.pdata.account)
            } else {
                playerAccountForPlayCountQuery.isFirstFree = false
                playerAccountForPlayCountQuery.playCount++
                playerAccountForPlayCountQuery.st = player.pdata.account.st
                await DBM.update(rid, { collection: "rb.rb3.player.account" }, playerAccountForPlayCountQuery)
            }
            if (player.pdata.base) {
                await DBM.upsert<IRb3PlayerBase>(rid, { collection: "rb.rb3.player.base" }, player.pdata.base)
            }
            if (player.pdata.config) await DBM.upsert<IRb3PlayerConfig>(rid, { collection: "rb.rb3.player.config" }, player.pdata.config)
            if (player.pdata.custom) await DBM.upsert<IRb3PlayerCustom>(rid, { collection: "rb.rb3.player.custom" }, player.pdata.custom)
            if (player.pdata.stageLogs?.log?.length > 0) for (let i of player.pdata.stageLogs.log) await updateMusicRecordFromStageLog(rid, i)
            if (player.pdata.released?.info?.length > 0) await updateReleasedInfos(rid, player.pdata.released)
            if (player.pdata.mylist?.slot?.length > 0) await DBM.upsert<IRb3Mylist>(rid, { collection: "rb.rb3.player.mylist" }, player.pdata.mylist)
            if (player.pdata.lincleLink != null) await DBM.upsert<IRb2LincleLink>(rid, { collection: "rb.rb2.player.lincleLink" }, player.pdata.lincleLink)
            if (player.pdata.tricolettePark != null) await DBM.upsert<IRb3TricolettePark>(rid, { collection: "rb.rb3.player.tricolettePark" }, player.pdata.tricolettePark)
            if (player.pdata.eventProgress?.data?.length > 0) for (let d of player.pdata.eventProgress.data) await DBM.upsert<IRb3EventProgress>(rid, { collection: "rb.rb3.player.event.eventProgress", index: d.index }, d)
            if (player.pdata.equip?.data?.length > 0) for (let e of player.pdata.equip.data) await DBM.upsert<IRb3Equip>(rid, { collection: "rb.rb3.player.equip", index: e.index }, e)
            if (player.pdata.seedPod?.data?.length > 0) for (let s of player.pdata.seedPod.data) await DBM.upsert<IRb3SeedPod>(rid, { collection: "rb.rb3.player.event.seedPod", index: s.index }, s)
            if (player.pdata.order != null) await updateOrder(rid, player.pdata.order)
            if (player.pdata.stamp != null) await DBM.upsert<IRb3Stamp>(rid, { collection: "rb.rb3.player.stamp" }, player.pdata.stamp)

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

        let scores: IRb3MusicRecord[] = await DB.Find<IRb3MusicRecord>(rid, { collection: "rb.rb3.playData.musicRecord" })
        let result = {
            pdata: { record: (scores?.length > 0) ? { rec: scores } : {} }
        }

        send.object(mapKObject(result, {
            pdata: { record: { rec: { 0: Rb3MusicRecordMap } } }
        }))
    }

    function translateRb3ClearType(clearType: ClearType): number {
        switch (clearType) {
            case ClearType.notPlayed: return 0
            case ClearType.failed: return 2
            case ClearType.cleared: return 3
            case ClearType.hardCleared: return 3
            case ClearType.sHardCleared: return 3
            case ClearType.fullCombo: return 4
            case ClearType.excellent: return 4
            case ClearType.allJustReflecFullCombo: return 4
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

    async function updateMusicRecordFromStageLog(rid: string, stageLog: IRb3PlayerStageLog): Promise<void> {
        let query: Query<IRb3MusicRecord> = { $and: [{ collection: "rb.rb3.playData.musicRecord" }, { musicId: stageLog.musicId }, { chartType: stageLog.chartType }] }
        let musicRecord = await DB.FindOne<IRb3MusicRecord>(rid, query)

        let newFlag = getClearTypeIndex(stageLog)
        if (newFlag < 0) return

        if (musicRecord == null) {

            musicRecord = generateRb3MusicRecord(stageLog.musicId, stageLog.chartType)
            musicRecord.clearType = stageLog.clearType
            musicRecord.achievementRateTimes100 = stageLog.achievementRateTimes100
            musicRecord.score = stageLog.score
            musicRecord.missCount = stageLog.missCount
            musicRecord.time = stageLog.time
            musicRecord.bestScoreUpdateTime = stageLog.time
            musicRecord.bestMissCountUpdateTime = stageLog.time
            musicRecord.bestAchievementRateUpdateTime = stageLog.time
            musicRecord.bestComboUpdateTime = stageLog.time
        } else {
            if (musicRecord.achievementRateTimes100 < stageLog.achievementRateTimes100) {
                musicRecord.bestAchievementRateUpdateTime = stageLog.time
                musicRecord.achievementRateTimes100 = stageLog.achievementRateTimes100
            }
            if (musicRecord.clearType < stageLog.clearType) musicRecord.clearType = stageLog.clearType
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
        }

        musicRecord.playCount++
        await DBM.upsert(rid, query, musicRecord)
        await DBM.insert(rid, stageLog)
    }

    async function updateOrder(rid: string, order: IRb3Order) {
        let oldOrder: IRb3Order = await DB.FindOne<IRb3Order>(rid, { collection: "rb.rb3.player.order" })
        if (oldOrder == null) await DBM.upsert<IRb3Order>(rid, { collection: "rb.rb3.player.order" }, order)
        else {
            oldOrder.experience = order.experience
            if (order.details != null) {
                for (let oo of oldOrder.details) {
                    oo.slot = -1
                }
                for (let no of order.details) {
                    let flag = false
                    if ((no.index == 2) && (no.clearedCount == 0)) {
                        no.clearedCount = 1
                        no.fragmentsCount0 = 1
                        no.slot = -1
                    }
                    for (let ooi = 0; ooi < oldOrder.details.length; ooi++) {
                        let oo = oldOrder.details[ooi]
                        if (oo.index == no.index) {
                            flag = true
                            oldOrder.details[ooi] = no
                            break
                        }
                    }
                    if (!flag) oldOrder.details.push(no)
                }
                await DBM.upsert<IRb3Order>(rid, { collection: "rb.rb3.player.order" }, oldOrder)
            }
        }
    }

    async function updateReleasedInfos(rid: string, infos: { info: IRb3PlayerReleasedInfo[] }) {
        for (let i of infos.info) await DBM.upsert<IRb3PlayerReleasedInfo>(rid, { collection: "rb.rb3.player.releasedInfo", type: i.type, id: i.id }, i)
    }

    function getClearTypeIndex(record: IRb3PlayerStageLog | IRb3MusicRecord): number {
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