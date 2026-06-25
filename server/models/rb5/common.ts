import { DBBigInt } from "../../utils/db/db_types"
import { ArrayWrapper } from "../../utils/types"
import { XD } from "../../utils/x"
import { Rb5EventControl } from "./event"

export class Rb5PlayerStart {
    @XD.s32("plyid") sessionId: number
    @XD.s32() nm = 0
    @XD.u64() startTime: bigint | DBBigInt = DBBigInt(Date.now() * 1000)
    @XD.aw("data", Rb5EventControl) eventCtrl: ArrayWrapper<"data", Rb5EventControl> = {
        data: Rb5EventControl.examples
    }
    @XD.obj({}) itemLockCtrl = {}

    constructor(sessionId: number = -1) {
        this.sessionId = sessionId
    }
}
