import { initializeBatch } from "./batch_initialize"
import { IPluginVersion } from "../../models/utility/plugin_version"
import { isHigherVersion } from "../../utility/utility_functions"
import { Batch } from "./batch"
import { DBM } from "./db_manager"

export const currentVersion: string = "0.12.0"
export async function initialize() {
    let version = await DB.FindOne<IPluginVersion>({ collection: "rb.pluginVersion" })
    if ((version == null) || isHigherVersion(version.version, currentVersion)) {
        initializeBatch()
        await Batch.execute(currentVersion)
        await DBM.upsert<IPluginVersion>(null, { collection: "rb.pluginVersion" }, { collection: "rb.pluginVersion", version: currentVersion })
    }
}