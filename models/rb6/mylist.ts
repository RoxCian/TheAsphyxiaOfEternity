import { getCollectionMappingElement, KObjectMappingRecord } from "../../utility/mapping"
import { ICollection } from "../utility/definitions"

export interface IRb6Mylist extends ICollection<"rb.rb6.player.mylist"> {
    index: number
    mylist: number[]
}

export const Rb6MylistMap: KObjectMappingRecord<IRb6Mylist> = {
    collection: getCollectionMappingElement<IRb6Mylist>("rb.rb6.player.mylist"),
    index: { $type: "s16", $targetKey: "idx" },
    mylist: { $type: "s16", $targetKey: "mlst" }
}