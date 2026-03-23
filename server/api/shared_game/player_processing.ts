import { RbVersion } from "../../models/shared/rb_types"
import { Type } from "../../utils/types"
import { toFullWidth, toHalfWidth } from "../../utils/utility_functions"

type IRbReleasedInfo = {
    type: number
    id: number
    param: number
    insertTime?: number
}
interface IRbPlayer {
    rid?: string
    pdata: {
        account?: {
            rid?: string
        }
        base: {
            name: string
        }
        released: {
            info?: IRbReleasedInfo[]
        }
    }
}

type UnlockConfigs = {
    isUnlockSongs: boolean
    isUnlockItems: boolean
}
const configsBackup: Record<`${string}.${RbVersion}`, UnlockConfigs> = {}

export type SpecialUnlockControlOptions = {
    type: number | [number, number]
    id: number | [number, number]
    param: number
    insertTime: number
}
const songReleaseInfoBackup = new Map<Type<IRbReleasedInfo>, IRbReleasedInfo[]>()
const itemReleaseInfoBackup = new Map<Type<IRbReleasedInfo>, IRbReleasedInfo[][]>()

export function seekUnlockConfigs(version: RbVersion, player: IRbPlayer): UnlockConfigs {
    const rid = player.rid
    const backupKey = `${rid}.${version}` as const
    const configs = configsBackup[backupKey]
    const isUnlockSongs: boolean = configs?.isUnlockSongs ?? U.GetConfig("unlock_all_songs")
    const isUnlockItems: boolean = configs?.isUnlockItems ?? U.GetConfig("unlock_all_items")
    return { isUnlockSongs, isUnlockItems }
}
export function attachReleaseInfo<T extends IRbPlayer, TReleasedInfo extends IRbReleasedInfo>(version: RbVersion, player: T, releasedInfoType: Type<TReleasedInfo>, ctrlArray: number[], onAttachItems?: Function) {
    const isUnlockSongs: boolean = U.GetConfig("unlock_all_songs")
    const isUnlockItems: boolean = U.GetConfig("unlock_all_items")
    if (!isUnlockSongs && !isUnlockSongs) return
    const rid = player.rid ?? player.pdata.account.rid
    if (!rid) return

    if (isUnlockSongs) {
        let songReleaseInfoArray = songReleaseInfoBackup.get(releasedInfoType)
        if (!songReleaseInfoArray) {
            songReleaseInfoArray = []
            songReleaseInfoBackup.set(releasedInfoType, songReleaseInfoArray)
        }
        if (songReleaseInfoArray.length < ctrlArray[0]) addReleaseInfo(releasedInfoType, songReleaseInfoArray, ctrlArray[0])
        else if (songReleaseInfoArray.length > ctrlArray[0]) songReleaseInfoArray = songReleaseInfoArray.slice(0, ctrlArray[0])
        if (player.pdata.released.info) player.pdata.released.info.push(...songReleaseInfoArray)
        else player.pdata.released.info = [...songReleaseInfoArray]
    }
    if (isUnlockItems) {
        let itemReleaseInfoArray = itemReleaseInfoBackup.get(releasedInfoType)
        if (!itemReleaseInfoArray) {
            itemReleaseInfoArray = []
            itemReleaseInfoBackup.set(releasedInfoType, itemReleaseInfoArray)
        }
        for (let i = 1; i < ctrlArray.length; i++) {
            let subArray = itemReleaseInfoArray[i] ?? []
            itemReleaseInfoArray[i] = subArray
            if (subArray.length < ctrlArray[i]) addReleaseInfo(releasedInfoType, subArray, ctrlArray[i])
            else if (subArray.length > ctrlArray[i]) subArray = subArray.slice(0, ctrlArray[i])
            if (player.pdata.released.info) player.pdata.released.info.push(...subArray)
            else player.pdata.released.info = [...subArray]
        }

        onAttachItems?.()
    }

    const backupKey = `${rid}.${version}` as const
    configsBackup[backupKey] = { isUnlockItems, isUnlockSongs }
}
export async function detachReleaseInfo<T extends IRbPlayer>(version: RbVersion, player: T, onDetachSongsOrItems?: (isUnlockSongs: boolean, isUnlockItems: boolean) => void | Promise<void>) {
    const rid = player.rid ?? player.pdata.account.rid
    if (!rid) return
    const backupKey = `${rid}.${version}` as const
    const configs = configsBackup[backupKey]
    delete configsBackup[backupKey]

    const isUnlockSongs: boolean = configs?.isUnlockSongs ?? U.GetConfig("unlock_all_songs")
    const isUnlockItems: boolean = configs?.isUnlockItems ?? U.GetConfig("unlock_all_items")

    if (isUnlockSongs || isUnlockItems) await onDetachSongsOrItems?.(isUnlockItems, isUnlockSongs)

    if (!player.pdata.released.info) return

    if (isUnlockSongs && isUnlockItems) {
        player.pdata.released.info = undefined
        return
    }

    for (let i = player.pdata.released.info.length - 1; i >= 0; i--) {
        if ((isUnlockSongs && (player.pdata.released.info[i].type === 0)) || (isUnlockItems && (player.pdata.released.info[i].type !== 0))) player.pdata.released.info.splice(i, 1)
    }
}

export function toFullWidthPlayerName(player: IRbPlayer) {
    if (player.pdata.base?.name) player.pdata.base.name = toFullWidth(player.pdata.base.name.toUpperCase())
}
export function toHalfWidthPlayerName(player: IRbPlayer) {
    if (player.pdata.base?.name) player.pdata.base.name = toHalfWidth(player.pdata.base.name.toUpperCase())
}

function addReleaseInfo<TReleaseInfo extends IRbReleasedInfo>(releaseInfoType: Type<TReleaseInfo>, releaseInfoArray: TReleaseInfo[], count: number) {
    for (let i = releaseInfoArray.length; i < count; i++) {
        const ri = new releaseInfoType()
        ri.type = 0
        ri.id = i
        ri.param = 15
        ri.insertTime = Date.parse("April 30, 2010")
        releaseInfoArray.push(ri)
    }
}