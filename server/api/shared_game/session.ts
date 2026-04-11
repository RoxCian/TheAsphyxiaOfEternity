import { RbVersion } from "../../models/shared/rb_types"
import { RbSession } from "../../models/shared/session"
import { DBH } from "../../utils/db/dbh"
import { utcNow } from "../../utils/utility_functions"

export async function createSession(rid: string, version: RbVersion): Promise<boolean> {
    const oldSession = await DBH.findOne<RbSession>(rid, { collection: "rb.session", version })
    if (oldSession) {
        const time = utcNow()
        if (time - oldSession.time > 1000 * 60 * 30) return false
    }
    const newSession = new RbSession(version)
    await DBH.upsert(rid, { collection: "rb.session", version }, newSession)
    return true
}
export async function getSession(rid: string, version: RbVersion): Promise<RbSession | undefined> {
    const session = await DBH.findOne<RbSession>(rid, { collection: "rb.session", version })
    if (!session) return undefined
    const time = utcNow()
    if (time - session.time > 1000 * 60 * 30) {
        DBH.remove<RbSession>(rid, { collection: "rb.session", version }) // no await
        return undefined
    }
    return session
}
export async function removeSession(rid: string, version: RbVersion): Promise<boolean> {
    if (!await getSession(rid, version)) return false
    await DBH.remove<RbSession>(rid, { collection: "rb.session", version })
    return true
}
export async function removeAllSessions() {
    // const time = utcNow()
    // const t = new DBH.T()
    // for (const session of await t.find<RbSession>(undefined, { collection: "rb.session" })) {
    //     // if (time - session.time <= 1000 * 60 * 30) continue
    //     t.remove<RbSession>((session as any).__rid, { _id: session._id })
    // }
    // await t.commit()
    console.log(await DBH.remove<RbSession>(undefined, { collection: "rb.session" }))
}