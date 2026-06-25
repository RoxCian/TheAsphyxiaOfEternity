import { DBBigInt } from "../../utils/db/db_types"
import { ArrayWrapper } from "../../utils/types"
import { XD, XM, XMap } from "../../utils/x"
import { Rb1EventControl } from "./event"

export class Rb1PlayerStart {
    @XD.s32("plyid") sessionId: number
    @XD.s32() nm = 0
    @XD.bool() isSuc = true
    @XD.u64() startTime: bigint | DBBigInt = DBBigInt(Math.trunc(Date.now() / 1000))
    @XD.aw("data", Rb1EventControl, { nm: XM.s32() } as XMap<ArrayWrapper<"data", Rb1EventControl> & { nm?: number }, undefined>) eventCtrl: ArrayWrapper<"data", Rb1EventControl> & { nm?: number } = {
        // data: undefined
        data: Rb1EventControl.examples,
        nm: 0
    }
    @XD.obj({}) itemLockCtrl = {}

    constructor(sessionId: number = -1) {
        this.sessionId = sessionId
    }
}