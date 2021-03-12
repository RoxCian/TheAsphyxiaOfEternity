import { getExampleEventControl, Rb5EventControlMap } from "../../models/rb5/event_control"
// import { initializePlayer } from "./initialize_player"
import { KRb5ShopInfo } from "../../models/rb5/shop_info"
import { KITEM2, KObjectMappingRecord, mapBackKObject, mapKObject } from "../../utility/mapping"
import { readPlayerPostTask, writePlayerPredecessor } from "./system_parameter_controller"
import { DBM } from "../utility/db_manager"
import { generateRb2LincleLink, generateRb2MusicRecord, generateRb2Profile, IRb2Glass, IRb2LincleLink, IRb2MusicRecord, IRb2Mylist, IRb2Player, IRb2PlayerBase, IRb2PlayerCustom, IRb2PlayerReleasedInfo, IRb2PlayerStat, IRb2StageLog, Rb2PlayerMap } from "../../models/rb2/profile"
import { tryFindPlayer } from "../utility/try_find_player"
import { IRb2StageLogStandalone, IRb2StageLogStandaloneElement, Rb2StageLogStandaloneMap } from "../../models/rb2/stage_log_standalone"
import { ClearType, findBestMusicRecord, findMusicRecordMetadatas, MusicRecordMetadatas } from "../utility/find_music_record"
import { getMusicId } from "../../data/musicinfo/rb_music_info"

export namespace Rb2HandlersCommon {
    export const ReadInfo: EPR = async (info: EamuseInfo, data, send) => {
        switch (info.method) {

        }
        send.success()
    }

    export const BootPcb: EPR = async (_info: EamuseInfo, _data: any, send: EamuseSend) => {
        send.object({ sinfo: KRb5ShopInfo })
    }

    export const StartPlayer: EPR = async (info: EamuseInfo, _data: any, send: EamuseSend) => {
        if (!info.model.startsWith("LBR")) return send.deny()
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
        if (!info.model.startsWith("LBR")) return send.deny()
        let readParam: IPlayerReadParameters = mapBackKObject(data, PlayerReadParametersMap)[0]
        let result: IRb2Player
        let base: IRb2PlayerBase = await DB.FindOne<IRb2PlayerBase>(readParam.rid, { collection: "rb.rb2.player.base" })
        if (base == null) {
            let rbPlayer = await tryFindPlayer(readParam.rid, 2)
            if (rbPlayer != null) {
                result = generateRb2Profile(readParam.rid, rbPlayer.userId)
                result.pdata.base.name = rbPlayer.name
                let scoreMetadatas = await findMusicRecordMetadatas(readParam.rid)
                let scores = await pullMusicRecords(readParam.rid, scoreMetadatas, true)
                if (scores.length > 0) result.pdata.record = { rec: scores }
            } else {
                let userId

                do userId = Math.trunc(Math.random() * 99999999)
                while ((await DB.Find<IRb2PlayerBase>({ collection: "rb.rb2.player.base", userId: userId })).length > 0)
                result = generateRb2Profile(readParam.rid, userId)
                result.pdata.base.name = "RBPlayer"
            }
            result.pdata.comment = ((base == null) || (base.comment == null)) ? "Enjoy limelight world!" : base.comment
        } else {
            let stat: IRb2PlayerStat = await DB.FindOne<IRb2PlayerStat>(readParam.rid, { collection: "rb.rb2.player.stat" })
            let custom: IRb2PlayerCustom = await DB.FindOne<IRb2PlayerCustom>(readParam.rid, { collection: "rb.rb2.player.custom" })
            let released: IRb2PlayerReleasedInfo[] = await DB.Find<IRb2PlayerReleasedInfo>(readParam.rid, { collection: "rb.rb2.player.releasedInfo" })
            let glass: IRb2Glass[] = await DB.Find<IRb2Glass>(readParam.rid, { collection: "rb.rb2.player.glass" })
            let lincleLink: IRb2LincleLink = await DB.FindOne<IRb2LincleLink>(readParam.rid, { collection: "rb.rb2.player.lincleLink" })
            let mylist: IRb2Mylist = await DB.FindOne<IRb2Mylist>(readParam.rid, { collection: "rb.rb2.player.mylist" })

            if (base.level > 1) custom.isBeginner = false

            if (base.playCount > 0) custom.isTutorialEnabled = false
            let scoreMetadatas = await findMusicRecordMetadatas(readParam.rid)
            let scores = await pullMusicRecords(readParam.rid, scoreMetadatas)

            result = {
                rid: readParam.rid,
                lid: "ea",
                beginTime: BigInt(614498759023),
                endTime: BigInt(9614498759023),
                mode: 0,
                pdata: {
                    comment: (base?.comment != "") ? base.comment : "Enjoy limelight world!",
                    team: { teamId: -1, teamName: "Asphyxia" },
                    base: base,
                    stat: stat,
                    custom: custom,
                    released: (released.length > 0) ? { info: released } : { info: [{ collection: "rb.rb2.player.releasedInfo", type: 0, id: 0, param: 0 }] },
                    record: (scores.length > 0) ? { rec: scores } : {},
                    stageLogs: {},
                    rival: {},
                    glass: (glass.length > 0) ? { g: glass } : {},
                    lincleLink: (lincleLink == null) ? generateRb2LincleLink() : lincleLink,
                    mylist: (mylist == null) ? { collection: "rb.rb2.player.mylist" } : mylist
                }
            }
        }
        send.object(readPlayerPostTask(mapKObject(result, Rb2PlayerMap)))
    }

    function translateRb2ClearType(clearType: ClearType): number {
        switch (clearType) {
            case ClearType.notPlayed: return 2
            case ClearType.failed: return 2
            case ClearType.cleared: return 3
            case ClearType.hardCleared: return 3
            case ClearType.sHardCleared: return 3
            case ClearType.fullCombo: return 4
            case ClearType.allJustReflecFullCombo: return 4
            case ClearType.excellent: return 4
        }
    }
    async function pullMusicRecords(rid: string, metas: MusicRecordMetadatas, isAlwaysCreateRecord: boolean = false): Promise<IRb2MusicRecord[]> {
        let result: IRb2MusicRecord[] = []
        for (let mk of metas) {
            let midstr = mk.split(":")[0]
            let mid = getMusicId(midstr, 2)
            if (mid < 0) continue
            let chart = parseInt(mk.split(":")[1])
            let currentRecord = isAlwaysCreateRecord ? generateRb2MusicRecord(mid, chart) : await DB.FindOne<IRb2MusicRecord>(rid, { collection: "rb.rb2.playData.musicRecord", musicId: mid, chartType: chart })
            if (currentRecord == null) currentRecord = generateRb2MusicRecord(mid, chart)
            let bestRecord = await findBestMusicRecord(rid, midstr, chart, 2)
            if (bestRecord != null) currentRecord.oldRecord = {
                winCount: bestRecord.winCount,
                drawCount: bestRecord.drawCount,
                loseCount: bestRecord.loseCount,
                score: bestRecord.score,
                clearType: translateRb2ClearType(bestRecord.clearType),
                achievementRateTimes10: Math.trunc(bestRecord.achievementRateTimes100 / 10),
                combo: bestRecord.combo,
                missCount: bestRecord.missCount,
                playCount: bestRecord.playCount
            }
            result.push(currentRecord)
        }

        return result
    }

    export const DeletePlayer: EPR = async (info: EamuseInfo, data: KITEM2<{ rid: string }>, send: EamuseSend) => {
        if (!info.model.startsWith("LBR")) return send.deny()
        try {
            let rid = data.rid["@content"]
            let ridqueries: Query<any>[] = [
                { collection: "rb.rb2.player.base" },
                { collection: "rb.rb2.player.custom" },
                { collection: "rb.rb2.player.releasedInfo" },
                { collection: "rb.rb2.player.lincleLink" },
                { collection: "rb.rb2.playData.musicRecord" },
                { collection: "rb.rb2.playData.stageLog" },
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

    export const WritePlayer: EPR = async (info: EamuseInfo, data: KITEM2<IRb2Player>, send: EamuseSend) => {
        if (!info.model.startsWith("LBR")) return send.deny()
        // try {
        data = await writePlayerPredecessor(data)
        let player: IRb2Player = mapBackKObject(data, Rb2PlayerMap)[0]
        let playCountQuery: Query<IRb2PlayerBase> = { collection: "rb.rb2.player.base" }
        let playerBaseForPlayCountQuery: IRb2PlayerBase = await DB.FindOne(player.rid, playCountQuery)
        if (player?.rid) {
            let rid = player.rid
            if (playerBaseForPlayCountQuery == null) { // save the new player
                if (player.pdata.base?.userId <= 0) {
                    let userId

                    do userId = Math.trunc(Math.random() * 99999999)
                    while ((await DB.Find<IRb2PlayerBase>({ collection: "rb.rb2.player.base", userId: userId })).length > 0)

                    player.pdata.base.userId = userId
                    // initializePlayer(player)
                    playerBaseForPlayCountQuery = player.pdata.base
                }
            }
            else {
                if (playerBaseForPlayCountQuery.playCount == null) playerBaseForPlayCountQuery.playCount = 1
                else playerBaseForPlayCountQuery.playCount++
            }
            if (player.pdata.base) {
                player.pdata.base.playCount = (playerBaseForPlayCountQuery?.playCount != null) ? playerBaseForPlayCountQuery.playCount : 1
                await DBM.upsert<IRb2PlayerBase>(rid, { collection: "rb.rb2.player.base" }, player.pdata.base)
            } else DBM.upsert<IRb2PlayerBase>(rid, { collection: "rb.rb2.player.base" }, playerBaseForPlayCountQuery)

            if (player.pdata.custom) await DBM.upsert<IRb2PlayerCustom>(rid, { collection: "rb.rb2.player.custom" }, player.pdata.custom)
            if (player.pdata.stat) await DBM.upsert<IRb2PlayerStat>(rid, { collection: "rb.rb2.player.stat" }, player.pdata.stat)
            if (player.pdata.stageLogs?.log?.length > 0) for (let i of player.pdata.stageLogs.log) StageLogManager.pushStageLog(rid, player.pdata.base.userId, i)
            if (player.pdata.record?.rec?.length > 0) for (let i of player.pdata.record.rec) await updateMusicRecord(rid, i)
            if (player.pdata.released?.info?.length > 0) await updateReleasedInfos(rid, player.pdata.released)
            if (player.pdata.glass?.g?.length > 0) for (let g of player.pdata.glass.g) await DBM.upsert<IRb2Glass>(rid, { collection: "rb.rb2.player.glass", id: g.id }, g)
            if (player.pdata.mylist?.slot?.length > 0) await DBM.upsert<IRb2Mylist>(rid, { collection: "rb.rb2.player.mylist" }, player.pdata.mylist)
            if (player.pdata.lincleLink) await DBM.upsert<IRb2LincleLink>(rid, { collection: "rb.rb2.player.lincleLink" }, player.pdata.lincleLink)
        }
        send.object({ uid: K.ITEM("s32", player.pdata.base.userId), time: K.ITEM("s32", Math.trunc(Date.now() / 1000)) })
        // }
        // catch (e) {
        //     console.log((<Error>e).message)
        //     send.deny()
        // }
    }

    export const LogPlayer: EPR = async (info: EamuseInfo, data: KITEM2<IRb2StageLogStandalone>, send: EamuseSend) => {
        if (!info.model.startsWith("LBR")) return send.deny()
        let log = mapBackKObject(data, Rb2StageLogStandaloneMap)[0]
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

    async function updateMusicRecord(rid: string, newRecord: IRb2MusicRecord): Promise<void> {
        let query: Query<IRb2MusicRecord> = { $and: [{ collection: "rb.rb2.playData.musicRecord" }, { musicId: newRecord.musicId }, { chartType: newRecord.chartType }] }
        let oldRecord = await DB.FindOne<IRb2MusicRecord>(rid, query)

        if (oldRecord == null) oldRecord = generateRb2MusicRecord(newRecord.musicId, newRecord.chartType)

        // red
        oldRecord.newRecord.clearType = newRecord.newRecord.clearType
        oldRecord.newRecord.achievementRateTimes10 = newRecord.newRecord.achievementRateTimes10
        oldRecord.newRecord.score = newRecord.newRecord.score
        oldRecord.newRecord.combo = newRecord.newRecord.combo
        oldRecord.newRecord.missCount = newRecord.newRecord.missCount
        oldRecord.newRecord.winCount = newRecord.newRecord.winCount
        oldRecord.newRecord.drawCount = newRecord.newRecord.drawCount
        oldRecord.newRecord.loseCount = newRecord.newRecord.loseCount

        oldRecord.newRecord.playCount++

        // blue
        oldRecord.oldRecord.clearType = newRecord.oldRecord.clearType
        oldRecord.oldRecord.achievementRateTimes10 = newRecord.oldRecord.achievementRateTimes10
        oldRecord.oldRecord.score = newRecord.oldRecord.score
        oldRecord.oldRecord.combo = newRecord.oldRecord.combo
        oldRecord.oldRecord.missCount = newRecord.oldRecord.missCount
        oldRecord.oldRecord.winCount = newRecord.oldRecord.winCount
        oldRecord.oldRecord.drawCount = newRecord.oldRecord.drawCount
        oldRecord.oldRecord.loseCount = newRecord.oldRecord.loseCount

        oldRecord.oldRecord.playCount++

        await DBM.upsert(rid, query, oldRecord)
    }

    async function updateReleasedInfos(rid: string, infos: { info?: IRb2PlayerReleasedInfo[] }) {
        for (let i of infos.info) await DBM.upsert<IRb2PlayerReleasedInfo>(rid, { collection: "rb.rb2.player.releasedInfo", type: i.type, id: i.id }, i)
    }
}

class StageLogManager {
    private static subscriberList = <{ userId: number, rid: string, log: IRb2StageLog, state: "pending" | "default" }[]>[]
    private static triggerList = <{ userId: number, log: IRb2StageLogStandalone, triggeredIndex: number[], state: "pending" | "default" }[]>[]

    private constructor() { }

    public static pushStageLog(rid: string, userId: number, log: IRb2StageLog) {
        this.subscriberList.push({ userId: userId, rid: rid, log: log, state: "default" })
    }
    public static pushStandaloneStageLog(log: IRb2StageLogStandalone) {
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

    private static checkLog(subscriber: IRb2StageLog, triggerElement: IRb2StageLogStandaloneElement, stageCount: number): boolean {
        if (subscriber.musicId != triggerElement.musicId) return false
        if (subscriber.chartType != triggerElement.chartType) return false
        if ((stageCount - subscriber.stageIndex - 1) != triggerElement.stageIndex) return false // The stage indexes in play logs saved by player.write and the indexes saved by log.play are reversed.
        return true
    }
}