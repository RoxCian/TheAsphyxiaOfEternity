import { getExampleEventControl, Rb5EventControlMap } from "../../models/rb5/event_control"
// import { initializePlayer } from "./initialize_player"
import { KITEM2, KObjectMappingRecord, mapBackKObject, mapKObject, s32me, strme, u8me } from "../../utility/mapping"
import { readPlayerPostProcess, writePlayerPreProcess } from "./processing"
import { DBM } from "../utility/db_manager"
import { generateRb1MusicRecord, generateRb1Profile, IRb1MusicRecord, IRb1Player, IRb1PlayerBase, IRb1PlayerCustom, IRb1PlayerReleasedInfo, IRb1PlayerStat, IRb1StageLog, Rb1PlayerMap } from "../../models/rb1/profile"
import { tryFindPlayer } from "../utility/try_find_player"
import { IRb1StageLogStandalone, IRb1StageLogStandaloneElement, Rb1StageLogStandaloneMap } from "../../models/rb1/stage_log_standalone"
import { generateUserId } from "../utility/generate_user_id"

export namespace Rb1HandlersCommon {
    export const StartPlayer: EPR = async (info, _data, send) => {
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

    export const ReadPlayer: EPR = async (info, data: KITEM2<IPlayerReadParameters>, send) => {
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
                result = generateRb1Profile(readParam.rid, await generateUserId())
                result.pdata.base.name = "RBPlayer"
            }
            await writePlayerInternal(result)
        } else {
            if (base.level > 5) base.tutorialFlag = 0
            let stat: IRb1PlayerStat = await DB.FindOne<IRb1PlayerStat>(readParam.rid, { collection: "rb.rb1.player.stat" })
            let custom: IRb1PlayerCustom = await DB.FindOne<IRb1PlayerCustom>(readParam.rid, { collection: "rb.rb1.player.custom" })
            let released: IRb1PlayerReleasedInfo[] = await DB.Find<IRb1PlayerReleasedInfo>(readParam.rid, { collection: "rb.rb1.player.releasedInfo" })

            let scores: IRb1MusicRecord[] = await DB.Find<IRb1MusicRecord>(readParam.rid, { collection: "rb.rb1.playData.musicRecord" })

            result = {
                rid: readParam.rid,
                lid: "ea",
                mode: 1,
                pdata: {
                    comment: ((base.comment == null) || (base.comment == "")) ? "Welcome to REFLEC BEAT!" : base.comment,
                    base: base,
                    stat: stat,
                    custom: custom,
                    released: (released.length > 0) ? { info: released } : {},
                    record: (scores.length > 0) ? { rec: scores } : {},
                    stageLogs: {}
                }
            }
        }
        send.object(readPlayerPostProcess(mapKObject(result, Rb1PlayerMap)))
    }

    export const DeletePlayer: EPR = async (info, data: KITEM2<{ rid: string }>, send) => {
        if (!info.model.startsWith("KBR")) return send.deny()
        try {
            let rid = data.rid["@content"]
            let base = await DB.FindOne<IRb1PlayerBase>(rid, { collection: "rb.rb1.player.base" })
            await DBM.overall(rid, base?.userId, "rb.rb1", "delete")
            send.success()
        } catch (e) {
            console.log((<Error>e).message)
            send.deny()
        }
    }

    export const WritePlayer: EPR = async (info, data: KITEM2<IRb1Player>, send) => {
        if (!info.model.startsWith("KBR")) return send.deny()
        data = await writePlayerPreProcess(data)
        let player: IRb1Player = mapBackKObject(data, Rb1PlayerMap)[0]
        await writePlayerInternal(player)
        send.object({ uid: K.ITEM("s32", player.pdata.base.userId) })
    }
    async function writePlayerInternal(player: IRb1Player) {
        let opm = new DBM.DBOperationManager()
        let playCountQuery: Query<IRb1PlayerBase> = { collection: "rb.rb1.player.base" }
        let playerBaseForPlayCountQuery: IRb1PlayerBase = await opm.findOne(player.rid, playCountQuery)
        if (player?.rid) {
            let rid = player.rid
            if (playerBaseForPlayCountQuery == null) { // save the new player
                if (player.pdata.base?.userId <= 0) {
                    player.pdata.base.userId = await generateUserId()
                    // initializePlayer(player)
                    playerBaseForPlayCountQuery = player.pdata.base
                    playerBaseForPlayCountQuery.playCount = 0
                }
            } else {
                if (playerBaseForPlayCountQuery.playCount == null) playerBaseForPlayCountQuery.playCount = 1
                else playerBaseForPlayCountQuery.playCount++

                if (player.pdata.base) {
                    if (playerBaseForPlayCountQuery.name) player.pdata.base.name = playerBaseForPlayCountQuery.name
                    player.pdata.base.comment = playerBaseForPlayCountQuery.comment
                    player.pdata.base.playCount = playerBaseForPlayCountQuery.playCount
                    opm.upsert<IRb1PlayerBase>(rid, { collection: "rb.rb1.player.base" }, player.pdata.base)
                } else opm.upsert<IRb1PlayerBase>(rid, { collection: "rb.rb1.player.base" }, playerBaseForPlayCountQuery)
            }

            if (player.pdata.custom) opm.upsert<IRb1PlayerCustom>(rid, { collection: "rb.rb1.player.custom" }, player.pdata.custom)
            if (player.pdata.stat) opm.upsert<IRb1PlayerStat>(rid, { collection: "rb.rb1.player.stat" }, player.pdata.stat)
            if (player.pdata.stageLogs?.log?.length > 0) for (let i of player.pdata.stageLogs.log) StageLogManager.pushStageLog(rid, player.pdata.base.userId, i)
            if (player.pdata.record?.rec?.length > 0) for (let i of player.pdata.record.rec) await updateMusicRecord(rid, i, opm)
            if (player.pdata.released?.info?.length > 0) for (let i of player.pdata.released.info) opm.upsert<IRb1PlayerReleasedInfo>(rid, { collection: "rb.rb1.player.releasedInfo", type: i.type, id: i.id }, i)
        }

        await DBM.operate(opm)
    }

    export const LogPlayer: EPR = async (info, data: KITEM2<IRb1StageLogStandalone>, send) => {
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

    async function updateMusicRecord(rid: string, newRecord: IRb1MusicRecord, opm: DBM.DBOperationManager): Promise<void> {
        let query: Query<IRb1MusicRecord> = { $and: [{ collection: "rb.rb1.playData.musicRecord" }, { musicId: newRecord.musicId }, { chartType: newRecord.chartType }] }
        let oldRecord = await opm.findOne<IRb1MusicRecord>(rid, query)

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
        opm.upsert(rid, query, oldRecord)
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