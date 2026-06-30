import { DBBigInt } from "../../utils/db/db_types"
import { ArrayWrapper } from "../../utils/types"
import { XD } from "../../utils/x"
import { Rb2ClearType } from "../shared/rb_types"
import { Rb2EventControl } from "./event"
import { Rb2LincleLink, Rb2MusicRecord, Rb2MusicRecordElement, Rb2PlayerReleasedInfo } from "./profile"

class Rb2PlayerStartData {
    @XD.s32() type = 0
    @XD.s32() value = 0
}

class Rb2PlayerUnlockMusic {
    @XD.attr() count: number = 0
}

export class Rb2PlayerStart {
    @XD.s32("plyid") sessionId: number
    @XD.s32() nm = 0
    @XD.bool() isSuc = true
    @XD.u64() startTime: bigint | DBBigInt = DBBigInt(Math.trunc(Date.now() / 1000))
    @XD.type(Rb2PlayerStartData) data = new Rb2PlayerStartData()
    // @XD.type("data", Rb2EventControl) eventCtrl: ArrayWrapper<"data", Rb2EventControl> = {
    //     data: Rb2EventControl.examples
    // }
    @XD.aw("item", Rb2PlayerReleasedInfo) unlockMusic: ArrayWrapper<"item", Rb2PlayerReleasedInfo> = {}
    @XD.aw("item", Rb2PlayerReleasedInfo) unlockItem: ArrayWrapper<"item", Rb2PlayerReleasedInfo> = {}
    @XD.obj({}) itemLockCtrl = {}
    @XD.type("lincle_link_4", Rb2LincleLink) lincleLink = new Rb2LincleLink()
    
    constructor(sessionId: number = 0) {
        this.sessionId = sessionId
    }
}

export class Rb2MusicRecordPlayerSucceed {
    @XD.s32("mid") musicId = 0
    @XD.s32("ctype") chartType = 0
    @XD.s32("win") winCount = 0
    @XD.s32("lose") loseCount = 0
    @XD.s32("draw") drawCount = 0
    @XD.s32("grade") clearType = Rb2ClearType.none
    @XD.s32("ap") achievementRateTimes10 = 0
    @XD.s32("score") score = 0
    @XD.s32("combo") combo = 0
    @XD.s32("miss") missCount = -1

    static fromMusicRecord(record: Rb2MusicRecord): Rb2MusicRecordPlayerSucceed {
        const result = new Rb2MusicRecordPlayerSucceed()
        result.musicId = record.musicId
        result.chartType = record.chartType
        result.winCount = record.newRecord.winCount
        result.loseCount = record.newRecord.loseCount
        result.drawCount = record.newRecord.loseCount
        result.clearType = record.newRecord.clearType
        result.achievementRateTimes10 = record.newRecord.achievementRateTimes10
        result.score = record.newRecord.score
        result.combo = record.newRecord.combo
        result.missCount = record.newRecord.missCount
        return result
    }
}

export class Rb2PlayerSucceed {
    @XD.str() name = ""
    @XD.s32() lv = -1
    @XD.s32() exp = -1
    @XD.s32("grade") grd = -1
    @XD.s32() ap = -1
    @XD.aw("i", Rb2PlayerReleasedInfo) released: ArrayWrapper<"i", Rb2PlayerReleasedInfo> = {}
    @XD.aw("mrec", Rb2MusicRecordPlayerSucceed) mrecord: ArrayWrapper<"mrec", Rb2MusicRecordPlayerSucceed> = {}

    addMusicRecords(records: Rb2MusicRecord[]) {
        if (records.length === 0) return
        this.mrecord.mrec = records.map(Rb2MusicRecordPlayerSucceed.fromMusicRecord)
    }
}
