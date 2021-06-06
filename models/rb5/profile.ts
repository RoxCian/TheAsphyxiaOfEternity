import { ICollection } from "../utility/definitions"
import { appendMappingElement, boolme, getCollectionMappingElement, ignoreme, KObjectMappingRecord, BigIntProxy, s16me, s32me, s8me, strme, u16me, u64me, u8me } from "../../utility/mapping"
import { IRb5ClasscheckRecord, Rb5ClasscheckRecordMappingRecord } from "./classcheck_record"
import { IRb5Mylist, Rb5MylistMap } from "./mylist"

let noNull = (source) => (source == null) ? 0 : source

export interface IRb5PlayerAccount extends ICollection<"rb.rb5.player.account"> {
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
    playCount: number
}
export const Rb5PlayerAccountWriteMap: KObjectMappingRecord<IRb5PlayerAccount> = {
    collection: getCollectionMappingElement<IRb5PlayerAccount>("rb.rb5.player.account"),
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
    playCount: { $type: "kignore", $fallbackValue: 0 }
}
export const Rb5PlayerAccountReadMap: KObjectMappingRecord<IRb5PlayerAccount> = {
    collection: getCollectionMappingElement<IRb5PlayerAccount>("rb.rb5.player.account"),
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
    playCount: s32me("tpc")
}
export function generateRb5PlayerAccount(rid: string, userId?: number): IRb5PlayerAccount {
    return {
        collection: "rb.rb5.player.account",
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
        playCount: 0
    }
}

export interface IRb5PlayerBase extends ICollection<"rb.rb5.player.base"> {
    comment: string
    totalBestScore: number
    totalBestScoreEachChartType: number[]
    totalBestScoreV2: number
    totalBestScoreEachChartTypeV2: number[]
    name: string
    matchingGrade: number // <mg />
    abilityPointTimes100: number // <ap />
    uattr: number
    money: number
    isTutorialEnabled: boolean // <is_tut />
    class: number
    classAchievrementRateTimes100: number // <class_ar />
    skillPointTimes10: number // <skill_point />
    mlog: number[]
}
export const Rb5PlayerBaseMap: KObjectMappingRecord<IRb5PlayerBase> = {
    collection: getCollectionMappingElement<IRb5PlayerBase>("rb.rb5.player.base"),
    money: s32me(),
    comment: strme("cmnt"),
    totalBestScore: s32me("tbs"),
    totalBestScoreEachChartType: s32me("tbgs"),
    totalBestScoreV2: s32me("tbs_5"),
    totalBestScoreEachChartTypeV2: s32me("tbgs_5"),
    name: strme(),
    matchingGrade: s32me("mg"),
    abilityPointTimes100: s32me("ap"),
    uattr: s32me(),
    isTutorialEnabled: boolme("is_tut"),
    class: s32me(),
    classAchievrementRateTimes100: s32me("class_ar"),
    skillPointTimes10: s32me("skill_point", noNull),
    mlog: s16me()
}
export function generateRb5PlayerBase(): IRb5PlayerBase {
    return {
        collection: "rb.rb5.player.base",
        money: 0,
        comment: "",
        totalBestScore: 0,
        totalBestScoreEachChartType: [0, 0, 0, 0],
        totalBestScoreV2: 0,
        totalBestScoreEachChartTypeV2: [0, 0, 0, 0],
        name: "",
        matchingGrade: 0,
        abilityPointTimes100: 0,
        uattr: 0,
        isTutorialEnabled: true,
        class: -1,
        classAchievrementRateTimes100: 0,
        skillPointTimes10: 0,
        mlog: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }
}

export interface IRb5PlayerConfig extends ICollection<"rb.rb5.player.config"> {
    iconId: number
    tabSel: number
    rivalPanelType: number
    folderLampType: number

    musicSelectBgm: number // <msel_bgm __type="u8" />
    narrowDownType: number // "u8"
    musicLevelDisplayingType: number // <musiclvdisp_type __type="u8" />
    bywordLeft: number // <byword_0 __type="s16" />
    bywordRight: number // <byword_1 __type="s16" />
    isAutoBywordLeft: boolean // <is_auto_byword_0 __type="bool" />
    isAutoBywordRight: boolean // <is_auto_byword_1 __type = "bool" />
    latestSymbolChatId: number[] // "s16"
    memoryRecordingType: number // <mrec_type __type="u8" />
    cardDisplay: number // <card_disp __type="u8" />
    scoreTabDisplay: number
    lastMusicId: number // "s16"
    lastNoteGrade: number // "u8"
    defaultMusicId: number // "s16"
    defaultNoteGrade: number // "u8"
    sortType: number // "u8"
    randomEntryWork: bigint | BigIntProxy
    customFolderWork: bigint | BigIntProxy
    folderType: number // "u8"
    isTweet: boolean
    isTwitterLinked: boolean // <is_link_twitter __type="bool" />
}
export const Rb5PlayerConfigMap: KObjectMappingRecord<IRb5PlayerConfig> = {
    collection: getCollectionMappingElement<IRb5PlayerConfig>("rb.rb5.player.config"),
    iconId: s16me("icon_id"),
    tabSel: u8me("tab_sel"),
    rivalPanelType: u8me("rival_panel_type"),
    folderLampType: u8me("folder_lamp_type"),


    musicSelectBgm: u8me("msel_bgm"),
    narrowDownType: u8me("narrowdown_type"),
    musicLevelDisplayingType: u8me("musiclvdisp_type"),
    bywordLeft: s16me("byword_0"),
    bywordRight: s16me("byword_1"),
    isAutoBywordLeft: boolme("is_auto_byword_0"),
    isAutoBywordRight: boolme("is_auto_byword_1"),
    latestSymbolChatId: s16me("latestsymbolchat_id"),
    memoryRecordingType: u8me("mrec_type"),
    cardDisplay: u8me("card_disp"),
    scoreTabDisplay: u8me("score_tab_disp"),
    lastMusicId: s16me("last_music_id"),
    lastNoteGrade: u8me("last_note_grade"),
    defaultMusicId: s16me("default_music_id"),
    defaultNoteGrade: u8me("default_note_grade"),
    sortType: u8me("sort_type"),
    randomEntryWork: u64me("random_entry_work"),
    customFolderWork: u64me("custom_folder_work"),
    folderType: u8me("folder_type"),
    isTweet: boolme("is_tweet"),
    isTwitterLinked: boolme("is_link_twitter")
}
export function generateRb5PlayerConfig(): IRb5PlayerConfig {
    return {
        collection: "rb.rb5.player.config",
        iconId: 0,
        tabSel: 0,
        rivalPanelType: 0,
        folderLampType: 0,

        // Second page of customization
        musicSelectBgm: 0,

        narrowDownType: 39,
        musicLevelDisplayingType: 0,
        bywordLeft: 0,
        bywordRight: 1,
        isAutoBywordLeft: true,
        isAutoBywordRight: true,
        latestSymbolChatId: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        memoryRecordingType: 2,
        cardDisplay: 0,
        scoreTabDisplay: 0,
        lastMusicId: 0,
        lastNoteGrade: 0,
        defaultMusicId: 0,
        defaultNoteGrade: 0,
        sortType: 0,
        randomEntryWork: BigInt(545477591039),
        customFolderWork: BigInt("18446744073709551615"),
        folderType: 0,
        isTweet: false,
        isTwitterLinked: false,
    }
}

export interface IRb5PlayerCustom extends ICollection<"rb.rb5.player.custom"> {
    stageMainGaugeType: number
    type: number


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
    stageTopAssistDisplayingType: number

    // Others
    stageScoreDisplayingType: number
    stageBonusType: number
    stageHighSpeed: number
    stageColorRandom: number
    stageColorSpecified: number
    stageClearCondition: number // ?

    voiceMessageSet: number
    voiceMessageVolume: number
}
export const Rb5PlayerCustomMap: KObjectMappingRecord<IRb5PlayerCustom> = {
    collection: getCollectionMappingElement<IRb5PlayerCustom>("rb.rb5.player.custom"),
    stageMainGaugeType: u8me("st_jr_gauge"),
    type: u8me(),

    stageShotSound: u8me("st_shot"),
    stageFrameType: u8me("st_frame"),
    stageExplodeType: u8me("st_expl"),
    stageBackground: u8me("st_bg"),
    stageShotVolume: u8me("st_shot_vol"),
    stageBackgroundBrightness: u8me("st_bg_bri"),
    stageObjectSize: u8me("st_obj_size"),
    stageClearGaugeType: u8me("st_hazard"),
    stageColorRandom: u8me("st_rnd"),
    stageSameTimeObjectsDisplayingType: u8me("same_time_note_disp", noNull), // VOLZZA 2
    stageScoreDisplayingType: u8me("st_score_disp_type", noNull), // VOLZZA 2
    stageBonusType: u8me("st_bonus_type", noNull), // VOLZZA 2
    stageRivalObjectsDisplayingType: u8me("st_rivalnote_type", noNull), // VOLZZA 2
    stageTopAssistDisplayingType: u8me("st_topassist_type", noNull), // VOLZZA 2
    stageHighSpeed: u8me("high_speed", noNull), // VOLZZA 2
    stageColorSpecified: u8me("color_type"),
    stageAchievementRateDisplayingType: u8me("st_clr_gauge"),
    stageClearCondition: u8me("st_clr_cond"),
    voiceMessageSet: s16me("voice_message_set"),
    voiceMessageVolume: u8me("voice_message_volume")
}
export function generateRb5PlayerCustom(): IRb5PlayerCustom {
    return {
        collection: "rb.rb5.player.custom",
        stageMainGaugeType: 0,
        type: 0,

        // First page of customization
        stageClearGaugeType: 0,
        stageAchievementRateDisplayingType: 0,
        stageObjectSize: 3,
        stageSameTimeObjectsDisplayingType: 0,
        voiceMessageSet: 0,
        voiceMessageVolume: 100,

        // Second page of customization
        stageShotSound: 0,
        stageShotVolume: 100,
        stageExplodeType: 0,
        stageFrameType: 0,
        stageBackground: 0,
        stageBackgroundBrightness: 100,

        // Forth page of customization
        stageRivalObjectsDisplayingType: 0,
        stageTopAssistDisplayingType: 0,

        // Others
        stageScoreDisplayingType: 0,
        stageBonusType: 0,
        stageHighSpeed: 0,
        stageColorRandom: 0,
        stageColorSpecified: 0,
        stageClearCondition: 0 // ?
    }
}

export interface IRb5PlayerStageLog extends ICollection<"rb.rb5.playData.stageLog"> {
    stageIndex: number
    musicId: number
    chartType: number
    color: number
    mt: number
    rt: number
    clearType: number // 1: played, 9: C, 10: HC, 11: S-HC
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
    rivalCpuId: number
    time: number
    decide: number
}
export const Rb5PlayerStageLogMap: KObjectMappingRecord<IRb5PlayerStageLog> = {
    collection: getCollectionMappingElement<IRb5PlayerStageLog>("rb.rb5.playData.stageLog"),
    stageIndex: s8me("stg"),
    musicId: s16me("mid"),
    chartType: s8me("ng"),
    color: s8me("col"),
    mt: s8me(),
    rt: s8me(),
    clearType: s8me("ct"),
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

export interface IRb5PlayerClasscheckLog {
    class: number
    clearType: number
    seperateAchievementRateTimes100: number[]
    seperateScore: number[]
    averageAchievementRateTimes100: number
    totalScore: number
    rank: number
}
export const Rb5PlayerClasscheckLogMap: KObjectMappingRecord<IRb5PlayerClasscheckLog> = {
    class: s32me(),
    clearType: s32me("clear_type"),
    seperateAchievementRateTimes100: s32me("s_ar"),
    seperateScore: s32me("s_score"),
    averageAchievementRateTimes100: s32me("t_ar"),
    totalScore: s32me("t_score"),
    rank: s32me("score_rank")
}

export interface IRb5PlayerReleasedInfo extends ICollection<"rb.rb5.player.releasedInfo"> {
    type: number
    id: number
    param: number
    insertTime: number
}
export const Rb5PlayerReleasedInfoMap: KObjectMappingRecord<IRb5PlayerReleasedInfo> = {
    collection: getCollectionMappingElement<IRb5PlayerReleasedInfo>("rb.rb5.player.releasedInfo"),
    type: u8me(),
    id: u16me(),
    param: u16me(),
    insertTime: s32me("insert_time")
}

export interface IRb5PlayerParameters extends ICollection<"rb.rb5.player.parameters"> {
    type: number
    bank: number
    data: number[]
}
export const Rb5PlayerParametersMap: KObjectMappingRecord<IRb5PlayerParameters> = {
    collection: getCollectionMappingElement<IRb5PlayerParameters>("rb.rb5.player.parameters"),
    type: s32me(),
    bank: s32me(),
    data: s32me()
}

export interface IRb5Minigame extends ICollection<"rb.rb5.playData.minigame"> {
    minigameId: number
    sc: number
    playCount: number
}
export const Rb5MinigameMap: KObjectMappingRecord<IRb5Minigame> = {
    collection: getCollectionMappingElement<IRb5Minigame>("rb.rb5.playData.minigame"),
    minigameId: s8me("mgid"),
    sc: s32me("sc"),
    playCount: s32me("pc")
}
export function generateRb5Minigame(): IRb5Minigame {
    return {
        collection: "rb.rb5.playData.minigame",
        minigameId: 0,
        sc: 0,
        playCount: 0
    }
}

export interface IRb5Derby extends ICollection<"rb.rb5.player.derby"> {
    value1: number
    value2: number
}
export const Rb5DerbyMap: KObjectMappingRecord<IRb5Derby> = {
    collection: getCollectionMappingElement<IRb5Derby>("rb.rb5.player.derby"),
    value1: s32me(),
    value2: s32me()
}
export function generateRb5Derby(): IRb5Derby {
    return {
        collection: "rb.rb5.player.derby",
        value1: 0,
        value2: 0
    }
}

export interface IRb5BattleRoyale extends ICollection<"rb.rb5.playData.battleRoyale"> {
    battleId: number
    phase: number
    border: number
    max: number
    remainDays: number
}
export const Rb5BattleRoyaleMap: KObjectMappingRecord<IRb5BattleRoyale> = {
    collection: getCollectionMappingElement<IRb5BattleRoyale>("rb.rb5.playData.battleRoyale"),
    battleId: s32me("battle_id"),
    phase: s32me(),
    border: s32me(),
    max: s32me(),
    remainDays: s32me("remain_days")
}
export function generateRb5BattleRoyale(): IRb5BattleRoyale {
    return {
        collection: "rb.rb5.playData.battleRoyale",
        battleId: 0,
        phase: 0,
        border: 0,
        max: 0,
        remainDays: 999
    }
}

export interface IRb5MyCourseLog extends ICollection<"rb.rb5.playData.myCourse"> {
    courseId: number
    musicId1: number
    musicId2: number
    musicId3: number
    musicId4: number
    chartType1: number
    chartType2: number
    chartType3: number
    chartType4: number
    score1: number
    score2: number
    score3: number
    score4: number
    defaultMusicId1: number
    defaultMusicId2: number
    defaultMusicId3: number
    defaultMusicId4: number
    defaultChartType1: number
    defaultChartType2: number
    defaultChartType3: number
    defaultChartType4: number
    insertTime: number
}
export const Rb5MyCourseLogMap: KObjectMappingRecord<IRb5MyCourseLog> = {
    collection: getCollectionMappingElement<IRb5MyCourseLog>("rb.rb5.playData.myCourse"),
    courseId: s16me("mycourse_id"),
    musicId1: s32me("music_id_1"),
    musicId2: s32me("music_id_2"),
    musicId3: s32me("music_id_3"),
    musicId4: s32me("music_id_4"),
    chartType1: s16me("note_grade_1"),
    chartType2: s16me("note_grade_2"),
    chartType3: s16me("note_grade_3"),
    chartType4: s16me("note_grade_4"),
    score1: s32me("score_1"),
    score2: s32me("score_2"),
    score3: s32me("score_3"),
    score4: s32me("score_4"),
    defaultMusicId1: s32me("def_music_id_1"),
    defaultMusicId2: s32me("def_music_id_2"),
    defaultMusicId3: s32me("def_music_id_3"),
    defaultMusicId4: s32me("def_music_id_4"),
    defaultChartType1: s16me("def_note_grade_1"),
    defaultChartType2: s16me("def_note_grade_2"),
    defaultChartType3: s16me("def_note_grade_3"),
    defaultChartType4: s16me("def_note_grade_4"),
    insertTime: s32me("insert_time")
}
export function generateRb5MyCourseLog(): IRb5MyCourseLog {
    return {
        collection: "rb.rb5.playData.myCourse",
        courseId: -1,
        musicId1: -1,
        musicId2: -1,
        musicId3: -1,
        musicId4: -1,
        chartType1: -1,
        chartType2: -1,
        chartType3: -1,
        chartType4: -1,
        score1: -1,
        score2: -1,
        score3: -1,
        score4: -1,
        defaultMusicId1: -1,
        defaultMusicId2: -1,
        defaultMusicId3: -1,
        defaultMusicId4: -1,
        defaultChartType1: -1,
        defaultChartType2: -1,
        defaultChartType3: -1,
        defaultChartType4: -1,
        insertTime: -1
    }
}


interface IRb5PlayerData {
    account: IRb5PlayerAccount
    base: IRb5PlayerBase
    config: IRb5PlayerConfig
    custom: IRb5PlayerCustom
    rival: {}
    pickupRival: {}
    stageLogs?: { log: IRb5PlayerStageLog[] }
    classcheck?: { rec: IRb5ClasscheckRecord[] } | IRb5PlayerClasscheckLog
    released: { info: IRb5PlayerReleasedInfo[] }
    announce: {}
    playerParam: { item: IRb5PlayerParameters[] }
    mylist: { list?: IRb5Mylist }
    musicRankPoint: {}
    ghost: {}
    ghostWinCount: {}
    purpose: {}
    minigame: IRb5Minigame
    share: {}
    battleRoyale: IRb5BattleRoyale
    derby: IRb5Derby
    yurukomeList: [number, number, number, number] // ゆるゆるコメント -> special comments shown on result screen
    myCourse: IRb5MyCourseLog
    myCourseF: IRb5MyCourseLog
    challengeEventCard: {
        setId: number
    }
}
export interface IRb5Player {
    pdata: IRb5PlayerData
}
export const Rb5PlayerReadMap: KObjectMappingRecord<IRb5Player> = {
    pdata: {
        account: Rb5PlayerAccountReadMap,
        base: Rb5PlayerBaseMap,
        config: Rb5PlayerConfigMap,
        custom: Rb5PlayerCustomMap,
        classcheck: <KObjectMappingRecord<{ rec: IRb5ClasscheckRecord[]; }>>{
            rec: { 0: Rb5ClasscheckRecordMappingRecord },
            $targetKey: "dojo"
        },
        stageLogs: {
            log: { 0: Rb5PlayerStageLogMap },
            $targetKey: "kignore"
        },
        released: {
            info: { 0: Rb5PlayerReleasedInfoMap }
        },
        rival: {},
        pickupRival: { $targetKey: "pickup_rival" },
        announce: {},
        playerParam: {
            item: { 0: Rb5PlayerParametersMap },
            $targetKey: "player_param"
        },
        mylist: { list: Rb5MylistMap },
        musicRankPoint: { $targetKey: "music_rank_point" },
        ghost: {},
        ghostWinCount: { $targetKey: "ghost_win_count" },
        purpose: {},
        minigame: Rb5MinigameMap,
        share: {},
        battleRoyale: appendMappingElement(Rb5BattleRoyaleMap, { $targetKey: "battle_royale" }),
        derby: Rb5DerbyMap,
        yurukomeList: s32me("yurukome_list"),
        myCourse: appendMappingElement(Rb5MyCourseLogMap, { $targetKey: "mycourse" }),
        myCourseF: appendMappingElement(Rb5MyCourseLogMap, { $targetKey: "mycourse_f" }),
        challengeEventCard: { setId: s32me("set_id"), $targetKey: "challenge_event_card" }
    }
}
export const Rb5PlayerWriteMap: KObjectMappingRecord<IRb5Player> = {
    pdata: {
        account: Rb5PlayerAccountWriteMap,
        base: Rb5PlayerBaseMap,
        config: Rb5PlayerConfigMap,
        custom: Rb5PlayerCustomMap,
        classcheck: appendMappingElement(Rb5PlayerClasscheckLogMap, { $targetKey: "dojo" }),
        stageLogs: {
            log: { 0: Rb5PlayerStageLogMap },
            $targetKey: "stglog"
        },
        released: {
            info: { 0: Rb5PlayerReleasedInfoMap }
        },
        rival: {},
        pickupRival: { $targetKey: "pickup_rival" },
        announce: {},
        playerParam: {
            item: { 0: Rb5PlayerParametersMap },
            $targetKey: "player_param"
        },
        mylist: { list: Rb5MylistMap },
        musicRankPoint: { $targetKey: "music_rank_point" },
        ghost: {},
        ghostWinCount: { $targetKey: "ghost_win_count" },
        purpose: {},
        minigame: Rb5MinigameMap,
        share: {},
        battleRoyale: appendMappingElement(Rb5BattleRoyaleMap, { $targetKey: "battle_royale" }),
        derby: Rb5DerbyMap,
        yurukomeList: s32me("yurukome_list"),
        myCourse: appendMappingElement(Rb5MyCourseLogMap, { $targetKey: "mycourse" }),
        myCourseF: appendMappingElement(Rb5MyCourseLogMap, { $targetKey: "mycourse_f" }),
        challengeEventCard: { setId: s32me("set_id"), $targetKey: "challenge_event_card" }
    }
}

export function generateRb5Profile(rid: string, userId?: number): IRb5Player {
    return {
        pdata: {
            account: generateRb5PlayerAccount(rid, userId),
            base: generateRb5PlayerBase(),
            config: generateRb5PlayerConfig(),
            custom: generateRb5PlayerCustom(),
            rival: {},
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
            minigame: generateRb5Minigame(),
            share: {},
            battleRoyale: generateRb5BattleRoyale(),
            derby: generateRb5Derby(),
            yurukomeList: [0, 0, 0, 0],
            myCourse: generateRb5MyCourseLog(),
            myCourseF: generateRb5MyCourseLog(),
            challengeEventCard: { setId: 0 }
        }
    }
}