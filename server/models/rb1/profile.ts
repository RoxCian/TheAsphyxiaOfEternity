import { XD } from "../../utils/x"
import { ICollection } from "../../utils/db/db_types"
import { ArrayWrapper } from "../../utils/types"
import { RbStageLog } from "../shared/shared"
import { Rb1ChartType, Rb1ClearType, RbColor } from "../shared/rb_types"

export class Rb1PlayerBase implements ICollection<"rb.rb1.player.base"> {
    readonly collection = "rb.rb1.player.base"
    @XD.s32("uid") userId: number
    @XD.str() name = "RBPlayer"
    comment = ""
    @XD.s16("lv") level = 0
    @XD.s32("exp") experience = 0
    @XD.s16("mg") matchingGrade = 0
    @XD.s16("ap") abilityPointTimes10 = 0
    @XD.s32("flag") tutorialFlag = 1
    playCount = 0

    constructor(userId: number = 0) {
        this.userId = userId
    }
}
export class Rb1PlayerStat implements ICollection<"rb.rb1.player.stat"> {
    readonly collection = "rb.rb1.player.stat"
    @XD.s32() day = 0
    @XD.s32("cnt") playCount = 0
    @XD.s32() last = 0
    @XD.s32() now = 0
}
export class Rb1PlayerCustom implements ICollection<"rb.rb1.player.custom"> {
    readonly collection = "rb.rb1.player.custom"
    @XD.u8("bgm_m") stageBackgroundMusic = 0
    @XD.u8("st_f") stageFrameType = 0
    @XD.u8("st_bg") stageBackground = 0
    @XD.u8("st_bg_b") stageBackgroundBrightness = 100
    @XD.u8("eff_e") stageExplodeType = 0
    @XD.u8("se_s") stageShotSound = 0
    @XD.u8("se_s_v") stageShotVolume = 100
}

export class Rb1PlayerReleasedInfo implements ICollection<"rb.rb1.player.releasedInfo"> {
    readonly collection = "rb.rb1.player.releasedInfo"
    @XD.u8() type = 0
    @XD.u16() id = 0
    param = 0
    insertTime = 0
}
export class Rb1MusicRecord implements ICollection<"rb.rb1.playData.musicRecord"> {
    readonly collection = "rb.rb1.playData.musicRecord"
    @XD.u16("mid") musicId: number
    @XD.u8("ng") chartType: Rb1ChartType
    @XD.s32("win") winCount = 0
    @XD.s32("lose") loseCount = 0
    @XD.s32("draw") drawCount = 0
    @XD.u8("ct") clearType = Rb1ClearType.none
    @XD.s16("ar") achievementRateTimes10 = 0
    @XD.s16("bs") score = 0
    @XD.s16("mc") combo = 0
    @XD.s16("bmc") missCount = 0
    playCount = 0

    constructor(musicId: number = 0, chartType: Rb1ChartType = Rb1ChartType.basic) {
        this.musicId = musicId
        this.chartType = chartType
    }
}
export class Rb1StageLogBasic {
    @XD.s16("mg") matchingGrade = 0
    @XD.s16("ap") abilityPointTimes10 = 0
    @XD.s16("ct") clearType = 0
    @XD.s16("s") score = 0
    @XD.s16("ar") achievementRateTimes10 = 0
}
export class Rb1StageLogDetails {
    @XD.s16("idx") stageIndex = 0
    @XD.s16("mid") musicId = 0
    @XD.s16("grade") chartType = Rb1ChartType.basic
    @XD.s16() color = RbColor.red
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
export class Rb1StageLog extends RbStageLog<"rb.rb1.playData.stageLog"> {
    readonly collection = "rb.rb1.playData.stageLog"
}
export class Rb1PlayerData {
    @XD.str("cmnt") comment = ""
    @XD.type(Rb1PlayerBase) base: Rb1PlayerBase
    @XD.type("con", Rb1PlayerStat) stat = new Rb1PlayerStat()
    @XD.type(Rb1PlayerCustom) custom = new Rb1PlayerCustom()
    @XD.aw("info", Rb1PlayerReleasedInfo) released: ArrayWrapper<"info", Rb1PlayerReleasedInfo> = {}
    @XD.aw("rec", Rb1MusicRecord) record: ArrayWrapper<"rec", Rb1MusicRecord> = {}
    @XD.aw("blog", "log", Rb1StageLog) stageLogs: ArrayWrapper<"log", Rb1StageLog> = {}

    constructor(userId: number = 0) {
        this.base = new Rb1PlayerBase(userId)
    }
}
export class Rb1Player {
    @XD.str() rid: string
    @XD.str() lid = "ea"
    @XD.u8() mode = 1
    @XD.type(Rb1PlayerData) pdata: Rb1PlayerData

    constructor(rid: string = "", userId: number = -1) {
        this.rid = rid
        this.pdata = new Rb1PlayerData(userId)
    }
}