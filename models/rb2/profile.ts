import { appendMappingElement, getCollectionMappingElement, KObjectMappingRecord, s32me, strme } from "../../utility/mapping"
import { ICollection } from "../utility/definitions"
import { IRb2StageLogStandaloneElement, Rb2StageLogStandaloneElementMap } from "./stage_log_standalone"

export interface IRb2PlayerBase extends ICollection<"rb.rb2.player.base"> {
    userId: number
    name: string
    comment: string
    iconId: number
    level: number
    experience: number
    matchingGrade: number
    abilityPointTimes100: number
    playCount: number
    uattr: number
}
export const Rb2PlayerBaseMap: KObjectMappingRecord<IRb2PlayerBase> = {
    collection: getCollectionMappingElement<IRb2PlayerBase>("rb.rb2.player.base"),
    userId: { $type: "s32", $targetKey: "uid" },
    iconId: { $type: "s16", $targetKey: "icon_id" },
    name: { $type: "str" },
    comment: { $type: "kignore" },
    level: { $type: "s16", $targetKey: "lv" },
    experience: { $type: "s32", $targetKey: "exp" },
    matchingGrade: { $type: "s16", $targetKey: "mg" },
    abilityPointTimes100: { $type: "s16", $targetKey: "ap" },
    playCount: { $type: "s32", $targetKey: "pc" },
    uattr: { $type: "s32" }
}
export function generateRb2PlayerBase(userId: number): IRb2PlayerBase {
    return {
        collection: "rb.rb2.player.base",
        userId: userId,
        iconId: 0,
        name: "",
        comment: "",
        level: 0,
        experience: 0,
        matchingGrade: 0,
        abilityPointTimes100: 0,
        playCount: 0,
        uattr: 0
    }
}

export interface IRb2PlayerStat extends ICollection<"rb.rb2.player.stat"> {
    day: number
    playCount: number
    totalCount: number
    last: number
    now: number
}
export const Rb2PlayerStatMap: KObjectMappingRecord<IRb2PlayerStat> = {
    collection: getCollectionMappingElement<IRb2PlayerStat>("rb.rb2.player.stat"),
    day: { $type: "s32" },
    playCount: { $type: "s32", $targetKey: "cnt" },
    totalCount: { $type: "s32", $targetKey: "total_cnt" },
    last: { $type: "s32" },
    now: { $type: "s32" }
}
export function generateRb2PlayerStat(): IRb2PlayerStat {
    return {
        collection: "rb.rb2.player.stat",
        day: 0,
        playCount: 0,
        totalCount: 0,
        last: 0,
        now: 0
    }
}

export interface IRb2PlayerCustom extends ICollection<"rb.rb2.player.custom"> {
    stageBackgroundMusic: number
    stageFrameType: number
    stageBackground: number
    stageBackgroundBrightness: number
    stageExplodeType: number
    stageShotSound: number
    stageShotVolume: number
    selectedGlass: number
    sortType: number
    lastMusicId: number
    lastChartType: number
    narrowDownType: number
    isBeginner: boolean
    isTutorialEnabled: boolean
    symbolChatSet1: number[]
    symbolChatSet2: number[]
    gaugeStyle: number
    objectShade: number
    objectSize: number
    byword: [number, number]
    isAutoByword: [boolean, boolean]
    isTweet: boolean
    isTwitterLinked: boolean
    mrecType: number
    cardDisplayType: number
    tabSelected: number
    hiddenParam: number[]
}
export const Rb2PlayerCustomMap: KObjectMappingRecord<IRb2PlayerCustom> = {
    collection: getCollectionMappingElement<IRb2PlayerCustom>("rb.rb2.player.custom"),
    stageBackgroundMusic: { $type: "u8", $targetKey: "bgm_m" },
    stageFrameType: { $type: "u8", $targetKey: "st_f" },
    stageBackground: { $type: "u8", $targetKey: "st_bg" },
    stageBackgroundBrightness: { $type: "u8", $targetKey: "st_bg_b" },
    stageExplodeType: { $type: "u8", $targetKey: "eff_e" },
    stageShotSound: { $type: "u8", $targetKey: "se_s" },
    stageShotVolume: { $type: "u8", $targetKey: "se_s_v" },
    selectedGlass: { $type: "u8", $targetKey: "s_gls" },
    sortType: { $type: "u8", $targetKey: "sort_type" },
    lastMusicId: { $type: "s16", $targetKey: "last_music_id" },
    lastChartType: { $type: "u8", $targetKey: "last_note_grade" },
    narrowDownType: { $type: "u8", $targetKey: "narrowdown_type" },
    isBeginner: { $type: "bool", $targetKey: "is_begginer" }, // Begginer? Excuse me?
    isTutorialEnabled: { $type: "bool", $targetKey: "is_tut" },
    symbolChatSet1: { $type: "s16", $targetKey: "symbol_chat_0" },
    symbolChatSet2: { $type: "s16", $targetKey: "symbol_chat_1" },
    gaugeStyle: { $type: "u8", $targetKey: "gauge_style" },
    objectShade: { $type: "u8", $targetKey: "obj_shade" },
    objectSize: { $type: "u8", $targetKey: "obj_size" },
    byword: { $type: "s16" },
    isAutoByword: { $type: "bool", $targetKey: "is_auto_byword" },
    isTweet: { $type: "bool", $targetKey: "is_tweet" },
    isTwitterLinked: { $type: "bool", $targetKey: "is_link_twitter" },
    mrecType: { $type: "s16", $targetKey: "mrec_type" },
    cardDisplayType: { $type: "s16", $targetKey: "card_disp_type" },
    tabSelected: { $type: "s16", $targetKey: "tab_sel" },
    hiddenParam: { $type: "s32", $targetKey: "hidden_param" }
}
export function generateRb2PlayerCustom(): IRb2PlayerCustom {
    return {
        collection: "rb.rb2.player.custom",
        stageBackgroundMusic: 0,
        stageFrameType: 0,
        stageBackground: 0,
        stageBackgroundBrightness: 100,
        stageExplodeType: 0,
        stageShotSound: 0,
        stageShotVolume: 100,
        selectedGlass: 0,
        sortType: 0,
        lastMusicId: 0,
        lastChartType: 0,
        narrowDownType: 0,
        isBeginner: true,
        isTutorialEnabled: true,
        symbolChatSet1: [0, 1, 2, 3, 4, 5],
        symbolChatSet2: [0, 1, 2, 3, 4, 5],
        gaugeStyle: 0,
        objectShade: 0,
        objectSize: 0,
        byword: [0, 0],
        isAutoByword: [true, true],
        isTweet: false,
        isTwitterLinked: false,
        mrecType: 0,
        cardDisplayType: 0,
        tabSelected: 4,
        hiddenParam: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0]
    }
}

export interface IRb2PlayerReleasedInfo extends ICollection<"rb.rb2.player.releasedInfo"> {
    type: number
    id: number
    param: number
}
export const Rb2PlayerReleasedInfoMap: KObjectMappingRecord<IRb2PlayerReleasedInfo> = {
    collection: getCollectionMappingElement<IRb2PlayerReleasedInfo>("rb.rb2.player.releasedInfo"),
    type: { $type: "u8" },
    id: { $type: "u16" },
    param: { $type: "u16" }
}

export interface IRb2MusicRecordElement {
    winCount: number
    loseCount: number
    drawCount: number
    clearType: number
    achievementRateTimes10: number
    score: number
    combo: number
    missCount: number
    playCount: number
}
export const Rb2MusicRecordElementMap: KObjectMappingRecord<IRb2MusicRecordElement> = {
    winCount: { $type: "s32", $targetKey: "win" },
    loseCount: { $type: "s32", $targetKey: "lose" },
    drawCount: { $type: "s32", $targetKey: "draw" },
    clearType: { $type: "u8", $targetKey: "ct" }, // 1: failed, 2: cleared, 3: full combo
    achievementRateTimes10: { $type: "s16", $targetKey: "ar" },
    score: { $type: "s32", $targetKey: "bs" },
    combo: { $type: "s16", $targetKey: "mc" },
    missCount: { $type: "s16", $targetKey: "bmc" },
    playCount: { $type: "kignore" }
}
export function generateRb2MusicRecordElement() {
    return {
        winCount: 0,
        loseCount: 0,
        drawCount: 0,
        clearType: 0,
        achievementRateTimes10: 0,
        score: 0,
        missCount: -1,
        combo: 0,
        playCount: 0
    }
}
export interface IRb2MusicRecord extends ICollection<"rb.rb2.playData.musicRecord"> {
    musicId: number
    chartType: number
    point: number
    time: number
    newRecord: IRb2MusicRecordElement
    oldRecord: IRb2MusicRecordElement
}
export const Rb2MusicRecordMap: KObjectMappingRecord<IRb2MusicRecord> = {
    collection: getCollectionMappingElement<IRb2MusicRecord>("rb.rb2.playData.musicRecord"),
    musicId: { $type: "u16", $targetKey: "mid" },
    chartType: { $type: "u8", $targetKey: "ng" },
    point: { $type: "s32" },
    time: { $type: "s32", $targetKey: "played_time" },
    newRecord: appendMappingElement(Rb2MusicRecordElementMap, { $targetKey: "mrec_0" }),
    oldRecord: appendMappingElement(Rb2MusicRecordElementMap, { $targetKey: "mrec_1" })
}
export function generateRb2MusicRecord(musicId: number, chartType: number): IRb2MusicRecord {
    return {
        collection: "rb.rb2.playData.musicRecord",
        musicId: musicId,
        chartType: chartType,
        point: 0,
        time: 0,
        newRecord: generateRb2MusicRecordElement(),
        oldRecord: generateRb2MusicRecordElement()
    }
}

export interface IRb2StageLogElement {
    matchingGrade: number
    abilityPointTimes100: number
    clearType: number
    score: number
    achievementRateTimes10: number
}
export const Rb2StageLogElementMap: KObjectMappingRecord<IRb2StageLogElement> = {
    matchingGrade: { $type: "s16", $targetKey: "mg" },
    abilityPointTimes100: { $type: "s16", $targetKey: "ap" },
    clearType: { $type: "u8", $targetKey: "ct" },
    score: { $type: "s16", $targetKey: "s" },
    achievementRateTimes10: { $type: "s16", $targetKey: "ar" }
}
export interface IRb2StageLog extends ICollection<"rb.rb2.playData.stageLog"> {
    stageIndex: number
    musicId: number
    chartType: number
    mt: number
    rt: number
    rivalUserId: number
    log: IRb2StageLogElement
    rivalLog: IRb2StageLogElement
    time: number
    standalone: IRb2StageLogStandaloneElement
}
export const Rb2StageLogMap: KObjectMappingRecord<IRb2StageLog> = {
    collection: getCollectionMappingElement<IRb2StageLog>("rb.rb2.playData.stageLog"),
    stageIndex: { $type: "u8", $targetKey: "id" },
    musicId: { $type: "u16", $targetKey: "mid" },
    chartType: { $type: "u8", $targetKey: "ng" },
    mt: { $type: "u8" },
    rt: { $type: "u8" },
    rivalUserId: { $type: "s32", $targetKey: "ruid" },
    log: appendMappingElement(Rb2StageLogElementMap, { $targetKey: "myself" }),
    rivalLog: appendMappingElement(Rb2StageLogElementMap, { $targetKey: "rival" }),
    time: { $type: "s32" },
    standalone: appendMappingElement(Rb2StageLogStandaloneElementMap, { $type: "kignore" })
}

export interface IRb2Glass extends ICollection<"rb.rb2.player.glass"> {
    id: number
    experience: number
}
export const Rb2GlassMap: KObjectMappingRecord<IRb2Glass> = {
    collection: getCollectionMappingElement<IRb2Glass>("rb.rb2.player.glass"),
    id: { $type: "s32" },
    experience: { $type: "s32", $targetKey: "exp" }
}

export interface IRb2LincleLink extends ICollection<"rb.rb2.player.lincleLink"> {
    qproParam: number
    glassParam: number
    iidxParam0Sub0: boolean
    iidxParam0Sub1: boolean
    iidxParam0Sub2: boolean
    iidxParam0Sub3: boolean
    iidxParam0Sub4: boolean
    iidxParam0Sub5: boolean
    iidxParam0Sub6: boolean
    iidxParam0: boolean
    iidxParam1: boolean
    iidxParam2: boolean
    iidxParam3: boolean
    iidxParam4: boolean
    rbParam0Sub0: boolean
    rbParam0Sub1: boolean
    rbParam0Sub2: boolean
    rbParam0Sub3: boolean
    rbParam0Sub4: boolean
    rbParam0Sub5: boolean
    rbParam0Sub6: boolean
    rbParam0: boolean
    rbParam1: boolean
    rbParam2: boolean
    rbParam3: boolean
    rbParam4: boolean
}
export const Rb2LincleLinkMap: KObjectMappingRecord<IRb2LincleLink> = {
    collection: getCollectionMappingElement<IRb2LincleLink>("rb.rb2.player.lincleLink"),
    qproParam: { $type: "u32", $targetKey: "qpro_add" },
    glassParam: { $type: "u32", $targetKey: "glass_add" },
    iidxParam0Sub0: { $type: "bool", $targetKey: "for_iidx_0_0" },
    iidxParam0Sub1: { $type: "bool", $targetKey: "for_iidx_0_1" },
    iidxParam0Sub2: { $type: "bool", $targetKey: "for_iidx_0_2" },
    iidxParam0Sub3: { $type: "bool", $targetKey: "for_iidx_0_3" },
    iidxParam0Sub4: { $type: "bool", $targetKey: "for_iidx_0_4" },
    iidxParam0Sub5: { $type: "bool", $targetKey: "for_iidx_0_5" },
    iidxParam0Sub6: { $type: "bool", $targetKey: "for_iidx_0_6" },
    iidxParam0: { $type: "bool", $targetKey: "for_iidx_0" },
    iidxParam1: { $type: "bool", $targetKey: "for_iidx_1" },
    iidxParam2: { $type: "bool", $targetKey: "for_iidx_2" },
    iidxParam3: { $type: "bool", $targetKey: "for_iidx_3" },
    iidxParam4: { $type: "bool", $targetKey: "for_iidx_4" },
    rbParam0Sub0: { $type: "bool", $targetKey: "for_rb_0_0" },
    rbParam0Sub1: { $type: "bool", $targetKey: "for_rb_0_1" },
    rbParam0Sub2: { $type: "bool", $targetKey: "for_rb_0_2" },
    rbParam0Sub3: { $type: "bool", $targetKey: "for_rb_0_3" },
    rbParam0Sub4: { $type: "bool", $targetKey: "for_rb_0_4" },
    rbParam0Sub5: { $type: "bool", $targetKey: "for_rb_0_5" },
    rbParam0Sub6: { $type: "bool", $targetKey: "for_rb_0_6" },
    rbParam0: { $type: "bool", $targetKey: "for_rb_0" },
    rbParam1: { $type: "bool", $targetKey: "for_rb_1" },
    rbParam2: { $type: "bool", $targetKey: "for_rb_2" },
    rbParam3: { $type: "bool", $targetKey: "for_rb_3" },
    rbParam4: { $type: "bool", $targetKey: "for_rb_4" }
}
export function generateRb2LincleLink(): IRb2LincleLink {
    return {
        collection: "rb.rb2.player.lincleLink",
        qproParam: 0,
        glassParam: 0,
        iidxParam0Sub0: false,
        iidxParam0Sub1: false,
        iidxParam0Sub2: false,
        iidxParam0Sub3: false,
        iidxParam0Sub4: false,
        iidxParam0Sub5: false,
        iidxParam0Sub6: false,
        iidxParam0: false,
        iidxParam1: false,
        iidxParam2: false,
        iidxParam3: false,
        iidxParam4: false,
        rbParam0Sub0: false,
        rbParam0Sub1: false,
        rbParam0Sub2: false,
        rbParam0Sub3: false,
        rbParam0Sub4: false,
        rbParam0Sub5: false,
        rbParam0Sub6: false,
        rbParam0: false,
        rbParam1: false,
        rbParam2: false,
        rbParam3: false,
        rbParam4: false
    }
}
export interface IRb2Mylist extends ICollection<"rb.rb2.player.mylist"> {
    slot?: {
        slotId: number
        musicId: number
    }[]
}
export const Rb2MylistMap: KObjectMappingRecord<IRb2Mylist> = {
    collection: getCollectionMappingElement<IRb2Mylist>("rb.rb2.player.mylist"),
    slot: {
        0: {
            slotId: { $type: "u8", $targetKey: "slot_id" },
            musicId: { $type: "s16", $targetKey: "music_id" }
        }
    },
    $targetKey: "fav_music_slot"
}

export interface IRb2Player {
    rid: string
    lid: string
    beginTime: bigint
    endTime: bigint
    mode: number
    pdata: {
        comment: string
        team: { teamId: number, teamName: string }
        base: IRb2PlayerBase
        stat: IRb2PlayerStat
        custom: IRb2PlayerCustom
        released: { info?: IRb2PlayerReleasedInfo[] }
        record: { rec?: IRb2MusicRecord[] }
        stageLogs: { log?: IRb2StageLog[] }
        rival: {}
        glass: { g?: IRb2Glass[] }
        mylist: IRb2Mylist
        lincleLink: IRb2LincleLink
    }
}
export const Rb2PlayerMap: KObjectMappingRecord<IRb2Player> = {
    rid: { $type: "str" },
    lid: { $type: "str" },
    beginTime: { $type: "u64", $targetKey: "begin_time" },
    endTime: { $type: "u64", $targetKey: "end_time" },
    mode: { $type: "u8" },
    pdata: {
        comment: { $type: "str", $targetKey: "cmnt" },
        team: { teamId: s32me("id"), teamName: strme("name") },
        base: Rb2PlayerBaseMap,
        stat: appendMappingElement(Rb2PlayerStatMap, { $targetKey: "con" }),
        custom: Rb2PlayerCustomMap,
        released: { info: { 0: Rb2PlayerReleasedInfoMap } },
        record: { rec: { 0: Rb2MusicRecordMap } },
        stageLogs: { log: { 0: Rb2StageLogMap }, $targetKey: "blog" },
        rival: {},
        glass: { g: { 0: Rb2GlassMap } },
        mylist: Rb2MylistMap,
        lincleLink: Rb2LincleLinkMap
    }
}

export function generateRb2Profile(rid: string, userId: number): IRb2Player {
    return {
        rid: rid,
        lid: "ea",
        beginTime: BigInt(614498759023),
        endTime: BigInt(9614498759023),
        mode: 0,
        pdata: {
            comment: "",
            team: { teamId: -1, teamName: "Asphyxia" },
            base: generateRb2PlayerBase(userId),
            stat: generateRb2PlayerStat(),
            custom: generateRb2PlayerCustom(),
            released: { info: [{ collection: "rb.rb2.player.releasedInfo", type: 0, id: 0, param: 0 }] },
            record: {},
            stageLogs: {},
            rival: {},
            glass: {},
            mylist: { collection: "rb.rb2.player.mylist" },
            lincleLink: generateRb2LincleLink()
        }
    }
}