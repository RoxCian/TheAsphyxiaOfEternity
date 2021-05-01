import { IRbComment, RbCommentMap } from "../../models/utility/comment"
import { generateRbLobbyEntry, generateRbLobbySettings, getRbLobbyEntryMap, IRbLobbyEntry, IRbLobbyEntryElement, IRbLobbySettings } from "../../models/utility/lobby"
import { KObjectMappingRecord, s32me, u8me, strme, mapKObject, mapBackKObject } from "../../utility/mapping"
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
    export function getAddLobbyHandler<TVersion extends number>(version: TVersion): EPR {
        let closure = { version: version }
        return async (_, data, send) => {
            let param = mapBackKObject(data, getRbLobbyEntryMap(closure.version))[0]
            let settings = await DB.FindOne<IRbLobbySettings<TVersion>>({ collection: <`rb.rb${TVersion}.player.lobbySettings#userId`>`rb.rb${closure.version}.player.lobbySettings#userId`, userId: param.entry[0].userId }) || generateRbLobbySettings(closure.version, param.entry[0].userId)
            if (!settings.isEnabled) return await send.deny()

            let result = await generateRbLobbyEntry(closure.version, param.entry[0])
            result.entryId = result.entry[0].entryId
            await DBM.upsert<IRbLobbyEntryElement<TVersion>>(null, { userId: param.entry[0].userId, collection: <`rb.rb${TVersion}.temporary.lobbyEntry`>`rb.rb${closure.version}.temporary.lobbyEntry` }, result.entry[0])

            let myLobbies = temporaryLobbies.get(param.entry[0].userId)
            if (myLobbies) myLobbies[closure.version] = result.entry[0]
            else {
                myLobbies = Array(7)
                myLobbies[closure.version] = result.entry[0]
                temporaryLobbies.set(param.entry[0].userId, [result.entry[0]])
            }

            let query: Query<IRbLobbyEntryElement<TVersion>> = { $not: { userId: param.entry[0].userId }, $and: [{ collection: <`rb.rb${TVersion}.temporary.lobbyEntry`>`rb.rb${closure.version}.temporary.lobbyEntry`, matchingGrade: { $gte: param.entry[0].matchingGrade - 5, $lte: param.entry[0].matchingGrade + 5 } }, myLobbies ? myLobbies[closure.version]?.pside ? { pside: (myLobbies[closure.version].pside == 0) ? 1 : 0 } : {} : {}] } // pside may represents color (red == 0 / blue == 1)
            let lobbies: IRbLobbyEntryElement<TVersion>[] = await DB.Find<IRbLobbyEntryElement<TVersion>>(query)
            result.entry.concat(lobbies)
            return await send.object(mapKObject(result, getRbLobbyEntryMap(closure.version)))
            // findLobbyCallbacks.set(param.entry[0].userId, null)
            // let time = 0
            // let schedule: NodeJS.Timeout[] = []
            // let query: Query<IRbLobbyEntryElement<TVersion>> = { $not: { userId: param.entry[0].userId }, $and: [{ collection: <`rb.rb${TVersion}.temporary.lobbyEntry`>`rb.rb${closure.version}.temporary.lobbyEntry`, matchingGrade: { $gte: param.entry[0].matchingGrade - 5, $lte: param.entry[0].matchingGrade + 5 } }, myLobbies ? myLobbies[closure.version]?.pside ? { pside: (myLobbies[closure.version].pside == 0) ? 1 : 0 } : {} : {}] } // pside may represents color (red == 0 / blue == 1)
            // while (time <= Math.min(settings.duration, 60000)) {
            //     schedule.push(setTimeout(async () => {
            //         let lobbies: IRbLobbyEntryElement<TVersion>[] = await DB.Find<IRbLobbyEntryElement<TVersion>>(query)
            //         if (lobbies.length == 0) return
            //         result.entry.concat(lobbies)
            //         setTimeout(() => send.object(mapKObject(result, getRbLobbyEntryMap(closure.version))), 3000)
            //         for (let e of schedule) clearTimeout(e)
            //     }, time))
            //     time += settings.rivalSearchingInterval
            // }
            // schedule.push(setTimeout(async () => await send.success(), Math.min(settings.duration, 60000) + 1))
        }
    }
    export function getReadLobbyHandler<TVersion extends number>(version: TVersion): EPR {
        let closure = { version: version }
        return async (_, data, send) => {
            let param = mapBackKObject(data, ReadLobbyParamMap)[0]
            let settings = await DB.FindOne<IRbLobbySettings<TVersion>>({ collection: <`rb.rb${TVersion}.player.lobbySettings#userId`>`rb.rb${closure.version}.player.lobbySettings#userId`, userId: param.userId }) || generateRbLobbySettings(closure.version, param.userId)
            if (!settings.isEnabled) return await send.deny()

            let myLobbies = temporaryLobbies.get(param.userId) ? temporaryLobbies.get(param.userId) : null
            let result = await generateRbLobbyEntry(closure.version)
            let query: Query<IRbLobbyEntryElement<TVersion>> = { $not: { userId: param.userId }, $and: [{ collection: <`rb.rb${TVersion}.temporary.lobbyEntry`>`rb.rb${closure.version}.temporary.lobbyEntry`, matchingGrade: { $gte: param.matchingGrade - 5, $lte: param.matchingGrade + 5 } }, myLobbies ? myLobbies[closure.version]?.pside ? { pside: (myLobbies[closure.version].pside == 0) ? 1 : 0 } : {} : {}] } // pside may represents color (red == 0 / blue == 1)
            let lobbies: IRbLobbyEntryElement<TVersion>[] = await DB.Find<IRbLobbyEntryElement<TVersion>>(query)
            result.entry = (param.maxRivalCount != null) ? lobbies.slice(0, param.maxRivalCount) : lobbies
            if (lobbies.length == 0) send.object(mapKObject(result, getRbLobbyEntryMap(closure.version)))
            else send.object(mapKObject(result, getRbLobbyEntryMap(closure.version)))
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

    export function getReadCommentHandler<TVersion extends number>(version: TVersion): EPR {
        let closure = { version: version }
        return async (_, data, send) => {
            let param = mapBackKObject(data, ReadCommentParamMap)[0]
            let comments: IRbComment[] = await DB.Find<IRbComment>({ collection: "rb.comment" })
            let result = {
                comment: { time: <number>param.time },
                c: param.limit ? comments.slice(0, param.limit) : comments,
                cf: <IRbComment[]>[],
                cs: <IRbComment[]>[]
            }
            for (let cmt of result.c) {
                if ((cmt.version <= 5) && (closure.version == 6)) cmt.characterId = cmt.version + 7 // chara 8 is Level 1 CPU
                if ((cmt.version == 6) && (closure.version <= 5)) cmt.iconId = cmt.characterId

                // Friends' comment

                if (cmt.userId == param.userId) result.cs.push(cmt)
            }

            return await send.object(mapKObject(result, { comment: { time: s32me<number>() }, c: { 0: RbCommentMap }, cf: { 0: RbCommentMap }, cs: { 0: RbCommentMap } }))
        }
    }
    export function getWriteCommentHandler<TVersion extends number>(version: TVersion): EPR {
        let closure = { version: version }
        return async (_, data, send) => {
            let comment = mapBackKObject<IRbComment>(data, RbCommentMap)[0]
            comment.version = closure.version
            if (!comment.balloon) comment.balloon = 0
            await DBM.insert<IRbComment>(null, comment)
            return await send.success()
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

    type ReadCommentParam = {
        userId: number
        teamId?: number
        time: number
        limit: number
    }
    const ReadCommentParamMap: KObjectMappingRecord<ReadCommentParam> = {
        userId: s32me("uid"),
        teamId: s32me("tid"),
        time: s32me(),
        limit: s32me()
    }
}