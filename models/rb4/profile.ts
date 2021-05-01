import { ICollection } from "../utility/definitions"
import { appendMappingElement, BigIntProxy, boolme, getCollectionMappingElement, KObjectMappingRecord, ignoreme, s16me, s32me, strme, u64me, u8me, u16me, s8me, s64me } from "../../utility/mapping"
import { IRb4ClasscheckRecord, Rb4ClasscheckRecordMappingRecord } from "./classcheck_record"
import { IRb4Mylist, Rb4MylistMap } from "./mylist"

export interface IRb4PlayerAccount extends ICollection<"rb.rb4.player.account"> {
    userId: number
    playerId: number
    playCountToday: number
    crd: number
    brd: number
    dayCount: number
    rid: string
    lid: string
    intrvld: number
    succeed: boolean
    pst: bigint | BigIntProxy
    wmode: number
    gmode: number
    version: number
    pp: boolean
    ps: boolean
    isContinue: boolean
    isFirstFree: boolean
    pay: number
    payPc: number
    st: bigint | BigIntProxy
    opc: number
    lpc: number
    cpc: number
    mpc: number
    debutVersion: number
    upperPoints: number
    upperOption: number
    playCount: number
}
export const Rb4PlayerAccountWriteMap: KObjectMappingRecord<IRb4PlayerAccount> = {
    collection: getCollectionMappingElement<IRb4PlayerAccount>("rb.rb4.player.account"),
    userId: s32me("usrid"),
    playerId: s32me("plyid"),
    playCountToday: s32me("dpc"),
    crd: s32me(),
    brd: s32me(),
    dayCount: s32me("tdc"),
    rid: strme(),
    lid: strme(),
    intrvld: ignoreme(),
    succeed: ignoreme(),
    pst: u64me(),
    wmode: u8me(),
    gmode: u8me(),
    version: s16me("ver"),
    pp: boolme(),
    ps: boolme(),
    isContinue: boolme("continue"),
    isFirstFree: boolme("firstfree"),
    pay: s16me(),
    payPc: s16me("pay_pc"),
    st: u64me(),
    opc: s32me(),
    lpc: s32me(),
    cpc: s32me(),
    mpc: s32me(),
    debutVersion: u8me("debutVer", (s) => s - 1, (t) => t + 1),
    upperPoints: s32me("upper_pt"),
    upperOption: s32me("upper_op"),
    playCount: s32me("tpc")
}
export const Rb4PlayerAccountReadMap: KObjectMappingRecord<IRb4PlayerAccount> = {
    collection: getCollectionMappingElement<IRb4PlayerAccount>("rb.rb4.player.account"),
    userId: s32me("usrid"),
    playerId: ignoreme(),
    playCountToday: s32me("dpc"),
    crd: s32me(),
    brd: s32me(),
    dayCount: s32me("tdc"),
    rid: ignoreme(),
    lid: ignoreme(),
    intrvld: s32me(),
    succeed: boolme(),
    pst: u64me(),
    wmode: ignoreme(),
    gmode: ignoreme(),
    version: s16me("ver"),
    pp: ignoreme(),
    ps: ignoreme(),
    isContinue: boolme("continue"),
    isFirstFree: boolme("firstfree"),
    pay: ignoreme(),
    payPc: ignoreme("pay_pc"),
    st: u64me(),
    opc: s32me(),
    lpc: s32me(),
    cpc: s32me(),
    mpc: s32me(),
    debutVersion: u8me("debutVer", (s) => s - 1, (t) => t + 1),
    upperPoints: s32me("upper_pt"),
    upperOption: s32me("upper_op"),
    playCount: s32me("tpc")
}
export function generateRb4PlayerAccount(rid: string, userId?: number, debutVersion?: number): IRb4PlayerAccount {
    return {
        collection: "rb.rb4.player.account",
        userId: (userId != null) ? userId : -1,
        playerId: 0,
        playCountToday: 0,
        crd: 1,
        brd: 1,
        dayCount: 0,
        rid: rid,
        lid: "ea",
        intrvld: 0,
        succeed: true,
        pst: BigInt(0),
        wmode: 1,
        gmode: 0,
        version: 0,
        pp: false,
        ps: false,
        isContinue: false,
        isFirstFree: false,
        pay: 0,
        payPc: 0,
        st: BigInt(Date.now()),
        opc: 0,
        lpc: 0,
        cpc: 0,
        mpc: 0,
        debutVersion: (debutVersion == null) ? 4 : debutVersion,
        upperPoints: 0,
        upperOption: -1,
        playCount: 0
    }
}

export interface IRb4PlayerBase extends ICollection<"rb.rb4.player.base"> {
    comment: string
    totalBestScore: number
    totalBestScoreRival: number
    totalBestScoreEachChartType: number[]
    totalBestScoreEachChartTypeRival: number[]
    totalBestScoreNewMusics: number
    totalBestScoreNewMusicsRival: number
    name: string
    matchingGrade: number
    abilityPointTimes100: number
    experience: number
    level: number
    uattr: number
    money: number
    isTutorialEnabled: boolean
    class: number
    classAchievrementRateTimes100: number
    upperPoints: number
    mlog: number[]
}
export const Rb4PlayerBaseMap: KObjectMappingRecord<IRb4PlayerBase> = {
    collection: getCollectionMappingElement<IRb4PlayerBase>("rb.rb4.player.base"),
    money: s32me(),
    comment: strme("cmnt"),
    totalBestScore: s32me("tbs"),
    totalBestScoreRival: s32me("tbs_r"),
    totalBestScoreEachChartType: s32me("tbgs"),
    totalBestScoreEachChartTypeRival: s32me("tbgs_r"),
    totalBestScoreNewMusics: s32me("tbms"),
    totalBestScoreNewMusicsRival: s32me("tbms_r"),
    name: strme(),
    matchingGrade: s32me("mg"),
    abilityPointTimes100: s32me("ap"),
    experience: s32me("exp"),
    level: s32me("lv"),
    uattr: s32me(),
    isTutorialEnabled: boolme("is_tut"),
    class: s32me(),
    classAchievrementRateTimes100: s32me("class_ar"),
    upperPoints: s32me("upper_pt"),
    mlog: s16me()
}
export function generateRb4PlayerBase(): IRb4PlayerBase {
    return {
        collection: "rb.rb4.player.base",
        money: 0,
        comment: "",
        totalBestScore: 0,
        totalBestScoreRival: 0,
        totalBestScoreEachChartType: [0, 0, 0, 0],
        totalBestScoreEachChartTypeRival: [0, 0, 0, 0],
        totalBestScoreNewMusics: 0,
        totalBestScoreNewMusicsRival: 0,
        name: "",
        matchingGrade: 0,
        abilityPointTimes100: 0,
        experience: 0,
        level: 0,
        uattr: 0,
        isTutorialEnabled: true,
        class: -1,
        classAchievrementRateTimes100: 0,
        upperPoints: 0,
        mlog: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }
}

export interface IRb4PlayerConfig extends ICollection<"rb.rb4.player.config"> {
    musicSelectBgm: number
    narrowDownType: number
    iconId: number
    bywordLeft: number // <byword_0 __type="s16" />
    bywordRight: number // <byword_1 __type="s16" />
    isAutoBywordLeft: boolean // <is_auto_byword_0 __type="bool" />
    isAutoBywordRight: boolean // <is_auto_byword_1 __type = "bool" />
    memoryRecordingType: number // <mrec_type __type="u8" />
    tabSel: number
    cardDisplay: number // <card_disp __type="u8" />
    scoreTabDisplay: number
    lastMusicId: number // "s16"
    lastChartType: number // "u8"
    sortType: number // "u8"
    rivalPanelType: number
    randomEntryWork: bigint | BigIntProxy
    customFolderWork: bigint | BigIntProxy
    folderType: number // "u8"
    folderLampType: number
    isTweet: boolean
    isTwitterLinked: boolean // <is_link_twitter __type="bool" />
}
export const Rb4PlayerConfigMap: KObjectMappingRecord<IRb4PlayerConfig> = {
    collection: getCollectionMappingElement<IRb4PlayerConfig>("rb.rb4.player.config"),
    iconId: s16me("icon_id"),
    tabSel: u8me("tab_sel"),
    rivalPanelType: u8me("rival_panel_type"),
    folderLampType: u8me("folder_lamp_type"),


    musicSelectBgm: u8me("msel_bgm"),
    narrowDownType: u8me("narrowdown_type"),
    bywordLeft: s16me("byword_0"),
    bywordRight: s16me("byword_1"),
    isAutoBywordLeft: boolme("is_auto_byword_0"),
    isAutoBywordRight: boolme("is_auto_byword_1"),
    memoryRecordingType: u8me("mrec_type"),
    cardDisplay: u8me("card_disp"),
    scoreTabDisplay: u8me("score_tab_disp"),
    lastMusicId: s16me("last_music_id"),
    lastChartType: u8me("last_note_grade"),
    sortType: u8me("sort_type"),
    randomEntryWork: u64me("random_entry_work"),
    customFolderWork: u64me("custom_folder_work"),
    folderType: u8me("folder_type"),
    isTweet: boolme("is_tweet"),
    isTwitterLinked: boolme("is_link_twitter")
}
export function generateRb4PlayerConfig(): IRb4PlayerConfig {
    return {
        collection: "rb.rb4.player.config",
        iconId: 0,
        tabSel: 0,
        rivalPanelType: 0,
        folderLampType: 0,

        // Second page of customization
        musicSelectBgm: 0,

        narrowDownType: 39,
        bywordLeft: 0,
        bywordRight: 1,
        isAutoBywordLeft: true,
        isAutoBywordRight: true,
        memoryRecordingType: 2,
        cardDisplay: 0,
        scoreTabDisplay: 0,
        lastMusicId: 0,
        lastChartType: 0,
        sortType: 0,
        randomEntryWork: BigInt(545477591039),
        customFolderWork: BigInt("18446744073709551615"),
        folderType: 0,
        isTweet: false,
        isTwitterLinked: false,
    }
}

export interface IRb4PlayerCustom extends ICollection<"rb.rb4.player.custom"> {
    stageMainGaugeType: number

    // First page of customization
    stageClearGaugeType: number
    stageAchievementRateDisplayingType: number
    stageObjectSize: number
    stageSameTimeObjectsDisplayingType: number

    // Second page of customization
    stageShotSound: number
    stageShotVolume: number
    stageExplodeType: number
    stageFrameType: number
    stageBackground: number
    stageBackgroundBrightness: number

    // Forth page of customization
    stageRivalObjectsDisplayingType: number
    stageJudgeDisplayingType: number
    stageTouchMarkerDisplayingType: number

    // Others
    stageScoreDisplayingType: number
    stageBonusType: number
    stageRandom: number
    stageClearCondition: number // ?

    chatStickersBeforeMatching: number[]
    chatStickersAfterMatching: number[]
    cheerVoice: number
}
export const Rb4PlayerCustomMap: KObjectMappingRecord<IRb4PlayerCustom> = {
    collection: getCollectionMappingElement<IRb4PlayerCustom>("rb.rb4.player.custom"),
    stageMainGaugeType: u8me("st_jr_gauge"),

    stageShotSound: u8me("st_shot"),
    stageFrameType: u8me("st_frame"),
    stageExplodeType: u8me("st_expl"),
    stageBackground: u8me("st_bg"),
    stageShotVolume: u8me("st_shot_vol"),
    stageBackgroundBrightness: u8me("st_bg_bri"),
    stageObjectSize: u8me("st_obj_size"),
    stageClearGaugeType: u8me("st_hazard"),
    stageRandom: u8me("st_rnd"),
    stageSameTimeObjectsDisplayingType: u8me("same_time_note_disp"),
    stageScoreDisplayingType: u8me("st_score_disp_type"),
    stageBonusType: u8me("st_bonus_type"),
    stageRivalObjectsDisplayingType: u8me("st_rivalnote_type"),
    stageJudgeDisplayingType: u8me("st_jdg_disp"),
    stageTouchMarkerDisplayingType: u8me("st_tm_disp"),
    stageAchievementRateDisplayingType: u8me("st_clr_gauge"),
    stageClearCondition: u8me("st_clr_cond"),
    chatStickersBeforeMatching: s16me("schat_0"),
    chatStickersAfterMatching: s16me("schat_1"),
    cheerVoice: u8me()
}
export function generateRb4PlayerCustom(): IRb4PlayerCustom {
    return {
        collection: "rb.rb4.player.custom",
        stageMainGaugeType: 0,

        stageClearGaugeType: 0,
        stageAchievementRateDisplayingType: 0,
        stageObjectSize: 3,
        stageSameTimeObjectsDisplayingType: 0,

        stageShotSound: 0,
        stageShotVolume: 100,
        stageExplodeType: 0,
        stageFrameType: 0,
        stageBackground: 0,
        stageBackgroundBrightness: 100,

        stageRivalObjectsDisplayingType: 0,
        stageJudgeDisplayingType: 0,

        stageScoreDisplayingType: 0,
        stageBonusType: 0,
        stageTouchMarkerDisplayingType: 0,
        stageRandom: 0,
        stageClearCondition: 0, // ?

        chatStickersBeforeMatching: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        chatStickersAfterMatching: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        cheerVoice: 0
    }
}

export interface IRb4PlayerStageLog extends ICollection<"rb.rb4.playData.stageLog"> {
    stageIndex: number
    musicId: number
    chartType: number
    color: number
    mt: number
    rt: number
    clearType: number // 1: played, 9: C, 10: HC, 11: S-HC
    clearTypeForClasscheck?: "Win" | "Draw" | "Lose"
    param: number
    matchingGrade: number
    clearGaugeTimes100: number
    achievementRateTimes100: number
    score: number
    justCount: number
    greatCount: number
    goodCount: number
    missCount: number
    justReflecCount: number
    rivalUserId: number
    rivalPlayerId: number
    rivalStageIndex: number
    rivalClearType: number
    rivalScore: number
    rivalMatchingGrade: number
    rivalClearGaugeTimes100: number
    rivalAchievementRateTimes100: number
    rivalCpuId: number // 21~23: Meijin, 26: World 1 Boss - Rose, 27: World 2 Boss - Merly, 28: World 3 Boss - Francis, 
    time: number
    decide: number
}
export const Rb4PlayerStageLogMap: KObjectMappingRecord<IRb4PlayerStageLog> = {
    collection: getCollectionMappingElement<IRb4PlayerStageLog>("rb.rb4.playData.stageLog"),
    stageIndex: s8me("stg"),
    musicId: s16me("mid"),
    chartType: s8me("ng"),
    color: s8me("col"),
    mt: s8me(),
    rt: s8me(),
    clearType: s8me("ct"),
    clearTypeForClasscheck: ignoreme(),
    param: s16me(),
    matchingGrade: s16me("grd"),
    clearGaugeTimes100: s16me("cl_gauge"),
    achievementRateTimes100: s16me("ar"),
    score: s16me("sc"),
    justCount: s16me("jt_jst"),
    greatCount: s16me("jt_grt"),
    goodCount: s16me("jt_gd"),
    missCount: s16me("jt_ms"),
    justReflecCount: s16me("jt_jr"),
    rivalUserId: s32me("r_uid"),
    rivalPlayerId: s32me("r_plyid"),
    rivalStageIndex: s8me("r_stg"),
    rivalClearType: s8me("r_ct"),
    rivalScore: s16me("r_sc"),
    rivalMatchingGrade: s16me("r_grd"),
    rivalClearGaugeTimes100: s16me("r_cl_gauge"),
    rivalAchievementRateTimes100: s16me("r_ar"),
    rivalCpuId: s8me("r_cpuid"),
    time: s32me(),
    decide: s8me()
}

export interface IRb4PlayerClasscheckLog {
    class: number
    clearType: number
    seperateAchievementRateTimes100: number[]
    seperateScore: number[]
    averageAchievementRateTimes100: number
    totalScore: number
    rank: number
}
export const Rb4PlayerClasscheckLogMap: KObjectMappingRecord<IRb4PlayerClasscheckLog> = {
    class: s32me(),
    clearType: s32me("clear_type"),
    seperateAchievementRateTimes100: s32me("s_ar"),
    seperateScore: s32me("s_score"),
    averageAchievementRateTimes100: s32me("t_ar"),
    totalScore: s32me("t_score"),
    rank: s32me("score_rank")
}

export interface IRb4PlayerReleasedInfo extends ICollection<"rb.rb4.player.releasedInfo"> {
    type: number
    id: number
    param: number
    insertTime: number
}
export const Rb4PlayerReleasedInfoMap: KObjectMappingRecord<IRb4PlayerReleasedInfo> = {
    collection: getCollectionMappingElement<IRb4PlayerReleasedInfo>("rb.rb4.player.releasedInfo"),
    type: u8me(),
    id: u16me(),
    param: u16me(),
    insertTime: s32me("insert_time")
}

export interface IRb4PlayerParameters extends ICollection<"rb.rb4.player.parameters"> {
    type: number
    bank: number
    data: number[]
}
export const Rb4PlayerParametersMap: KObjectMappingRecord<IRb4PlayerParameters> = {
    collection: getCollectionMappingElement<IRb4PlayerParameters>("rb.rb4.player.parameters"),
    type: s32me(),
    bank: s32me(),
    data: s32me()
}

export interface IRb4Quest extends ICollection<"rb.rb4.player.quest"> {
    eyeColor: number
    bodyColor: number
    item: number
    comment: string
}
export const Rb4QuestMap: KObjectMappingRecord<IRb4Quest> = {
    collection: getCollectionMappingElement<IRb4Quest>("rb.rb4.player.quest"),
    eyeColor: s16me("eye_color"),
    bodyColor: s16me("body_color"),
    item: s16me(),
    comment: strme()
}

export interface IRb4Stamp extends ICollection<"rb.rb4.player.stamp"> {
    stampCount: number[]
    area: bigint | BigIntProxy
    magic: bigint | BigIntProxy
    reserve: number
}
export const Rb4StampMap: KObjectMappingRecord<IRb4Stamp> = {
    collection: getCollectionMappingElement<IRb4Stamp>("rb.rb4.player.stamp"),
    stampCount: s32me("stmpcnt"),
    area: s64me(),
    magic: s64me("prfvst"),
    reserve: s32me()
}
export function generateRb4Stamp(): IRb4Stamp {
    return {
        collection: "rb.rb4.player.stamp",
        stampCount: [0, 0, 0, 0, 0, 0, 0, 0, 0],
        area: BigInt(7),
        magic: BigInt(Math.trunc(Math.random() * 99999999)),
        reserve: 0
    }
}

export interface IRb4Episode extends ICollection<"rb.rb4.player.episode#userId"> {
    userId: number
    type: number
    value0: number
    value1: number
    text: string
    time: number
}
export const Rb4EpisodeMap: KObjectMappingRecord<IRb4Episode> = {
    collection: getCollectionMappingElement<IRb4Episode>("rb.rb4.player.episode#userId"),
    userId: s32me("user_id"),
    type: u8me(),
    value0: u16me(),
    value1: u16me(),
    text: strme(),
    time: s32me()
}
export function generateRb4Episode(userId?: number): IRb4Episode {
    return {
        collection: "rb.rb4.player.episode#userId",
        userId: (userId == null) ? -1 : userId,
        type: 0,
        value0: 0,
        value1: 0,
        text: "",
        time: 0
    }
}

interface IRb4PlayerData {
    account: IRb4PlayerAccount
    base: IRb4PlayerBase
    config: IRb4PlayerConfig
    custom: IRb4PlayerCustom
    rival: {}
    stamp: IRb4Stamp
    pickupRival: {}
    stageLogs?: { log: IRb4PlayerStageLog[] }
    classcheck?: { rec: IRb4ClasscheckRecord[] } | IRb4PlayerClasscheckLog
    released: { info: IRb4PlayerReleasedInfo[] }
    announce: {}
    playerParam: { item: IRb4PlayerParameters[] }
    mylist: { list?: IRb4Mylist }
    musicRankPoint: {}
    ghost: {}
    ghostWinCount: {}
    purpose: {}
    share: {}
    episode: { info: IRb4Episode }
    quest: IRb4Quest
}
export interface IRb4Player {
    pdata: IRb4PlayerData
}
export const Rb4PlayerReadMap: KObjectMappingRecord<IRb4Player> = {
    pdata: {
        account: Rb4PlayerAccountReadMap,
        base: Rb4PlayerBaseMap,
        config: Rb4PlayerConfigMap,
        custom: Rb4PlayerCustomMap,
        classcheck: <KObjectMappingRecord<{ rec: IRb4ClasscheckRecord[]; }>>{
            rec: { 0: Rb4ClasscheckRecordMappingRecord },
            $targetKey: "dojo"
        },
        stageLogs: {
            log: { 0: Rb4PlayerStageLogMap },
            $targetKey: "kignore"
        },
        released: {
            info: { 0: Rb4PlayerReleasedInfoMap }
        },
        rival: {},
        stamp: Rb4StampMap,
        pickupRival: { $targetKey: "pickup_rival" },
        announce: {},
        playerParam: {
            item: { 0: Rb4PlayerParametersMap },
            $targetKey: "player_param"
        },
        mylist: { list: Rb4MylistMap },
        musicRankPoint: { $targetKey: "music_rank_point" },
        ghost: {},
        ghostWinCount: { $targetKey: "ghost_win_count" },
        purpose: {},
        share: {},
        episode: { info: Rb4EpisodeMap },
        quest: Rb4QuestMap
    }
}
export const Rb4PlayerWriteMap: KObjectMappingRecord<IRb4Player> = {
    pdata: {
        account: Rb4PlayerAccountWriteMap,
        base: Rb4PlayerBaseMap,
        config: Rb4PlayerConfigMap,
        custom: Rb4PlayerCustomMap,
        classcheck: appendMappingElement(Rb4PlayerClasscheckLogMap, { $targetKey: "dojo" }),
        stageLogs: {
            log: { 0: Rb4PlayerStageLogMap },
            $targetKey: "stglog"
        },
        released: {
            info: { 0: Rb4PlayerReleasedInfoMap }
        },
        rival: {},
        stamp: Rb4StampMap,
        pickupRival: { $targetKey: "pickup_rival" },
        announce: {},
        playerParam: {
            item: { 0: Rb4PlayerParametersMap },
            $targetKey: "player_param"
        },
        mylist: { list: Rb4MylistMap },
        musicRankPoint: { $targetKey: "music_rank_point" },
        ghost: {},
        ghostWinCount: { $targetKey: "ghost_win_count" },
        purpose: {},
        share: {},
        episode: { info: Rb4EpisodeMap },
        quest: Rb4QuestMap
    }
}

export function generateRb4Profile(rid: string, userId?: number, debutVersion?: number): IRb4Player {
    return {
        pdata: {
            account: generateRb4PlayerAccount(rid, userId, debutVersion),
            base: generateRb4PlayerBase(),
            config: generateRb4PlayerConfig(),
            custom: generateRb4PlayerCustom(),
            rival: {},
            stamp: generateRb4Stamp(),
            pickupRival: {},
            announce: {},
            playerParam: <any>{},
            mylist: {},
            released: <any>{},
            musicRankPoint: {},
            ghost: {},
            ghostWinCount: {},
            purpose: {},
            classcheck: <any>{},
            share: {},
            episode: { info: generateRb4Episode(userId) },
            quest: { collection: "rb.rb4.player.quest", eyeColor: 0, bodyColor: 0, item: 0, comment: "" }
        }
    }
}