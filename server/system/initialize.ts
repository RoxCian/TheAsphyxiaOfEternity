import { DBH } from "../utils/db/dbh"
import { initializeBatch } from "./batch_initialize"
import { IPluginVersion } from "../models/system/plugin_version"
import { isHigherVersion } from "../utils/utility_functions"
import { Batch } from "./batch"
import { pluginVersion } from "./const"
import { removeAllLobbies } from "../api/shared_game/lobby"
import { removeAllSessions } from "../api/shared_game/session"

let initialized = false
export async function initialize() {
    if (initialized) return
    initialized = true
    const version = await DBH.findOne<IPluginVersion>({ collection: "rb.pluginVersion" })
    if (!version || isHigherVersion(version.version, pluginVersion)) {
        initializeBatch()
        await Batch.execute(pluginVersion)
        await DBH.upsert<IPluginVersion>({ collection: "rb.pluginVersion" }, { collection: "rb.pluginVersion", version: pluginVersion })
    }
    await removeAllLobbies()
    await removeAllSessions()
}