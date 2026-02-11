import { XD, XM } from "../../utils/x"
import { DBH } from "../../utils/db/dbh"
import { DBBigInt, ICollection } from "../../utils/db/db_types"
import { ArrayWrapper } from "../../utils/types"
import { RbStageLog } from "../shared/shared"
import { Rb1ChartType, Rb2ClearType } from "../shared/rb_types"

export class Rb2PlayerBase implements ICollection<"rb.rb2.player.base"> {
    readonly collection = "rb.rb2.player.base"
    @XD.s32("uid") userId: number
    @XD.str() name = "RBPlayer"
    comment = ""
    @XD.s16("icon_id") iconId = 0
    @XD.s16("lv") level = 0
    @XD.s32("exp") experience = 0
    @XD.s16("mg") matchingGrade = 0
    @XD.s16("ap") abilityPointTimes100 = 0
    @XD.s32("pc") playCount = 0
    @XD.s32() uattr = 0

    constructor(userId: number = 0) {
        this.userId = userId
    }
}
export class Rb2PlayerStat implements ICollection<"rb.rb2.player.stat"> {
    readonly collection = "rb.rb2.player.stat"
    @XD.s32() day = 0
    @XD.s32("cnt") playCount = 0
    @XD.s32("total_cnt") totalCount = 0
    @XD.s32() last = 0
    @XD.s32() now = 0
}
export class Rb2PlayerCustom implements ICollection<"rb.rb2.player.custom"> {
    readonly collection = "rb.rb2.player.custom"
    @XD.u8("bgm_m") stageBackgroundMusic = 0
    @XD.u8("st_f") stageFrameType = 0
    @XD.u8("st_bg") stageBackground = 0
    @XD.u8("st_bg_b") stageBackgroundBrightness = 100
    @XD.u8("eff_e") stageExplodeType = 0
    @XD.u8("se_s") stageShotSound = 0
    @XD.u8("se_s_v") stageShotVolume = 100
    @XD.u8("s_gls") selectedGlass = 0
    @XD.u8() sortType = 0
    @XD.s16() lastMusicId = 0
    @XD.u8("last_note_grade") lastChartType = Rb1ChartType.basic
    @XD.u8("narrowdown_type") narrowDownType = 0
    @XD.bool() isBeginner = true
    @XD.bool("is_tut") isTutorialEnabled = true
    @XD.s16("symbol_chat_1") symbolChatSet1 = [0, 1, 2, 3, 4, 5]
    @XD.s16("symbol_chat_2") symbolChatSet2 = [0, 1, 2, 3, 4, 5]
    @XD.u8() gaugeStyle = 0
    @XD.u8("obj_shade") objectShade = 0
    @XD.u8("obj_size") objectSize = 0
    @XD.s16() byword = [0, 0]
    @XD.bool() isAutoByword = [true, true]
    @XD.bool() isTweet = false
    @XD.bool("is_link_twitter") isTwitterLinked = false
    @XD.s16() mrecType = 0
    @XD.s16("card_disp_type") cardDisplayType = 0
    @XD.s16("tab_sel") tabSelected = 4
    @XD.s32() hiddenParam = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0]
}

export class Rb2PlayerReleasedInfo implements ICollection<"rb.rb2.player.releasedInfo"> {
    readonly collection = "rb.rb2.player.releasedInfo"
    @XD.u8() type = 0
    @XD.u16() id = 0
    @XD.u16() param = 0
    @XD.s32() insertTime = 0
}
export class Rb2MusicRecordElement {
    @XD.s32("win") winCount = 0
    @XD.s32("lose") loseCount = 0
    @XD.s32("draw") drawCount = 0
    @XD.u8("ct") clearType = Rb2ClearType.none
    @XD.s16("ar") achievementRateTimes10 = 0
    @XD.s32("bs") score = 0
    @XD.s16("mc") combo = 0
    @XD.s16("bmc") missCount = -1
    playCount = 0
}

export class Rb2MusicRecord implements ICollection<"rb.rb2.playData.musicRecord"> {
    readonly collection = "rb.rb2.playData.musicRecord"
    @XD.u16("mid") musicId: number
    @XD.u8("ng") chartType: Rb1ChartType
    @XD.s32() point = 0
    @XD.s32("played_time") time = 0
    @XD.type("mrec_0", Rb2MusicRecordElement) @DBH.one(Rb2MusicRecordElement) newRecord = new Rb2MusicRecordElement()
    @XD.type("mrec_1", Rb2MusicRecordElement) @DBH.one(Rb2MusicRecordElement) oldRecord = new Rb2MusicRecordElement()

    constructor(musicId: number = 0, chartType: Rb1ChartType = Rb1ChartType.basic) {
        this.musicId = musicId
        this.chartType = chartType
    }
}

export class Rb2StageLog extends RbStageLog<"rb.rb2.playData.stageLog"> {
    readonly collection = "rb.rb2.playData.stageLog"
}

export class Rb2Glass implements ICollection<"rb.rb2.player.glass"> {
    readonly collection = "rb.rb2.player.glass"
    @XD.s32() id = 0
    @XD.s32("exp") experience = 0
}

export class Rb2LincleLink implements ICollection<"rb.rb2.player.lincleLink"> {
    readonly collection = "rb.rb2.player.lincleLink"
    @XD.u32("qpro_add") qproParam: number
    @XD.u32("glass_add") glassParam: number
    @XD.bool("for_iidx_0_0") iidxParam0Sub0 = false
    @XD.bool("for_iidx_0_1") iidxParam0Sub1 = false
    @XD.bool("for_iidx_0_2") iidxParam0Sub2 = false
    @XD.bool("for_iidx_0_3") iidxParam0Sub3 = false
    @XD.bool("for_iidx_0_4") iidxParam0Sub4 = false
    @XD.bool("for_iidx_0_5") iidxParam0Sub5 = false
    @XD.bool("for_iidx_0_6") iidxParam0Sub6 = false
    @XD.bool("for_iidx_0") iidxParam0 = false
    @XD.bool("for_iidx_1") iidxParam1 = false
    @XD.bool("for_iidx_2") iidxParam2 = false
    @XD.bool("for_iidx_3") iidxParam3 = false
    @XD.bool("for_iidx_4") iidxParam4 = false
    @XD.bool("for_rb_0_0") rbParam0Sub0 = false
    @XD.bool("for_rb_0_1") rbParam0Sub1 = false
    @XD.bool("for_rb_0_2") rbParam0Sub2 = false
    @XD.bool("for_rb_0_3") rbParam0Sub3 = false
    @XD.bool("for_rb_0_4") rbParam0Sub4 = false
    @XD.bool("for_rb_0_5") rbParam0Sub5 = false
    @XD.bool("for_rb_0_6") rbParam0Sub6 = false
    @XD.bool("for_rb_0") rbParam0 = false
    @XD.bool("for_rb_1") rbParam1 = false
    @XD.bool("for_rb_2") rbParam2 = false
    @XD.bool("for_rb_3") rbParam3 = false
    @XD.bool("for_rb_4") rbParam4 = false
}
export class Rb2MylistElement {
    @XD.u8() slotId = 0
    @XD.s16() musicId = 0
}
export class Rb2Mylist implements ICollection<"rb.rb2.player.mylist"> {
    readonly collection = "rb.rb2.player.mylist"
    @XD.a(Rb2MylistElement) @DBH.many(Rb2MylistElement) slot?: Rb2MylistElement[]
}

export class Rb2PlayerData {
    @XD.str("cmnt") comment = ""
    @XD.obj({ teamId: XM.s32("id"), teamName: XM.str("name") }) team = {
        teamId: -1,
        teamName: "Asphyxia"
    }
    @XD.type(Rb2PlayerBase) base: Rb2PlayerBase
    @XD.type(Rb2PlayerStat) stat = new Rb2PlayerStat()
    @XD.type(Rb2PlayerCustom) custom = new Rb2PlayerCustom()
    @XD.aw("info", Rb2PlayerReleasedInfo) released: ArrayWrapper<"info", Rb2PlayerReleasedInfo> = {
        info: [new Rb2PlayerReleasedInfo]
    }
    @XD.aw("rec", Rb2MusicRecord) record: ArrayWrapper<"rec", Rb2MusicRecord> = {}
    @XD.aw("blog", "log", Rb2StageLog) stageLogs: ArrayWrapper<"log", Rb2StageLog> = {}
    @XD.obj({}) rival = {}
    @XD.aw("g", Rb2Glass) glass: ArrayWrapper<"g", Rb2Glass> = {}
    @XD.type(Rb2Mylist) mylist = new Rb2Mylist()
    @XD.type(Rb2LincleLink) lincleLink = new Rb2LincleLink()

    constructor(userId: number = 0) {
        this.base = new Rb2PlayerBase(userId)
    }
}
export class Rb2Player {
    @XD.str() rid: string
    @XD.str() lid = "ea"
    @XD.u64() beginTime: bigint | DBBigInt = BigInt(614498759023)
    @XD.u64() endTime: bigint | DBBigInt = BigInt(9614498759023)
    @XD.u8() mode = 0
    @XD.type(Rb2PlayerData) pdata: Rb2PlayerData

    constructor(rid: string = "", userId: number = -1) {
        this.rid = rid
        this.pdata = new Rb2PlayerData(userId)
    }
}