import { Rb6MiscSettings } from "../../models/rb6/misc_settings"
import { RbVersion } from "../../models/shared/rb_types"
import { RbSessionStorage } from "../../models/shared/session"
import { DBH } from "../../utils/db/dbh"

const sessionTimeout = 30 * 60 * 1000 // ms

export async function createSession(rid: string, version: RbVersion): Promise<RbSessionStorage> {
    const oldSession = await DBH.findOne<RbSessionStorage>(rid, RbSessionStorage, { collection: "rb.session", version })
    if (oldSession) {
        const time = Date.now()
        if (time - oldSession.time < sessionTimeout && oldSession.read) {
            oldSession.regenerateSessionId()
            if (version === 6) oldSession.rb6RankingQuestIndex = (await DBH.findOne<Rb6MiscSettings>(rid, { collection: "rb.rb6.player.misc" }))?.rankingQuestIndex ?? 0
            await DBH.update(rid, { collection: "rb.session", version }, oldSession)
            return oldSession
        }
    }
    const newSession = new RbSessionStorage(version)
    if (version === 6) newSession.rb6RankingQuestIndex = (await DBH.findOne<Rb6MiscSettings>(rid, { collection: "rb.rb6.player.misc" }))?.rankingQuestIndex ?? 0
    await DBH.upsert(rid, { collection: "rb.session", version }, newSession)
    return newSession
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