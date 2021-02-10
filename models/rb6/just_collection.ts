import { getCollectionMappingElement, KObjectMappingRecord } from "../../utility/mapping"
import { ICollection } from "../../utility/definitions"

export interface IRb6JustCollectionElement extends ICollection<"rb.rb6.playData.justCollection"> {
    userId?: number
    musicId: number
    chartType: number
    blueData?: Buffer
    redData?: Buffer
    blueDataArray?: number[]
    redDataArray?: number[]
}
export const Rb6JustCollectionElementMappingRecord: KObjectMappingRecord<IRb6JustCollectionElement> = {
    collection: getCollectionMappingElement<IRb6JustCollectionElement>("rb.rb6.playData.justCollection"),
    userId: { $type: "s32", $targetKey: "user_id" },
    musicId: { $type: "s32", $targetKey: "music_id" },
    chartType: { $type: "s8", $targetKey: "note_grade" },
    blueData: { $type: "bin", $targetKey: "item_blue_data_bin" },
    redData: { $type: "bin", $targetKey: "item_red_data_bin" },
    blueDataArray: { $type: "kignore" },
    redDataArray: { $type: "kignore" }
}