import { C } from "../../utils/controller"
import { RbChartsInfo, RbMusicResponse, RbVersion } from "../../models/shared/web"
import { rbMusicId } from "../../data/tables/rb_music_id"
import { rbMusicInfo } from "../../data/tables/rb_music_info"
import { rbChartInfo } from "../../data/tables/rb_chart_info"

export function registerMusicsController() {
    C.route("rbReadMusic", readMusic)
    C.route("rbReadMusics", readMusics)
}

export async function tryFindMusicResponse<TVersion extends RbVersion>(version: TVersion, musicId: number): Promise<RbMusicResponse<TVersion> | undefined> {
    try {
        return await findMusicResponse(version, musicId)
    } catch {
        return undefined
    }
}
export async function findMusicResponse<TVersion extends RbVersion>(version: TVersion, musicId: number): Promise<RbMusicResponse<TVersion>> {
    const musicUid = rbMusicId.find(i => i.version === version && i.musicId === musicId)?.musicUid
    if (!musicUid) throw new Error("Music not found")
    const music = rbMusicInfo.find(i => i.musicUid === musicUid)
    if (!music) throw new Error("Music info not found")
    const charts = rbChartInfo.filter(i => i.version === version && i.musicId === musicId).sort((l, r) => l.chartType - r.chartType) as unknown as RbChartsInfo<TVersion>
    return { version, musicId, music, charts }
}

const readMusic: C.C<{ version: RbVersion, musicId: number }, RbMusicResponse<RbVersion>> = async data => {
    try {
        return await findMusicResponse(data.version, data.musicId)
    } catch (ex) {
        if (ex instanceof Error) return C.error(404, ex.message)
    }
}
const readMusics: C.C<{ version: RbVersion }, RbMusicResponse<RbVersion>[]> = data => {
    // mylist feature related api
    if (data.version === 1) return [] // no mylist features, bypass for now.
    return rbMusicId.filter(i => i.version === data.version).map(i => {
        const music = rbMusicInfo.find(mi => mi.musicUid === i.musicUid)
        const charts = rbChartInfo.filter(ci => ci.musicId === i.musicId && ci.version === data.version).sort((l, r) => l.chartType - r.chartType) as RbChartsInfo<RbVersion>
        if (!music || !charts[0] || !charts[1] || !charts[2]) return undefined!
        return {
            version: data.version,
            musicId: i.musicId,
            music: rbMusicInfo.find(mi => mi.musicUid === i.musicUid)!,
            charts: rbChartInfo.filter(ci => ci.musicId === i.musicId && ci.version === data.version).sort((l, r) => l.chartType - r.chartType) as RbChartsInfo<RbVersion>
        }
    }).filter(m => m)
}
