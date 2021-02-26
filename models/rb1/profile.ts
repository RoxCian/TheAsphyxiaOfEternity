import { appendMappingElement, getCollectionMappingElement, KObjectMappingRecord } from "../../utility/mapping"
import { ICollection } from "../utility/definitions"
import { IRb1StageLogStandaloneElement, Rb1StageLogStandaloneElementMap } from "./stage_log_standalone"

export interface IRb1PlayerBase extends ICollection<"rb.rb1.player.base"> {
    userId: number
    name: string
    level: number
    experience: number
    matchingGrade: number
    abilityPointTimes10: number
    tutorialFlag: number
}
export const Rb1PlayerBaseMap: KObjectMappingRecord<IRb1PlayerBase> = {
    collection: getCollectionMappingElement<IRb1PlayerBase>("rb.rb1.player.base"),
    userId: { $type: "s32", $targetKey: "uid" },
    name: { $type: "str" },
    level: { $type: "s16", $targetKey: "lv" },
    experience: { $type: "s32", $targetKey: "exp" },
    matchingGrade: { $type: "s16", $targetKey: "mg" },
    abilityPointTimes10: { $type: "s16", $targetKey: "ap" },
    tutorialFlag: { $type: "s32", $targetKey: "flag" }
}
export function generateRb1PlayerBase(userId: number): IRb1PlayerBase {
    return {
        collection: "rb.rb1.player.base",
        userId: userId,
        name: "",
        level: 0,
        experience: 0,
        matchingGrade: 0,
        abilityPointTimes10: 0,
        tutorialFlag: 1
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
    day: { $type: "s32" },
    playCount: { $type: "s32", $targetKey: "cnt" },
    last: { $type: "s32" },
    now: { $type: "s32" }
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
    stageBackgroundMusic: { $type: "u8", $targetKey: "bgm_m" },
    stageFrameType: { $type: "u8", $targetKey: "st_f" },
    stageBackground: { $type: "u8", $targetKey: "st_bg" },
    stageBackgroundBrightness: { $type: "u8", $targetKey: "st_bg_b" },
    stageExplodeType: { $type: "u8", $targetKey: "eff_e" },
    stageShotSound: { $type: "u8", $targetKey: "se_s" },
    stageShotVolume: { $type: "u8", $targetKey: "se_s_v" }
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
    type: { $type: "u8" },
    id: { $type: "u16" }
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
    musicId: { $type: "u16", $targetKey: "mid" },
    chartType: { $type: "u8", $targetKey: "ng" },
    winCount: { $type: "s32", $targetKey: "win" },
    loseCount: { $type: "s32", $targetKey: "lose" },
    drawCount: { $type: "s32", $targetKey: "draw" },
    clearType: { $type: "u8", $targetKey: "ct" }, // 1: failed, 2: cleared, 3: full combo
    achievementRateTimes10: { $type: "s16", $targetKey: "ar" },
    score: { $type: "s16", $targetKey: "bs" },
    combo: { $type: "s16", $targetKey: "mc" },
    missCount: { $type: "s16", $targetKey: "bmc" },
    playCount: { $type: "kignore" }
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
    matchingGrade: { $type: "s16", $targetKey: "mg" },
    abilityPointTimes10: { $type: "s16", $targetKey: "ap" },
    clearType: { $type: "u8", $targetKey: "ct" },
    score: { $type: "s16", $targetKey: "s" },
    achievementRateTimes10: { $type: "s16", $targetKey: "ar" }
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
    stageIndex: { $type: "u8", $targetKey: "id" },
    musicId: { $type: "u16", $targetKey: "mid" },
    chartType: { $type: "u8", $targetKey: "ng" },
    mt: { $type: "u8" },
    rt: { $type: "u8" },
    rivalUserId: { $type: "s32", $targetKey: "ruid" },
    log: appendMappingElement(Rb1StageLogElementMap, { $targetKey: "myself" }),
    rivalLog: appendMappingElement(Rb1StageLogElementMap, { $targetKey: "rival" }),
    time: { $type: "s32" },
    standalone: appendMappingElement(Rb1StageLogStandaloneElementMap, { $type: "kignore" })
}

export interface IRb1Player {
    rid: string
    lid: string
    mode: number
    pdata: {
        base: IRb1PlayerBase
        stat: IRb1PlayerStat
        custom: IRb1PlayerCustom
        released: { info?: IRb1PlayerReleasedInfo[] }
        record: { rec?: IRb1MusicRecord[] }
        stageLogs: { log?: IRb1StageLog[] }
    }
}
export const Rb1PlayerMap: KObjectMappingRecord<IRb1Player> = {
    rid: { $type: "str" },
    lid: { $type: "str" },
    mode: { $type: "u8" },
    pdata: {
        base: Rb1PlayerBaseMap,
        stat: appendMappingElement(Rb1PlayerStatMap, { $targetKey: "con" }),
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
            base: generateRb1PlayerBase(userId),
            stat: generateRb1PlayerStat(),
            custom: generateRb1PlayerCustom(),
            released: {},
            record: {},
            stageLogs: {}
        }
    }
}