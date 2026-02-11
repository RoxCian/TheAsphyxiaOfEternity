import { RbChartInfo, RbChartType, RbMusicVariation, RbVersion } from "../../models/shared/rb_types"
import { RbChartResponse, RbChartsInfo } from "../../models/shared/web"
import { loadCsvAsync } from "../../utils/csv"
import { rbMusicVariation } from "./rb_music_variation"

export const rbChartInfo = loadCsvAsync<RbChartInfo<RbVersion, RbChartType<RbVersion>>>("rb_chart_info")

export async function findChartInfo<TVersion extends RbVersion>(musicId: number, version: TVersion, chartType: RbChartType<TVersion>): Promise<RbChartInfo<RbVersion, RbChartType<TVersion>> | undefined> {
    return (await rbChartInfo).find(c => c.version === version && c.musicId === musicId && c.chartType === chartType) as RbChartInfo<RbVersion, RbChartType<TVersion>>
}
export async function findCharts<TVersion extends RbVersion>(musicId: number, version: TVersion): Promise<RbChartsInfo<TVersion>> {
    const charts = (await rbChartInfo).filter(c => c.version === version && c.musicId === musicId)
    const result: RbChartsInfo<TVersion> = {}
    for (const c of charts) result[c.chartType] = c
    const variations = (await rbMusicVariation).filter(v => v.version === version && v.musicId === musicId)
    for (const v of variations) result[v.chartType as RbChartType<TVersion>].variation = v as RbMusicVariation<TVersion, RbChartType<TVersion>>
    return result
}
export async function findChartInfoResponse<TVersion extends RbVersion, TChartType extends RbChartType<TVersion>>(musicId: number, version: TVersion, chartType: TChartType): Promise<RbChartResponse<TVersion, TChartType> | undefined> {
    const result = await findChartInfo(musicId, version, chartType) as RbChartResponse<TVersion, TChartType>
    if (!result) return undefined
    const variation = (await rbMusicVariation).find(v => v.version === version && v.musicId === musicId && v.chartType === chartType) as RbMusicVariation<TVersion, TChartType>
    if (variation) result.variation = variation
    return result
}