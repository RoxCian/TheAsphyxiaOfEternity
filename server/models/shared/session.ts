import { ICollection } from "../../utils/db/db_types"
import { RbVersion } from "./rb_types"

export class RbSession implements ICollection<"rb.session"> {
    readonly collection = "rb.session"
    version: RbVersion
    time: number
    unlockSettings: {
        unlockAllSongs: boolean
        unlockAllItems: boolean
    }

    constructor(version: RbVersion) {
        this.version = version
        const now = new Date()
        this.time = Date.UTC(
            now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),
            now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds()
        )
        this.unlockSettings = {
            unlockAllSongs: U.GetConfig("unlock_all_songs"),
            unlockAllItems: U.GetConfig("unlock_all_items")
        }
    }
}