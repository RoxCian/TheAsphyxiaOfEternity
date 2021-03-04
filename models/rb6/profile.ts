import { ICollection } from "../utility/definitions"
import { appendMappingElement, BigIntProxy, getCollectionMappingElement, KObjectMappingRecord } from "../../utility/mapping"
import { IRb6JustCollection, Rb6JustCollectionMap } from "./just_collection"
import { IRb6ClasscheckRecord, Rb6ClasscheckRecordMap } from "./classcheck_record"
import { Rb6CharacterCardMap, IRb6CharacterCard } from "./character_card"
import { IRb6Mylist, Rb6MylistMap } from "./mylist"

export interface IRb6PlayerAccount extends ICollection<"rb.rb6.player.account"> {
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
export const Rb6PlayerAccountWriteMap: KObjectMappingRecord<IRb6PlayerAccount> = {
    collection: getCollectionMappingElement<IRb6PlayerAccount>("rb.rb6.player.account"),
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
export const Rb6PlayerAccountReadMap: KObjectMappingRecord<IRb6PlayerAccount> = {
    collection: getCollectionMappingElement<IRb6PlayerAccount>("rb.rb6.player.account"),
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
export function generateRb6PlayerAccount(rid: string, userId: number): IRb6PlayerAccount {
    return {
        collection: "rb.rb6.player.account",
        userId: userId,
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

export interface IRb6PlayerBase extends ICollection<"rb.rb6.player.base"> {
    comment: string
    totalBestScore: number
    totalBestScoreEachChartType: number[]
    name: string
    matchingGrade: number // <mg />
    abilityPointTimes100: number // <ap />
    uattr: number
    isTutorialEnabled: boolean // <is_tut />
    class: number
    classAchievrementRateTimes100: number // <class_ar />
    skillPointTimes10: number // <skill_point />
    pastelParts: number[]
    pastelExperiences: number
    rankQuestScore: number[]
    rankQuestRank: number[]
    mLog: number[]
    ghostWinCount: number
}
export const Rb6PlayerBaseMap: KObjectMappingRecord<IRb6PlayerBase> = {
    collection: getCollectionMappingElement<IRb6PlayerBase>("rb.rb6.player.base"),
    comment: { $type: "str", $targetKey: "cmnt" },
    totalBestScore: { $type: "s32", $targetKey: "tbs" },
    totalBestScoreEachChartType: { $type: "s32", $targetKey: "tbgs" },
    name: { $type: "str" },
    matchingGrade: { $type: "s32", $targetKey: "mg" },
    abilityPointTimes100: { $type: "s32", $targetKey: "ap" },
    uattr: { $type: "s32" },
    isTutorialEnabled: { $type: "bool", $targetKey: "is_tut" },
    class: { $type: "s32" },
    classAchievrementRateTimes100: { $type: "s32", $targetKey: "class_ar" },
    skillPointTimes10: { $type: "s32", $targetKey: "skill_point" },
    pastelParts: { $type: "s32", $targetKey: "pastel_parts" },
    pastelExperiences: { $type: "s32", $targetKey: "pastel_exp" },
    rankQuestScore: { $type: "s32", $targetKey: "rankquestscore" },
    rankQuestRank: { $type: "s32", $targetKey: "rankquestrank" },
    mLog: { $type: "s16", $targetKey: "mlog" },
    ghostWinCount: { $type: "s32", $targetKey: "ghost_win_count" }
}
export function generateRb6PlayerBase(): IRb6PlayerBase {
    return {
        collection: "rb.rb6.player.base",
        comment: "",
        totalBestScore: 0,
        totalBestScoreEachChartType: [0, 0, 0, 0],
        name: "",
        matchingGrade: 0,
        abilityPointTimes100: 0,
        uattr: 0,
        isTutorialEnabled: true,
        class: 0,
        classAchievrementRateTimes100: 0,
        skillPointTimes10: 0,
        pastelParts: [0, 0, 0, 0],
        pastelExperiences: 0,
        rankQuestScore: [0, 0, 0],
        rankQuestRank: [0, 0, 0],
        mLog: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ghostWinCount: 0
    }
}

export interface IRb6PlayerConfig extends ICollection<"rb.rb6.player.config"> {
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
    randomEntryWork: bigint | BigIntProxy
    customFolderWork: bigint | BigIntProxy
    folderType: number // "u8"
    isTweet: boolean
    isTwitterLinked: boolean // <is_link_twitter __type="bool" />
}
export const Rb6PlayerConfigMap: KObjectMappingRecord<IRb6PlayerConfig> = {
    collection: getCollectionMappingElement("rb.rb6.player.config"),
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
export function generateRb6PlayerConfig(): IRb6PlayerConfig {
    return {
        collection: "rb.rb6.player.config",

        // Second page of customization
        musicSelectBgm: 0,

        narrowDownType: 0,
        musicLevelDisplayingType: 0,
        characterCardId: 0,
        bywordLeft: 0,
        bywordRight: 0,
        isAutoBywordLeft: true,
        isAutoBywordRight: true,
        latestSymbolChatId: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        memoryRecordingType: 0,
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

export interface IRb6PlayerCustom extends ICollection<"rb.rb6.player.custom"> {
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
    stageBigBangEffectPerformingType: number
    stageRivalObjectsDisplayingType: number
    stageTopAssistDisplayingType: number
    stageChatSoundSwitch: number

    // Others
    stageScoreDisplayingType: number
    stageBonusType: number
    stageHighSpeed: number
    stageRandom: number
    stageColorSpecified: number
    stageJustCollectionDisplayingType: number
    stageClearCondition: number // ?
}
export const Rb6PlayerCustomMap: KObjectMappingRecord<IRb6PlayerCustom> = {
    collection: getCollectionMappingElement<IRb6PlayerCustom>("rb.rb6.player.custom"),
    stageShotSound: { $type: "u8", $targetKey: "st_shot" },
    stageFrameType: { $type: "u8", $targetKey: "st_frame" },
    stageExplodeType: { $type: "u8", $targetKey: "st_expl" },
    stageBackground: { $type: "u8", $targetKey: "st_bg" },
    stageShotVolume: { $type: "u8", $targetKey: "st_shot_vol" },
    stageBackgroundBrightness: { $type: "u8", $targetKey: "st_bg_bri" },
    stageObjectSize: { $type: "u8", $targetKey: "st_obj_size" },
    stageClearGaugeType: { $type: "u8", $targetKey: "st_clr_gauge" },
    stageRandom: { $type: "u8", $targetKey: "st_rnd" },
    stageSameTimeObjectsDisplayingType: { $type: "u8", $targetKey: "same_time_note_disp" },
    stageScoreDisplayingType: { $type: "u8", $targetKey: "st_score_disp_type" },
    stageBonusType: { $type: "u8", $targetKey: "st_bonus_type" },
    stageRivalObjectsDisplayingType: { $type: "u8", $targetKey: "st_rivalnote_type" },
    stageTopAssistDisplayingType: { $type: "u8", $targetKey: "st_topassist_type" },
    stageBigBangEffectPerformingType: { $type: "u8", $targetKey: "st_bigbangeff_type" },
    stageChatSoundSwitch: { $type: "u8", $targetKey: "st_chatvolume_type" },
    stageHighSpeed: { $type: "u8", $targetKey: "high_speed" },
    stageColorSpecified: { $type: "u8", $targetKey: "color_type" },
    stageJustCollectionDisplayingType: { $type: "u8", $targetKey: "justcol_type" },
    stageAchievementRateDisplayingType: { $type: "u8", $targetKey: "st_hazard" },
    stageClearCondition: { $type: "u8", $targetKey: "st_clr_cond" }
}
export function generateRb6PlayerCustom(): IRb6PlayerCustom {
    return {
        collection: "rb.rb6.player.custom",
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
        stageBigBangEffectPerformingType: 0,
        stageRivalObjectsDisplayingType: 0,
        stageTopAssistDisplayingType: 0,
        stageChatSoundSwitch: 0,

        // Others
        stageScoreDisplayingType: 0,
        stageBonusType: 0,
        stageHighSpeed: 0,
        stageRandom: 0,
        stageColorSpecified: 0,
        stageJustCollectionDisplayingType: 0,
        stageClearCondition: 0 // ?
    }
}

export interface IRb6PlayerStageLog extends ICollection<"rb.rb6.playData.stageLog"> {
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
    justReflecCount: number
    justCollectionRateTimes100: number
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
export const Rb6PlayerStageLogMap: KObjectMappingRecord<IRb6PlayerStageLog> = {
    collection: getCollectionMappingElement<IRb6PlayerStageLog>("rb.rb6.playData.stageLog"),
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
    greatCount: { $type: "s16", $targetKey: "jt_grt" },
    goodCount: { $type: "s16", $targetKey: "jt_gd" },
    keepCount: { $type: "s16", $targetKey: "jt_keep" },
    missCount: { $type: "s16", $targetKey: "jt_ms" },
    justReflecCount: { $type: "s16", $targetKey: "jt_jr" },
    justCollectionRateTimes100: { $type: "s16", $targetKey: "justcoll" },
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

export interface IRb6PlayerClasscheckLog {
    class: number
    clearType: number
    seperateAchievementRateTimes100: number[]
    seperateScore: number[]
    averageAchievementRateTimes100: number
    totalScore: number
    rank: number
}
export const Rb6PlayerClasscheckLogMap: KObjectMappingRecord<IRb6PlayerClasscheckLog> = {
    class: { $type: "s32" },
    clearType: { $type: "s32", $targetKey: "clear_type" },
    seperateAchievementRateTimes100: { $type: "s32", $targetKey: "s_ar" },
    seperateScore: { $type: "s32", $targetKey: "s_score" },
    averageAchievementRateTimes100: { $type: "s32", $targetKey: "t_ar" },
    totalScore: { $type: "s32", $targetKey: "t_score" },
    rank: { $type: "s32", $targetKey: "score_rank" }
}

export interface IRb6PlayerReleasedInfo extends ICollection<"rb.rb6.player.releasedInfo"> {
    type: number
    id: number
    param: number
    insertTime: number
}
export const Rb6PlayerReleasedInfoMap: KObjectMappingRecord<IRb6PlayerReleasedInfo> = {
    collection: getCollectionMappingElement<IRb6PlayerReleasedInfo>("rb.rb6.player.releasedInfo"),
    type: { $type: "u8" },
    id: { $type: "u16" },
    param: { $type: "u16" },
    insertTime: { $type: "s32", $targetKey: "insert_time" }
}

export interface IRb6PlayerParameters extends ICollection<"rb.rb6.player.parameters"> {
    type: number
    bank: number
    data: number[]
}
export const Rb6PlayerParametersMap: KObjectMappingRecord<IRb6PlayerParameters> = {
    collection: getCollectionMappingElement<IRb6PlayerParameters>("rb.rb6.player.parameters"),
    type: { $type: "s32" },
    bank: { $type: "s32" },
    data: { $type: "s32" }
}

export interface IRb6QuestRecord extends ICollection<"rb.rb6.playData.quest"> {
    dungeonId: number
    dungeonGrade: number
    clearCount: number
    playCount: number
    isCleared: boolean
}
export const Rb6QuestRecordMap: KObjectMappingRecord<IRb6QuestRecord> = {
    collection: getCollectionMappingElement<IRb6QuestRecord>("rb.rb6.playData.quest"),
    dungeonId: { $type: "s32", $targetKey: "dungeon_id" },
    dungeonGrade: { $type: "s8", $targetKey: "dungeon_grade" },
    clearCount: { $type: "s32", $targetKey: "clear_num" },
    playCount: { $type: "s32", $targetKey: "play_num" },
    isCleared: { $type: "bool", $targetKey: "clear_flag" }
}

interface IRb6PlayerData {
    account: IRb6PlayerAccount
    base: IRb6PlayerBase
    config: IRb6PlayerConfig
    custom: IRb6PlayerCustom
    rival: {}
    pickupRival: {}
    stageLogs?: { log: IRb6PlayerStageLog[] }
    justCollections?: { list: IRb6JustCollection[] }
    classcheck?: { rec: IRb6ClasscheckRecord[] } | IRb6PlayerClasscheckLog
    characterCards: { list: IRb6CharacterCard[] }
    released: { info: IRb6PlayerReleasedInfo[] }
    announce: {}
    playerParam: { item: IRb6PlayerParameters[] }
    mylist: { list?: IRb6Mylist }
    musicRankPoint: {}
    quest: { list?: IRb6QuestRecord[] }
    ghost: {}
    ghostWinCount: {}
    purpose: {}
}
export interface IRb6Player {
    pdata: IRb6PlayerData
}
export const Rb6PlayerReadMap: KObjectMappingRecord<IRb6Player> = {
    pdata: {
        account: Rb6PlayerAccountReadMap,
        base: Rb6PlayerBaseMap,
        config: Rb6PlayerConfigMap,
        custom: Rb6PlayerCustomMap,
        justCollections: {
            list: { 0: Rb6JustCollectionMap },
            $type: "kignore"
        },
        classcheck: <KObjectMappingRecord<{ rec: IRb6ClasscheckRecord[]; }>>{
            rec: { 0: Rb6ClasscheckRecordMap },
            $targetKey: "dojo"
        },
        characterCards: {
            list: { 0: Rb6CharacterCardMap },
            $targetKey: "chara_card"
        },
        stageLogs: {
            log: { 0: Rb6PlayerStageLogMap },
            $targetKey: "kignore"
        },
        released: {
            info: { 0: Rb6PlayerReleasedInfoMap }
        },
        rival: {},
        pickupRival: { $targetKey: "pickup_rival" },
        announce: {},
        playerParam: {
            item: { 0: Rb6PlayerParametersMap },
            $targetKey: "player_param"
        },
        mylist: { list: Rb6MylistMap },
        musicRankPoint: { $targetKey: "music_rank_point" },
        quest: {
            list: { 0: Rb6QuestRecordMap }
        },
        ghost: {},
        ghostWinCount: { $targetKey: "ghost_win_count" },
        purpose: {}
    }
}
export const Rb6PlayerWriteMap: KObjectMappingRecord<IRb6Player> = {
    pdata: {
        account: Rb6PlayerAccountWriteMap,
        base: Rb6PlayerBaseMap,
        config: Rb6PlayerConfigMap,
        custom: Rb6PlayerCustomMap,
        justCollections: {
            list: { 0: Rb6JustCollectionMap },
            $targetKey: "justcollection"
        },
        classcheck: appendMappingElement(Rb6PlayerClasscheckLogMap, { $targetKey: "dojo" }),
        characterCards: {
            list: { 0: Rb6CharacterCardMap },
            $targetKey: "chara_card"
        },
        stageLogs: {
            log: { 0: Rb6PlayerStageLogMap },
            $targetKey: "stglog"
        },
        released: {
            info: { 0: Rb6PlayerReleasedInfoMap }
        },
        rival: {},
        pickupRival: { $targetKey: "pickup_rival" },
        announce: {},
        playerParam: {
            item: { 0: Rb6PlayerParametersMap },
            $targetKey: "player_param"
        },
        mylist: { list: Rb6MylistMap },
        musicRankPoint: { $targetKey: "music_rank_point" },
        quest: {
            list: { 0: Rb6QuestRecordMap }
        },
        ghost: {},
        ghostWinCount: { $targetKey: "ghost_win_count" },
        purpose: {}
    }
}

export function generateRb6Profile(rid: string, userId: number): IRb6Player {
    return {
        pdata: {
            account: generateRb6PlayerAccount(rid, userId),
            base: generateRb6PlayerBase(),
            config: generateRb6PlayerConfig(),
            custom: generateRb6PlayerCustom(),
            classcheck: <any>{},
            characterCards: <any>{},
            released: <any>{},
            rival: {},
            pickupRival: {},
            announce: {},
            playerParam: <any>{},
            mylist: {},
            musicRankPoint: {},
            quest: {},
            ghost: {},
            ghostWinCount: {},
            purpose: {}
        }
    }
}