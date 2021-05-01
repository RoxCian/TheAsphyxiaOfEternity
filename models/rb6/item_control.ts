import { boolme, KObjectMappingRecord, s32me } from "../../utility/mapping"

export interface IRb6ItemControl {
    type: number
    id: number
    param: number
    isNoticing: boolean
    isCardOnly: boolean
}
export const Rb6ItemControlMap: KObjectMappingRecord<IRb6ItemControl> = {
    type: s32me("item_type"),
    id: s32me("item_id"),
    param: s32me("item_param"),
    isNoticing: boolme("notice"),
    isCardOnly: boolme("card_only")
}