import { C } from "../../utils/controller"
import { RbChartsInfo, RbMusicResponse, RbVersion } from "../../models/shared/web"
import { rbMusicId } from "../../data/tables/rb_music_id"
import { rbMusicInfo } from "../../data/tables/rb_music_info"
import { rbChartInfo } from "../../data/tables/rb_chart_info"

export function registerMusicsController() {
    C.route("rbReadMusics", readMusics)
}

const readMusics: C.C<{ version: RbVersion }, RbMusicResponse<RbVersion>[]> = async data => {
    if (data.version === 1) return [] // no mylist features, bypass for now.

    const musicId = await rbMusicId
    const musicInfo = await rbMusicInfo
    const chartInfo = await rbChartInfo
        
    return musicId.filter(i => i.version === data.version).map(i => ({
        version: data.version,
        musicId: i.musicId,
        music: musicInfo.find(mi => mi.musicUid === i.musicUid),
        charts: chartInfo.filter(ci => ci.musicId === i.musicId && ci.version === data.version).sort((l, r) => l.chartType - r.chartType) as RbChartsInfo<RbVersion>
    })).filter(m => m.charts[0] && m.charts[1] && m.charts[2])
}