import { RbChartInfo, RbChartType, RbMusicVariation, RbVersion } from "../../models/shared/rb_types"
import { RbChartResponse, RbChartsInfo } from "../../models/shared/web"
import { loadCsv } from "../../utils/csv"
import { rbMusicVariation } from "./rb_music_variation"

export const rbChartInfo = loadCsv<RbChartInfo<RbVersion, RbChartType<RbVersion>>>("rb_chart_info")

export function findChartInfo<TVersion extends RbVersion>(musicId: number, version: TVersion, chartType: RbChartType<TVersion>): RbChartInfo<TVersion, RbChartType<TVersion>> {
    return rbChartInfo.find(c => c.version === version && c.musicId === musicId && c.chartType === chartType) as RbChartInfo<TVersion, RbChartType<TVersion>>
}
export function findCharts<TVersion extends RbVersion>(musicId: number, version: TVersion): RbChartsInfo<TVersion> {
    const charts = rbChartInfo.filter(c => c.version === version && c.musicId === musicId)
    const result: RbChartsInfo<TVersion> = {}
    for (const c of charts) result[c.chartType] = c
    const variations = rbMusicVariation.filter(v => v.version === version && v.musicId === musicId)
    for (const v of variations) result[v.chartType].variation = v as RbMusicVariation<TVersion, RbChartType<TVersion>>
    return result
}
export function findChartInfoResponse<TVersion extends RbVersion, TChartType extends RbChartType<TVersion>>(musicId: number, version: TVersion, chartType: TChartType): RbChartResponse<TVersion, TChartType> {
    const result = findChartInfo(musicId, version, chartType) as RbChartResponse<TVersion, TChartType>
    if (!result) return {
        version,
        musicId,
        chartType,
        level: -1,
        skillRate: -1,
        maxCombo: 0,
        maxKeepCount: 0,
        maxJustReflec: 0,
        chartVersion: version
    }
    const variation = rbMusicVariation.find(v => v.version === version && v.musicId === musicId && v.chartType === chartType) as RbMusicVariation<TVersion, TChartType>
    if (variation) result.variation = variation
    return result
}