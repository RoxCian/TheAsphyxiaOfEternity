import { ICollection } from "../utility/definitions"
import { appendMappingElement, BigIntProxy, getCollectionMappingElement, KObjectMappingRecord } from "../../utility/mapping"
import { IRb3Mylist, Rb3MylistMap } from "./mylist"
import { generateRb2LincleLink, IRb2LincleLink, Rb2LincleLinkMap } from "../rb2/profile"
import { IRb3MusicRecord, Rb3MusicRecordMap } from "./music_record"

export interface IRb3PlayerAccount extends ICollection<"rb.rb3.player.account"> {
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
export const Rb3PlayerAccountWriteMap: KObjectMappingRecord<IRb3PlayerAccount> = {
    collection: getCollectionMappingElement<IRb3PlayerAccount>("rb.rb3.player.account"),
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
    playCount: { $type: "kignore", $fallbackValue: 0 },
}
export const Rb3PlayerAccountReadMap: KObjectMappingRecord<IRb3PlayerAccount> = {
    collection: getCollectionMappingElement<IRb3PlayerAccount>("rb.rb3.player.account"),
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
    playCount: { $type: "kignore", $fallbackValue: 0 },
}
export function generateRb3PlayerAccount(rid: string, userId?: number): IRb3PlayerAccount {
    return {
        collection: "rb.rb3.player.account",
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
        st: BigInt(Date.now().toString() + "000"),
        opc: 0,
        lpc: 0,
        cpc: 0,
        mpc: 0,
        playCount: 0
    }
}

export interface IRb3PlayerBase extends ICollection<"rb.rb3.player.base"> {
    comment: string
    teamId: number
    teamName: string
    totalBestScore: number
    totalBestScoreRival: number
    name: string
    matchingGrade: number // <mg />
    abilityPointTimes100: number // <ap />
    onigiriTimes10: number
    level: number
    hiddenParam: number[]
    isTutorialEnabled: boolean
    uattr: number
}
export const Rb3PlayerBaseMap: KObjectMappingRecord<IRb3PlayerBase> = {
    collection: getCollectionMappingElement<IRb3PlayerBase>("rb.rb3.player.base"),
    comment: { $type: "str", $targetKey: "cmnt" },
    teamId: { $type: "s32", $targetKey: "tid" },
    teamName: { $type: "str", $targetKey: "tname" },
    totalBestScore: { $type: "s32", $targetKey: "tbs" },
    totalBestScoreRival: { $type: "s32", $targetKey: "tbs_r" },
    name: { $type: "str" },
    matchingGrade: { $type: "s32", $targetKey: "mg" },
    abilityPointTimes100: { $type: "s32", $targetKey: "ap" },
    isTutorialEnabled: { $type: "bool", $targetKey: "is_tut" },
    onigiriTimes10: { $type: "s32", $targetKey: "exp" },
    level: { $type: "s32", $targetKey: "lv" },
    hiddenParam: { $type: "s32", $targetKey: "hidden_param" },
    uattr: { $type: "s32" }
}
export function generateRb3PlayerBase(): IRb3PlayerBase {
    return {
        collection: "rb.rb3.player.base",
        comment: "",
        teamId: -1,
        teamName: "Asphyxia",
        totalBestScore: 0,
        totalBestScoreRival: 0,
        name: "",
        matchingGrade: 0,
        abilityPointTimes100: 0,
        isTutorialEnabled: true,
        level: 0,
        onigiriTimes10: 0,
        hiddenParam: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        uattr: 0
    }
}

export interface IRb3PlayerConfig extends ICollection<"rb.rb3.player.config"> {
    tabSelected: number
    rivalPanelType: number
    folderLampType: number

    musicSelectBgm: number // <msel_bgm __type="u8" />
    narrowDownType: number // "u8"
    // Second page of customization
    iconId: number
    bywordLeft: number // <byword_0 __type="s16" />
    bywordRight: number // <byword_1 __type="s16" />
    isAutoBywordLeft: boolean // <is_auto_byword_0 __type="bool" />
    isAutoBywordRight: boolean // <is_auto_byword_1 __type = "bool" />

    memoryRecordingType: number // <mrec_type __type="u8" />
    cardDisplay: number // <card_disp __type="u8" />
    scoreTabDisplay: number
    lastMusicId: number // "s16"
    lastChartType: number // "u8"
    sortType: number // "u8"
    randomEntryWork: bigint | BigIntProxy
    customFolderWork: bigint | BigIntProxy
    folderType: number // "u8"
    isTweet: boolean
    isTwitterLinked: boolean // <is_link_twitter __type="bool" />
}
export const Rb3PlayerConfigMap: KObjectMappingRecord<IRb3PlayerConfig> = {
    collection: getCollectionMappingElement("rb.rb3.player.config"),
    iconId: { $type: "s16", $targetKey: "icon_id" },
    tabSelected: { $type: "u8", $targetKey: "tab_sel" },
    rivalPanelType: { $type: "u8", $targetKey: "rival_panel_type" },
    folderLampType: { $type: "u8", $targetKey: "folder_lamp_type" },


    musicSelectBgm: { $type: "u8", $targetKey: "msel_bgm" },
    narrowDownType: { $type: "u8", $targetKey: "narrowdown_type" },
    bywordLeft: { $type: "s16", $targetKey: "byword_0" },
    bywordRight: { $type: "s16", $targetKey: "byword_1" },
    isAutoBywordLeft: { $type: "bool", $targetKey: "is_auto_byword_0" },
    isAutoBywordRight: { $type: "bool", $targetKey: "is_auto_byword_1" },
    memoryRecordingType: { $type: "u8", $targetKey: "mrec_type" },
    cardDisplay: { $type: "u8", $targetKey: "card_disp" },
    scoreTabDisplay: { $type: "u8", $targetKey: "score_tab_disp" },
    lastMusicId: { $type: "s16", $targetKey: "last_music_id" },
    lastChartType: { $type: "u8", $targetKey: "last_note_grade" },
    sortType: { $type: "u8", $targetKey: "sort_type" },
    randomEntryWork: { $type: "u64", $targetKey: "random_entry_work" },
    customFolderWork: { $type: "u64", $targetKey: "custom_folder_work" },
    folderType: { $type: "u8", $targetKey: "folder_lamp_type" },
    isTweet: { $type: "bool", $targetKey: "is_tweet" },
    isTwitterLinked: { $type: "bool", $targetKey: "is_link_twitter" }
}
export function generateRb3PlayerConfig(): IRb3PlayerConfig {
    return {
        collection: "rb.rb3.player.config",
        iconId: 0,
        tabSelected: 0,
        rivalPanelType: 0,
        folderLampType: 0,

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

export interface IRb3PlayerCustom extends ICollection<"rb.rb3.player.custom"> {

    // First page of customization
    stageShotSound: number
    stageShotVolume: number
    stageExplodeType: number
    stageFrameType: number
    stageBackground: number
    stageBackgroundBrightness: number
    stageObjectSize: number

    // Third page of customization
    simpleChatSetBeforeMatching: number[]
    simpleChatSetAfterMatching: number[]
    iconChatSetBeforeMatching: number[]
    iconChatSetAfterMatching: number[]

    // Forth page of customization
    stageMainGaugeType: number
    stageClearGaugeType: number
    stageJudgeDisplayingType: number
    stageTouchMarkerDisplayingType: number
    stageRandom: number // ?

}
export const Rb3PlayerCustomMap: KObjectMappingRecord<IRb3PlayerCustom> = {
    collection: getCollectionMappingElement<IRb3PlayerCustom>("rb.rb3.player.custom"),
    stageMainGaugeType: { $type: "u8", $targetKey: "st_jr_gauge" },

    stageShotSound: { $type: "u8", $targetKey: "st_shot" },
    stageFrameType: { $type: "u8", $targetKey: "st_frame" },
    stageExplodeType: { $type: "u8", $targetKey: "st_expl" },
    stageBackground: { $type: "u8", $targetKey: "st_bg" },
    stageShotVolume: { $type: "u8", $targetKey: "st_shot_vol" },
    stageBackgroundBrightness: { $type: "u8", $targetKey: "st_bg_bri" },
    stageObjectSize: { $type: "u8", $targetKey: "st_obj_size" },
    stageClearGaugeType: { $type: "u8", $targetKey: "st_clr_gauge" },
    stageRandom: { $type: "u8", $targetKey: "st_rnd" },
    simpleChatSetBeforeMatching: { $type: "s16", $targetKey: "schat_0" },
    simpleChatSetAfterMatching: { $type: "s16", $targetKey: "schat_1" },
    iconChatSetBeforeMatching: { $type: "s16", $targetKey: "ichat_0" },
    iconChatSetAfterMatching: { $type: "s16", $targetKey: "ichat_1" },
    stageJudgeDisplayingType: { $type: "u8", $targetKey: "st_jdg_disp" },
    stageTouchMarkerDisplayingType: { $type: "u8", $targetKey: "st_tm_disp" },
}
export function generateRb3PlayerCustom(): IRb3PlayerCustom {
    return {
        collection: "rb.rb3.player.custom",
        stageMainGaugeType: 0,
        stageClearGaugeType: 0,
        stageObjectSize: 3,
        stageShotSound: 0,
        stageShotVolume: 100,
        stageExplodeType: 0,
        stageFrameType: 0,
        stageBackground: 0,
        stageBackgroundBrightness: 100,
        stageRandom: 0,
        stageJudgeDisplayingType: 0,
        stageTouchMarkerDisplayingType: 0,
        simpleChatSetBeforeMatching: [0, 1, 2, 3, 4, 5, 6, 7, 8],
        simpleChatSetAfterMatching: [9, 10, 11, 12, 13, 14, 15, 16, 17],
        iconChatSetBeforeMatching: [0, 1, 2, 3, -1, -1],
        iconChatSetAfterMatching: [0, 1, 2, 3, -1, -1]
    }
}

export interface IRb3PlayerStageLog extends ICollection<"rb.rb3.playData.stageLog"> {
    stageIndex: number
    musicId: number
    chartType: number
    color: number
    mt: number
    rt: number
    clearType: number // 2: F, 3: C
    matchingGrade: number
    clearGaugeTimes100: number
    achievementRateTimes100: number
    score: number
    combo: number
    experience: number
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
export const Rb3PlayerStageLogMap: KObjectMappingRecord<IRb3PlayerStageLog> = {
    collection: getCollectionMappingElement<IRb3PlayerStageLog>("rb.rb3.playData.stageLog"),
    stageIndex: { $type: "s8", $targetKey: "stg" },
    musicId: { $type: "s16", $targetKey: "mid" },
    chartType: { $type: "s8", $targetKey: "ng" },
    color: { $type: "s8", $targetKey: "col" },
    mt: { $type: "s8" },
    rt: { $type: "s8" },
    clearType: { $type: "s8", $targetKey: "ct" },
    matchingGrade: { $type: "s16", $targetKey: "grd" },
    clearGaugeTimes100: { $type: "s16", $targetKey: "cl_gauge" },
    achievementRateTimes100: { $type: "s16", $targetKey: "ar" },
    score: { $type: "s16", $targetKey: "sc" },
    combo: { $type: "s16", $targetKey: "cmb" },
    experience: { $type: "s16", $targetKey: "exp" },
    justCount: { $type: "s16", $targetKey: "jt_jst" },
    greatCount: { $type: "s16", $targetKey: "jt_grt" },
    goodCount: { $type: "s16", $targetKey: "jt_gd" },
    missCount: { $type: "s16", $targetKey: "jt_ms" },
    justReflecCount: { $type: "s16", $targetKey: "jt_jr" },
    rivalUserId: { $type: "s32", $targetKey: "r_uid" },
    rivalPlayerId: { $type: "s32", $targetKey: "r_plyid" },
    rivalStageIndex: { $type: "s8", $targetKey: "r_stg" },
    rivalClearType: { $type: "s8", $targetKey: "r_ct" },
    rivalScore: { $type: "s16", $targetKey: "r_sc" },
    rivalMatchingGrade: { $type: "s16", $targetKey: "r_grd" },
    rivalClearGaugeTimes100: { $type: "s16", $targetKey: "r_cl_gauge" },
    rivalAchievementRateTimes100: { $type: "s16", $targetKey: "r_ar" },
    rivalCpuId: { $type: "s8", $targetKey: "r_cpuid" }, // cpuid: 9/7, music: Velvet Centiment, rival: Cecil Spade; cpuid: 9, music: SPEED BLADE, rival: Francis Club;
    time: { $type: "s32" },
    decide: { $type: "s8" }
}

export interface IRb3EventProgress extends ICollection<"rb.rb3.player.event.eventProgress"> {
    index: number
    experience: number
}
export const Rb3EventProgressMap: KObjectMappingRecord<IRb3EventProgress> = {
    collection: getCollectionMappingElement<IRb3EventProgress>("rb.rb3.player.event.eventProgress"),
    index: { $type: "s16", $targetKey: "id" },
    experience: { $type: "s32", $targetKey: "exp" }
}

export interface IRb3Equip extends ICollection<"rb.rb3.player.equip"> {
    index: number
    experience: number
    stype?: number
}
export const Rb3EquipMap: KObjectMappingRecord<IRb3Equip> = {
    collection: getCollectionMappingElement<IRb3Equip>("rb.rb3.player.equip"),
    index: { $type: "s16", $targetKey: "id" },
    experience: { $type: "s32", $targetKey: "exp" },
    stype: { $type: "s16" }
}

export interface IRb3SeedPod extends ICollection<"rb.rb3.player.event.seedPod"> {
    index: number
    pod: number
}
export const Rb3SeedPodMap: KObjectMappingRecord<IRb3SeedPod> = {
    collection: getCollectionMappingElement<IRb3SeedPod>("rb.rb3.player.event.seedPod"),
    index: { $type: "s16", $targetKey: "id" },
    pod: { $type: "s16" },
}

export interface IRb3OrderDetails {
    index: number
    slot: number
    clearedCount: number
    fragmentsCount0: number
    fragmentsCount1: number
    param: number
}
export const Rb3OrderDetailsMap: KObjectMappingRecord<IRb3OrderDetails> = {
    index: { $type: "s16", $targetKey: "order" },
    slot: { $type: "s16", $targetKey: "slt" },
    clearedCount: { $type: "s32", $targetKey: "ccnt" },
    fragmentsCount0: { $type: "s32", $targetKey: "fcnt" },
    fragmentsCount1: { $type: "s32", $targetKey: "fcnt1" },
    param: { $type: "s32", $targetKey: "prm" }
}
export interface IRb3Order extends ICollection<"rb.rb3.player.order"> {
    experience: number
    details?: IRb3OrderDetails[]
}
export const Rb3OrderMap: KObjectMappingRecord<IRb3Order> = {
    collection: getCollectionMappingElement<IRb3Order>("rb.rb3.player.order"),
    experience: { $type: "s32", $targetKey: "exp" },
    details: { 0: Rb3OrderDetailsMap, $targetKey: "d" }
}

export interface IRb3PlayerReleasedInfo extends ICollection<"rb.rb3.player.releasedInfo"> {
    type: number
    id: number
    param: number
    insertTime: number
}
export const Rb3PlayerReleasedInfoMap: KObjectMappingRecord<IRb3PlayerReleasedInfo> = {
    collection: getCollectionMappingElement<IRb3PlayerReleasedInfo>("rb.rb3.player.releasedInfo"),
    type: { $type: "u8" },
    id: { $type: "u16" },
    param: { $type: "u16" },
    insertTime: { $type: "s32", $targetKey: "insert_time" }
}

export interface IRb3Stamp extends ICollection<"rb.rb3.player.stamp"> {
    stampCount: number[]
    ticketCount: number[]
    area: bigint | BigIntProxy
    magic: bigint | BigIntProxy
    reserve: number
}
export const Rb3StampMap: KObjectMappingRecord<IRb3Stamp> = {
    collection: getCollectionMappingElement<IRb3Stamp>("rb.rb3.player.stamp"),
    stampCount: { $type: "s32", $targetKey: "stmpcnt" },
    ticketCount: { $type: "s32", $targetKey: "tcktcnt" },
    area: { $type: "s64" },
    magic: { $type: "s64", $targetKey: "prfvst" },
    reserve: { $type: "s32" }
}
export function generateRb3Stamp(): IRb3Stamp {
    return {
        collection: "rb.rb3.player.stamp",
        stampCount: [0, 0, 0, 0, 0],
        ticketCount: [0, 0, 0, 0, 0],
        area: BigInt(7),
        magic: BigInt(Math.trunc(Math.random() * 99999999)),
        reserve: 0
    }
}

export interface IRb3TricolettePark extends ICollection<"rb.rb3.player.tricolettePark"> {
    openMusic: number
    boss0Damage: number
    boss1Damage: number
    boss2Damage: number
    boss3Damage: number
    boss0Stun: number
    boss1Stun: number
    boss2Stun: number
    boss3Stun: number
    magicGauge: number
    todaysParty: number
    isUseUnionMagic: boolean
}
export const Rb3TricoletteParkMap: KObjectMappingRecord<IRb3TricolettePark> = {
    collection: getCollectionMappingElement<IRb3TricolettePark>("rb.rb3.player.tricolettePark"),
    openMusic: { $type: "s32", $targetKey: "open_music" },
    boss0Damage: { $type: "s32", $targetKey: "boss0_damage" },
    boss1Damage: { $type: "s32", $targetKey: "boss1_damage" },
    boss2Damage: { $type: "s32", $targetKey: "boss2_damage" },
    boss3Damage: { $type: "s32", $targetKey: "boss3_damage" },
    boss0Stun: { $type: "s32", $targetKey: "boss0_stun" },
    boss1Stun: { $type: "s32", $targetKey: "boss1_stun" },
    boss2Stun: { $type: "s32", $targetKey: "boss2_stun" },
    boss3Stun: { $type: "s32", $targetKey: "boss3_stun" },
    magicGauge: { $type: "s32", $targetKey: "magic_gauge" },
    todaysParty: { $type: "s32", $targetKey: "today_party" },
    isUseUnionMagic: { $type: "bool", $targetKey: "use_union_magic" },
    $targetKey: "tricolettepark"
}
export function generateRb3TricolettePark(): IRb3TricolettePark {
    return {
        collection: "rb.rb3.player.tricolettePark",
        openMusic: 0,
        boss0Damage: 0,
        boss1Damage: 0,
        boss2Damage: 0,
        boss3Damage: 0,
        boss0Stun: 0,
        boss1Stun: 0,
        boss2Stun: 0,
        boss3Stun: 0,
        magicGauge: 0,
        todaysParty: 0,
        isUseUnionMagic: false
    }
}

interface IRb3PlayerData {
    account: IRb3PlayerAccount
    base: IRb3PlayerBase
    config: IRb3PlayerConfig
    custom: IRb3PlayerCustom
    rival: {}
    lincleLink: IRb2LincleLink
    tricolettePark: IRb3TricolettePark
    stamp: IRb3Stamp
    eventProgress: { data?: IRb3EventProgress[] }
    equip: { data?: IRb3Equip[] }
    seedPod: { data?: IRb3SeedPod[] }
    order: IRb3Order
    record?: { rec?: IRb3MusicRecord[] }
    recordOld?: { rec?: IRb3MusicRecord[] }
    stageLogs?: { log: IRb3PlayerStageLog[] }
    released: { info: IRb3PlayerReleasedInfo[] }
    announce: {}
    mylist: IRb3Mylist
    musicRankPoint: {}
    ghost: {}
    ghostWinCount: {}
    purpose: {}
    share: {}
}
export interface IRb3Player {
    pdata: IRb3PlayerData
}
export const Rb3PlayerReadMap: KObjectMappingRecord<IRb3Player> = {
    pdata: {
        account: Rb3PlayerAccountReadMap,
        base: Rb3PlayerBaseMap,
        config: Rb3PlayerConfigMap,
        custom: Rb3PlayerCustomMap,
        record: { rec: { 0: Rb3MusicRecordMap } },
        recordOld: { rec: { 0: Rb3MusicRecordMap }, $targetKey: "record_old" },
        stageLogs: {
            log: { 0: Rb3PlayerStageLogMap },
            $targetKey: "kignore"
        },
        released: {
            info: { 0: Rb3PlayerReleasedInfoMap }
        },
        rival: {},
        announce: {},
        lincleLink: appendMappingElement(Rb2LincleLinkMap, { $targetKey: "lincle_link_4" }),
        tricolettePark: Rb3TricoletteParkMap,
        stamp: Rb3StampMap,
        eventProgress: {
            data: { 0: Rb3EventProgressMap },
            $targetKey: "evntexp"
        },
        equip: {
            data: { 0: Rb3EquipMap },
            $targetKey: "eqpexp"
        },
        seedPod: {
            data: { 0: Rb3SeedPodMap },
            $targetKey: "seedpod"
        },
        order: Rb3OrderMap,
        mylist: Rb3MylistMap,
        musicRankPoint: { $targetKey: "music_rank_point" },
        ghost: {},
        ghostWinCount: { $targetKey: "ghost_win_count" },
        purpose: {},
        share: {},
    }
}
export const Rb3PlayerWriteMap: KObjectMappingRecord<IRb3Player> = {
    pdata: {
        account: Rb3PlayerAccountWriteMap,
        base: Rb3PlayerBaseMap,
        config: Rb3PlayerConfigMap,
        custom: Rb3PlayerCustomMap,
        record: { rec: { 0: Rb3MusicRecordMap }, $type: "kignore" },
        recordOld: { rec: { 0: Rb3MusicRecordMap }, $type: "kignore", $targetKey: "record_old" },
        stageLogs: {
            log: { 0: Rb3PlayerStageLogMap },
            $targetKey: "stglog"
        },
        released: {
            info: { 0: Rb3PlayerReleasedInfoMap }
        },
        rival: {},
        announce: {},
        lincleLink: appendMappingElement(Rb2LincleLinkMap, { $targetKey: "lincle_link_4" }),
        tricolettePark: Rb3TricoletteParkMap,
        stamp: Rb3StampMap,
        eventProgress: {
            data: { 0: Rb3EventProgressMap },
            $targetKey: "evntexp"
        },
        equip: {
            data: { 0: Rb3EquipMap },
            $targetKey: "eqpexp"
        },
        seedPod: {
            data: { 0: Rb3SeedPodMap },
            $targetKey: "seedpod"
        },
        order: Rb3OrderMap,
        mylist: Rb3MylistMap,
        musicRankPoint: { $targetKey: "music_rank_point" },
        ghost: {},
        ghostWinCount: { $targetKey: "ghost_win_count" },
        purpose: {},
        share: {},
    }
}

export function generateRb3Profile(rid: string, userId?: number): IRb3Player {
    return {
        pdata: {
            account: generateRb3PlayerAccount(rid, userId),
            base: generateRb3PlayerBase(),
            config: generateRb3PlayerConfig(),
            custom: generateRb3PlayerCustom(),
            rival: {},
            announce: {},
            lincleLink: generateRb2LincleLink(),
            tricolettePark: generateRb3TricolettePark(),
            stamp: generateRb3Stamp(),
            eventProgress: {},
            equip: {},
            seedPod: {},
            order: {
                collection: "rb.rb3.player.order",
                experience: 0
            },
            mylist: { collection: "rb.rb3.player.mylist" },
            released: <any>{},
            musicRankPoint: {},
            ghost: {},
            ghostWinCount: {},
            purpose: {},
            share: {},
            record: {},
            recordOld: {}
        }
    }
}