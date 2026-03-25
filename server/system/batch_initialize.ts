import { DBH } from "../utils/db/dbh"
import { Batch } from "./batch"
import { Rb6JustCollection } from "../models/rb6/just_collection"
import { Rb3PlayerAccount } from "../models/rb3/profile"
import { Rb6Ghost } from "../models/rb6/ghost"
import { Rb6PlayerAccount, Rb6PlayerBase } from "../models/rb6/profile"
import { Rb6MusicRecord } from "../models/rb6/music_record"

export function initializeBatch() {
    Batch.register("batch#0.11.11.part2", "1.4.0", async () => {
        const jc = await DBH.find<Rb6JustCollection>({ collection: "rb.rb6.playData.justCollection#userId" })
        for (const e of jc) {
            if (!e.userId) {
                await DBH.remove(undefined, { _id: e._id }, false)
                continue
            }
            if (!e["redData"] && !e["blueData"] && !e["redDataArray"] && !e["blueDataArray"]) continue
            delete e["redData"]
            delete e["blueData"]
            delete e["redDataArray"]
            delete e["blueDataArray"]

            await DBH.update(undefined, { collection: "rb.rb6.playData.justCollection#userId", userId: e.userId, musicId: e.musicId, chartType: e.chartType }, e)
        }
    })
    Batch.register("batch#0.12.0", "0.12.0", async () => {
        const a = await DBH.find<Rb3PlayerAccount>(undefined, { collection: "rb.rb3.player.account" })
        for (const account of a) {
            if (account.playCountToday == undefined) account.playCountToday = (account as any).dpc
            if (account.dayCount == undefined) account.dayCount = (account as any).tdc
            await DBH.update(undefined, { collection: "rb.rb3.player.account", __refid: account.rid }, account)
        }
    })
    Batch.register("batch#0.12.0.part2", "1.4.0", async () => {
        const a = await DBH.find<Rb3PlayerAccount>(undefined, { collection: "rb.rb3.player.account" })
        for (const account of a) {
            delete account["dpc"]
            delete account["tdc"]
            await DBH.update(account.rid, { collection: "rb.rb3.player.account", __refid: account.rid }, account)
        }
    })
    Batch.register("batch#1.2.0", "1.2.0", async () => {
        const g = await DBH.find<Rb6Ghost>({ collection: "rb.rb6.playData.ghost#userId" })
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
    Batch.register("batch#2.0.0", "2.0.0", async () => {
        const records = await DBH.find<Rb6MusicRecord>(undefined, { collection: "rb.rb6.playData.musicRecord" })
        const modifiedRecords: Doc<Rb6MusicRecord>[] = []
        for (const r of records) {
            let modified = false
            if (r.justCollectionRateTimes100Red == undefined) {
                modified = true
                r.justCollectionRateTimes100Red = 0
            }
            if (r.justCollectionRateTimes100Blue == undefined) {
                modified = true
                r.justCollectionRateTimes100Blue = 0
            }
            if (modified) modifiedRecords.push(r)
        }
        for (const r of modifiedRecords) await DBH.update((r as any).__refid, { _id: r._id }, r)
        
        const base = await DBH.find<Rb6PlayerBase>({ collection: "rb.rb6.player.base" })
        for (const b of base) {
            b.classAchievementRateTimes100 ??= (b as any)["classAchievrementRateTimes100"]
            delete (b as any)["classAchievrementRateTimes100"]
            await DBH.update((b as any).__refid, { collection: "rb.rb6.player.base" }, b)
        }
    })
}
