import { ignoreme, me, s16me, s32me, strme, u16me, u8me } from "../../utility/mapping"
import { appendMappingElement, getCollectionMappingElement, KObjectMappingRecord } from "../../utility/mapping"
import { ICollection } from "../utility/definitions"
import { IRb1StageLogStandaloneElement, Rb1StageLogStandaloneElementMap } from "./stage_log_standalone"

export interface IRb1PlayerBase extends ICollection<"rb.rb1.player.base"> {
    userId: number
    name: string
    comment: string
    level: number
    experience: number
    matchingGrade: number
    abilityPointTimes10: number
    tutorialFlag: number
    playCount: number
}
export const Rb1PlayerBaseMap: KObjectMappingRecord<IRb1PlayerBase> = {
    collection: getCollectionMappingElement<IRb1PlayerBase>("rb.rb1.player.base"),
    userId: s32me("uid"),
    name: strme(),
    comment: ignoreme(),
    level: s16me("lv"),
    experience: s32me("exp"),
    matchingGrade: s16me("mg"),
    abilityPointTimes10: s16me("ap"),
    tutorialFlag: s32me("flag"),
    playCount: ignoreme()
}
export function generateRb1PlayerBase(userId: number): IRb1PlayerBase {
    return {
        collection: "rb.rb1.player.base",
        userId: userId,
        name: "",
        comment: "",
        level: 0,
        experience: 0,
        matchingGrade: 0,
        abilityPointTimes10: 0,
        tutorialFlag: 1,
        playCount: 0
    }
}

export interface IRb1PlayerStat extends ICollection<"rb.rb1.player.stat"> {
    day: number
    playCount: number
    last: number
    now: number
}
export const Rb1PlayerStatMap: KObjectMappingRecord<IRb1PlayerStat> = {
    collection: getCollectionMappingElement<IRb1PlayerStat>("rb.rb1.player.stat"),
    day: s32me(),
    playCount: s32me("cnt"),
    last: s32me(),
    now: s32me()
}
export function generateRb1PlayerStat(): IRb1PlayerStat {
    return {
        collection: "rb.rb1.player.stat",
        day: 0,
        playCount: 0,
        last: 0,
        now: 0
    }
}

export interface IRb1PlayerCustom extends ICollection<"rb.rb1.player.custom"> {
    stageBackgroundMusic: number
    stageFrameType: number
    stageBackground: number
    stageBackgroundBrightness: number
    stageExplodeType: number
    stageShotSound: number
    stageShotVolume: number
}
export const Rb1PlayerCustomMap: KObjectMappingRecord<IRb1PlayerCustom> = {
    collection: getCollectionMappingElement<IRb1PlayerCustom>("rb.rb1.player.custom"),
    stageBackgroundMusic: u8me("bgm_m"),
    stageFrameType: u8me("st_f"),
    stageBackground: u8me("st_bg"),
    stageBackgroundBrightness: u8me("st_bg_b"),
    stageExplodeType: u8me("eff_e"),
    stageShotSound: u8me("se_s"),
    stageShotVolume: u8me("se_s_v")
}
export function generateRb1PlayerCustom(): IRb1PlayerCustom {
    return {
        collection: "rb.rb1.player.custom",
        stageBackgroundMusic: 0,
        stageFrameType: 0,
        stageBackground: 0,
        stageBackgroundBrightness: 100,
        stageExplodeType: 0,
        stageShotSound: 0,
        stageShotVolume: 100
    }
}

export interface IRb1PlayerReleasedInfo extends ICollection<"rb.rb1.player.releasedInfo"> {
    type: number
    id: number
}
export const Rb1PlayerReleasedInfoMap: KObjectMappingRecord<IRb1PlayerReleasedInfo> = {
    collection: getCollectionMappingElement<IRb1PlayerReleasedInfo>("rb.rb1.player.releasedInfo"),
    type: u8me(),
    id: u16me()
}

export interface IRb1MusicRecord extends ICollection<"rb.rb1.playData.musicRecord"> {
    musicId: number
    chartType: number
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
export const Rb1MusicRecordMap: KObjectMappingRecord<IRb1MusicRecord> = {
    collection: getCollectionMappingElement<IRb1MusicRecord>("rb.rb1.playData.musicRecord"),
    musicId: u16me("mid"),
    chartType: u8me("ng"),
    winCount: s32me("win"),
    loseCount: s32me("lose"),
    drawCount: s32me("draw"),
    clearType: u8me("ct"), // 1: failed, 2: cleared, 3: full combo
    achievementRateTimes10: s16me("ar"),
    score: s16me("bs"),
    combo: s16me("mc"),
    missCount: s16me("bmc"),
    playCount: ignoreme()
}
export function generateRb1MusicRecord(musicId: number, chartType: number): IRb1MusicRecord {
    return {
        collection: "rb.rb1.playData.musicRecord",
        musicId: musicId,
        chartType: chartType,
        winCount: 0,
        loseCount: 0,
        drawCount: 0,
        clearType: 0,
        achievementRateTimes10: 0,
        score: 0,
        combo: 0,
        missCount: 0,
        playCount: 0
    }
}

export interface IRb1StageLogElement {
    matchingGrade: number
    abilityPointTimes10: number
    clearType: number
    score: number
    achievementRateTimes10: number
}
export const Rb1StageLogElementMap: KObjectMappingRecord<IRb1StageLogElement> = {
    matchingGrade: s16me("mg"),
    abilityPointTimes10: s16me("ap"),
    clearType: u8me("ct"),
    score: s16me("s"),
    achievementRateTimes10: s16me("ar")
}
export interface IRb1StageLog extends ICollection<"rb.rb1.playData.stageLog"> {
    stageIndex: number
    musicId: number
    chartType: number
    mt: number
    rt: number
    rivalUserId: number
    log: IRb1StageLogElement
    rivalLog: IRb1StageLogElement
    time: number
    standalone: IRb1StageLogStandaloneElement
}
export const Rb1StageLogMap: KObjectMappingRecord<IRb1StageLog> = {
    collection: getCollectionMappingElement<IRb1StageLog>("rb.rb1.playData.stageLog"),
    stageIndex: u8me("id"),
    musicId: u16me("mid"),
    chartType: u8me("ng"),
    mt: u8me(),
    rt: u8me(),
    rivalUserId: s32me("ruid"),
    log: appendMappingElement(Rb1StageLogElementMap, me("myself")),
    rivalLog: appendMappingElement(Rb1StageLogElementMap, me("rival")),
    time: s32me(),
    standalone: appendMappingElement(Rb1StageLogStandaloneElementMap, ignoreme())
}

export interface IRb1Player {
    rid: string
    lid: string
    mode: number
    pdata: {
        comment: string
        base: IRb1PlayerBase
        stat: IRb1PlayerStat
        custom: IRb1PlayerCustom
        released: { info?: IRb1PlayerReleasedInfo[] }
        record: { rec?: IRb1MusicRecord[] }
        stageLogs: { log?: IRb1StageLog[] }
    }
}
export const Rb1PlayerMap: KObjectMappingRecord<IRb1Player> = {
    rid: strme(),
    lid: strme(),
    mode: u8me(),
    pdata: {
        comment: strme("cmnt"),
        base: Rb1PlayerBaseMap,
        stat: appendMappingElement(Rb1PlayerStatMap, me("con")),
        custom: Rb1PlayerCustomMap,
        released: { info: { 0: Rb1PlayerReleasedInfoMap } },
        record: { rec: { 0: Rb1MusicRecordMap } },
        stageLogs: { log: { 0: Rb1StageLogMap }, $targetKey: "blog" }
    }
}

export function generateRb1Profile(rid: string, userId: number): IRb1Player {
    return {
        rid: rid,
        lid: "ea",
        mode: 1,
        pdata: {
            comment: "",
            base: generateRb1PlayerBase(userId),
            stat: generateRb1PlayerStat(),
            custom: generateRb1PlayerCustom(),
            released: {},
            record: {},
            stageLogs: {}
        }
    }
}