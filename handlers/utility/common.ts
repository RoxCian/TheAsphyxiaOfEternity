import { generateRb2EventStatus, IRb2EventStatus, Rb2EventStatusMap } from "../../models/rb2/event_status"
import { IRbComment, Rb2CommentMap, Rb3CommentMap, Rb4CommentMap, Rb6CommentMap } from "../../models/utility/comment"
import { generateRbLobbyEntry, generateRbLobbySettings, getRbLobbyEntryMap, IRbLobbyEntryElement, IRbLobbySettings } from "../../models/utility/lobby"
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
        if (!U.GetConfig("comment_feature")) return async (_0, _1, send) => await send.deny()
        let closure = { version: version }
        return async (_, data, send) => {
            let param = mapBackKObject(data, ReadCommentParamMap)[0]
            let comments: IRbComment[] = await DB.Find<IRbComment>({ collection: "rb.info.comment" })
            comments.sort((l, r) => r.time - l.time)
            let commentMap: KObjectMappingRecord<IRbComment>
            switch (closure.version) {
                case 6:
                    commentMap = Rb6CommentMap
                    break
                case 5:
                    commentMap = Rb4CommentMap
                    break
                case 4:
                    commentMap = Rb4CommentMap
                    break
                case 3:
                    commentMap = Rb3CommentMap
                    break
                case 2:
                    commentMap = Rb2CommentMap
                    break
                default:
                    return await send.deny()
            }
            let result = {
                comment: { time: <number>Date.now() },
                c: param.limit ? comments.slice(0, param.limit) : comments,
                cf: <IRbComment[]>[],
                cs: <IRbComment[]>[],
                ct: <IRbComment[]>[],
            }
            let resultRb2 = {
                time: <number>Date.now(),
                comment: {
                    c: param.limit ? comments.slice(0, param.limit) : comments,
                    cf: <IRbComment[]>[]
                },
                status: {
                    s: <IRb2EventStatus[]>[]
                }
            }
            for (let cmt of (closure.version == 2) ? resultRb2.comment.c : result.c) {
                if ((cmt.version <= 5) && (closure.version == 6)) cmt.characterId = cmt.version + 7 // chara == 8 -> Level 1 CPU
                if ((cmt.version == 6) && (closure.version <= 5)) cmt.iconId = cmt.characterId

                // Favorite comments
                // Team members' comments
                // Shop comments

                if (cmt.userId == param.userId) result.cs.push(cmt)
                if (closure.version == 2) resultRb2.status.s.push(resultRb2.status.s.find((v) => v.userId == cmt.userId) || await DB.FindOne<IRb2EventStatus>({ collection: "rb.rb2.player.event.status#userId", userId: cmt.userId }) || generateRb2EventStatus(cmt.userId, cmt.name))
            }

            if (result.c.length == 0) delete result.c
            if (result.cf.length == 0) delete result.cf
            if (result.cs.length == 0) delete result.cs
            if (result.ct.length == 0) delete result.ct
            if (resultRb2.comment.c.length == 0) delete resultRb2.comment.c
            if (resultRb2.comment.cf.length == 0) delete resultRb2.comment.cf

            if (closure.version == 2) return await send.object(mapKObject(resultRb2, { time: s32me<number>(), comment: { c: { 0: commentMap }, cf: { 0: commentMap } }, status: { s: { 0: Rb2EventStatusMap } } }))
            else return await send.object(mapKObject(result, { comment: { time: s32me<number>() }, c: { 0: commentMap }, cf: { 0: commentMap }, cs: { 0: commentMap }, ct: { 0: commentMap } }))
        }
    }
    export function getWriteCommentHandler<TVersion extends number>(version: TVersion): EPR {
        if (!U.GetConfig("comment_feature")) return async (_0, _1, send) => await send.deny()
        let closure = { version: version }
        return async (_, data, send) => {
            let commentMap: KObjectMappingRecord<IRbComment>
            switch (closure.version) {
                case 6:
                    commentMap = Rb6CommentMap
                    break
                case 5:
                    commentMap = Rb4CommentMap
                    break
                case 4:
                    commentMap = Rb4CommentMap
                    break
                case 3:
                    commentMap = Rb3CommentMap
                    break
                case 2:
                    commentMap = Rb2CommentMap
                    break
                default:
                    return await send.deny()
            }
            let comment = mapBackKObject<IRbComment>(data, commentMap)[0]
            comment.version = closure.version
            if (!comment.balloon) comment.balloon = 0
            if (!comment.experience) comment.experience = 0
            if (!comment.shopName) comment.shopName = ""
            if (!comment.lobbyId) comment.lobbyId = "ea"
            if (!comment.teamId) comment.teamId = -1
            if (!comment.teamName) comment.teamName = "ASPHYXIA"
            do {
                comment.entryId = Math.round(Math.random() * 99999999)
            } while (await DB.FindOne<IRbComment>({ collection: "rb.info.comment", entryId: comment.entryId }))
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