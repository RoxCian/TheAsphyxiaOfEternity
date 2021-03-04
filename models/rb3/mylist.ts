import { getCollectionMappingElement, KObjectMappingRecord } from "../../utility/mapping"
import { ICollection } from "../utility/definitions"

export interface IRb3Mylist extends ICollection<"rb.rb3.player.mylist"> {
    slot?: {
        slotId: number
        musicId: number
    }[]
}
export const Rb3MylistMap: KObjectMappingRecord<IRb3Mylist> = {
    collection: getCollectionMappingElement<IRb3Mylist>("rb.rb3.player.mylist"),
    slot: {
        0: {
            slotId: { $type: "u8", $targetKey: "slot_id" },
            musicId: { $type: "s16", $targetKey: "music_id" }
        }
    },
    $targetKey: "fav_music_slot"
}
