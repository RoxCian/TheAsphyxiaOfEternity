import { KObjectMappingRecord, mapKObject } from "../../utility/mapping"

export interface IRb4ShopInfo {
    name: "Asphyxia Core"
    clEnabled: boolean
    clH: number
    clM: number
    shopFlag: boolean
}
export const Rb4ShopInfoMap: KObjectMappingRecord<IRb4ShopInfo> = {
    name: { $type: "str", $targetKey: "nm" },
    clEnabled: { $type: "bool", $targetKey: "cl_enbl" },
    clH: { $type: "u8", $targetKey: "cl_h" },
    clM: { $type: "u8", $targetKey: "cl_m" },
    shopFlag: { $type: "bool", $targetKey: "shop_flag" }
}
export const Rb4ShopInfo: IRb4ShopInfo = {
    name: "Asphyxia Core",
    clEnabled: false,
    clH: 0,
    clM: 0,
    shopFlag: false
}
export const KRb4ShopInfo = mapKObject(Rb4ShopInfo, Rb4ShopInfoMap)

export const KRb4ShopInfoOriginal = {
    name: K.ITEM("str", "Asphysia Core"),
    cl_enbl: K.ITEM("bool", 0),
    ch_h: K.ITEM("u8", 0),
    ch_m: K.ITEM("u8", 0),
    shop_flag: K.ITEM("bool", 0)
}