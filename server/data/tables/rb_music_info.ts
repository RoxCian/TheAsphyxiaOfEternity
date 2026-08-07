import { RbMusicInfo, RbVersion } from "../../models/shared/rb_types"
import { loadCsv } from "../../utils/csv"
import { getMusicUid } from "./rb_music_id"

export const rbMusicInfo = loadCsv<RbMusicInfo>("rb_music_info")

const defaultMusicInfo: RbMusicInfo = {
    musicUid: "----",
    title: "<Not found>",
    artist: "",
    isRenewal: false,
    bpm: 0,
    category: ""
}

export function findMusicInfo(musicId: number, version: RbVersion): RbMusicInfo {
    const musicUid = getMusicUid(musicId, version)
    if (!musicUid) return defaultMusicInfo
    return rbMusicInfo.find(i => i.musicUid === musicUid) ?? defaultMusicInfo
}