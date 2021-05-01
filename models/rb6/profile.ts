import { ICollection } from "../utility/definitions"
import { appendMappingElement, BigIntProxy, binme, boolme, getCollectionMappingElement, ignoreme, KObjectMappingRecord, s16me, s32me, s8me, strme, u16me, u64me, u8me } from "../../utility/mapping"
import { IRb6JustCollection, Rb6JustCollectionMap } from "./just_collection"
import { IRb6ClasscheckRecord, Rb6ClasscheckRecordMap } from "./classcheck_record"
import { Rb6CharacterCardMap, IRb6CharacterCard } from "./character_card"
import { IRb6Mylist, Rb6MylistMap } from "./mylist"

export interface IRb6PlayerAccount extends ICollection<"rb.rb6.player.account"> {
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
export const Rb6PlayerAccountWriteMap: KObjectMappingRecord<IRb6PlayerAccount> = {
    collection: getCollectionMappingElement<IRb6PlayerAccount>("rb.rb6.player.account"),
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
    playCount: s32me("tpc")
}
export const Rb6PlayerAccountReadMap: KObjectMappingRecord<IRb6PlayerAccount> = {
    collection: getCollectionMappingElement<IRb6PlayerAccount>("rb.rb6.player.account"),
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
export function generateRb6PlayerAccount(rid: string, userId: number): IRb6PlayerAccount {
    return {
        collection: "rb.rb6.player.account",
        userId: userId,
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
    comment: strme("cmnt"),
    totalBestScore: s32me("tbs"),
    totalBestScoreEachChartType: s32me("tbgs"),
    name: strme(),
    matchingGrade: s32me("mg"),
    abilityPointTimes100: s32me("ap"),
    uattr: s32me(),
    isTutorialEnabled: boolme("is_tut"),
    class: s32me(),
    classAchievrementRateTimes100: s32me("class_ar"),
    skillPointTimes10: s32me("skill_point"),
    pastelParts: s32me("pastel_parts"),
    pastelExperiences: s32me("pastel_exp"),
    rankQuestScore: s32me("rankquestscore"),
    rankQuestRank: s32me("rankquestrank"),
    mLog: s16me("mlog"),
    ghostWinCount: s32me("ghost_win_count")
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
        class: -1,
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
    collection: getCollectionMappingElement<IRb6PlayerConfig>("rb.rb6.player.config"),
    musicSelectBgm: u8me("msel_bgm"),
    narrowDownType: u8me("narrowdown_type"),
    musicLevelDisplayingType: u8me("musiclvdisp_type"),
    characterCardId: s16me("characard_id"),
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
export function generateRb6PlayerConfig(): IRb6PlayerConfig {
    return {
        collection: "rb.rb6.player.config",

        // Second page of customization
        musicSelectBgm: 0,

        narrowDownType: 0,
        musicLevelDisplayingType: 0,
        characterCardId: 0,
        bywordLeft: 0,
        bywordRight: 1,
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
    stageTopAssistDisplayingType: u8me("st_topassist_type"),
    stageBigBangEffectPerformingType: u8me("st_bigbangeff_type"),
    stageChatSoundSwitch: u8me("st_chatvolume_type"),
    stageHighSpeed: u8me("high_speed"),
    stageColorSpecified: u8me("color_type"),
    stageJustCollectionDisplayingType: u8me("justcol_type"),
    stageAchievementRateDisplayingType: u8me("st_clr_gauge"),
    stageClearCondition: u8me("st_clr_cond")
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
    combo: s16me(),
    justCount: s16me("jt_jst"),
    greatCount: s16me("jt_grt"),
    goodCount: s16me("jt_gd"),
    keepCount: s16me("jt_keep"),
    missCount: s16me("jt_ms"),
    justReflecCount: s16me("jt_jr"),
    justCollectionRateTimes100: s16me("justcoll"),
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
    class: s32me(),
    clearType: s32me("clear_type"),
    seperateAchievementRateTimes100: s32me("s_ar"),
    seperateScore: s32me("s_score"),
    averageAchievementRateTimes100: s32me("t_ar"),
    totalScore: s32me("t_score"),
    rank: s32me("score_rank")
}

export interface IRb6PlayerReleasedInfo extends ICollection<"rb.rb6.player.releasedInfo"> {
    type: number
    id: number
    param: number
    insertTime: number
}
export const Rb6PlayerReleasedInfoMap: KObjectMappingRecord<IRb6PlayerReleasedInfo> = {
    collection: getCollectionMappingElement<IRb6PlayerReleasedInfo>("rb.rb6.player.releasedInfo"),
    type: u8me(),
    id: u16me(),
    param: u16me(),
    insertTime: s32me("insert_time")
}

export interface IRb6PlayerParameters extends ICollection<"rb.rb6.player.parameters"> {
    type: number
    bank: number
    data: number[]
}
export const Rb6PlayerParametersMap: KObjectMappingRecord<IRb6PlayerParameters> = {
    collection: getCollectionMappingElement<IRb6PlayerParameters>("rb.rb6.player.parameters"),
    type: s32me(),
    bank: s32me(),
    data: s32me()
}

export interface IRb6QuestRecord extends ICollection<"rb.rb6.playData.quest"> {
    dungeonId: number
    dungeonGrade: number
    rankingId: number
    clearCount: number
    playCount: number
    isCleared: boolean
    score?: number
    lastPlayTime: number
    updateTime: number
}
export const Rb6QuestRecordMap: KObjectMappingRecord<IRb6QuestRecord> = {
    collection: getCollectionMappingElement<IRb6QuestRecord>("rb.rb6.playData.quest"),
    dungeonId: s32me("dungeon_id"),
    dungeonGrade: s8me("dungeon_grade"),
    rankingId: ignoreme(),
    clearCount: s32me("clear_num"),
    playCount: s32me("play_num"),
    isCleared: boolme("clear_flg"),
    score: ignoreme(),
    lastPlayTime: ignoreme(),
    updateTime: ignoreme(),
}

export interface IRb6Ghost extends ICollection<"rb.rb6.playData.ghost#userId"> {
    userId?: number
    characterCardId: number
    matchingGrade: number
    musicId: number
    chartType: number
    redData?: Buffer
    blueData?: Buffer
    redDataBase64?: string
    blueDataBase64?: string
}
export const Rb6GhostMap: KObjectMappingRecord<IRb6Ghost> = {
    collection: getCollectionMappingElement<IRb6Ghost>("rb.rb6.playData.ghost#userId"),
    userId: ignoreme(),
    characterCardId: s32me("chara_card_id"),
    matchingGrade: s32me("matching_grade"),
    musicId: s32me("music_id"),
    chartType: s8me("note_grade"),
    redData: binme("item_red_data_bin"),
    blueData: binme("item_blue_data_bin"),
    redDataBase64: ignoreme(),
    blueDataBase64: ignoreme()
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
    ghost: { list?: IRb6Ghost[] }
    ghostWinCount: {
        info: number
    }
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
        ghost: {
            list: { 0: Rb6GhostMap }
        },
        ghostWinCount: { info: s32me(), $targetKey: "ghost_win_count" },
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
        ghost: {
            list: { 0: Rb6GhostMap }
        },
        ghostWinCount: { info: s32me(), $targetKey: "ghost_win_count" },
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
            ghostWinCount: { info: 0 },
            purpose: {}
        }
    }
}