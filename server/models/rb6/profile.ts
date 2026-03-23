import { DBBigInt, ICollection } from "../../utils/db/db_types"
import { ArrayWrapper } from "../../utils/types"
import { XD } from "../../utils/x"
import { Rb6ChartType, Rb6ClasscheckIndex, Rb6ClearType, RbColor, RbColorSpecification } from "../shared/rb_types"
import { Rb6CharacterCard } from "./character_card"
import { Rb6Classcheck } from "./classcheck"
import { Rb6Ghost, Rb6GhostWinCount } from "./ghost"
import { Rb6JustCollection } from "./just_collection"
import { Rb6Mylist } from "./mylist"

export class Rb6PlayerAccount implements ICollection<"rb.rb6.player.account"> {
    readonly collection = "rb.rb6.player.account"
    @XD.s32("usrid") userId: number
    @XD.ToO.s32("plyid") playerId = 0
    @XD.s32("dpc") playCountToday = 0
    @XD.s32("tpc") playCount = 0
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

export class Rb6PlayerBase implements ICollection<"rb.rb6.player.base"> {
    readonly collection = "rb.rb6.player.base"
    @XD.str("cmnt") comment = ""
    @XD.s32("tbs") totalBestScore = 0
    @XD.s32("tbgs") totalBestScoreEachChartType: number[] = [0, 0, 0, 0]
    @XD.str() name = ""
    @XD.s32("mg") matchingGrade = 0
    @XD.s32("ap") abilityPointTimes100 = 0
    @XD.s32() uattr = 0
    @XD.bool("is_tut") isTutorialEnabled = true
    @XD.s32() class = Rb6ClasscheckIndex.none
    @XD.s32("class_ar") classAchievementRateTimes100 = 0
    @XD.s32("skill_point") skillPointTimes10 = 0
    @XD.s32() pastelParts: [number, number, number, number] = [0, 0, 0, 0]
    @XD.s32("pastel_exp") pastelExperiences = 0
    @XD.s32("rankquestscore") rankQuestScore: number[] = [0, 0, 0]
    @XD.s32("rankquestrank") rankQuestRank: number[] = [0, 0, 0]
    @XD.s16("mlog") mLog: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    @XD.s32() ghostWinCount = 0
}

export class Rb6PlayerConfig implements ICollection<"rb.rb6.player.config"> {
    readonly collection = "rb.rb6.player.config"
    @XD.u8("msel_bgm") musicSelectBgm = 0
    @XD.u8("narrowdown_type") narrowDownType = 0
    @XD.u8("musiclvdisp_type") musicLevelDisplayingType = 0
    @XD.s16("characard_id") characterCardId = 0
    @XD.s16("byword_0") bywordLeft = 0
    @XD.s16("byword_1") bywordRight = 1
    @XD.bool("is_auto_byword_0") isAutoBywordLeft = true
    @XD.bool("is_auto_byword_1") isAutoBywordRight = true
    @XD.s16("latestsymbolchat_id") latestSymbolChatId: number[] = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
    @XD.u8("mrec_type") memoryRecordingType = 0
    @XD.u8("card_disp") cardDisplay = 0
    @XD.u8("score_tab_disp") scoreTabDisplay = 0
    @XD.s16() lastMusicId = 0
    @XD.u8("last_note_grade") lastNoteGrade = Rb6ChartType.basic // TODO: lastChartType
    @XD.s16() defaultMusicId = 0
    @XD.u8("default_note_grade") defaultNoteGrade = Rb6ChartType.basic // TODO: defaultChartType
    @XD.u8() sortType = 0
    @XD.u64() randomEntryWork: bigint | DBBigInt = BigInt(Math.trunc(Math.random() * 99999999))
    @XD.u64() customFolderWork: bigint | DBBigInt = BigInt(Math.trunc(Math.random() * 9999999999999))
    @XD.u8() folderType = 0
    @XD.bool() isTweet = false
    @XD.bool("is_link_twitter") isTwitterLinked = false
}

export class Rb6PlayerCustom implements ICollection<"rb.rb6.player.custom"> {
    readonly collection = "rb.rb6.player.custom"
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
    @XD.u8("st_bigbangeff_type") stageBigBangEffectPerformingType = 0
    @XD.u8("st_rivalnote_type") stageRivalObjectsDisplayingType = 0
    @XD.u8("st_topassist_type") stageTopAssistDisplayingType = 0
    @XD.u8("st_chatvolume_type") stageChatSoundSwitch = 0

    // Others
    @XD.u8("st_score_disp_type") stageScoreDisplayingType = 0
    @XD.u8("st_bonus_type") stageBonusType = 0
    @XD.u8("high_speed") stageHighSpeed = 0
    @XD.u8("st_rnd") stageRandom = 0
    @XD.u8("color_type") stageColorSpecified = RbColorSpecification.random
    @XD.u8("justcol_type") stageJustCollectionDisplayingType = 0
    @XD.u8("st_clr_cond") stageClearCondition = 0 // ?
}

export class Rb6PlayerStageLog implements ICollection<"rb.rb6.playData.stageLog"> {
    readonly collection = "rb.rb6.playData.stageLog"
    @XD.s8("stg") stageIndex: number
    @XD.s16("mid") musicId: number
    @XD.s8("ng") chartType: Rb6ChartType
    @XD.s8("col") color: RbColor
    @XD.s8() mt: number
    @XD.s8() rt: number
    @XD.s8("ct") clearType: Rb6ClearType // 1: played, 2: played (hard gauge), 3: cleared, 4: hard clear
    @XD.s16() param: number
    @XD.s16("grd") matchingGrade: number
    @XD.s16("cl_gauge") clearGaugeTimes100: number
    @XD.s16("ar") achievementRateTimes100: number
    @XD.s16("sc") score: number
    @XD.s16() combo: number
    @XD.s16("jt_jst") justCount: number
    @XD.s16("jt_grt") greatCount: number
    @XD.s16("jt_gd") goodCount: number
    @XD.s16("jt_keep") keepCount: number
    @XD.s16("jt_ms") missCount: number
    @XD.s16("jt_jr") justReflecCount: number
    @XD.s16("justcoll") justCollectionRateTimes100: number
    @XD.s32("r_uid") rivalUserId: number
    @XD.s32("r_plyid") rivalPlayerId: number
    @XD.s8("r_stg") rivalStageIndex: number
    @XD.s8("r_ct") rivalClearType: Rb6ClearType
    @XD.s16("r_sc") rivalScore: number
    @XD.s16("r_grd") rivalMatchingGrade: number
    @XD.s16("r_cl_gauge") rivalClearGaugeTimes100: number
    @XD.s16("r_ar") rivalAchievementRateTimes100: number
    @XD.s8("r_cpuid") rivalCpuId: number
    @XD.s32() time: number
    @XD.s8() decide: number
}

export class Rb6PlayerReleasedInfo implements ICollection<"rb.rb6.player.releasedInfo"> {
    readonly collection = "rb.rb6.player.releasedInfo"
    @XD.u8() type: number
    @XD.u16() id: number
    @XD.u16() param: number
    @XD.s32() insertTime: number
}

export class Rb6PlayerParameters implements ICollection<"rb.rb6.player.parameters"> {
    readonly collection = "rb.rb6.player.parameters"
    @XD.s32() type: number
    @XD.s32() bank: number
    @XD.s32() data: number[]
}

export class Rb6QuestRecord implements ICollection<"rb.rb6.playData.quest"> {
    readonly collection = "rb.rb6.playData.quest"
    @XD.s32() dungeonId: number
    @XD.s8() dungeonGrade: number
    rankingId: number
    @XD.s32("clear_num") clearCount: number
    @XD.s32("play_num") playCount: number
    @XD.bool("clear_flg") isCleared: boolean
    score?: number
    lastPlayTime: number
    updateTime: number
}

class Rb6PlayerData {
    @XD.type(Rb6PlayerAccount) account: Rb6PlayerAccount
    @XD.type(Rb6PlayerBase) base = new Rb6PlayerBase()
    @XD.type(Rb6PlayerConfig) config = new Rb6PlayerConfig()
    @XD.type(Rb6PlayerCustom) custom = new Rb6PlayerCustom()
    @XD.obj({}) rival = {}
    @XD.obj({}) pickupRival = {}
    @XD.ToO.aw("stglog", "log", Rb6PlayerStageLog) stageLogs: ArrayWrapper<"log", Rb6PlayerStageLog> = {}
    @XD.ToO.aw("justcollection", "list", Rb6JustCollection) justCollections: ArrayWrapper<"list", Rb6JustCollection> = {}
    @XD.ToX.aw("dojo", "rec", Rb6Classcheck) @XD.ToO.type("dojo", Rb6Classcheck) classcheck: ArrayWrapper<"rec", Rb6Classcheck> | Rb6Classcheck = {}
    @XD.aw("chara_card", "list", Rb6CharacterCard) characterCards: ArrayWrapper<"list", Rb6CharacterCard> = {}
    @XD.aw("info", Rb6PlayerReleasedInfo) released: ArrayWrapper<"info", Rb6PlayerReleasedInfo> = {}
    @XD.obj({}) announce = {}
    @XD.aw("item", Rb6PlayerParameters) playerParam: ArrayWrapper<"item", Rb6PlayerParameters> = {}
    @XD.aw("list", Rb6Mylist) mylist: ArrayWrapper<"list", Rb6Mylist> = { list: [new Rb6Mylist()] }
    @XD.obj({}) musicRankPoint = {}
    @XD.aw("list", Rb6QuestRecord) quest: ArrayWrapper<"list", Rb6QuestRecord> = {}
    @XD.aw("list", Rb6Ghost) ghost: ArrayWrapper<"list", Rb6Ghost> = {}
    @XD.type(Rb6GhostWinCount) ghostWinCount = new Rb6GhostWinCount()
    @XD.obj({}) purpose = {}

    constructor(rid: string, userId: number = -1) {
        this.account = new Rb6PlayerAccount(rid, userId)
    }
}
export class Rb6Player {
    @XD.type(Rb6PlayerData) pdata: Rb6PlayerData

    constructor(rid: string, userId: number = -1) {
        this.pdata = new Rb6PlayerData(rid, userId)
    }
}