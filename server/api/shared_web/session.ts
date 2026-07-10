import { C } from "../../utils/controller"
import { RbRequest, RbSession, RbVersion } from "../../models/shared/web"
import { getSession, removeSession } from "../shared_game/session"

export function registerSessionController() {
    C.route("rbReadSession", readSession, true)
    C.route("rbKillSession", killSession, true)
}

const readSession: C.C<RbRequest & { version: RbVersion }, RbSession> = async data => {
    const session = await getSession(data.rid, data.version)
    if (!session) return undefined
    return {
        version: session.version,
        time: session.time,
        sessionId: session.sessionId,
    }
}
const killSession: C.C<RbRequest & { version: RbVersion }, { succeeded: boolean }> = async data => {
    return { succeeded: await removeSession(data.rid, data.version) }
}
