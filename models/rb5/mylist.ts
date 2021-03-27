import { getCollectionMappingElement, KObjectMappingRecord, s16me } from "../../utility/mapping"
import { ICollection } from "../utility/definitions"

export interface IRb5Mylist extends ICollection<"rb.rb5.player.mylist"> {
    index: number
    mylist: number[]
}

export const Rb5MylistMap: KObjectMappingRecord<IRb5Mylist> = {
    collection: getCollectionMappingElement<IRb5Mylist>("rb.rb5.player.mylist"),
    index: s16me("idx"),
    mylist: s16me("mlst")
}