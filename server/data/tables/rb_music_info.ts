import { RbMusicInfo, RbVersion } from "../../models/shared/rb_types"
import { loadCsvAsync } from "../../utils/csv"
import { getMusicUid } from "./rb_music_id"

export const rbMusicInfo = loadCsvAsync<RbMusicInfo>("rb_music_info")

export async function findMusicInfo(musicId: number, version: RbVersion): Promise<RbMusicInfo | undefined> {
    const musicUid = await getMusicUid(musicId, version)
    if (!musicUid) return undefined
    return (await rbMusicInfo).find(i => i.musicUid === musicUid)
}