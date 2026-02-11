import { DBBigInt, ICollection } from "../../utils/db/db_types"
import { ArrayWrapper } from "../../utils/types"
import { XD } from "../../utils/x"
import { Rb4ChartType, Rb4ClearType, RbColor } from "../shared/rb_types"
import { Rb4Classcheck } from "./classcheck"
import { Rb4Mylist } from "./mylist"

export class Rb4PlayerAccount implements ICollection<"rb.rb4.player.account"> {
    readonly collection = "rb.rb4.player.account"
    @XD.s32("usrid") userId: number
    @XD.ToO.s32("plyid") playerId = 0
    @XD.s32("tpc") playCount = 0
    @XD.s32("dpc") playCountToday = 0
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
    @XD.u64() st: bigint | DBBigInt = BigInt(0)
    @XD.s32() opc = 0
    @XD.s32() lpc = 0
    @XD.s32() cpc = 0
    @XD.s32() mpc = 0
    @XD.u8("debutVer", undefined, (s: number) => s - 1, t => t + 1) debutVersion: number
    @XD.s32("upper_pt") upperPoints = 0
    @XD.s32("upper_op") upperOption = -1

    constructor(rid: string, userId: number = -1, debutVersion: number = 4) {
        this.rid = rid
        this.userId = userId
        this.debutVersion = debutVersion
    }
}

export class Rb4PlayerBase implements ICollection<"rb.rb4.player.base"> {
    readonly collection = "rb.rb4.player.base"
    @XD.str("cmnt") comment = ""
    @XD.s32("tbs") totalBestScore = 0
    @XD.s32("tbs_r") totalBestScoreRival = 0
    @XD.s32("tbgs") totalBestScoreEachChartType = [0, 0, 0, 0]
    @XD.s32("tbgs_r") totalBestScoreEachChartTypeRival = [0, 0, 0, 0]
    @XD.s32("tbms") totalBestScoreNewMusics = 0
    @XD.s32("tbms_r") totalBestScoreNewMusicsRival = 0
    @XD.str() name = ""
    @XD.s32("mg") matchingGrade = 0
    @XD.s32("ap") abilityPointTimes100 = 0
    @XD.s32("exp") experience = 0
    @XD.s32("lv") level = 0
    @XD.s32() uattr = 0
    @XD.s32() money = 0
    @XD.s32("is_tut") isTutorialEnabled = true
    @XD.s32() class = -1
    @XD.s32("class_ar") classAchievementRateTimes100 = 0
    @XD.s32("upper_pt") upperPoints = 0
    @XD.s16() mlog = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
}

export class Rb4PlayerConfig implements ICollection<"rb.rb4.player.config"> {
    readonly collection = "rb.rb4.player.config"
    @XD.s16() iconId = 0
    @XD.u8() tabSel = 0
    @XD.u8() rivalPanelType = 0
    @XD.u8() folderLampType = 0
    @XD.u8("msel_bgm") musicSelectBgm = 0 // One item of customization page 2
    @XD.u8("narrowdown_type") narrowDownType = 39
    @XD.s16("byword_0") bywordLeft = 0
    @XD.s16("byword_1") bywordRight = 1
    @XD.bool("is_auto_byword_0") isAutoBywordLeft = true
    @XD.bool("is_auto_byword_1") isAutoBywordRight = true
    @XD.u8("mrec_type") memoryRecordingType = 2
    @XD.u8("card_disp") cardDisplay = 0
    @XD.u8("score_tab_disp") scoreTabDisplay = 0
    @XD.s16() lastMusicId = 0
    @XD.u8("last_note_grade") lastChartType = Rb4ChartType.basic
    @XD.u8() sortType = 0
    @XD.u64() randomEntryWork: bigint | DBBigInt = BigInt(Math.trunc(Math.random() * 99999999))
    @XD.u64() customFolderWork: bigint | DBBigInt = BigInt(Math.trunc(Math.random() * 9999999999999))
    @XD.u8() folderType = 0
    @XD.bool() isTweet = false
    @XD.bool("is_link_twitter") isTwitterLinked = false
}

export class Rb4PlayerCustom implements ICollection<"rb.rb4.player.custom"> {
    readonly collection = "rb.rb4.player.custom"
    @XD.u8("st_jr_gauge") stageMainGaugeType = 0

    // Customization page 1
    @XD.u8("st_hazard") stageClearGaugeType = 0
    @XD.u8("st_clr_gauge") stageAchievementRateDisplayingType = 0
    @XD.u8("st_obj_size") stageObjectSize = 3
    @XD.u8("same_time_note_disp") stageSameTimeObjectsDisplayingType = 0

    // Customization page 2
    @XD.u8("st_shot") stageShotSound = 0
    @XD.u8("st_shot_vol") stageShotVolume = 100
    @XD.u8("st_expl") stageExplodeType = 0
    @XD.u8("st_frame") stageFrameType = 0
    @XD.u8("st_bg") stageBackground = 0
    @XD.u8("st_bg_bri") stageBackgroundBrightness = 100

    // Customization page 4
    @XD.u8("st_rivalnote_type") stageRivalObjectsDisplayingType = 0
    @XD.u8("st_jdg_disp") stageJudgeDisplayingType = 0
    @XD.u8("st_tm_disp") stageTouchMarkerDisplayingType = 0

    // Others
    @XD.u8("st_score_disp_type") stageScoreDisplayingType = 0
    @XD.u8("st_bonus_type") stageBonusType = 0
    @XD.u8("st_rnd") stageRandom = 0
    @XD.u8("st_clr_cond") stageClearCondition = 0 // ?

    @XD.s16("schat_0") chatStickersBeforeMatching = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
    @XD.s16("schat_1") chatStickersAfterMatching = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
    @XD.u8("cheerVoice") cheerVoice = 0
}

export class Rb4PlayerStageLog implements ICollection<"rb.rb4.playData.stageLog"> {
    readonly collection = "rb.rb4.playData.stageLog"
    @XD.s8("stg") stageIndex = 0
    @XD.s16("mid") musicId = 0
    @XD.s8("ng") chartType = Rb4ChartType.basic
    @XD.s8("col") color = RbColor.red
    @XD.s8() mt = 0
    @XD.s8() rt = 0
    @XD.s8("ct") clearType = Rb4ClearType.none // 1: played, 9: C, 10: HC, 11: S-HC
    clearTypeForClasscheck?: "Win" | "Draw" | "Lose"
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

export class Rb4PlayerClasscheckLog {
    @XD.s32() class = 0
    @XD.s32() clearType = Rb4ClearType.none
    @XD.s32("s_ar") seperateAchievementRateTimes100: number[] = []
    @XD.s32("s_score") seperateScore: number[] = []
    @XD.s32("t_ar") averageAchievementRateTimes100 = 0
    @XD.s32("t_score") totalScore = 0
    @XD.s32("score_rank") rank = 0
}

export class Rb4PlayerReleasedInfo implements ICollection<"rb.rb4.player.releasedInfo"> {
    readonly collection = "rb.rb4.player.releasedInfo"
    @XD.u8() type = 0
    @XD.u16() id = 0
    @XD.u16() param = 0
    // @XD.s32() insertTime = 0 // TODO: check
}

export class Rb4PlayerParameters implements ICollection<"rb.rb4.player.parameters"> {
    readonly collection = "rb.rb4.player.parameters"
    @XD.s32() type = 0
    @XD.s32() bank = 0
    @XD.s32() data: number[] = []
}

export class Rb4Quest implements ICollection<"rb.rb4.player.quest"> {
    readonly collection = "rb.rb4.player.quest"
    @XD.s16() eyeColor = 0
    @XD.s16() bodyColor = 0
    @XD.s16() item = 0
    @XD.str() comment = ""
}

export class Rb4Stamp implements ICollection<"rb.rb4.player.stamp"> {
    readonly collection = "rb.rb4.player.stamp"
    @XD.s32("stmpcnt") stampCount = [0, 0, 0, 0, 0, 0, 0, 0, 0]
    @XD.s64() area: bigint | DBBigInt = BigInt(7)
    @XD.s64("prfvst") magic: bigint | DBBigInt = BigInt(Math.trunc(Math.random() * 99999999))
    // @XD.s32() reserve = 0 // TODO: check
}

export class Rb4Episode implements ICollection<"rb.rb4.player.episode#userId"> {
    readonly collection = "rb.rb4.player.episode#userId"
    @XD.s32() userId: number
    @XD.u8() type = 0
    @XD.u16("value0") value0 = 0
    @XD.u16("value1") value1 = 0
    @XD.str() text = ""
    @XD.s32() time = 0

    constructor(userId?: number) {
        this.userId = userId ?? -1
    }
}

class Rb4EpisodesPlayerData {
    @XD.aw("info", Rb4Episode) episode: ArrayWrapper<"info", Rb4Episode> = {}
    constructor(userId?: number) {
        this.episode.info = [new Rb4Episode(userId)]
    }
}

export class Rb4Episodes {
    @XD.type(Rb4EpisodesPlayerData) pdata = new Rb4EpisodesPlayerData()
}

class Rb4PlayerData {
    @XD.type(Rb4PlayerAccount) account: Rb4PlayerAccount
    @XD.type(Rb4PlayerBase) base = new Rb4PlayerBase()
    @XD.type(Rb4PlayerConfig) config = new Rb4PlayerConfig()
    @XD.type(Rb4PlayerCustom) custom = new Rb4PlayerCustom()
    @XD.obj({}) rival = {} // TODO
    @XD.type(Rb4Stamp) stamp = new Rb4Stamp()
    @XD.obj({}) pickupRival = {}
    @XD.ToO.aw("stglog", "log", Rb4PlayerStageLog) stageLogs?: ArrayWrapper<"log", Rb4PlayerStageLog>
    @XD.ToX.aw("dojo", "rec", Rb4Classcheck) @XD.ToO.type("dojo", Rb4Classcheck) classcheck?: ArrayWrapper<"rec", Rb4Classcheck> | Rb4Classcheck = {}
    @XD.aw("info", Rb4PlayerReleasedInfo) released: ArrayWrapper<"info", Rb4PlayerReleasedInfo> = {}
    @XD.obj({}) announce = {}
    @XD.aw("item", Rb4PlayerParameters) playerParam: ArrayWrapper<"item", Rb4PlayerParameters> = {}
    @XD.aw("list", Rb4Mylist) mylist: ArrayWrapper<"list", Rb4Mylist> = { list: [new Rb4Mylist()] }
    @XD.obj({}) musicRankPoint = {}
    @XD.obj({}) ghost = {}
    @XD.obj({}) ghostWinCount = {}
    @XD.obj({}) purpose = {}
    @XD.obj({}) share = {}
    @XD.aw("info", Rb4Episode) episode: ArrayWrapper<"info", Rb4Episode> = {}
    @XD.type(Rb4Quest) quest = new Rb4Quest()

    constructor(rid: string, userId: number = -1, debutVersion?: number) {
        this.account = new Rb4PlayerAccount(rid, userId, debutVersion)
    }
}
export class Rb4Player {
    @XD.type(Rb4PlayerData) pdata: Rb4PlayerData

    constructor(rid: string = "", userId: number = -1, debutVersion?: number) {
        this.pdata = new Rb4PlayerData(rid, userId, debutVersion)
    }
}
