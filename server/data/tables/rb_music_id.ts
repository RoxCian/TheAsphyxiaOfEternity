import { RbMusicId, RbVersion } from "../../models/shared/rb_types"
import { loadCsv } from "../../utils/csv"

export const rbMusicId = loadCsv<RbMusicId<RbVersion>>("rb_music_id")

export function getMusicUid(musicId: number, version: RbVersion): string | undefined {
    const result = rbMusicId.find(e => e.musicId === musicId && e.version === version)
    return result?.musicUid
}
export function getMusicId(musicUid: string, version: RbVersion): number | undefined {
    const result = rbMusicId.find(e => e.musicUid === musicUid && e.version === version)
    return result?.musicId
}
export function convertMusicId(musicId: number, sourceVersion: RbVersion, targetVersion: RbVersion): number | undefined {
    const uid = rbMusicId.find(e => e.musicId === musicId && e.version === sourceVersion)?.musicUid
    if (uid == undefined) return undefined
    return rbMusicId.find(e => e.musicUid === uid && e.version === targetVersion)?.musicId
}
export function isNewMusic(musicId: number, version: RbVersion): boolean {
    const midstr = getMusicUid(musicId, version)
    return !midstr || (parseInt(midstr[0]) >= version) // Should use greater or eq, some games introduced musics in next game title as pre-update event
}