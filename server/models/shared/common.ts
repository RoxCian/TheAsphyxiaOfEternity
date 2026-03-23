import { XD } from "../../utils/x"

export class RbPlayerRead {
    @XD.str() rid = ""
    @XD.str() lid = ""
    @XD.s16() ver = 0
    @XD.str() cardId = ""
    @XD.s16() cardType = 0
}