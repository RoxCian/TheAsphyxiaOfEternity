import { ArrayWrapper } from "../../utils/types"
import { XD } from "../../utils/x"
import { Rb5EventControl } from "./event"

export class Rb5PlayerStart {
    @XD.s32() plyid: number
    @XD.s32() nm = 0
    @XD.u64() startTime = BigInt(Date.now() * 1000)
    @XD.aw("data", Rb5EventControl) eventCtrl: ArrayWrapper<"data", Rb5EventControl> = {
        data: Rb5EventControl.examples
    }
    @XD.obj({}) itemLockCtrl = {}

    constructor(playerId: number = -1) {
        this.plyid = playerId
    }
}
