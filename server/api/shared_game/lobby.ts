import { H } from "../../utils/handler"
import { XF } from "../../utils/x"
import { DBH } from "../../utils/db/dbh"
import { RbLobbyEntryElement, RbLobbyEntry, RbLobbySettings, ReadLobbyParams, generateLobbyEntryId } from "../../models/shared/lobby"
import { RbVersion } from "../../models/shared/rb_types"
import { Type } from "../../utils/types"

const tempLobbies = new Map<number, RbLobbyEntryElement<RbVersion>[]>()

export function createAddLobbyHandler<TVersion extends RbVersion>(version: TVersion): H.H<RbLobbyEntry<TVersion>> {
    const closure = { version: version }
    return async data => {
        const params = XF.o(data, RbLobbyEntry as Type<RbLobbyEntry<TVersion>>)
        const settings = await DBH.findOne<RbLobbySettings<TVersion>>({ collection: `rb.rb${closure.version}.player.lobbySettings#userId` as const, userId: params.entries[0].userId }) ?? new RbLobbySettings(closure.version, params.entries[0].userId)
        if (!settings.isEnabled) return H.deny
        const result = await RbLobbyEntry.create(closure.version, params.entries[0])
        await DBH.upsert({ userId: params.entries[0].userId, collection: `rb.rb${closure.version}.temporary.lobbyEntry` as const }, result.entries[0])

        let myLobbies = tempLobbies.get(params.entries[0].userId)
        if (myLobbies) myLobbies[closure.version] = result.entries[0]
        else {
            myLobbies = Array(7)
            myLobbies[closure.version] = result.entries[0]
            tempLobbies.set(params.entries[0].userId, [result.entries[0]])
        }

        const query: Query<RbLobbyEntryElement<TVersion>> = {
            $not: { userId: params.entries[0].userId },
            $and: [{
                collection: `rb.rb${closure.version}.temporary.lobbyEntry` as const,
                matchingGrade: {
                    $gte: params.entries[0].matchingGrade - 5,
                    $lte: params.entries[0].matchingGrade + 5
                }
            }, myLobbies ? myLobbies[closure.version]?.pside ? {
                pside: (myLobbies[closure.version].pside === 0) ? 1 : 0
            } : {} : {}]
        } // pside may represents color (red === 0 / blue === 1)
        const lobbies = await DBH.find(query)
        result.entries.concat(lobbies)
        return XF.x(result)
    }
}
export function createReadLobbyHandler<TVersion extends RbVersion>(version: TVersion): H.H<ReadLobbyParams> {
    const closure = { version: version }
    return async data => {
        const params = XF.o(data, ReadLobbyParams)
        let settings = await DB.FindOne<RbLobbySettings<TVersion>>({ collection: `rb.rb${closure.version}.player.lobbySettings#userId` as const, userId: params.userId }) ?? new RbLobbySettings(closure.version, params.userId)
        if (!settings.isEnabled) return H.deny

        const myLobbies = tempLobbies.get(params.userId)
        const query: Query<RbLobbyEntryElement<TVersion>> = {
            $not: { userId: params.userId },
            $and: [{
                collection: `rb.rb${closure.version}.temporary.lobbyEntry` as const,
                matchingGrade: {
                    $gte: params.matchingGrade - 5,
                    $lte: params.matchingGrade + 5
                }
            }, myLobbies ? myLobbies[closure.version]?.pside ? {
                pside: (myLobbies[closure.version].pside === 0) ? 1 : 0
            } : {} : {}]
        } // pside may represents color (red == 0 / blue == 1)
        const lobbies = await DBH.find<RbLobbyEntryElement<TVersion>>(RbLobbyEntryElement, query)
        const result = new RbLobbyEntry(tempLobbies.get(params.userId)?.[closure.version]?.entryId ?? 0)
        result.entries = lobbies.slice(0, params.maxRivalCount)
        return XF.x(result)
    }
}
export function createDeleteLobbyHandler<TVersion extends RbVersion>(version: TVersion): H.H {
    const closure = { version: version }
    // TODO: should I check tempLobbies set?
    return async data => {
        const entryId = $(data).number("eid")
        await DBH.remove<RbLobbyEntryElement<TVersion>>({ collection: `rb.rb${closure.version}.temporary.lobbyEntry` as const, entryId: entryId })
        return H.success
    }
}
export async function removeAllLobbies() {
    await DBH.remove<RbLobbyEntryElement<RbVersion>>({
        $or: [
            { collection: "rb.rb1.temporary.lobbyEntry" },
            { collection: "rb.rb2.temporary.lobbyEntry" },
            { collection: "rb.rb3.temporary.lobbyEntry" },
            { collection: "rb.rb4.temporary.lobbyEntry" },
            { collection: "rb.rb5.temporary.lobbyEntry" },
            { collection: "rb.rb6.temporary.lobbyEntry" },
        ]
    })
}