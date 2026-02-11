import { ArrayWrapper } from "../../utils/types"
import { XD } from "../../utils/x"
import { Rb2EventControl } from "./event"

export class Rb2PlayerStart {
    @XD.s32() plyid = 0
    @XD.s32() nm = 0
    @XD.bool() isSuc = true
    @XD.u64() startTime = BigInt(Date.now() * 1000)
    @XD.aw("data", Rb2EventControl) eventCtrl: ArrayWrapper<"data", Rb2EventControl> = {
        data: Rb2EventControl.examples
    }
    @XD.obj({}) itemLockCtrl = {}
}
