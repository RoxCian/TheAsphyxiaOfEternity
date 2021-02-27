import { getExampleEventControl, Rb5EventControlMap } from "../../models/rb5/event_control"
// import { initializePlayer } from "./initialize_player"
import { KRb5ShopInfo } from "../../models/rb5/shop_info"
import { KITEM2, KObjectMappingRecord, mapBackKObject, mapKObject } from "../../utility/mapping"
import { readPlayerPostTask, writePlayerPredecessor } from "./system_parameter_controller"
import { DBM } from "../../utility/db_manager"
import { generateRb1MusicRecord, generateRb1Profile, IRb1MusicRecord, IRb1Player, IRb1PlayerBase, IRb1PlayerCustom, IRb1PlayerReleasedInfo, IRb1PlayerStat, IRb1StageLog, Rb1PlayerMap } from "../../models/rb1/profile"
import { tryFindPlayer } from "../utility/try_find_player"
import { IRb1StageLogStandalone, IRb1StageLogStandaloneElement, Rb1StageLogStandaloneMap } from "../../models/rb1/stage_log_standalone"
import { Rb6HandlersCommon } from "../rb6/common"

export namespace Rb1HandlersCommon {
    export const ReadInfo: EPR = async (info: EamuseInfo, data, send) => {
        switch (info.method) {

        }
        send.success()
    }

    export const BootPcb: EPR = async (_info: EamuseInfo, _data: any, send: EamuseSend) => {
        send.object({ sinfo: KRb5ShopInfo })
    }

    export const StartPlayer: EPR = async (info: EamuseInfo, _data: any, send: EamuseSend) => {
        if (!info.model.startsWith("KBR")) return send.deny()
        let data = <any>getExampleEventControl()
        data.nm = 0
        let result = {
            plyid: 0,
            nm: 0,
            is_suc: true,
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
            is_suc: { $type: <"bool">"bool" },
            start_time: { $type: <"u64">"u64" },
            event_ctrl: {
                data: datamap
            },
            item_lock_ctrl: {},
        }
        send.object(mapKObject(result, map))
    }

    export const ReadPlayer: EPR = async (info: EamuseInfo, data: KITEM2<IPlayerReadParameters>, send: EamuseSend) => {
        if (!info.model.startsWith("KBR")) return send.deny()
        let readParam: IPlayerReadParameters = mapBackKObject(data, PlayerReadParametersMap)[0]
        let result: IRb1Player
        let base: IRb1PlayerBase = await DB.FindOne<IRb1PlayerBase>(readParam.rid, { collection: "rb.rb1.player.base" })
        if (base == null) {
            let rbPlayer = await tryFindPlayer(readParam.rid, 1)
            if (rbPlayer != null) {
                result = generateRb1Profile(readParam.rid, rbPlayer.userId)
                result.pdata.base.name = rbPlayer.name
            } else {
                let userId

                do userId = Math.trunc(Math.random() * 99999999)
                while ((await DB.Find<IRb1PlayerBase>({ collection: "rb.rb1.player.base", userId: userId })).length > 0)
                result = generateRb1Profile(readParam.rid, userId)
                result.pdata.base.name = "RBPlayer"
            }
        } else {
            if (base.level > 5) base.tutorialFlag = 0
            let stat: IRb1PlayerStat = await DB.FindOne<IRb1PlayerStat>(readParam.rid, { collection: "rb.rb1.player.stat" })
            let custom: IRb1PlayerCustom = await DB.FindOne<IRb1PlayerCustom>(readParam.rid, { collection: "rb.rb1.player.custom" })
            let released: IRb1PlayerReleasedInfo[] = await DB.Find<IRb1PlayerReleasedInfo>(readParam.rid, { collection: "rb.rb1.player.releasedInfo" })

            let init = (v, i) => (v == null) ? i : v
            // if (account.intrvld == null) account.intrvld = 0
            // if (account.succeed == null) account.succeed = true
            // if (account.pst == null) account.pst = BigInt(0)
            // if (account.st == null) account.st = BigInt(0)
            // if (account.opc == null) account.opc = 0
            // account.tpc = 1000
            // if (account.lpc == null) account.lpc = 0
            // if (account.cpc == null) account.cpc = 0
            // if (account.mpc == null) account.mpc = 0
            // if (base.comment == null) base.comment = "Welcome to REFLEC BEAT."
            // if (base.mlog == null) base.mlog = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            // if (battleRoyale == null) battleRoyale = generateRb5BattleRoyale()
            // if (myCourse == null) myCourse = generateRb5MyCourseLog()
            // if (mylist.index < 0) mylist.index = 0
            let scores: IRb1MusicRecord[] = await DB.Find<IRb1MusicRecord>(readParam.rid, { collection: "rb.rb1.playData.musicRecord" })

            // base.totalBestScore = 0
            // base.totalBestScoreEachChartType = [0, 0, 0, 0]
            // for (let s of scores) {
            //     base.totalBestScore += s.score
            //     base.totalBestScoreEachChartType[s.chartType] += s.score
            // }

            // config.randomEntryWork = init(config.randomEntryWork, BigInt(Math.trunc(Math.random() * 99999999)))
            // config.customFolderWork = init(config.randomEntryWork, BigInt(Math.trunc(Math.random() * 9999999999999)))


            result = {
                rid: readParam.rid,
                lid: "ea",
                mode: 1,
                pdata: {
                    base: base,
                    stat: stat,
                    custom: custom,
                    released: (released.length > 0) ? { info: released } : {},
                    record: (scores.length > 0) ? { rec: scores } : {},
                    stageLogs: {}
                }
            }
        }
        send.object(readPlayerPostTask(mapKObject(result, Rb1PlayerMap)))
    }

    export const DeletePlayer: EPR = async (info: EamuseInfo, data: KITEM2<{ rid: string }>, send: EamuseSend) => {
        if (!info.model.startsWith("KBR")) return send.deny()
        try {
            let rid = data.rid["@content"]
            let ridqueries: Query<any>[] = [
                { collection: "rb.rb1.player.account" },
                { collection: "rb.rb1.player.base" },
                { collection: "rb.rb1.player.custom" },
                { collection: "rb.rb1.player.releasedInfo" },
                { collection: "rb.rb1.playData.musicRecord" },
                { collection: "rb.rb1.playData.stageLog" },
            ]
            for (let q of ridqueries) {
                DB.Remove(rid, q)
            }
            send.success()
        } catch (e) {
            console.log((<Error>e).message)
            send.deny()
        }
    }

    export const WritePlayer: EPR = async (info: EamuseInfo, data: KITEM2<IRb1Player>, send: EamuseSend) => {
        if (!info.model.startsWith("KBR")) return send.deny()
        // try {
        data = await writePlayerPredecessor(data)
        let player: IRb1Player = mapBackKObject(data, Rb1PlayerMap)[0]
        let playCountQuery: Query<IRb1PlayerBase> = { collection: "rb.rb1.player.base" }
        let playerBaseForPlayCountQuery: IRb1PlayerBase = await DB.FindOne(player.rid, playCountQuery)
        if (player?.rid) {
            let rid = player.rid
            if (playerBaseForPlayCountQuery == null) { // save the new player
                if (player.pdata.base?.userId <= 0) {
                    let userId

                    do userId = Math.trunc(Math.random() * 99999999)
                    while ((await DB.Find<IRb1PlayerBase>({ collection: "rb.rb1.player.base", userId: userId })).length > 0)

                    player.pdata.base.userId = userId
                    // initializePlayer(player)
                }
            }
            else {
                if (playerBaseForPlayCountQuery.playCount == null) playerBaseForPlayCountQuery.playCount = 1
                else playerBaseForPlayCountQuery.playCount++
                DBM.upsert<IRb1PlayerBase>(rid, { collection: "rb.rb1.player.base" }, playerBaseForPlayCountQuery)
            }
            if (player.pdata.base) {
                player.pdata.base.playCount = playerBaseForPlayCountQuery.playCount
                await DBM.upsert<IRb1PlayerBase>(rid, { collection: "rb.rb1.player.base" }, player.pdata.base)
            }
            if (player.pdata.custom) await DBM.upsert<IRb1PlayerCustom>(rid, { collection: "rb.rb1.player.custom" }, player.pdata.custom)
            if (player.pdata.stat) await DBM.upsert<IRb1PlayerStat>(rid, { collection: "rb.rb1.player.stat" }, player.pdata.stat)
            if (player.pdata.stageLogs?.log?.length > 0) for (let i of player.pdata.stageLogs.log) StageLogManager.pushStageLog(rid, player.pdata.base.userId, i)
            if (player.pdata.record?.rec?.length > 0) for (let i of player.pdata.record.rec) await updateMusicRecord(rid, i)
            if (player.pdata.released?.info?.length > 0) await updateReleasedInfos(rid, player.pdata.released)
        }
        send.object({ uid: K.ITEM("s32", player.pdata.base.userId) })
        // }
        // catch (e) {
        //     console.log((<Error>e).message)
        //     send.deny()
        // }
    }

    export const LogPlayer: EPR = async (info: EamuseInfo, data: KITEM2<IRb1StageLogStandalone>, send: EamuseSend) => {
        if (!info.model.startsWith("KBR")) return send.deny()
        let log = mapBackKObject(data, Rb1StageLogStandaloneMap)[0]
        StageLogManager.pushStandaloneStageLog(log)
        StageLogManager.update()
        send.success()
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

    async function updateMusicRecord(rid: string, newRecord: IRb1MusicRecord): Promise<void> {
        let query: Query<IRb1MusicRecord> = { $and: [{ collection: "rb.rb1.playData.musicRecord" }, { musicId: newRecord.musicId }, { chartType: newRecord.chartType }] }
        let oldRecord = await DB.FindOne<IRb1MusicRecord>(rid, query)

        if (oldRecord == null) oldRecord = generateRb1MusicRecord(newRecord.musicId, newRecord.chartType)
        oldRecord.clearType = newRecord.clearType
        oldRecord.achievementRateTimes10 = newRecord.achievementRateTimes10
        oldRecord.score = newRecord.score
        oldRecord.combo = newRecord.combo
        oldRecord.missCount = newRecord.missCount
        oldRecord.winCount = newRecord.winCount
        oldRecord.drawCount = newRecord.drawCount
        oldRecord.loseCount = newRecord.loseCount

        oldRecord.playCount++
        await DBM.upsert(rid, query, oldRecord)
    }

    async function updateReleasedInfos(rid: string, infos: { info?: IRb1PlayerReleasedInfo[] }) {
        for (let i of infos.info) await DBM.upsert<IRb1PlayerReleasedInfo>(rid, { collection: "rb.rb1.player.releasedInfo", type: i.type, id: i.id }, i)
    }
}

class StageLogManager {
    private static subscriberList = <{ userId: number, rid: string, log: IRb1StageLog, state: "pending" | "default" }[]>[]
    private static triggerList = <{ userId: number, log: IRb1StageLogStandalone, triggeredIndex: number[], state: "pending" | "default" }[]>[]

    private constructor() { }

    public static pushStageLog(rid: string, userId: number, log: IRb1StageLog) {
        this.subscriberList.push({ userId: userId, rid: rid, log: log, state: "default" })
    }
    public static pushStandaloneStageLog(log: IRb1StageLogStandalone) {
        this.triggerList.push({ userId: log.userId, log: log, triggeredIndex: <number[]>[], state: "default" })
    }

    public static update() {
        let triggerRemoveIndex = []
        let subscriberRemoveIndex = []
        for (let i = 0; i < this.triggerList.length; i++) {
            let t = this.triggerList[i]
            if (t.state == "pending") continue
            for (let j = 0; j < this.subscriberList.length; j++) {
                let s = this.subscriberList[j]
                if (s.state == "pending") continue
                if (s.userId == t.userId) {
                    for (let e = 0; e < t.log.rec.length; e++) if (!t.triggeredIndex.includes(e) && this.checkLog(s.log, t.log.rec[e], t.log.play.stageCount)) {
                        s.state = "pending"
                        t.triggeredIndex.push(e)
                        s.log.stageIndex = t.log.play.stageCount - s.log.stageIndex - 1 // The stage indexes in play logs saved by player.write and the indexes saved by log.play are reversed.
                        s.log.standalone = t.log.rec[e]
                        DBM.insert(s.rid, s.log)
                        subscriberRemoveIndex.push(j)
                        break
                    }
                }
                if (t.triggeredIndex.length == t.log.play.stageCount) {
                    t.state = "pending"
                    triggerRemoveIndex.push(i)
                    break
                }
            }
        }

        for (let i of triggerRemoveIndex) this.triggerList.splice(i, 1)
        for (let j of subscriberRemoveIndex) this.subscriberList.splice(j, 1)
    }

    private static checkLog(subscriber: IRb1StageLog, triggerElement: IRb1StageLogStandaloneElement, stageCount: number): boolean {
        if (subscriber.musicId != triggerElement.musicId) return false
        if (subscriber.chartType != triggerElement.chartType) return false
        if ((stageCount - subscriber.stageIndex - 1) != triggerElement.stageIndex) return false // The stage indexes in play logs saved by player.write and the indexes saved by log.play are reversed.
        return true
    }
}