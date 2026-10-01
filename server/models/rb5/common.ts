import { XD } from "../../utils/x"
import { DBBigInt } from "../../utils/db/db_types"
import { ArrayWrapper } from "../../utils/types"
import { Rb5EventControl } from "./event"
import { Rb5MusicRecord } from "./music_record"
import { Rb5PlayerReleasedInfo } from "./profile"

export class Rb5PlayerStart {
    @XD.s32("plyid") sessionId: number
    @XD.s32() nm = 1
    @XD.u64() startTime: bigint | DBBigInt = DBBigInt(Date.now() * 1000)
    @XD.aw("data", Rb5EventControl) eventCtrl: ArrayWrapper<"data", Rb5EventControl> = {
        data: Rb5EventControl.examples
    }
    @XD.obj({}) itemLockCtrl = {}

    constructor(sessionId: number = -1) {
        this.sessionId = sessionId
    }
}

export class Rb5PlayerSucceed {
    @XD.str() name = ""
    @XD.s16() lv = -1
    @XD.s32() exp = -1
    @XD.s32() grd = -1
    @XD.s32() ap = -1
    @XD.aw("i", Rb5PlayerReleasedInfo) released: ArrayWrapper<"i", Rb5PlayerReleasedInfo> = {}
    @XD.aw("mrec", Rb5MusicRecord) mrecord: ArrayWrapper<"mrec", Rb5MusicRecord> = {}
}
