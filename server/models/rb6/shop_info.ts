import { XD } from "../../utils/x"

export class Rb6ShopInfoContent {
    @XD.str("nm") name = "Asphyxia Core" as const
    @XD.bool("cl_enbl") clEnabled = true
    @XD.u8() clH = 8
    @XD.u8() clM = 0
    @XD.u8("prf") prefecture = 13
    @XD.bool() shopFlag = true
}

export class Rb6ShopInfo {
    @XD.type(Rb6ShopInfoContent) sinfo = new Rb6ShopInfoContent()
}