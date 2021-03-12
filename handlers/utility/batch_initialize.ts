import { Batch } from "./batch"
import { DBM } from "./db_manager"
import { bufferToBase64, log } from "../../utility/utility_functions"
import { IRb6JustCollection } from "../../models/rb6/just_collection"
import { IRb3PlayerAccount } from "../../models/rb3/profile"

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
    // Batch.register("batch#0.12.0", "0.12.0", async () => {
    //     let a = await DB.Find<IRb3PlayerAccount>({ collection: "rb.rb3.player.account" })
    //     log(a)
    //     for (let account of a) {
    //         if (account.playCountToday == null) account.playCountToday = account.dpc
    //         if (account.dayCount == null) account.dayCount = account.tdc
    //         await DBM.update(null, { collection: "rb.rb3.player.account", __refid: account.rid }, account)
    //     }
    // })
    // Batch.register("batch#0.12.0.part2", "1.4.0", async () => {
    //     let a = await DB.Find<IRb3PlayerAccount>({ collection: "rb.rb3.player.account" })
    //     log(a)
    //     for (let account of a) {
    //         delete account["dpc"]
    //         delete account["tdc"]
    //         await DBM.update(null, { collection: "rb.rb3.player.account", __refid: account.rid }, account)
    //     }
    // })
}
