import { getCollectionMappingElement, ignoreme, KObjectMappingRecord, strme, s16me, s32me, s8me, boolme } from "../../utility/mapping"
import { ICollection } from "./definitions"

export interface IRbComment extends ICollection<"rb.info.comment"> {
    entryId: number
    userId: number
    name: string
    experience?: number
    version: number
    iconId?: number
    characterId?: number
    balloon?: number
    teamId?: number
    teamName?: string
    lobbyId?: string
    shopName?: string
    prefecture: number
    time: number
    comment: string
    isTweet: boolean
}
export const Rb6CommentMap: KObjectMappingRecord<IRbComment> = {
    collection: getCollectionMappingElement<IRbComment>("rb.info.comment"),
    entryId: s32me("eid"),
    userId: s32me("uid"),
    name: strme(),
    experience: ignoreme(),
    version: ignoreme(),
    iconId: ignoreme(),
    characterId: s16me("chara"),
    balloon: s8me("bln"),
    teamId: ignoreme(),
    teamName: ignoreme(),
    lobbyId: strme("lid"),
    shopName: ignoreme(),
    prefecture: s8me("pref"),
    time: s32me(),
    comment: strme(),
    isTweet: boolme("is_tweet")
}
export const Rb4CommentMap: KObjectMappingRecord<IRbComment> = {
    collection: getCollectionMappingElement<IRbComment>("rb.info.comment"),
    entryId: s32me("eid"),
    userId: s32me("uid"),
    name: strme(),
    experience: ignoreme(),
    version: ignoreme(),
    iconId: s16me("icon"),
    characterId: ignoreme(),
    balloon: s8me("bln"),
    teamId: s32me("tid"),
    teamName: strme("t_name"),
    lobbyId: strme("lid"),
    shopName: ignoreme(),
    prefecture: s8me("pref"),
    time: s32me(),
    comment: strme(),
    isTweet: boolme("is_tweet")
}
export const Rb3CommentMap: KObjectMappingRecord<IRbComment> = {
    collection: getCollectionMappingElement<IRbComment>("rb.info.comment"),
    entryId: s32me("eid"),
    userId: s32me("uid"),
    name: strme(),
    experience: ignoreme(),
    version: ignoreme(),
    iconId: s16me("icon"),
    characterId: ignoreme(),
    balloon: s8me("bln"),
    teamId: s32me("tid"),
    teamName: strme("t_name"),
    lobbyId: ignoreme(),
    shopName: ignoreme(),
    prefecture: s8me("pref"),
    time: s32me(),
    comment: strme(),
    isTweet: boolme("is_tweet")
}
export const Rb2CommentMap: KObjectMappingRecord<IRbComment> = {
    collection: getCollectionMappingElement<IRbComment>("rb.info.comment"),
    entryId: s32me("eid"),
    userId: s32me("uid"),
    name: strme("p_name"),
    experience: s32me("exp"),
    version: ignoreme(),
    iconId: s32me("customize"),
    characterId: ignoreme(),
    balloon: s8me("bln"),
    teamId: s32me("tid"),
    teamName: strme("t_name"),
    lobbyId: strme("lid"),
    shopName: strme("s_name"),
    prefecture: s8me("pref"),
    time: s32me(),
    comment: strme(),
    isTweet: boolme("is_tweet")
}
export function generateRbComment(version: number, userId: number, name: string): IRbComment {
    return {
        collection: "rb.info.comment",
        entryId: 0,
        userId: userId,
        name: name,
        version: version,
        iconId: 0,
        characterId: 0,
        balloon: 0,
        teamId: 0,
        teamName: "Asphyxia",
        lobbyId: "ea",
        prefecture: 53,
        time: 0,
        comment: "",
        isTweet: false
    }
}