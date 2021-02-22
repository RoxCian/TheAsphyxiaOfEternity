import { generateRb5ClasscheckRecord, IRb5ClasscheckRecord } from "../../models/rb5/classcheck_record"
import { getExampleEventControl, Rb5EventControlMap } from "../../models/rb5/event_control"
import { initializePlayer } from "./initialize_player"
import { generateRb5MusicRecord, IRb5MusicRecord, Rb5MusicRecordMap } from "../../models/rb5/music_record"
import { IRb5Mylist } from "../../models/rb5/mylist"
import { IRb5Player, IRb5PlayerAccount, IRb5PlayerBase, IRb5PlayerClasscheckLog, IRb5PlayerConfig, IRb5PlayerCustom, IRb5PlayerParameters, IRb5PlayerReleasedInfo, IRb5PlayerStageLog, IRb5QuestRecord, Rb5PlayerReadMap, Rb5PlayerWriteMap } from "../../models/rb5/profile"
import { KRb5ShopInfo } from "../../models/rb5/shop_info"
import { KITEM2, KObjectMappingRecord, mapBackKObject, mapKObject } from "../../utility/mapping"
import { readPlayerPostTask, writePlayerPredecessor } from "./system_parameter_controller"
import { generateRb5Profile } from "../../models/rb5/profile"

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
        send.object(mapKObject(generateRb5Profile(readParam.rid), Rb5PlayerReadMap))
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

                let userId

                do userId = Math.trunc(Math.random() * 99999999)
                while ((await DB.Find<IRb5PlayerAccount>({ collection: "rb.rb5.player.account", userId: userId })).length > 0)

                player.pdata.account.userId = userId
                player.pdata.account.isFirstFree = true
                initializePlayer(player)
                await DB.Upsert(rid, { collection: "rb.rb5.player.account" }, player.pdata.account)
                await DB.Upsert(rid, { collection: "rb.rb5.player.base" }, player.pdata.base)
                await DB.Upsert(rid, { collection: "rb.rb5.player.config" }, player.pdata.config)
                await DB.Upsert(rid, { collection: "rb.rb5.player.custom" }, player.pdata.custom)
            } else {
                playerAccountForPlayCountQuery.isFirstFree = false
                playerAccountForPlayCountQuery.playCount++
                await DB.Update(rid, { collection: "rb.rb5.player.account" }, playerAccountForPlayCountQuery)
            }
            if (player.pdata.stageLogs?.log?.length > 0) for (let i of player.pdata.stageLogs.log) await updateMusicRecordFromStageLog(rid, i)
            if (player.pdata.base) {
                let init = (v, i) => (v == null) ? i : v

                await DB.Upsert<IRb5PlayerBase>(rid, { collection: "rb.rb5.player.base" }, player.pdata.base)
            }
            if (player.pdata.config) await DB.Upsert<IRb5PlayerConfig>(rid, { collection: "rb.rb5.player.config" }, player.pdata.config)
            if (player.pdata.custom) await DB.Upsert<IRb5PlayerCustom>(rid, { collection: "rb.rb5.player.custom" }, player.pdata.custom)
            if ((<IRb5PlayerClasscheckLog>player.pdata.classcheck)?.class) {
                (player.pdata.classcheck as IRb5PlayerClasscheckLog).totalScore = player.pdata.stageLogs.log[0].score + player.pdata.stageLogs.log[1]?.score + player.pdata.stageLogs.log[2]?.score
                await updateClasscheckRecordFromLog(rid, <IRb5PlayerClasscheckLog>player.pdata.classcheck, player.pdata.stageLogs.log[player.pdata.stageLogs.log.length - 1].time)
            }
            if (player.pdata.released?.info?.length > 0) await updateReleasedInfos(rid, player.pdata.released)
            if (player.pdata.playerParam?.item?.length > 0) await updatePlayerParameters(rid, player.pdata.playerParam)
            if (player.pdata.mylist?.list != null) await DB.Upsert<IRb5Mylist>(rid, { collection: "rb.rb5.player.mylist", index: player.pdata.mylist.list.index }, player.pdata.mylist.list)
            if (player.pdata.quest?.list?.length > 0) for (let q of player.pdata.quest.list) await DB.Upsert<IRb5QuestRecord>(rid, { collection: "rb.rb5.playData.quest", dungeonId: q.dungeonId, dungeonGrade: q.dungeonGrade }, q)
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

        let scores: IRb5MusicRecord[] = await DB.Find<IRb5MusicRecord>(rid, { collection: "rb.rb5.playData.musicRecord" })
        let result = {
            pdata: { record: (scores?.length > 0) ? { rec: scores } : {} }
        }

        send.object(mapKObject(result, {
            pdata: { record: { rec: { 0: Rb5MusicRecordMap } } }
        }))
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
        await DB.Upsert(rid, query, classRecord)
    }

    async function updateReleasedInfos(rid: string, infos: { info: IRb5PlayerReleasedInfo[] }) {
        for (let i of infos.info) await DB.Upsert<IRb5PlayerReleasedInfo>(rid, { collection: "rb.rb5.player.releasedInfo", type: i.type, id: i.id }, i)
    }

    async function updatePlayerParameters(rid: string, params: { item: IRb5PlayerParameters[] }) {
        for (let i of params.item) await DB.Upsert<IRb5PlayerParameters>(rid, { collection: "rb.rb5.player.parameters", type: i.type, bank: i.bank }, i)
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