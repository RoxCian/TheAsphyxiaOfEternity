import { removeAllLobbies } from "../api/shared_game/lobby"
import { removeAllSessions } from "../api/shared_game/session"
import { IPluginVersion } from "../models/system/plugin_version"
import { DBH } from "../utils/db/dbh"
import { isHigherVersion } from "../utils/utility_functions"
import { Batch } from "./batch"
import { initializeBatch } from "./batch_initialize"
import { pluginVersion } from "./const"

let initialized = false
export async function initialize() {
    if (initialized) return
    initialized = true
    console.log("🔵 悠久のアスフィクシア -The Asphyxia of Eternity-")
    const version = await DBH.findOne<IPluginVersion>({ collection: "rb.pluginVersion" })
    initializeBatch()
    await Batch.execute(pluginVersion)
    if (!version || isHigherVersion(version.version, pluginVersion)) {
        await DBH.upsert<IPluginVersion>({ collection: "rb.pluginVersion" }, { collection: "rb.pluginVersion", version: pluginVersion })
    }
    await removeAllLobbies()
    await removeAllSessions()
    console.log(`🔵 RB Plugin initialized at ${new Date().toLocaleString()}`)
}