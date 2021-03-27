import { getCollectionMappingElement, KObjectMappingRecord, s16me, u8me } from "../../utility/mapping"
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
            slotId: u8me("slot_id"),
            musicId: s16me("music_id")
        }
    },
    $targetKey: "fav_music_slot"
}
