import { ICollection } from "../../utils/db/db_types"
import { RbVersion, RbSession } from "./rb_types"

export class RbSessionStorage implements ICollection<"rb.session">, RbSession {
    readonly collection = "rb.session"
    version: RbVersion
    time: number
    sessionId: number
    unlockSettings: {
        unlockAllSongs: boolean
        unlockAllItems: boolean
    }
    rb6RankingQuestIndex: number
    read = false

    constructor(version: RbVersion) {
        this.version = version
        this.time = Date.now()
        this.sessionId = Math.round(Math.random() * 99999999)
        this.unlockSettings = {
            unlockAllSongs: U.GetConfig("unlock_all_songs"),
            unlockAllItems: U.GetConfig("unlock_all_items")
        }
        this.rb6RankingQuestIndex = 0
    }

    regenerateSessionId() {
        this.sessionId = Math.round(Math.random() * 99999999)
    }
}