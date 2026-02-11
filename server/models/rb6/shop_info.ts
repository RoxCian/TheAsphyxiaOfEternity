import { XD } from "../../utils/x"

export class Rb6ShopInfoContent {
    @XD.str("nm") name = "Asphyxia Core" as const
    @XD.bool("cl_enbl") clEnabled = false
    @XD.u8() clH = 0
    @XD.u8() clM = 0
    @XD.u8("prf") prefecture = 3
    @XD.bool() shopFlag = false
}

export class Rb6ShopInfo {
    @XD.type(Rb6ShopInfoContent) sinfo = new Rb6ShopInfoContent()
}