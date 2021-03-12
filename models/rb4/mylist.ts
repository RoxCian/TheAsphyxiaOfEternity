import { getCollectionMappingElement, KObjectMappingRecord } from "../../utility/mapping"
import { ICollection } from "../utility/definitions"

export interface IRb4Mylist extends ICollection<"rb.rb4.player.mylist"> {
    index: number
    mylist: number[]
}

export const Rb4MylistMap: KObjectMappingRecord<IRb4Mylist> = {
    collection: getCollectionMappingElement<IRb4Mylist>("rb.rb4.player.mylist"),
    index: { $type: "s16", $targetKey: "idx" },
    mylist: { $type: "s16", $targetKey: "mlst" }
}