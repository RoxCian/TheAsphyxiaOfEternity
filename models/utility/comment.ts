import { getCollectionMappingElement, ignoreme, KObjectMappingRecord, strme, s16me, s32me, s8me, boolme } from "../../utility/mapping"
import { ICollection } from "./definitions"

export interface IRbComment extends ICollection<"rb.comment"> {
    userId: number
    name: string
    version: number
    iconId?: number
    characterId?: number
    balloon?: number
    teamId?: number
    teamName?: string
    lobbyId?: string
    preference: number
    time: number
    comment: string
    isTweet: boolean
}
export const RbCommentMap: KObjectMappingRecord<IRbComment> = {
    collection: getCollectionMappingElement<IRbComment>("rb.comment"),
    userId: s32me("uid"),
    name: strme(),
    version: ignoreme(),
    iconId: s16me("icon"),
    characterId: s16me("chara"),
    balloon: s8me("bln"),
    teamId: s32me("tid"),
    teamName: strme("t_name"),
    lobbyId: strme("lid"),
    preference: s8me("pref"),
    time: s32me(),
    comment: strme(),
    isTweet: boolme("is_tweet")
}
export function generateRbComment(version: number, userId: number, name: string): IRbComment {
    return {
        collection: "rb.comment",
        userId: userId,
        name: name,
        version: version,
        iconId: 0,
        characterId: 0,
        balloon: 0,
        teamId: 0,
        teamName: "Asphyxia",
        lobbyId: "ea",
        preference: 53,
        time: 0,
        comment: "",
        isTweet: false
    }
}