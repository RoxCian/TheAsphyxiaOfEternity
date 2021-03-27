import { ICollection } from "../utility/definitions"
import { boolme, getCollectionMappingElement, KObjectMappingRecord, s16me, s32me, s8me, strme } from "../../utility/mapping"

export interface IRb6Comment extends ICollection<"rb.rb6.utility.comment"> {
    uid: number
    name: string
    characterCard: number
    bln: number // ?
    lobbyId: string
    preference: number // ?
    time: number
    comment: string
    isTweet: boolean
}

export const Rb6CommentMap: KObjectMappingRecord<IRb6Comment> = {
    collection: getCollectionMappingElement<IRb6Comment>("rb.rb6.utility.comment"),
    uid: s32me(),
    name: strme(),
    characterCard: s16me("chara"),
    bln: s8me(),
    lobbyId: strme(),
    preference: s8me("pref"),
    time: s32me(),
    comment: strme(),
    isTweet: boolme("is_tweet")
}