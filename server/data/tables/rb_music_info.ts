import { RbMusicInfo, RbVersion } from "../../models/shared/rb_types"
import { loadCsvAsync } from "../../utils/csv"
import { getMusicUid } from "./rb_music_id"

export const rbMusicInfo = loadCsvAsync<RbMusicInfo>("rb_music_info")

const defaultMusicInfo: RbMusicInfo = {
    musicUid: "----",
    title: "<Not found>",
    artist: "",
    isRenewal: false,
    bpm: 0,
    category: ""
}

export async function findMusicInfo(musicId: number, version: RbVersion): Promise<RbMusicInfo> {
    const musicUid = await getMusicUid(musicId, version)
    if (!musicUid) return defaultMusicInfo
    return (await rbMusicInfo).find(i => i.musicUid === musicUid) ?? defaultMusicInfo
}