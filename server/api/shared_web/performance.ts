import { findChartInfo } from "../../data/tables/rb_chart_info"
import { RbChartType, RbVersion } from "../../models/shared/rb_types"

export function computeQuickPerformanceScore(version: RbVersion, ar: number, musicId: number, chartType: RbChartType<RbVersion>): number {
    const chart = findChartInfo(musicId, version, chartType)
    if (!chart) {
        console.log(`Chart info not found (music ID: ${musicId}, chart type: ${chartType}) <RB${ version === 2 ? " limelight" : version === 3 ? " colette" : version === 4 ? " groovin'" : version === 5 ? " VOLZZA" : version ===6 ? " REFLESIA" : "" }>`)
        return -1
    }
    return ar * (chart.skillRate > 0 ? chart.skillRate : (chart.level * (version === 1 ? 8 : version === 5 ? 6.923 : 7.73))) // align level to 90 (max skill rate)
}
