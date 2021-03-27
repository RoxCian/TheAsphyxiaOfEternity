import { boolme, KObjectMappingRecord, mapKObject, strme, u8me } from "../../utility/mapping"

export interface IRb3ShopInfo {
    name: "Asphyxia Core"
    clEnabled: boolean
    clH: number
    clM: number
    shopFlag: boolean
}
export const Rb3ShopInfoMap: KObjectMappingRecord<IRb3ShopInfo> = {
    name: strme("nm"),
    clEnabled: boolme("cl_enbl"),
    clH: u8me("cl_h"),
    clM: u8me("cl_m"),
    shopFlag: boolme("shop_flag")
}
export const Rb3ShopInfo: IRb3ShopInfo = {
    name: "Asphyxia Core",
    clEnabled: false,
    clH: 0,
    clM: 0,
    shopFlag: false
}
export const KRb3ShopInfo = mapKObject(Rb3ShopInfo, Rb3ShopInfoMap)

export const KRb3ShopInfoOriginal = {
    name: K.ITEM("str", "Asphysia Core"),
    cl_enbl: K.ITEM("bool", 0),
    ch_h: K.ITEM("u8", 0),
    ch_m: K.ITEM("u8", 0),
    shop_flag: K.ITEM("bool", 0)
}