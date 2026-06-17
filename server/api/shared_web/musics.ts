import { C } from "../../utils/controller"
import { RbChartsInfo, RbMusicResponse, RbVersion } from "../../models/shared/web"
import { rbMusicId } from "../../data/tables/rb_music_id"
import { rbMusicInfo } from "../../data/tables/rb_music_info"
import { rbChartInfo } from "../../data/tables/rb_chart_info"

export function registerMusicsController() {
    C.route("rbReadMusic", readMusic)
    C.route("rbReadMusics", readMusics)
}

const readMusic: C.C<{ version: RbVersion, musicId: number }, RbMusicResponse<RbVersion>> = async data => {
    const musicUid = (await rbMusicId).find(i => i.version === data.version && i.musicId === data.musicId)?.musicUid
    if (!musicUid) return C.error(404, "Music not found")
    const music = (await rbMusicInfo).find(i => i.musicUid === musicUid)
    if (!music) return C.error(404, "Music info not found")
    const charts = (await rbChartInfo).filter(i => i.version === data.version && i.musicId === data.musicId).sort((l, r) => l.chartType - r.chartType) as RbChartsInfo<RbVersion>
    return {
        version: data.version,
        musicId: data.musicId,
        music, charts
    }
}
const readMusics: C.C<{ version: RbVersion }, RbMusicResponse<RbVersion>[]> = async data => {
    // mylist feature related api
    if (data.version === 1) return [] // no mylist features, bypass for now.

    const musicId = await rbMusicId
    const musicInfo = await rbMusicInfo
    const chartInfo = await rbChartInfo
        
    return musicId.filter(i => i.version === data.version).map(i => {
        const music = musicInfo.find(mi => mi.musicUid === i.musicUid)
        const charts = chartInfo.filter(ci => ci.musicId === i.musicId && ci.version === data.version).sort((l, r) => l.chartType - r.chartType) as RbChartsInfo<RbVersion>
        if (!music || !charts[0] || !charts[1] || !charts[2]) return undefined!
        return {
            version: data.version,
            musicId: i.musicId,
            music: musicInfo.find(mi => mi.musicUid === i.musicUid)!,
            charts: chartInfo.filter(ci => ci.musicId === i.musicId && ci.version === data.version).sort((l, r) => l.chartType - r.chartType) as RbChartsInfo<RbVersion>
        }
    }).filter(m => m)
}
