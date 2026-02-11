import { XD } from "../../utils/x"
import { DBBigInt, ICollection } from "../../utils/db/db_types"
import { Rb3Mylist } from "./mylist"
import { Rb3MusicOldRecord, Rb3MusicRecord } from "./music_record"
import { Rb2LincleLink } from "../rb2/profile"
import { ArrayWrapper } from "../../utils/types"
import { Rb1ChartType, Rb3ClearType, RbColor } from "../shared/rb_types"

export class Rb3PlayerAccount implements ICollection<"rb.rb3.player.account"> {
    readonly collection = "rb.rb3.player.account"
    @XD.s32("usrid") userId: number
    @XD.ToO.s32("plyid") playerId = 0
    @XD.s32("dpc") playCountToday?: number = 0
    @XD.s32() crd = 1
    @XD.s32() brd = 1
    @XD.s32("tdc") dayCount?: number = 0
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
    @XD.u64() st: bigint | DBBigInt = BigInt(Date.now() + "000")
    @XD.s32() opc = 0
    @XD.s32() lpc = 0
    @XD.s32() cpc = 0
    @XD.s32() mpc = 0
    @XD.s32("tpc") playCount = 0

    constructor(rid: string = "", userId: number = 0) {
        this.rid = rid
        this.userId = userId
    }
}

export class Rb3PlayerBase implements ICollection<"rb.rb3.player.base"> {
    readonly collection = "rb.rb3.player.base"
    @XD.str("cmnt") comment = ""
    @XD.s32("tid") teamId = -1
    @XD.s32("tname") teamName = "Asphyxia"
    @XD.s32("tbs") totalBestScore = 0
    @XD.s32("tbs_r") totalBestScoreRival = 0
    @XD.str() name = ""
    @XD.s32("mg") matchingGrade = 0
    @XD.s32("ap") abilityPointTimes100 = 0
    @XD.s32("exp") onigiriTimes10 = 0
    @XD.s32("lv") level = 0
    @XD.s32() hiddenParam = new Array(50).fill(0)
    @XD.bool("is_tut") isTutorialEnabled = true
    @XD.s32() uattr = 0
}

export class Rb3PlayerConfig implements ICollection<"rb.rb3.player.config"> {
    readonly collection = "rb.rb3.player.config"
    @XD.u8("tab_sel") tabSelected = 0
    @XD.u8() rivalPanelType = 0
    @XD.u8() folderLampType = 0

    @XD.u8("msel_bgm") musicSelectBgm = 0
    @XD.u8("narrowdown_type") narrowDownType = 39
    // Second page of customization
    @XD.s16() iconId = 0
    @XD.s16("byword_0") bywordLeft = 0
    @XD.s16("byword_1") bywordRight = 1
    @XD.bool("is_auto_byword_0") isAutoBywordLeft = true
    @XD.bool("is_auto_byword_1") isAutoBywordRight = true

    @XD.u8("mrec_type") memoryRecordingType = 2
    @XD.u8("card_disp") cardDisplay = 0
    @XD.u8("score_tab_disp") scoreTabDisplay = 0
    @XD.s16() lastMusicId = 0
    @XD.u8("last_note_grade") lastChartType = Rb1ChartType.basic
    @XD.u8() sortType = 0
    @XD.u64() randomEntryWork: bigint | DBBigInt = BigInt(Math.trunc(Math.random() * 99999999))
    @XD.u64() customFolderWork: bigint | DBBigInt = BigInt(Math.trunc(Math.random() * 9999999999999))
    @XD.u8("folder_lamp_type") folderType = 0
    @XD.bool() isTweet = false
    @XD.bool("is_link_twitter") isTwitterLinked = false
}

export class Rb3PlayerCustom implements ICollection<"rb.rb3.player.custom"> {
    readonly collection = "rb.rb3.player.custom"
    // First page of customization
    @XD.u8("st_shot") stageShotSound = 0
    @XD.u8("st_shot_vol") stageShotVolume = 100
    @XD.u8("st_expl") stageExplodeType = 0
    @XD.u8("st_frame") stageFrameType = 0
    @XD.u8("st_bg") stageBackground = 0
    @XD.u8("st_bg_bri") stageBackgroundBrightness = 100
    @XD.u8("st_obj_size") stageObjectSize = 0

    // Third page of customization
    @XD.s16("schat_0") simpleChatSetBeforeMatching = [0, 1, 2, 3, 4, 5, 6, 7, 8]
    @XD.s16("schat_1") simpleChatSetAfterMatching = [9, 10, 11, 12, 13, 14, 15, 16, 17]
    @XD.s16("ichat_0") iconChatSetBeforeMatching = [0, 1, 2, 3, -1, -1]
    @XD.s16("ichat_1") iconChatSetAfterMatching = [0, 1, 2, 3, -1, -1]

    // Forth page of customization
    @XD.u8("st_jr_gauge") stageMainGaugeType = 0
    @XD.u8("st_clr_gauge") stageClearGaugeType = 0
    @XD.u8("st_jdg_disp") stageJudgeDisplayingType = 0
    @XD.u8("st_tm_disp") stageTouchMarkerDisplayingType = 0
    stageRandom = 0 // ?
}

export class Rb3PlayerStageLog implements ICollection<"rb.rb3.playData.stageLog"> {
    readonly collection = "rb.rb3.playData.stageLog"
    @XD.s8("stg") stageIndex = 0
    @XD.s16("mid") musicId = 0
    @XD.s8("ng") chartType: Rb1ChartType
    @XD.s8("col") color = RbColor.red
    @XD.s8() mt = 0
    @XD.s8() rt = 0
    @XD.s8("ct") clearType = Rb3ClearType.none
    @XD.s16("grd") matchingGrade = 0
    @XD.s16("cl_gauge") clearGaugeTimes100 = 0
    @XD.s16("ar") achievementRateTimes100 = 0
    @XD.s16("sc") score = 0
    @XD.s16("cmb") combo = 0
    @XD.s16("exp") experience = 0
    @XD.s16("jt_jst") justCount = 0
    @XD.s16("jt_grt") greatCount = 0
    @XD.s16("jt_gd") goodCount = 0
    @XD.s16("jt_ms") missCount = 0
    @XD.s16("jt_jr") justReflecCount = 0
    @XD.s32("r_uid") rivalUserId = 0
    @XD.s32("r_plyid") rivalPlayerId = 0
    @XD.s8("r_stg") rivalStageIndex = 0
    @XD.s8("r_ct") rivalClearType = Rb3ClearType.none
    @XD.s16("r_sc") rivalScore = 0
    @XD.s16("r_grd") rivalMatchingGrade = 0
    @XD.s16("r_cl_gauge") rivalClearGaugeTimes100 = 0
    @XD.s16("r_ar") rivalAchievementRateTimes100 = 0
    @XD.s16("r_cpuid") rivalCpuId = 0
    @XD.s32() time = 0
    @XD.s8() decide = 0
}

export class Rb3EventProgress implements ICollection<"rb.rb3.player.event.eventProgress"> {
    readonly collection = "rb.rb3.player.event.eventProgress"
    @XD.s16("id") index: number
    @XD.s32("exp") experience: number
}

export class Rb3Equip implements ICollection<"rb.rb3.player.equip"> {
    readonly collection = "rb.rb3.player.equip"
    @XD.s16("id") index: number
    @XD.s32("exp") experience: number
    @XD.s16() stype?: number
}

export class Rb3SeedPod implements ICollection<"rb.rb3.player.event.seedPod"> {
    readonly collection = "rb.rb3.player.event.seedPod"
    @XD.s16("id") index: number
    @XD.s16() pod: number
}

export class Rb3OrderDetails {
    @XD.s16("order") index: number
    @XD.s16("slt") slot: number
    @XD.s32("ccnt") clearedCount: number
    @XD.s32("fcnt") fragmentsCount0: number
    @XD.s32("fcnt1") fragmentsCount1: number
    @XD.s32("prm") param: number
}
export class Rb3Order implements ICollection<"rb.rb3.player.order"> {
    readonly collection = "rb.rb3.player.order"
    @XD.s32("exp") experience: number
    @XD.a(Rb3OrderDetails, "d") details?: Rb3OrderDetails[]
}

export class Rb3PlayerReleasedInfo implements ICollection<"rb.rb3.player.releasedInfo"> {
    readonly collection = "rb.rb3.player.releasedInfo"
    @XD.u8() type: number
    @XD.u16() id: number
    @XD.u16() param: number
    @XD.s32() insertTime: number
}

export class Rb3Stamp implements ICollection<"rb.rb3.player.stamp"> {
    readonly collection = "rb.rb3.player.stamp"
    @XD.s32("stmpcnt") stampCount = [0, 0, 0, 0, 0]
    @XD.s32("tcktcnt") ticketCount = [0, 0, 0, 0, 0]
    @XD.s64() area: bigint | DBBigInt = BigInt(7)
    @XD.s64() magic: bigint | DBBigInt = BigInt(Math.trunc(Math.random() * 99999999))
    @XD.s32() reserve = 0
}

export class Rb3TricolettePark implements ICollection<"rb.rb3.player.tricolettePark"> {
    readonly collection = "rb.rb3.player.tricolettePark"
    @XD.s32() openMusic = 0
    @XD.s32() boss0Damage = 0
    @XD.s32() boss1Damage = 0
    @XD.s32() boss2Damage = 0
    @XD.s32() boss3Damage = 0
    @XD.s32() boss0Stun = 0
    @XD.s32() boss1Stun = 0
    @XD.s32() boss2Stun = 0
    @XD.s32() boss3Stun = 0
    @XD.s32() magicGauge = 0
    @XD.s32("today_party") todaysParty = 0
    @XD.bool("use_union_magic") isUseUnionMagic = false
}

class Rb3PlayerData {
    @XD.type(Rb3PlayerAccount) account: Rb3PlayerAccount
    @XD.type(Rb3PlayerBase) base = new Rb3PlayerBase()
    @XD.type(Rb3PlayerConfig) config = new Rb3PlayerConfig()
    @XD.type(Rb3PlayerCustom) custom = new Rb3PlayerCustom()
    @XD.obj({}) rival = {}
    @XD.type("lincle_link_4", Rb2LincleLink) lincleLink = new Rb2LincleLink()
    @XD.type("tricolette_park", Rb3TricolettePark) tricolettePark = new Rb3TricolettePark()
    @XD.type(Rb3Stamp) stamp = new Rb3Stamp()
    @XD.aw("evntexp", "data", Rb3EventProgress) eventProgress: { data?: Rb3EventProgress[] } = {}
    @XD.aw("eqpexp", "data", Rb3Equip) equip: { data?: Rb3Equip[] } = {}
    @XD.aw("seedpod", "data", Rb3SeedPod) seedPod: { data?: Rb3SeedPod[] } = {}
    @XD.type(Rb3Order) order = new Rb3Order()
    @XD.ToX.aw("rec", Rb3MusicRecord) record?: ArrayWrapper<"rec", Rb3MusicRecord> = {}
    @XD.ToX.aw("rec", Rb3MusicOldRecord) recordOld?: ArrayWrapper<"rec", Rb3MusicOldRecord> = {}
    @XD.ToO.aw("stglog", "log", Rb3PlayerStageLog) stageLogs?: ArrayWrapper<"log", Rb3PlayerStageLog> = {}
    @XD.aw("info", Rb3PlayerReleasedInfo) released: ArrayWrapper<"info", Rb3PlayerReleasedInfo> = {}
    @XD.obj({}) announce = {}
    @XD.type("fav_music_slot", Rb3Mylist) mylist = new Rb3Mylist()
    @XD.obj({}) musicRankPoint = {}
    @XD.obj({}) ghost = {}
    @XD.obj({}) ghostWinCount = {}
    @XD.obj({}) purpose = {}
    @XD.obj({}) share = {}

    constructor(rid: string = "", userId: number = -1) {
        this.account = new Rb3PlayerAccount(rid, userId)
    }
}
export class Rb3Player {
    @XD.type(Rb3PlayerData) pdata: Rb3PlayerData

    constructor(rid: string = "", userId: number = -1) {
        this.pdata = new Rb3PlayerData(rid, userId)
    }
}
