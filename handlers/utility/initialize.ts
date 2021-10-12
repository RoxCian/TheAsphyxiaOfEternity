import { initializeBatch } from "./batch_initialize"
import { IPluginVersion } from "../../models/utility/plugin_version"
import { isHigherVersion } from "../../utility/utility_functions"
import { Batch } from "./batch"
import { DBM } from "./db_manager"
import { IRbLobbyEntryElement } from "../../models/utility/lobby"

export const currentVersion: string = "1.1.11"
export async function initialize() {
    let version = await DB.FindOne<IPluginVersion>({ collection: "rb.pluginVersion" })
    if ((version == null) || isHigherVersion(version.version, currentVersion)) {
        initializeBatch()
        await Batch.execute(currentVersion)
        await DBM.upsert<IPluginVersion>(null, { collection: "rb.pluginVersion" }, { collection: "rb.pluginVersion", version: currentVersion })

        await DBM.remove<IRbLobbyEntryElement<1 | 2 | 3 | 4 | 5 | 6>>(null, {
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