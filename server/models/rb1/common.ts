import { ArrayWrapper } from "../../utils/types"
import { XD, XM } from "../../utils/x"
import { Rb1EventControl } from "./event"

export class Rb1PlayerStart {
    @XD.s32() plyid = 0
    @XD.s32() nm = 0
    @XD.bool() isSuc = true
    @XD.u64() startTime = BigInt(Math.trunc(Date.now() / 1000))
    @XD.aw("data", Rb1EventControl, { nm: XM.s32() }) eventCtrl: ArrayWrapper<"data", Rb1EventControl> & { nm?: number } = {
        // data: undefined
        data: Rb1EventControl.examples,
        nm: 0
    }
    @XD.obj({}) itemLockCtrl = {}
}