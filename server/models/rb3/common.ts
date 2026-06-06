import { XD } from "../../utils/x"
import { ArrayWrapper } from "../../utils/types"
import { Rb3EventControl } from "./event"
import { Rb3MusicRecord } from "./music_record"
import { Rb3PlayerReleasedInfo } from "./profile"

export class Rb3ItemLockCtrl {
    @XD.u8() type = 0
    @XD.u16() id = 0
    @XD.u16() param = 0
}

export class Rb3PlayerStart {
    @XD.s32("plyid") sessionId = 0
    @XD.s32() nm = 0
    @XD.u64() startTime = BigInt(Math.trunc(Date.now() / 1000))
    @XD.aw("data", Rb3EventControl) eventCtrl: ArrayWrapper<"data", Rb3EventControl> = {
        data: Rb3EventControl.examples
    }
    @XD.aw("item", Rb3ItemLockCtrl) itemLockCtrl: ArrayWrapper<"item", Rb3ItemLockCtrl> = {}
}

export class Rb3PlayerSucceed {
    @XD.str() name = ""
    @XD.s16() lv = -1
    @XD.s32() exp = -1
    @XD.s32() grd = -1
    @XD.s32() ap = -1
    @XD.aw("i", Rb3PlayerReleasedInfo) released: ArrayWrapper<"i", Rb3PlayerReleasedInfo> = {}
    @XD.aw("mrec", Rb3MusicRecord) mrecord: ArrayWrapper<"mrec", Rb3MusicRecord> = {}
}