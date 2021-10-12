import { boolme, KObjectMappingRecord, mapKObject, strme, u8me } from "../../utility/mapping"

export interface IRb6ShopInfo {
    name: "Asphyxia Core"
    clEnabled: boolean
    clH: number
    clM: number
    prefecture: number
    shopFlag: boolean
}
export const Rb6ShopInfoMap: KObjectMappingRecord<IRb6ShopInfo> = {
    name: strme("nm"),
    clEnabled: boolme("cl_enbl"),
    clH: u8me("cl_h"),
    clM: u8me("cl_m"),
    prefecture: u8me("prf"),
    shopFlag: boolme("shop_flag")
}
export const Rb6ShopInfo: IRb6ShopInfo = {
    name: "Asphyxia Core",
    clEnabled: false,
    clH: 0,
    clM: 0,
    prefecture: 3,
    shopFlag: false
}
export const KRb6ShopInfo = mapKObject(Rb6ShopInfo, Rb6ShopInfoMap)

export const KRb6ShopInfoOriginal = {
    name: K.ITEM("str", "Asphysia Core"),
    cl_enbl: K.ITEM("bool", 1),
    ch_h: K.ITEM("u8", 0),
    ch_m: K.ITEM("u8", 0),
    pref: K.ITEM("u8", 3),
    shop_flag: K.ITEM("bool", 1)
}