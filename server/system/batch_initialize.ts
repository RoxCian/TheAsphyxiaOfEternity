import { DBH } from "../utils/db/dbh"
import { Batch } from "./batch"
import { Rb6JustCollection } from "../models/rb6/just_collection"
import { Rb3PlayerAccount } from "../models/rb3/profile"
import { Rb6Ghost } from "../models/rb6/ghost"
import { Rb6PlayerAccount } from "../models/rb6/profile"
import { Rb6MusicRecord } from "../models/rb6/music_record"

export function initializeBatch() {
    Batch.register("batch#0.11.11.part2", "1.4.0", async () => {
        const jc = await DB.Find<Rb6JustCollection>({ collection: "rb.rb6.playData.justCollection#userId" })
        for (const e of jc) {
            delete e["redData"]
            delete e["blueData"]
            delete e["redDataArray"]
            delete e["blueDataArray"]

            await DBH.update(undefined, { collection: "rb.rb6.playData.justCollection#userId", userId: e.userId, musicId: e.musicId, chartType: e.chartType }, e)
        }
    })
    Batch.register("batch#0.12.0", "0.12.0", async () => {
        const a = await DB.Find<Rb3PlayerAccount>(undefined, { collection: "rb.rb3.player.account" })
        for (const account of a) {
            if (account.playCountToday == undefined) account.playCountToday = (account as any).dpc
            if (account.dayCount == undefined) account.dayCount = (account as any).tdc
            await DBH.update(undefined, { collection: "rb.rb3.player.account", __refid: account.rid }, account)
        }
    })
    Batch.register("batch#0.12.0.part2", "1.4.0", async () => {
        const a = await DB.Find<Rb3PlayerAccount>(undefined, { collection: "rb.rb3.player.account" })
        for (const account of a) {
            delete account["dpc"]
            delete account["tdc"]
            await DBH.update(undefined, { collection: "rb.rb3.player.account", __refid: account.rid }, account)
        }
    })
    Batch.register("batch#1.2.0", "1.2.0", async () => {
        const g = await DB.Find<Rb6Ghost>({ collection: "rb.rb6.playData.ghost#userId" })
        const accountsCache = new Map<number, Rb6PlayerAccount>()
        for (const ghost of g) {
            const account: Rb6PlayerAccount = accountsCache.get(ghost.userId) || await DB.FindOne<Rb6PlayerAccount>(undefined, { collection: "rb.rb6.player.account", userId: ghost.userId })
            if (!account) continue
            accountsCache.set(ghost.userId, account)
            const rid = account.rid
            const update: Update<Rb6MusicRecord> = { $set: {} }
            if (ghost.blueDataBase64) update.$set.isHasGhostBlue = true
            if (ghost.redDataBase64) update.$set.isHasGhostRed = true
            DBH.update<Rb6MusicRecord>(rid, { collection: "rb.rb6.playData.musicRecord", musicId: ghost.musicId, chartType: ghost.chartType }, update)
        }
    })
}
