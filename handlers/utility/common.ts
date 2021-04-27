import { mapBackKObject } from "../../../bst@asphyxia/utility/mapping"
import { generateRbLobbyEntry, generateRbLobbySettings, getRbLobbyEntryMap, IRbLobbyEntry, IRbLobbyEntryElement, IRbLobbySettings } from "../../models/utility/lobby"
import { KObjectMappingRecord, s32me, u8me, strme, mapKObject } from "../../utility/mapping"
import { DBM } from "./db_manager"

export namespace UtilityHandlersCommon {
    export const WriteShopInfo: EPR = async (__, ___, send) => {
        let result = {
            sinfo: {
                lid: K.ITEM("str", "ea"),
                nm: K.ITEM("str", "Asphyxia shop"),
                cntry: K.ITEM("str", "Japan"),
                rgn: K.ITEM("str", "1"),
                prf: K.ITEM("s16", 13),
                cl_enbl: K.ITEM("bool", 0),
                cl_h: K.ITEM("u8", 8),
                cl_m: K.ITEM("u8", 0)
            }
        }
        send.object(result)
    }

    let temporaryLobbies = new Map<number, IRbLobbyEntryElement<number>[]>()
    let findLobbyCallbacks = new Map<number, () => any>()
    export function getAddLobbyHandler<TVersion extends number>(version: TVersion): EPR {
        let closure = { version: version }
        return async (_, data, send) => {
            let param = mapBackKObject(data, getRbLobbyEntryMap(closure.version)).data
            let settings = await DB.FindOne<IRbLobbySettings<TVersion>>({ collection: <`rb.rb${TVersion}.player.lobbySettings#userId`>`rb.rb${closure.version}.player.lobbySettings#userId`, userId: param.entry[0].userId }) || generateRbLobbySettings(closure.version, param.entry[0].userId)
            if (!settings.isEnabled) return await send.deny()

            let result = await generateRbLobbyEntry(closure.version, param.entry[0])

            await DBM.upsert<IRbLobbyEntryElement<TVersion>>(null, { userId: param.entry[0].userId, collection: <`rb.rb${TVersion}.temporary.lobbyEntry`>`rb.rb${closure.version}.temporary.lobbyEntry` }, result.entry[0])

            let myLobbies = temporaryLobbies.get(param.entry[0].userId)
            if (myLobbies) myLobbies[closure.version] = result.entry[0]
            else {
                myLobbies = Array(7)
                myLobbies[closure.version] = result.entry[0]
                temporaryLobbies.set(param.entry[0].userId, [result.entry[0]])
            }

            findLobbyCallbacks.set(param.entry[0].userId, null)
            let time = 0
            let schedule: NodeJS.Timeout[] = []
            let query: Query<IRbLobbyEntryElement<TVersion>> = { $not: { userId: param.entry[0].userId }, $and: [{ collection: <`rb.rb${TVersion}.temporary.lobbyEntry`>`rb.rb${closure.version}.temporary.lobbyEntry`, matchingGrade: { $gte: param.entry[0].matchingGrade - 5, $lte: param.entry[0].matchingGrade + 5 } }, myLobbies ? myLobbies[closure.version]?.pside ? { pside: (myLobbies[closure.version].pside == 0) ? 1 : 0 } : {} : {}] } // pside may represents color (red == 0 / blue == 1)
            while (time <= settings.duration) {
                schedule.push(setTimeout(async () => {
                    let lobbies: IRbLobbyEntryElement<TVersion>[] = await DB.Find<IRbLobbyEntryElement<TVersion>>(query)
                    if (lobbies.length == 0) return
                    result.entry.concat(lobbies)
                    setTimeout(() => send.object(mapKObject(result, getRbLobbyEntryMap(closure.version))), 3000)
                    for (let e of schedule) clearTimeout(e)
                }, time))
                time += settings.rivalSearchingInterval
            }
            schedule.push(setTimeout(async () => await send.success(), settings.duration + 1))
        }
    }
    export function getReadLobbyHandler<TVersion extends number>(version: TVersion): EPR {
        let closure = { version: version }
        return async (_, data, send) => {
            let param = mapBackKObject(data, ReadLobbyParamMap).data
            let settings = await DB.FindOne<IRbLobbySettings<TVersion>>({ collection: <`rb.rb${TVersion}.player.lobbySettings#userId`>`rb.rb${closure.version}.player.lobbySettings#userId`, userId: param.userId }) || generateRbLobbySettings(closure.version, param.userId)
            if (!settings.isEnabled) return await send.deny()

            let myLobbies = temporaryLobbies.get(param.userId) ? temporaryLobbies.get(param.userId) : null
            let result = await generateRbLobbyEntry(closure.version)
            result.interval = settings.duration
            result.intervalP = settings.rivalSearchingInterval
            let query: Query<IRbLobbyEntryElement<TVersion>> = { $not: { userId: param.userId }, $and: [{ collection: <`rb.rb${TVersion}.temporary.lobbyEntry`>`rb.rb${closure.version}.temporary.lobbyEntry`, matchingGrade: { $gte: param.matchingGrade - 5, $lte: param.matchingGrade + 5 } }, myLobbies ? myLobbies[closure.version]?.pside ? { pside: (myLobbies[closure.version].pside == 0) ? 1 : 0 } : {} : {}] } // pside may represents color (red == 0 / blue == 1)
            let lobbies: IRbLobbyEntryElement<TVersion>[] = await DB.Find<IRbLobbyEntryElement<TVersion>>(query)
            result.entry = (param.maxRivalCount != null) ? lobbies.slice(0, param.maxRivalCount) : lobbies
            if (lobbies.length == 0) send.object(mapKObject(result, getRbLobbyEntryMap(closure.version)))
            else setTimeout(() => send.object(mapKObject(result, getRbLobbyEntryMap(closure.version))), 3000)
        }
    }
    export function getDeleteLobbyHandler<TVersion extends number>(version: TVersion): EPR {
        let closure = { version: version }
        return async (_, data, send) => {
            let entryId = $(data).number("eid")
            await DBM.remove<IRbLobbyEntryElement<TVersion>>(null, { collection: <`rb.rb${TVersion}.temporary.lobbyEntry`>`rb.rb${closure.version}.temporary.lobbyEntry`, entryId: entryId })
            send.success()
        }
    }

    type ReadLobbyParam = {
        userId: number
        matchingGrade: number
        lobbyId: string
        maxRivalCount: number
        friend: number[]
        version: number
    }
    const ReadLobbyParamMap: KObjectMappingRecord<ReadLobbyParam> = {
        userId: s32me("uid"),
        matchingGrade: u8me("m_grade"),
        lobbyId: strme("lid"),
        maxRivalCount: s32me("max"),
        friend: s32me(),
        version: u8me("var")
    }
}