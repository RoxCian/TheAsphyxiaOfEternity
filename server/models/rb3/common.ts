import { XD } from "../../utils/x"
import { ArrayWrapper } from "../../utils/types"
import { Rb3EventControl, Rb3JubeatCollaboration } from "./event"
import { Rb3MusicRecord } from "./music_record"
import { Rb3PlayerReleasedInfo, Rb3TricolettePark } from "./profile"
import { DBBigInt } from "../../utils/db/db_types"
import { Rb2LincleLink } from "../rb2/profile"

export class Rb3ItemLockCtrl {
    @XD.u8() type = 0
    @XD.u16() id = 0
    @XD.u16() param = 0
}

export class Rb3PlayerStart {
    @XD.s32("plyid") sessionId: number
    @XD.s32() nm = 0
    @XD.u64() startTime: bigint | DBBigInt = DBBigInt(Math.trunc(Date.now() / 1000))
    @XD.aw("data", Rb3EventControl) eventCtrl: ArrayWrapper<"data", Rb3EventControl> = {
        data: Rb3EventControl.examples
    }
    @XD.aw("item", Rb3ItemLockCtrl) itemLockCtrl: ArrayWrapper<"item", Rb3ItemLockCtrl> = {}
    @XD.type("lincle_link_4", Rb2LincleLink) lincleLink = new Rb2LincleLink()
    @XD.type("jbrbcollabo", Rb3JubeatCollaboration) jubeatCollaboration = new Rb3JubeatCollaboration()
    @XD.type("tricolettepark", Rb3TricolettePark) tricolettePark = new Rb3TricolettePark()

    constructor(sessionId: number = 0) {
        this.sessionId = sessionId
    }
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