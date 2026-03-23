import { XD } from "../../utils/x"

export class Rb3ShopInfoContent {
    @XD.str("nm") name = "Asphyxia Core" as const
    @XD.bool("cl_enbl") clEnabled = true
    @XD.u8() clH = 0
    @XD.u8() clM = 0
    @XD.bool() shopFlag = true
}

export class Rb3ShopInfo {
    @XD.type(Rb3ShopInfoContent) sinfo = new Rb3ShopInfoContent()
}