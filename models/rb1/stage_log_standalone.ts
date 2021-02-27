import { KObjectMappingRecord } from "../../utility/mapping";

export interface IRb1StageLogStandaloneElement {
    stageIndex: number
    musicId: number
    chartType: number
    color: number
    isMatched: number
    result: number
    score: number
    combo: number
    justReflecCount: number
    justCount: number
    greatCount: number
    goodCount: number
    missCount: number
    sec: number
}
export const Rb1StageLogStandaloneElementMap: KObjectMappingRecord<IRb1StageLogStandaloneElement> = {
    stageIndex: { $type: "s16", $targetKey: "idx" },
    musicId: { $type: "s16", $targetKey: "mid" },
    chartType: { $type: "s16", $targetKey: "grade" },
    color: { $type: "s16" },
    isMatched: { $type: "s16", $targetKey: "match" },
    result: { $type: "s16", $targetKey: "res" },
    score: { $type: "s16" },
    combo: { $type: "s16", $targetKey: "mc" },
    justReflecCount: { $type: "s16", $targetKey: "jt_jr" },
    justCount: { $type: "s16", $targetKey: "jt_ju" },
    greatCount: { $type: "s16", $targetKey: "jt_gr" },
    goodCount: { $type: "s16", $targetKey: "jt_gd" },
    missCount: { $type: "s16", $targetKey: "jt_ms" },
    sec: { $type: "s32" },
}

export interface IRb1StageLogStandalone {
    userId: number
    lid: string
    play: {
        stageCount: number
        sec: number
    }
    rec: IRb1StageLogStandaloneElement[]
}
export const Rb1StageLogStandaloneMap: KObjectMappingRecord<IRb1StageLogStandalone> = {
    userId: { $type: "s32", $targetKey: "uid" },
    lid: { $type: "str" },
    play: {
        stageCount: { $type: "s16", $targetKey: "stage" },
        sec: { $type: "s32" }
    },
    rec: { 0: Rb1StageLogStandaloneElementMap }
}