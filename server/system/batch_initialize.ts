import { DBH } from "../utils/db/dbh"
import { Batch } from "./batch"
import { Rb6JustCollection } from "../models/rb6/just_collection"
import { Rb3PlayerAccount } from "../models/rb3/profile"
import { Rb6Ghost } from "../models/rb6/ghost"
import { Rb6PlayerAccount, Rb6PlayerBase, Rb6PlayerStageLog } from "../models/rb6/profile"
import { Rb6MusicRecord } from "../models/rb6/music_record"
import { Rb4Classcheck } from "../models/rb4/classcheck"
import { Rb5Classcheck } from "../models/rb5/classcheck"
import { Rb6Classcheck } from "../models/rb6/classcheck"
import { Rb4PlayerStageLog } from "../models/rb4/profile"
import { Rb5PlayerStageLog } from "../models/rb5/profile"
import { Rb4DojoIndex, RbVersionWithClasscheck } from "../models/shared/rb_types"

export function initializeBatch() {
    Batch.register("batch#0.11.11.part2", "1.4.0", async () => {
        const jc = await DBH.find<Rb6JustCollection>({ collection: "rb.rb6.playData.justCollection#userId" })
        for (const e of jc) {
            if (!e.userId) {
                await DBH.remove({ _id: e._id })
                continue
            }
            if (!e["redData"] && !e["blueData"] && !e["redDataArray"] && !e["blueDataArray"]) continue
            delete e["redData"]
            delete e["blueData"]
            delete e["redDataArray"]
            delete e["blueDataArray"]

            await DBH.update({ collection: "rb.rb6.playData.justCollection#userId", userId: e.userId, musicId: e.musicId, chartType: e.chartType }, e)
        }
    })
    Batch.register("batch#0.12.0", "0.12.0", async () => {
        const a = await DBH.find<Rb3PlayerAccount>(undefined, { collection: "rb.rb3.player.account" })
        for (const account of a) {
            if (account.playCountToday == undefined) account.playCountToday = (account as any).dpc
            if (account.dayCount == undefined) account.dayCount = (account as any).tdc
            await DBH.update(account.rid, { collection: "rb.rb3.player.account", __refid: account.rid }, account)
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
            if (!ghost.userId) continue
            const account = accountsCache.get(ghost.userId) || await DBH.findOne<Rb6PlayerAccount>(undefined, { collection: "rb.rb6.player.account", userId: ghost.userId })
            if (!account) continue
            accountsCache.set(ghost.userId, account)
            const rid = account.rid
            const update: Update<Rb6MusicRecord> = { $set: {} }
            if (ghost.blueDataBase64) update.$set!.isHasGhostBlue = true
            if (ghost.redDataBase64) update.$set!.isHasGhostRed = true
            DBH.update<Rb6MusicRecord>(rid, { collection: "rb.rb6.playData.musicRecord", musicId: ghost.musicId, chartType: ghost.chartType }, update)
        }
    })
    Batch.register("batch#2.0.0", "2.0.0", async () => {
        const records = await DBH.find<Rb6MusicRecord>(undefined, { collection: "rb.rb6.playData.musicRecord" })
        const modifiedRecords: Doc<Rb6MusicRecord>[] = []
        // fill justcol rate with 0
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

        // typo fix: classAchievrementRateTimes100 -> classAchievementRateTimes100
        const base = await DBH.find<Rb6PlayerBase>({ collection: "rb.rb6.player.base" })
        for (const b of base) {
            b.classAchievementRateTimes100 ??= (b as any)["classAchievrementRateTimes100"]
            delete (b as any)["classAchievrementRateTimes100"]
            await DBH.update((b as any).__refid, { collection: "rb.rb6.player.base" }, b)
        }
    })
    Batch.register("batch#2.0.0.part2", "2.0.0", async () => {
        // append stage log into classcheck records
        const t = new DBH.T()
        const classchecks = await t.find(undefined, { collection: { $in: ["rb.rb4.playData.classcheck", "rb.rb5.playData.classcheck", "rb.rb6.playData.classcheck"] } } as Query<Rb4Classcheck | Rb5Classcheck | Rb6Classcheck>)
        for (const classcheck of classchecks) {
            if (classcheck.stageLogs) continue
            const rid: string = (classcheck as any).__refid
            if (!rid) continue
            const version = (classcheck.collection.charCodeAt(5) - 48) as RbVersionWithClasscheck 
            const stageLogs = await t.find(rid, { collection: { $in: [`rb.rb${version}.playData.stageLog`] }, time: { $lte: classcheck.recordUpdateTime, $gte: classcheck.recordUpdateTime - 10 * 60 /** 10min offset */ } } as Query<Rb4PlayerStageLog | Rb5PlayerStageLog | Rb6PlayerStageLog>)
            stageLogs.sort((l, r) => l.time - r.time)
            for (let i = stageLogs.length - 1; i >= 0; i--) {
                if (stageLogs[i].stageIndex !== 0) continue
                if (classcheck.collection === "rb.rb4.playData.classcheck") {
                    t.update<Rb4Classcheck>(rid, { collection: "rb.rb4.playData.classcheck", class: classcheck.class as Rb4DojoIndex }, {
                        $set: { stageLogs: stageLogs.splice(i) as Rb4PlayerStageLog[] },
                        $unset: {
                            musicsId: true,
                            chartsType: true,
                            seperateScore: true,
                            seperateAchievementRateTimes100: true
                        }
                    })
                } else {
                    t.update<typeof classcheck>(rid, { collection: classcheck.collection, class: classcheck.class } as Query<Rb5Classcheck | Rb6Classcheck>, { $set: { stageLogs: stageLogs.splice(i) as any } })
                }
                break
            }
        }
        await t.commit()
    })
}
