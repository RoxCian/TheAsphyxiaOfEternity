import { RbRequest, RbVersion } from "../../models/shared/web"
import { C } from "../../utils/controller"
import { DBH } from "../../utils/db/dbh"
import { findPlayer } from "../shared_game/find_player"

export function registerSaveDataController() {
    C.route("rbExportSaveData", exportSaveData)
    C.route("rbDeleteSaveData", deleteSaveData)
}

const exportSaveData: C.C<RbRequest & { version: RbVersion }> = async data => {
    if (!data.rid) return { type: "error", code: 401, message: "RID not provided." }
    if (!data.version) return { type: "error", code: 401, message: "Version not provided." }
    const player = await findPlayer(data.rid, data.version)
    if (!player) return { type: "error", code: 404, message: "Profile not found, nothing to export." }
    const docs = await DBH.exportAll(data.rid, new RegExp(`^rb.rb${data.version}.`))
    return { type: "json", data: docs }
}
const deleteSaveData: C.C<RbRequest & { version: RbVersion }> = async data => {
    if (!data.rid) return { type: "error", code: 401, message: "RID not provided." }
    if (!data.version) return { type: "error", code: 401, message: "Version not provided." }
    const player = await findPlayer(data.rid, data.version)
    if (!player) return { type: "error", code: 404, message: "Profile not found, nothing to remove." }
    await DBH.removeAll(data.rid, new RegExp(`^rb.rb${data.version}.`))
    return { type: "" }
}