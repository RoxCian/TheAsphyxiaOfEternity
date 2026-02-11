import { DBH } from "../utils/db/dbh"
import { initializeBatch } from "./batch_initialize"
import { IPluginVersion } from "../models/system/plugin_version"
import { isHigherVersion } from "../utils/utility_functions"
import { Batch } from "./batch"
import { RbLobbyEntryElement } from "../models/shared/lobby"
import { RbVersion } from "../models/shared/rb_types"
import { pluginVersion } from "./const"

let initialized = false
export async function initialize() {
    if (initialized) return
    initialized = true
    const version = await DB.FindOne<IPluginVersion>({ collection: "rb.pluginVersion" })
    if (!version || isHigherVersion(version.version, pluginVersion)) {
        initializeBatch()
        await Batch.execute(pluginVersion)
        await DBH.upsert<IPluginVersion>(undefined, { collection: "rb.pluginVersion" }, { collection: "rb.pluginVersion", version: pluginVersion })

        await DBH.remove<RbLobbyEntryElement<RbVersion>>(undefined, {
            $or: [
                { collection: "rb.rb1.temporary.lobbyEntry" },
                { collection: "rb.rb2.temporary.lobbyEntry" },
                { collection: "rb.rb3.temporary.lobbyEntry" },
                { collection: "rb.rb4.temporary.lobbyEntry" },
                { collection: "rb.rb5.temporary.lobbyEntry" },
                { collection: "rb.rb6.temporary.lobbyEntry" },
            ]
        })
    }
}