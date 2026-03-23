import { XD } from "../../utils/x"

export class Rb5ShopInfoContent {
    @XD.str("nm") name = "Asphyxia Core" as const
    @XD.bool("cl_enbl") clEnabled = true
    @XD.u8() clH = 0
    @XD.u8() clM = 0
    @XD.bool() shopFlag = true
}

export class Rb5ShopInfo {
    @XD.type(Rb5ShopInfoContent) sinfo = new Rb5ShopInfoContent()
}