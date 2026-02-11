import { C } from "../../utils/controller"
import { readdirSync } from "fs"
import { resolve } from "path"
import { pluginDir } from "../../system/const"

export function registerJacketController() {
    C.route("rbGetJackets", getJackets)
}

let jackets: string[] | undefined
const getJackets: C.C = async () => {
    jackets ??= readdirSync(resolve(pluginDir, "webui/assets/jackets")).map(n => n.match(/^(?<filename>\d[a-z][a-z\d]\d(_[0123]?))\..+$/)?.groups.filename).filter(n => n)
    return jackets
}