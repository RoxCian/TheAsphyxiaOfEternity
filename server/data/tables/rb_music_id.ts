import { RbMusicId, RbVersion } from "../../models/shared/rb_types"
import { loadCsvAsync } from "../../utils/csv"

export const rbMusicId = loadCsvAsync<RbMusicId<RbVersion>>("rb_music_id")

export async function getMusicUid(musicId: number, version: RbVersion): Promise<string | undefined> {
    const result = (await rbMusicId).find(e => e.musicId === musicId && e.version === version)
    return result?.musicUid
}
export async function getMusicId(musicUid: string, version: RbVersion): Promise<number | undefined> {
    const result = (await rbMusicId).find(e => e.musicUid === musicUid && e.version === version)
    return result?.musicId
}
export async function convertMusicId(musicId: number, sourceVersion: RbVersion, targetVersion: RbVersion): Promise<number | undefined> {
    const musicIdData = await rbMusicId
    const uid = musicIdData.find(e => e.musicId === musicId && e.version === sourceVersion)?.musicUid
    if (uid == undefined) return undefined
    return musicIdData.find(e => e.musicUid === uid && e.version === targetVersion)?.musicId
}
export async function isNewMusic(musicId: number, version: RbVersion): Promise<boolean> {
    const midstr = getMusicUid(musicId, version)
    return !midstr || (parseInt(midstr[0]) >= version) // Should use greater or eq, some games introduced musics in next game title as pre-update event
}