import { ICollection } from "../utility/definitions"
import { appendMappingElement, BigIntProxy, boolme, getCollectionMappingElement, ignoreme, KObjectMappingRecord, s16me, s32me, s64me, s8me, strme, u16me, u64me, u8me } from "../../utility/mapping"
import { IRb3Mylist, Rb3MylistMap } from "./mylist"
import { generateRb2LincleLink, IRb2LincleLink, Rb2LincleLinkMap } from "../rb2/profile"
import { IRb3MusicRecord, Rb3MusicRecordMap, Rb3OldMusicRecordMap } from "./music_record"

export interface IRb3PlayerAccount extends ICollection<"rb.rb3.player.account"> {
    userId: number
    playerId: number
    dpc?: number
    playCountToday?: number
    crd: number
    brd: number
    tdc?: number
    dayCount?: number
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
    userId: s32me("usrid"),
    playerId: s32me("plyid"),
    /** * @deprecated Use playCountToday instead  */
    dpc: ignoreme(),
    playCountToday: s32me("dpc"),
    crd: s32me(),
    brd: s32me(),
    /** * @deprecated Use dayCount instead  */
    tdc: ignoreme(),
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
    playCount: s32me("tpc"),
}
export const Rb3PlayerAccountReadMap: KObjectMappingRecord<IRb3PlayerAccount> = {
    collection: getCollectionMappingElement<IRb3PlayerAccount>("rb.rb3.player.account"),
    userId: s32me("usrid"),
    playerId: ignoreme(),
    dpc: s32me(),
    playCountToday: s32me("dpc"),
    crd: s32me(),
    brd: s32me(),
    tdc: s32me(),
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
    playCount: s32me("tpc"),
}
export function generateRb3PlayerAccount(rid: string, userId?: number): IRb3PlayerAccount {
    return {
        collection: "rb.rb3.player.account",
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
    comment: strme("cmnt"),
    teamId: s32me("tid"),
    teamName: strme("tname"),
    totalBestScore: s32me("tbs"),
    totalBestScoreRival: s32me("tbs_r"),
    name: strme(),
    matchingGrade: s32me("mg"),
    abilityPointTimes100: s32me("ap"),
    isTutorialEnabled: boolme("is_tut"),
    onigiriTimes10: s32me("exp"),
    level: s32me("lv"),
    hiddenParam: s32me("hidden_param"),
    uattr: s32me()
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
    collection: getCollectionMappingElement<IRb3PlayerConfig>("rb.rb3.player.config"),
    iconId: s16me("icon_id"),
    tabSelected: u8me("tab_sel"),
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
    folderType: u8me("folder_lamp_type"),
    isTweet: boolme("is_tweet"),
    isTwitterLinked: boolme("is_link_twitter")
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
    stageMainGaugeType: u8me("st_jr_gauge"),

    stageShotSound: u8me("st_shot"),
    stageFrameType: u8me("st_frame"),
    stageExplodeType: u8me("st_expl"),
    stageBackground: u8me("st_bg"),
    stageShotVolume: u8me("st_shot_vol"),
    stageBackgroundBrightness: u8me("st_bg_bri"),
    stageObjectSize: u8me("st_obj_size"),
    stageClearGaugeType: u8me("st_clr_gauge"),
    stageRandom: u8me("st_rnd"),
    simpleChatSetBeforeMatching: s16me("schat_0"),
    simpleChatSetAfterMatching: s16me("schat_1"),
    iconChatSetBeforeMatching: s16me("ichat_0"),
    iconChatSetAfterMatching: s16me("ichat_1"),
    stageJudgeDisplayingType: u8me("st_jdg_disp"),
    stageTouchMarkerDisplayingType: u8me("st_tm_disp"),
}
export function generateRb3PlayerCustom(): IRb3PlayerCustom {
    return {
        collection: "rb.rb3.player.custom",
        stageMainGaugeType: 0,
        stageClearGaugeType: 0,
        stageObjectSize: 0,
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
    stageIndex: s8me("stg"),
    musicId: s16me("mid"),
    chartType: s8me("ng"),
    color: s8me("col"),
    mt: s8me(),
    rt: s8me(),
    clearType: s8me("ct"),
    matchingGrade: s16me("grd"),
    clearGaugeTimes100: s16me("cl_gauge"),
    achievementRateTimes100: s16me("ar"),
    score: s16me("sc"),
    combo: s16me("cmb"),
    experience: s16me("exp"),
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
    rivalCpuId: s8me("r_cpuid"), // cpuid: 9/7, music: Velvet Sentiment, rival: Cecil Spade; cpuid: 9, music: SPEED BLADE, rival: Francis Club;
    time: s32me(),
    decide: s8me()
}

export interface IRb3EventProgress extends ICollection<"rb.rb3.player.event.eventProgress"> {
    index: number
    experience: number
}
export const Rb3EventProgressMap: KObjectMappingRecord<IRb3EventProgress> = {
    collection: getCollectionMappingElement<IRb3EventProgress>("rb.rb3.player.event.eventProgress"),
    index: s16me("id"),
    experience: s32me("exp")
}

export interface IRb3Equip extends ICollection<"rb.rb3.player.equip"> {
    index: number
    experience: number
    stype?: number
}
export const Rb3EquipMap: KObjectMappingRecord<IRb3Equip> = {
    collection: getCollectionMappingElement<IRb3Equip>("rb.rb3.player.equip"),
    index: s16me("id"),
    experience: s32me("exp"),
    stype: s16me()
}

export interface IRb3SeedPod extends ICollection<"rb.rb3.player.event.seedPod"> {
    index: number
    pod: number
}
export const Rb3SeedPodMap: KObjectMappingRecord<IRb3SeedPod> = {
    collection: getCollectionMappingElement<IRb3SeedPod>("rb.rb3.player.event.seedPod"),
    index: s16me("id"),
    pod: s16me(),
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
    index: s16me("order"),
    slot: s16me("slt"),
    clearedCount: s32me("ccnt"),
    fragmentsCount0: s32me("fcnt"),
    fragmentsCount1: s32me("fcnt1"),
    param: s32me("prm")
}
export interface IRb3Order extends ICollection<"rb.rb3.player.order"> {
    experience: number
    details?: IRb3OrderDetails[]
}
export const Rb3OrderMap: KObjectMappingRecord<IRb3Order> = {
    collection: getCollectionMappingElement<IRb3Order>("rb.rb3.player.order"),
    experience: s32me("exp"),
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
    type: u8me(),
    id: u16me(),
    param: u16me(),
    insertTime: s32me("insert_time")
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
    stampCount: s32me("stmpcnt"),
    ticketCount: s32me("tcktcnt"),
    area: s64me(),
    magic: s64me("prfvst"),
    reserve: s32me()
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
    openMusic: s32me("open_music"),
    boss0Damage: s32me("boss0_damage"),
    boss1Damage: s32me("boss1_damage"),
    boss2Damage: s32me("boss2_damage"),
    boss3Damage: s32me("boss3_damage"),
    boss0Stun: s32me("boss0_stun"),
    boss1Stun: s32me("boss1_stun"),
    boss2Stun: s32me("boss2_stun"),
    boss3Stun: s32me("boss3_stun"),
    magicGauge: s32me("magic_gauge"),
    todaysParty: s32me("today_party"),
    isUseUnionMagic: boolme("use_union_magic"),
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
        recordOld: { rec: { 0: Rb3OldMusicRecordMap }, $targetKey: "record_old" },
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