import { DBBigInt } from "../../utils/db/db_types"
import { ArrayWrapper } from "../../utils/types"
import { XD } from "../../utils/x"
import { Rb4EventControl } from "./event"
import { Rb4MusicRecord } from "./music_record"
import { Rb4PlayerReleasedInfo } from "./profile"

export class Rb4PlayerStart {
    @XD.s32("plyid") sessionId: number
    @XD.s32() nm = 0
    @XD.u64() startTime: bigint | DBBigInt = DBBigInt(0)
    @XD.aw("data", Rb4EventControl) eventCtrl: ArrayWrapper<"data", Rb4EventControl> = {
        data: Rb4EventControl.examples
    }
    @XD.obj({}) itemLockCtrl = {}

    constructor(sessionId: number = 0) {
        this.sessionId = sessionId
    }
}

export class Rb4PlayerSucceed {
    @XD.str() name = ""
    @XD.s16() lv = -1
    @XD.s32() exp = -1
    @XD.s32() grd = -1
    @XD.s32() ap = -1
    @XD.s32() money = -1
    @XD.aw("i", Rb4PlayerReleasedInfo) released: ArrayWrapper<"i", Rb4PlayerReleasedInfo> = {}
    @XD.aw("mrec", Rb4MusicRecord) mrecord: ArrayWrapper<"mrec", Rb4MusicRecord> = {}
}