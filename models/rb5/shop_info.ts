import { KObjectMappingRecord, mapKObject } from "../../utility/mapping"

export interface IRb5ShopInfo {
    name: "Asphyxia Core"
    clEnabled: boolean
    clH: number
    clM: number
    shopFlag: boolean
}
export const Rb5ShopInfoMap: KObjectMappingRecord<IRb5ShopInfo> = {
    name: { $type: "str", $targetKey: "nm" },
    clEnabled: { $type: "bool", $targetKey: "cl_enbl" },
    clH: { $type: "u8", $targetKey: "cl_h" },
    clM: { $type: "u8", $targetKey: "cl_m" },
    shopFlag: { $type: "bool", $targetKey: "shop_flag" }
}
export const Rb5ShopInfo: IRb5ShopInfo = {
    name: "Asphyxia Core",
    clEnabled: false,
    clH: 0,
    clM: 0,
    shopFlag: false
}
export const KRb5ShopInfo = mapKObject(Rb5ShopInfo, Rb5ShopInfoMap)

export const KRb5ShopInfoOriginal = {
    name: K.ITEM("str", "Asphysia Core"),
    cl_enbl: K.ITEM("bool", 0),
    ch_h: K.ITEM("u8", 0),
    ch_m: K.ITEM("u8", 0),
    shop_flag: K.ITEM("bool", 0)
}