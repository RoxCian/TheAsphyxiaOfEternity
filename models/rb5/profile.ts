import { ICollection } from "../utility/definitions"
import { appendMappingElement, getCollectionMappingElement, KObjectMappingRecord } from "../../utility/mapping"
import { IRb5ClasscheckRecord, Rb5ClasscheckRecordMappingRecord } from "./classcheck_record"
import { IRb5Mylist, Rb5MylistMap } from "./mylist"

export interface IRb5PlayerAccount extends ICollection<"rb.rb5.player.account"> {
    userId: number
    playerId: number
    tpc: number
    dpc: number
    crd: number
    brd: number
    tdc: number
    rid: string
    lid: string
    intrvld: number
    succeed: boolean
    pst: bigint
    wmode: number
    gmode: number
    version: number
    pp: boolean
    ps: boolean
    isContinue: boolean
    isFirstFree: boolean
    pay: number
    payPc: number
    st: bigint
    opc: number
    lpc: number
    cpc: number
    mpc: number
    playCount: number
}
export const Rb5PlayerAccountWriteMap: KObjectMappingRecord<IRb5PlayerAccount> = {
    collection: getCollectionMappingElement<IRb5PlayerAccount>("rb.rb5.player.account"),
    userId: { $type: "s32", $targetKey: "usrid" },
    playerId: { $type: "s32", $targetKey: "plyid" },
    tpc: { $type: "s32" },
    dpc: { $type: "s32" },
    crd: { $type: "s32" },
    brd: { $type: "s32" },
    tdc: { $type: "s32" },
    rid: { $type: "str" },
    lid: { $type: "str" },
    intrvld: { $type: "kignore" },
    succeed: { $type: "kignore" },
    pst: { $type: "u64" },
    wmode: { $type: "u8" },
    gmode: { $type: "u8" },
    version: { $type: "s16", $targetKey: "ver" },
    pp: { $type: "bool" },
    ps: { $type: "bool" },
    isContinue: { $type: "bool", $targetKey: "continue" },
    isFirstFree: { $type: "bool", $targetKey: "firstfree" },
    pay: { $type: "s16" },
    payPc: { $type: "s16", $targetKey: "pay_pc" },
    st: { $type: "u64" },
    opc: { $type: "s32" },
    lpc: { $type: "s32" },
    cpc: { $type: "s32" },
    mpc: { $type: "s32" },
    playCount: { $type: "kignore", $fallbackValue: 0 }
}
export const Rb5PlayerAccountReadMap: KObjectMappingRecord<IRb5PlayerAccount> = {
    collection: getCollectionMappingElement<IRb5PlayerAccount>("rb.rb5.player.account"),
    userId: { $type: "s32", $targetKey: "usrid" },
    playerId: { $type: "kignore" },
    tpc: { $type: "s32" },
    dpc: { $type: "s32" },
    crd: { $type: "s32" },
    brd: { $type: "s32" },
    tdc: { $type: "s32" },
    rid: { $type: "kignore" },
    lid: { $type: "kignore" },
    intrvld: { $type: "s32" },
    succeed: { $type: "bool" },
    pst: { $type: "u64" },
    wmode: { $type: "kignore" },
    gmode: { $type: "kignore" },
    version: { $type: "s16", $targetKey: "ver" },
    pp: { $type: "kignore" },
    ps: { $type: "kignore" },
    isContinue: { $type: "bool", $targetKey: "continue" },
    isFirstFree: { $type: "bool", $targetKey: "firstfree" },
    pay: { $type: "kignore" },
    payPc: { $type: "kignore", $targetKey: "pay_pc" },
    st: { $type: "u64" },
    opc: { $type: "s32" },
    lpc: { $type: "s32" },
    cpc: { $type: "s32" },
    mpc: { $type: "s32" },
    playCount: { $type: "kignore", $fallbackValue: 0 }
}
export function generateRb5PlayerAccount(rid: string, userId?: number): IRb5PlayerAccount {
    return {
        collection: "rb.rb5.player.account",
        userId: (userId != null) ? userId : -1,
        playerId: 0,
        tpc: 1000,
        dpc: 1,
        crd: 1,
        brd: 1,
        tdc: 1,
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
    name: string
    matchingGrade: number // <mg />
    averagePrecisionTimes100: number // <ap />
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
    money: { $type: "s32" },
    comment: { $type: "str", $targetKey: "cmnt" },
    totalBestScore: { $type: "s32", $targetKey: "tbs_5" },
    totalBestScoreEachChartType: { $type: "s32", $targetKey: "tbgs_5" },
    name: { $type: "str" },
    matchingGrade: { $type: "s32", $targetKey: "mg" },
    averagePrecisionTimes100: { $type: "s32", $targetKey: "ap" },
    uattr: { $type: "s32" },
    isTutorialEnabled: { $type: "bool", $targetKey: "is_tut" },
    class: { $type: "s32" },
    classAchievrementRateTimes100: { $type: "s32", $targetKey: "class_ar" },
    skillPointTimes10: { $type: "s32", $targetKey: "skill_point" },
    mlog: { $type: "s16" }
}
export function generateRb5PlayerBase(): IRb5PlayerBase {
    return {
        collection: "rb.rb5.player.base",
        money: 0,
        comment: "",
        totalBestScore: 0,
        totalBestScoreEachChartType: [0, 0, 0, 0],
        name: "",
        matchingGrade: 0,
        averagePrecisionTimes100: 0,
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
    characterCardId: number // <characard_id __type="s16" />
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
    randomEntryWork: bigint
    customFolderWork: bigint
    folderType: number // "u8"
    isTweet: boolean
    isTwitterLinked: boolean // <is_link_twitter __type="bool" />
}
export const Rb5PlayerConfigMap: KObjectMappingRecord<IRb5PlayerConfig> = {
    collection: getCollectionMappingElement("rb.rb5.player.config"),
    iconId: { $type: "s16", $targetKey: "icon_id" },
    tabSel: { $type: "u8", $targetKey: "tab_sel" },
    rivalPanelType: { $type: "u8", $targetKey: "rival_panel_type" },
    folderLampType: { $type: "u8", $targetKey: "folder_lamp_type" },


    musicSelectBgm: { $type: "u8", $targetKey: "msel_bgm" },
    narrowDownType: { $type: "u8", $targetKey: "narrowdown_type" },
    musicLevelDisplayingType: { $type: "u8", $targetKey: "musiclvdisp_type" },
    characterCardId: { $type: "s16", $targetKey: "characard_id" },
    bywordLeft: { $type: "s16", $targetKey: "byword_0" },
    bywordRight: { $type: "s16", $targetKey: "byword_1" },
    isAutoBywordLeft: { $type: "bool", $targetKey: "is_auto_byword_0" },
    isAutoBywordRight: { $type: "bool", $targetKey: "is_auto_byword_1" },
    latestSymbolChatId: { $type: "s16", $targetKey: "latestsymbolchat_id" },
    memoryRecordingType: { $type: "u8", $targetKey: "mrec_type" },
    cardDisplay: { $type: "u8", $targetKey: "card_disp" },
    scoreTabDisplay: { $type: "u8", $targetKey: "score_tab_disp" },
    lastMusicId: { $type: "s16", $targetKey: "last_music_id" },
    lastNoteGrade: { $type: "u8", $targetKey: "last_note_grade" },
    defaultMusicId: { $type: "s16", $targetKey: "default_music_id" },
    defaultNoteGrade: { $type: "u8", $targetKey: "default_note_grade" },
    sortType: { $type: "u8", $targetKey: "sort_type" },
    randomEntryWork: { $type: "u64", $targetKey: "random_entry_work" },
    customFolderWork: { $type: "u64", $targetKey: "custom_folder_work" },
    folderType: { $type: "u8", $targetKey: "folder_type" },
    isTweet: { $type: "bool", $targetKey: "is_tweet" },
    isTwitterLinked: { $type: "bool", $targetKey: "is_link_twitter" }
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
        characterCardId: 0,
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

    // voiceMessageSet: number
    // voiceMessageVolume: number
}
export const Rb5PlayerCustomMap: KObjectMappingRecord<IRb5PlayerCustom> = {
    collection: getCollectionMappingElement<IRb5PlayerCustom>("rb.rb5.player.custom"),
    stageMainGaugeType: { $type: "u8", $targetKey: "st_jr_gauge" },//
    type: { $type: "u8" },

    stageShotSound: { $type: "u8", $targetKey: "st_shot" },//
    stageFrameType: { $type: "u8", $targetKey: "st_frame" },//
    stageExplodeType: { $type: "u8", $targetKey: "st_expl" },//
    stageBackground: { $type: "u8", $targetKey: "st_bg" },//
    stageShotVolume: { $type: "u8", $targetKey: "st_shot_vol" },//
    stageBackgroundBrightness: { $type: "u8", $targetKey: "st_bg_bri" },//
    stageObjectSize: { $type: "u8", $targetKey: "st_obj_size" },//
    stageClearGaugeType: { $type: "u8", $targetKey: "st_clr_gauge" },//
    stageColorRandom: { $type: "u8", $targetKey: "st_rnd" },//
    stageSameTimeObjectsDisplayingType: { $type: "u8", $targetKey: "same_time_note_disp" },//
    stageScoreDisplayingType: { $type: "u8", $targetKey: "st_score_disp_type" },//
    stageBonusType: { $type: "u8", $targetKey: "st_bonus_type" },//
    stageRivalObjectsDisplayingType: { $type: "u8", $targetKey: "st_rivalnote_type" },//
    stageTopAssistDisplayingType: { $type: "u8", $targetKey: "st_topassist_type" },//
    stageHighSpeed: { $type: "u8", $targetKey: "high_speed" },//
    stageColorSpecified: { $type: "u8", $targetKey: "color_type" },
    stageAchievementRateDisplayingType: { $type: "u8", $targetKey: "st_hazard" },//
    stageClearCondition: { $type: "u8", $targetKey: "st_clr_cond" }//
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
    clearType: number // 1: played, 2: played (hard gauge), 3: cleared, 4: hard clear
    param: number
    matchingGrade: number
    clearGaugeTimes100: number
    achievementRateTimes100: number
    score: number
    combo: number
    justCount: number
    greatCount: number
    goodCount: number
    keepCount: number
    missCount: number
    justReflectCount: number
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
    stageIndex: { $type: "s8", $targetKey: "stg" },
    musicId: { $type: "s16", $targetKey: "mid" },
    chartType: { $type: "s8", $targetKey: "ng" },
    color: { $type: "s8", $targetKey: "col" },
    mt: { $type: "s8" },
    rt: { $type: "s8" },
    clearType: { $type: "s8", $targetKey: "ct" },
    param: { $type: "s16" },
    matchingGrade: { $type: "s16", $targetKey: "grd" },
    clearGaugeTimes100: { $type: "s16", $targetKey: "cl_gauge" },
    achievementRateTimes100: { $type: "s16", $targetKey: "ar" },
    score: { $type: "s16", $targetKey: "sc" },
    combo: { $type: "s16" },
    justCount: { $type: "s16", $targetKey: "jt_jst" },
    greatCount: { $type: "s16", $targetKey: "jt_jrt" },
    goodCount: { $type: "s16", $targetKey: "jt_gd" },
    keepCount: { $type: "s16", $targetKey: "jt_keep" },
    missCount: { $type: "s16", $targetKey: "jt_ms" },
    justReflectCount: { $type: "s16", $targetKey: "jt_jr" },
    rivalUserId: { $type: "s32", $targetKey: "r_uid" },
    rivalPlayerId: { $type: "s32", $targetKey: "r_plyid" },
    rivalStageIndex: { $type: "s8", $targetKey: "r_stg" },
    rivalClearType: { $type: "s8", $targetKey: "r_ct" },
    rivalScore: { $type: "s16", $targetKey: "r_sc" },
    rivalMatchingGrade: { $type: "s16", $targetKey: "r_grd" },
    rivalClearGaugeTimes100: { $type: "s16", $targetKey: "r_cl_gauge" },
    rivalAchievementRateTimes100: { $type: "s16", $targetKey: "r_ar" },
    rivalCpuId: { $type: "s8", $targetKey: "r_cpuid" },
    time: { $type: "s32" },
    decide: { $type: "s8" }
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
    class: { $type: "s32" },
    clearType: { $type: "s32", $targetKey: "clear_type" },
    seperateAchievementRateTimes100: { $type: "s32", $targetKey: "s_ar" },
    seperateScore: { $type: "s32", $targetKey: "s_score" },
    averageAchievementRateTimes100: { $type: "s32", $targetKey: "t_ar" },
    totalScore: { $type: "s32", $targetKey: "t_score" },
    rank: { $type: "s32", $targetKey: "score_rank" }
}

export interface IRb5PlayerReleasedInfo extends ICollection<"rb.rb5.player.releasedInfo"> {
    type: number
    id: number
    param: number
    insertTime: number
}
export const Rb5PlayerReleasedInfoMap: KObjectMappingRecord<IRb5PlayerReleasedInfo> = {
    collection: getCollectionMappingElement<IRb5PlayerReleasedInfo>("rb.rb5.player.releasedInfo"),
    type: { $type: "u8" },
    id: { $type: "u16" },
    param: { $type: "u16" },
    insertTime: { $type: "s32", $targetKey: "insert_time" }
}

export interface IRb5PlayerParameters extends ICollection<"rb.rb5.player.parameters"> {
    type: number
    bank: number
    data: number[]
}
export const Rb5PlayerParametersMap: KObjectMappingRecord<IRb5PlayerParameters> = {
    collection: getCollectionMappingElement<IRb5PlayerParameters>("rb.rb5.player.parameters"),
    type: { $type: "s32" },
    bank: { $type: "s32" },
    data: { $type: "s32" }
}

export interface IRb5Minigame extends ICollection<"rb.rb5.playData.minigame"> {
    minigameId: number
    sc: number
    playCount: number
}
export const Rb5MinigameMap: KObjectMappingRecord<IRb5Minigame> = {
    collection: getCollectionMappingElement<IRb5Minigame>("rb.rb5.playData.minigame"),
    minigameId: { $type: "s8", $targetKey: "mgid" },
    sc: { $type: "s32", $targetKey: "sc" },
    playCount: { $type: "s32", $targetKey: "pc" }
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
    value1: { $type: "s32" },
    value2: { $type: "s32" }
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
    battleId: { $type: "s32", $targetKey: "battle_id" },
    phase: { $type: "s32" },
    border: { $type: "s32" },
    max: { $type: "s32" },
    remainDays: { $type: "s32", $targetKey: "remain_days" }
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
    courseId: { $type: "s16", $targetKey: "mycourse_id" },
    musicId1: { $type: "s32", $targetKey: "music_id_1" },
    musicId2: { $type: "s32", $targetKey: "music_id_2" },
    musicId3: { $type: "s32", $targetKey: "music_id_3" },
    musicId4: { $type: "s32", $targetKey: "music_id_4" },
    chartType1: { $type: "s16", $targetKey: "note_grade_1" },
    chartType2: { $type: "s16", $targetKey: "note_grade_2" },
    chartType3: { $type: "s16", $targetKey: "note_grade_3" },
    chartType4: { $type: "s16", $targetKey: "note_grade_4" },
    score1: { $type: "s32", $targetKey: "score_1" },
    score2: { $type: "s32", $targetKey: "score_2" },
    score3: { $type: "s32", $targetKey: "score_3" },
    score4: { $type: "s32", $targetKey: "score_4" },
    defaultMusicId1: { $type: "s32", $targetKey: "def_music_id_1" },
    defaultMusicId2: { $type: "s32", $targetKey: "def_music_id_2" },
    defaultMusicId3: { $type: "s32", $targetKey: "def_music_id_3" },
    defaultMusicId4: { $type: "s32", $targetKey: "def_music_id_4" },
    defaultChartType1: { $type: "s16", $targetKey: "def_note_grade_1" },
    defaultChartType2: { $type: "s16", $targetKey: "def_note_grade_2" },
    defaultChartType3: { $type: "s16", $targetKey: "def_note_grade_3" },
    defaultChartType4: { $type: "s16", $targetKey: "def_note_grade_4" },
    insertTime: { $type: "s32", $targetKey: "insert_time" }
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
    yurukomeList: [number, number, number, number]
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
        yurukomeList: { $type: "s32", $targetKey: "yurukome_list" },
        myCourse: appendMappingElement(Rb5MyCourseLogMap, { $targetKey: "mycourse" }),
        myCourseF: appendMappingElement(Rb5MyCourseLogMap, { $targetKey: "mycourse_f" }),
        challengeEventCard: { setId: { $type: "s32", $targetKey: "set_id" }, $targetKey: "challenge_event_card" }
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
        yurukomeList: { $type: "s32", $targetKey: "yurukome_list" },
        myCourse: appendMappingElement(Rb5MyCourseLogMap, { $targetKey: "mycourse" }),
        myCourseF: appendMappingElement(Rb5MyCourseLogMap, { $targetKey: "mycourse_f" }),
        challengeEventCard: { setId: { $type: "s32", $targetKey: "set_id" }, $targetKey: "challenge_event_card" }
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