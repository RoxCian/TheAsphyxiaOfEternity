import { initializeBatch } from "./batch_initialize"
import { IPluginVersion } from "../../models/utility/plugin_version"
import { isHigherVersion } from "../../utility/utility_functions"
import { Batch } from "./batch"
import { DBM } from "./db_manager"
import { IRb6LobbyEntryElement } from "../../models/rb6/lobby"

export const currentVersion: string = "1.0.4"
export async function initialize() {
    let version = await DB.FindOne<IPluginVersion>({ collection: "rb.pluginVersion" })
    if ((version == null) || isHigherVersion(version.version, currentVersion)) {
        initializeBatch()
        await Batch.execute(currentVersion)
        await DBM.upsert<IPluginVersion>(null, { collection: "rb.pluginVersion" }, { collection: "rb.pluginVersion", version: currentVersion })

        await DBM.remove<IRb6LobbyEntryElement>(null, { collection: "rb.rb6.temporary.lobbyEntry" })
    }
}