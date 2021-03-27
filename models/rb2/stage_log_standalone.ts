import { KObjectMappingRecord, s16me, s32me, strme } from "../../utility/mapping"

export interface IRb2StageLogStandaloneElement {
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
export const Rb2StageLogStandaloneElementMap: KObjectMappingRecord<IRb2StageLogStandaloneElement> = {
    stageIndex: s16me("idx"),
    musicId: s16me("mid"),
    chartType: s16me("grade"),
    color: s16me(),
    isMatched: s16me("match"),
    result: s16me("res"),
    score: s16me(),
    combo: s16me("mc"),
    justReflecCount: s16me("jt_jr"),
    justCount: s16me("jt_ju"),
    greatCount: s16me("jt_gr"),
    goodCount: s16me("jt_gd"),
    missCount: s16me("jt_ms"),
    sec: s32me(),
}

export interface IRb2StageLogStandalone {
    userId: number
    lid: string
    play: {
        stageCount: number
        sec: number
    }
    rec: IRb2StageLogStandaloneElement[]
}
export const Rb2StageLogStandaloneMap: KObjectMappingRecord<IRb2StageLogStandalone> = {
    userId: s32me("uid"),
    lid: strme(),
    play: {
        stageCount: s16me("stage"),
        sec: s32me()
    },
    rec: { 0: Rb2StageLogStandaloneElementMap }
}