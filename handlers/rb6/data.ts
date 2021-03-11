import { IRb6PlayerAccount } from "../../models/rb6/profile"
import { DBM } from "../utility/db_manager"
import { ICollection } from "../../models/utility/definitions"

export async function operateDataInternal(rid: string, operation: "delete" | "export" | "override", data?: any): Promise<string | null> {
    try {
        let account = await DB.FindOne<IRb6PlayerAccount>(rid, { collection: "rb.rb6.player.account" })
        if (account == null) return "Account is not existed."
        let uid = account.userId
        let collections = await DBM.getCollectionNames("rb.rb6")
        let traverse = async (f: (rid: string | null, query: Query<ICollection<any>>) => Promise<any>) => {
            let result = []
            for (let c of collections) {
                if (c.name.includes("#userId")) result.concat(...await f(null, { collection: c.name, userId: uid }))
                else result.concat(...await f(rid, { collection: c.name }))
            }
            return result
        }
        switch (operation) {
            case "delete":
                await traverse((rid, query) => DBM.remove(rid, query))
                break
            case "export":
                let result = await traverse((rid, query) => DB.Find(rid, query))
                return JSON.stringify(result)
            case "override":
                if (!Array.isArray(data)) return "The data may not be an Asphyxia CORE savedata."
                for (let d of data) {
                    if ((typeof (d?.collection) != "string") || (!d.collection.includes("rb.rb6"))) return "The data may not be a REFLEC BEAT 悠久のリフレシア savedata."
                }
                await traverse((rid, query) => DBM.remove(rid, query))
                for (let d of data) DB.Insert(d)
                break
        }
    } catch (e) {
        return e.message
    }
    return null
}