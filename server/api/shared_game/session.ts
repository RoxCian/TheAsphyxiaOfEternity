import { RbVersion } from "../../models/shared/rb_types"
import { RbSessionStorage } from "../../models/shared/session"
import { DBH } from "../../utils/db/dbh"

const sessionTimeout = 30 * 60 * 1000 // ms

export async function createSession(rid: string, version: RbVersion): Promise<boolean> {
    const oldSession = await DBH.findOne<RbSessionStorage>(rid, { collection: "rb.session", version })
    if (oldSession) {
        const time = Date.now()
        if (time - oldSession.time < sessionTimeout && oldSession.read) return false // TODO: rethink of game processing
    }
    const newSession = new RbSessionStorage(version)
    await DBH.upsert(rid, { collection: "rb.session", version }, newSession)
    return true
}
export async function markSessionRead(rid: string, version: RbVersion): Promise<boolean> {
    const session = await DBH.findOne<RbSessionStorage>(rid, { collection: "rb.session", version })
    if (!session) return false
    session.read = true
    DBH.update<RbSessionStorage>(rid, { collection: "rb.session" }, session)
    return true
}
export async function getSession(rid: string, version: RbVersion): Promise<RbSessionStorage | undefined> {
    const session = await DBH.findOne<RbSessionStorage>(rid, { collection: "rb.session", version })
    if (!session) return undefined
    const time = Date.now()
    if (time - session.time > sessionTimeout) {
        DBH.remove<RbSessionStorage>(rid, { collection: "rb.session", version }) // no await
        return undefined
    }
    return session
}
export async function removeSession(rid: string, version: RbVersion): Promise<boolean> {
    if (!await getSession(rid, version)) return false
    await DBH.remove<RbSessionStorage>(rid, { collection: "rb.session", version })
    return true
}
export async function removeAllSessions() {
    const time = Date.now()
    const t = new DBH.T()
    for (const session of await t.find<RbSessionStorage>(undefined, { collection: "rb.session" })) {
        if (time - session.time <= sessionTimeout) continue
        t.remove<RbSessionStorage>((session as any).__rid, { _id: session._id })
    }
    await t.commit()
}