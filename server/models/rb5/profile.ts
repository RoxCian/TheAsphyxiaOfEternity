import { DBBigInt, ICollection } from "../../utils/db/db_types"
import { ArrayWrapper } from "../../utils/types"
import { XD } from "../../utils/x"
import { Rb4ChartType, Rb4ClearType, Rb5ClasscheckIndex, RbClasscheckClearType, RbColor } from "../shared/rb_types"
import { Rb5Classcheck } from "./classcheck"
import { Rb5Mylist } from "./mylist"

export class Rb5PlayerAccount implements ICollection<"rb.rb5.player.account"> {
    readonly collection = "rb.rb5.player.account"
    @XD.s32("usrid") userId: number
    @XD.ToO.s32("plyid") playerId = 0
    @XD.s32("dpc") playCountToday = 0
    @XD.ToX.s32("tpc") playCount = 0
    @XD.s32() crd = 1
    @XD.s32() brd = 1
    @XD.s32("tdc") dayCount = 0
    @XD.ToO.str() rid: string
    @XD.ToO.str() lid = "ea"
    @XD.ToX.s32() intrvld = 0
    @XD.ToX.bool() succeed = true
    @XD.u64() pst: bigint | DBBigInt = BigInt(0)
    @XD.ToO.u8() wmode = 1
    @XD.ToO.u8() gmode = 0
    @XD.s16("ver") version = 0
    @XD.ToO.bool() pp = false
    @XD.ToO.bool() ps = false
    @XD.bool("continue") isContinue = false
    @XD.bool("firstfree") isFirstFree = false
    @XD.ToO.s16() pay = 0
    @XD.ToO.s16() payPc = 0
    @XD.u64() st: bigint | DBBigInt = BigInt(Date.now())
    @XD.s32() opc = 0
    @XD.s32() lpc = 0
    @XD.s32() cpc = 0
    @XD.s32() mpc = 0

    constructor(rid: string, userId: number = -1) {
        this.rid = rid
        this.userId = userId
    }
}

export class Rb5PlayerBase implements ICollection<"rb.rb5.player.base"> {
    readonly collection = "rb.rb5.player.base"
    @XD.str("cmnt") comment = ""
    @XD.s32("tbs") totalBestScore = 0
    @XD.s32("tbgs") totalBestScoreEachChartType: number[] = [0, 0, 0, 0]
    @XD.s32("tbs_5") totalBestScoreV2 = 0
    @XD.s32("tbgs_5") totalBestScoreEachChartTypeV2: number[] = [0, 0, 0, 0]
    @XD.str() name = ""
    @XD.s32("mg") matchingGrade = 0 // <mg />
    @XD.s32("ap") abilityPointTimes100 = 0 // <ap />
    @XD.s32() uattr = 0
    @XD.s32() money = 0
    @XD.bool("ts_tut") isTutorialEnabled = true // <is_tut />
    @XD.s32() class = Rb5ClasscheckIndex.none
    @XD.s32("class_ar") classAchievementRateTimes100 = 0 // <class_ar />
    @XD.s32("skill_point") skillPointTimes10 = 0 // <skill_point />
    @XD.s16() mlog: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
}

export class Rb5PlayerConfig implements ICollection<"rb.rb5.player.config"> {
    readonly collection = "rb.rb5.player.config"
    @XD.s16() iconId = 0
    @XD.u8() tabSel = 0
    @XD.u8() rivalPanelType = 0
    @XD.u8() folderLampType = 0

    @XD.u8("msel_bgm") musicSelectBgm = 0
    @XD.u8("narrowdown_type") narrowDownType = 39
    @XD.u8("musiclvdisp_type") musicLevelDisplayingType = 0
    @XD.s16("byword_0") bywordLeft = 0
    @XD.s16("byword_1") bywordRight = 1
    @XD.bool("is_auto_byword_0") isAutoBywordLeft = true
    @XD.bool("is_auto_byword_1") isAutoBywordRight = true
    @XD.s16("latestsymbolchat_id") latestSymbolChatId: number[] = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
    @XD.u8("mrec_type") memoryRecordingType = 2
    @XD.u8("card_disp") cardDisplay = 0
    @XD.u8("score_tab_disp") scoreTabDisplay = 0
    @XD.s16() lastMusicId = 0
    @XD.u8() lastNoteGrade = Rb4ChartType.basic // TODO: "lastChartType"
    @XD.s16() defaultMusicId = 0
    @XD.u8() defaultNoteGrade = Rb4ChartType.basic // TODO: "defaultChartType"
    @XD.u8() sortType = 0
    @XD.u64() randomEntryWork: bigint | DBBigInt = BigInt(Math.trunc(Math.random() * 99999999))
    @XD.u64() customFolderWork: bigint | DBBigInt = BigInt(Math.trunc(Math.random() * 9999999999999))
    @XD.u8() folderType = 0
    @XD.bool() isTweet = false
    @XD.bool("is_link_twitter") isTwitterLinked = false
}

export class Rb5PlayerCustom implements ICollection<"rb.rb5.player.custom"> {
    readonly collection = "rb.rb5.player.custom"
    @XD.u8("st_jr_gauge") stageMainGaugeType = 0
    @XD.u8() type = 0


    // Customization page 1
    @XD.u8("st_hazard") stageClearGaugeType = 0
    @XD.u8("st_clr_gauge") stageAchievementRateDisplayingType = 0
    @XD.u8("st_obj_size") stageObjectSize = 3
    @XD.u8("same_time_note_disp") stageSameTimeObjectsDisplayingType = 0 // VOLZZA 2

    // Customization page 2
    @XD.u8("st_shot") stageShotSound = 0
    @XD.u8("st_shot_vol") stageShotVolume = 100
    @XD.u8("st_expl") stageExplodeType = 0
    @XD.u8("st_frame") stageFrameType = 0
    @XD.u8("st_bg") stageBackground = 0
    @XD.u8("st_bg_bri") stageBackgroundBrightness = 100

    // Customization page 4
    @XD.u8("st_rivalnote_disp") stageRivalObjectsDisplayingType = 0 // VOLZZA 2
    @XD.u8("st_topassist_type") stageTopAssistDisplayingType = 0 // VOLZZA 2

    // Others
    @XD.u8("st_score_disp_type") stageScoreDisplayingType = 0 // VOLZZA 2
    @XD.u8("st_bonus_type") stageBonusType = 0 // VOLZZA 2
    @XD.u8("high_speed") stageHighSpeed = 0 // VOLZZA 2
    @XD.u8("st_rnd") stageColorRandom = 0
    @XD.u8("color_type") stageColorSpecified = 0
    @XD.u8("st_clr_cond") stageClearCondition = 0 // ?

    @XD.s16() voiceMessageSet = 0
    @XD.u8() voiceMessageVolume = 100
}

export class Rb5PlayerStageLog implements ICollection<"rb.rb5.playData.stageLog"> {
    readonly collection = "rb.rb5.playData.stageLog"
    @XD.s8("stg") stageIndex = 0
    @XD.s16("mid") musicId = 0
    @XD.s8("ng") chartType = Rb4ChartType.basic
    @XD.s8("col") color = RbColor.red
    @XD.s8() mt = 0
    @XD.s8() rt = 0
    @XD.s8("ct") clearType = Rb4ClearType.none // 1: played, 9: C, 10: HC, 11: S-HC
    @XD.s16() param = 0
    @XD.s16("grd") matchingGrade = 0
    @XD.s16("cl_gauge") clearGaugeTimes100 = 0
    @XD.s16("ar") achievementRateTimes100 = 0
    @XD.s16("sc") score = 0
    @XD.s16("jt_jst") justCount = 0
    @XD.s16("jt_grt") greatCount = 0
    @XD.s16("jt_gd") goodCount = 0
    @XD.s16("jt_ms") missCount = 0
    @XD.s16("jt_jr") justReflecCount = 0
    @XD.s32("r_uid") rivalUserId = 0
    @XD.s32("r_plyid") rivalPlayerId = 0
    @XD.s8("r_stg") rivalStageIndex = 0
    @XD.s8("r_ct") rivalClearType = Rb4ClearType.none
    @XD.s16("r_sc") rivalScore = 0
    @XD.s16("r_grd") rivalMatchingGrade = 0
    @XD.s16("r_cl_gauge") rivalClearGaugeTimes100 = 0
    @XD.s16("r_ar") rivalAchievementRateTimes100 = 0
    @XD.s8("r_cpuid") rivalCpuId = 0
    @XD.s32() time = 0
    @XD.s8() decide = 0
}

export class Rb5PlayerReleasedInfo implements ICollection<"rb.rb5.player.releasedInfo"> {
    readonly collection = "rb.rb5.player.releasedInfo"
    @XD.u8() type: number
    @XD.u16() id: number
    @XD.u16() param: number
    @XD.s32() insertTime: number
}

export class Rb5PlayerParameters implements ICollection<"rb.rb5.player.parameters"> {
    readonly collection = "rb.rb5.player.parameters"
    @XD.s32() type: number
    @XD.s32() bank: number
    @XD.s32() data: number[]
}

export class Rb5Minigame implements ICollection<"rb.rb5.playData.minigame"> {
    readonly collection = "rb.rb5.playData.minigame"
    @XD.s8("mgid") minigameId = 0
    @XD.s32() sc = 0
    @XD.s32("pc") playCount = 0
}

export class Rb5Derby implements ICollection<"rb.rb5.player.derby"> {
    readonly collection = "rb.rb5.player.derby"
    @XD.s32() value1 = 0
    @XD.s32() value2 = 0
}

export class Rb5BattleRoyale implements ICollection<"rb.rb5.playData.battleRoyale"> {
    readonly collection = "rb.rb5.playData.battleRoyale"
    @XD.s32() battleId = 0
    @XD.s32() phase = 0
    @XD.s32() border = 0
    @XD.s32() max = 0
    @XD.s32() remainDays = 999
}

export class Rb5MyCourseLog implements ICollection<"rb.rb5.playData.myCourse"> {
    readonly collection = "rb.rb5.playData.myCourse"
    @XD.s16("mycourse_id") courseId = -1
    @XD.s32() musicId1 = 0
    @XD.s32() musicId2 = 0
    @XD.s32() musicId3 = 0
    @XD.s32() musicId4 = 0
    @XD.s16("note_grade_1") chartType1 = Rb4ChartType.basic
    @XD.s16("note_grade_2") chartType2 = Rb4ChartType.basic
    @XD.s16("note_grade_3") chartType3 = Rb4ChartType.basic
    @XD.s16("note_grade_4") chartType4 = Rb4ChartType.basic
    @XD.s32() score1 = 0
    @XD.s32() score2 = 0
    @XD.s32() score3 = 0
    @XD.s32() score4 = 0
    @XD.s32("def_music_id_1") defaultMusicId1 = 0
    @XD.s32("def_music_id_2") defaultMusicId2 = 0
    @XD.s32("def_music_id_3") defaultMusicId3 = 0
    @XD.s32("def_music_id_4") defaultMusicId4 = 0
    @XD.s16("def_note_grade_1") defaultChartType1 = Rb4ChartType.basic
    @XD.s16("def_note_grade_2") defaultChartType2 = Rb4ChartType.basic
    @XD.s16("def_note_grade_3") defaultChartType3 = Rb4ChartType.basic
    @XD.s16("def_note_grade_4") defaultChartType4 = Rb4ChartType.basic
    @XD.s32() insertTime = Math.trunc(Date.now() / 1000)
}

class Rb5ChallengeEventCard {
    @XD.s32() setId = 0
}

class Rb5PlayerData {
    @XD.type(Rb5PlayerAccount) account: Rb5PlayerAccount
    @XD.type(Rb5PlayerBase) base = new Rb5PlayerBase()
    @XD.type(Rb5PlayerConfig) config = new Rb5PlayerConfig()
    @XD.type(Rb5PlayerCustom) custom = new Rb5PlayerCustom()
    @XD.obj({}) rival = {}
    @XD.obj({}) pickupRival = {}
    @XD.ToO.aw("stglog", "log", Rb5PlayerStageLog) stageLogs?: ArrayWrapper<"log", Rb5PlayerStageLog>
    @XD.ToX.aw("dojo", "rec", Rb5Classcheck) @XD.ToO.type("dojo", Rb5Classcheck) classcheck: ArrayWrapper<"rec", Rb5Classcheck> | Rb5Classcheck = {}
    @XD.aw("info", Rb5PlayerReleasedInfo) released: ArrayWrapper<"info", Rb5PlayerReleasedInfo> = {}
    @XD.obj({}) announce = {}
    @XD.aw("item", Rb5PlayerParameters) playerParam: ArrayWrapper<"item", Rb5PlayerParameters> = {}
    @XD.aw("list", Rb5Mylist) mylist: ArrayWrapper<"list", Rb5Mylist> = {}
    @XD.obj({}) musicRankPoint = {}
    @XD.obj({}) ghost = {}
    @XD.obj({}) ghostWinCount = {}
    @XD.obj({}) purpose = {}
    @XD.type(Rb5Minigame) minigame = new Rb5Minigame()
    @XD.obj({}) share = {}
    @XD.type(Rb5BattleRoyale) battleRoyale = new Rb5BattleRoyale()
    @XD.type(Rb5Derby) derby = new Rb5Derby()
    @XD.s32() yurukomeList: [number, number, number, number] = [0, 0, 0, 0] // ゆるゆるコメント -> special comments shown on result screen
    @XD.type("mycourse", Rb5MyCourseLog) myCourse = new Rb5MyCourseLog()
    @XD.type("mycourse_f", Rb5MyCourseLog) myCourseF = new Rb5MyCourseLog()
    @XD.type(Rb5ChallengeEventCard) challengeEventCard = new Rb5ChallengeEventCard()

    constructor(rid: string, userId: number = -1) {
        this.account = new Rb5PlayerAccount(rid, userId)
    }
}

export class Rb5Player {
    @XD.type(Rb5PlayerData) pdata: Rb5PlayerData

    constructor(rid: string = "", userId: number = -1) {
        this.pdata = new Rb5PlayerData(rid, userId)
    }
}