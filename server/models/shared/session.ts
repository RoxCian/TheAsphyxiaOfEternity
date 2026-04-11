import { ICollection } from "../../utils/db/db_types"
import { utcNow } from "../../utils/utility_functions"
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
        this.time = utcNow()
        this.unlockSettings = {
            unlockAllSongs: U.GetConfig("unlock_all_songs"),
            unlockAllItems: U.GetConfig("unlock_all_items")
        }
    }
}