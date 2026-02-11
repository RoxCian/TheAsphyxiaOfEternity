import { ArrayWrapper } from "../../utils/types"
import { XD } from "../../utils/x"
import { Rb6EventControl } from "./event"
import { Rb6ItemControl } from "./item"
import { Rb6MusicRecord } from "./music_record"
import { Rb6PlayerReleasedInfo } from "./profile"
import { Rb6Quest } from "./quest"

export class Rb6PlayerStart {
    @XD.s32() plyid: number
    @XD.s32() nm = 0
    @XD.u64() startTime = BigInt(Date.now())
    @XD.aw("data", Rb6EventControl) eventCtrl: ArrayWrapper<"data", Rb6EventControl> = {
        data: Rb6EventControl.examples
    }
    @XD.obj({ item: {} }) itemLockCtrl: {} = { item: {} }
    @XD.aw("data", Rb6ItemControl) itemCtrl: ArrayWrapper<"data", Rb6ItemControl> = {}
    @XD.aw("data", Rb6Quest) quertCtrl: ArrayWrapper<"data", Rb6Quest> = {}

    constructor(playerId: number = -1) {
        this.plyid = playerId
    }
}

export class Rb6PlayerSucceed {
    @XD.str() name = ""
    @XD.s16() lv = -1
    @XD.s32() exp = -1
    @XD.s32() grd = -1
    @XD.s32() ap = -1
    @XD.aw("i", Rb6PlayerReleasedInfo) released: ArrayWrapper<"i", Rb6PlayerReleasedInfo> = {}
    @XD.aw("mrec", Rb6MusicRecord) mrecord: ArrayWrapper<"mrec", Rb6MusicRecord> = {}
}
