import { Batch } from "./batch"
import { DBM } from "./db_manager"
import { bufferToBase64 } from "../../utility/utility_functions"
import { IRb6JustCollection } from "../../models/rb6/just_collection"
import { IRb3PlayerAccount } from "../../models/rb3/profile"
import { IRb6Ghost, IRb6PlayerAccount } from "../../models/rb6/profile"
import { IRb6MusicRecord } from "../../models/rb6/music_record"

export function initializeBatch() {
    Batch.register("batch#0.11.11", "0.11.11", async () => {
        let jc = await DB.Find<IRb6JustCollection>({ collection: "rb.rb6.playData.justCollection#userId" })
        for (let e of jc) {
            if (e.redDataArray != null) e.redDataBase64 = bufferToBase64(Buffer.from(e.redDataArray))
            else if (e.redData != null) e.redDataBase64 = bufferToBase64(Buffer.from(e.redData))
            delete e.redData
            delete e.redDataArray
            if (e.blueDataArray != null) e.blueDataBase64 = bufferToBase64(Buffer.from(e.blueDataArray))
            else if (e.blueData != null) e.blueDataBase64 = bufferToBase64(Buffer.from(e.blueData))
            delete e.blueData
            delete e.blueDataArray

            await DBM.update(null, { collection: "rb.rb6.playData.justCollection#userId", userId: e.userId, musicId: e.musicId, chartType: e.chartType }, e)
        }
    })
    Batch.register("batch#0.11.11.part2", "1.4.0", async () => {
        let jc = await DB.Find<IRb6JustCollection>({ collection: "rb.rb6.playData.justCollection#userId" })
        for (let e of jc) {
            delete e["redData"]
            delete e["blueData"]
            delete e["redDataArray"]
            delete e["blueDataArray"]

            await DBM.update(null, { collection: "rb.rb6.playData.justCollection#userId", userId: e.userId, musicId: e.musicId, chartType: e.chartType }, e)
        }
    })
    Batch.register("batch#0.12.0", "0.12.0", async () => {
        let a = await DB.Find<IRb3PlayerAccount>(null, { collection: "rb.rb3.player.account" })
        for (let account of a) {
            if (account.playCountToday == null) account.playCountToday = account.dpc
            if (account.dayCount == null) account.dayCount = account.tdc
            await DBM.update(null, { collection: "rb.rb3.player.account", __refid: account.rid }, account)
        }
    })
    Batch.register("batch#0.12.0.part2", "1.4.0", async () => {
        let a = await DB.Find<IRb3PlayerAccount>(null, { collection: "rb.rb3.player.account" })
        for (let account of a) {
            delete account["dpc"]
            delete account["tdc"]
            await DBM.update(null, { collection: "rb.rb3.player.account", __refid: account.rid }, account)
        }
    })
    Batch.register("batch#1.2.0", "1.2.0", async () => {
        let g = await DB.Find<IRb6Ghost>({ collection: "rb.rb6.playData.ghost#userId" })
        let accountsCache = new Map<number, IRb6PlayerAccount>()
        for (let ghost of g) {
            let account: IRb6PlayerAccount = accountsCache.get(ghost.userId) || await DB.FindOne<IRb6PlayerAccount>(null, { collection: "rb.rb6.player.account", userId: ghost.userId })
            if (!account) continue
            accountsCache.set(ghost.userId, account)
            let rid = account.rid
            let update: Update<IRb6MusicRecord> = { $set: {} }
            if (ghost.blueDataBase64) update.$set.isHasGhostBlue = true
            if (ghost.redDataBase64) update.$set.isHasGhostRed = true
            DBM.update<IRb6MusicRecord>(rid, { collection: "rb.rb6.playData.musicRecord", musicId: ghost.musicId, chartType: ghost.chartType }, update)
        }
    })
}
