import { DBH } from "../../utils/db/dbh"
import { ICollection } from "../../utils/db/db_types"
import { XD, XM } from "../../utils/x"

export class RbStageLogStandaloneElement {
    @XD.s16("idx") stageIndex = 0
    @XD.s16("mid") musicId = 0
    @XD.s16("grade") chartType = 0
    @XD.s16() color = 0
    @XD.s16("match") isMatched = 0
    @XD.s16("res") result = 0
    @XD.s16() score = 0
    @XD.s16("mc") combo = 0
    @XD.s16("jt_jr") justReflecCount = 0
    @XD.s16("jt_ju") justCount = 0
    @XD.s16("jt_gr") greatCount = 0
    @XD.s16("jt_gd") goodCount = 0
    @XD.s16("jt_ms") missCount = 0
    @XD.s32() sec = 0
}

export class RbStageLogStandalone {
    @XD.s32("uid") userId = 0
    @XD.str() lid = ""
    @XD.obj({ stageCount: XM.s16("stage"), sec: XM.s32() }) play = {
        stageCount: 0,
        sec: 0
    }
    @XD.a(RbStageLogStandaloneElement) rec: RbStageLogStandaloneElement[] = []
}
export class RbStageLogBasic {
    @XD.s16("mg") matchingGrade = 0
    @XD.s16("ap") abilityPointTimes10 = 0
    @XD.s16("ct") clearType = 0
    @XD.s16("s") score = 0
    @XD.s16("ar") achievementRateTimes10 = 0
}
export abstract class RbStageLog<TCollection extends string> implements ICollection<TCollection> {
    abstract readonly collection: TCollection
    @XD.u8("id") stageIndex = 0
    @XD.u16("mid") musicId = 0
    @XD.u8("ng") chartType = 0
    @XD.u8() mt = 0
    @XD.u8() rt = 0
    @XD.s32("ruid") rivalUserId = 0
    @XD.type("myself", RbStageLogBasic) @DBH.one(RbStageLogBasic) log = new RbStageLogBasic()
    @XD.type("rival", RbStageLogBasic) @DBH.one(RbStageLogBasic) rivalLog = new RbStageLogBasic()
    @XD.s32() time = 0
    @XD.type(RbStageLogStandaloneElement) @DBH.one(RbStageLogStandaloneElement) standalone?: RbStageLogStandaloneElement
}