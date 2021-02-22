import { ICollection } from "../utility/definitions"
import { getCollectionMappingElement, KObjectMappingRecord } from "../../utility/mapping"

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
    uid: { $type: "s32" },
    name: { $type: "str" },
    characterCard: { $type: "s16", $targetKey: "chara" },
    bln: { $type: "s8" },
    lobbyId: { $type: "str" },
    preference: { $type: "s8", $targetKey: "pref" },
    time: { $type: "s32" },
    comment: { $type: "str" },
    isTweet: { $type: "bool", $targetKey: "is_tweet" }
}