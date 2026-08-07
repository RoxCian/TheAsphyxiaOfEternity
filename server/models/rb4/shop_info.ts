import { XD } from "../../utils/x"

export class Rb4ShopInfoContent {
    @XD.str("nm") name = "Asphyxia Core" as const
    @XD.bool("cl_enbl") clEnabled = true
    @XD.u8() clH = 127
    @XD.u8() clM = 127
    @XD.bool() shopFlag = true
}

export class Rb4ShopInfo {
    @XD.type(Rb4ShopInfoContent) sinfo = new Rb4ShopInfoContent()
}