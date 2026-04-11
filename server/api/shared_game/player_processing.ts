import { RbVersion } from "../../models/shared/rb_types"
import { Type } from "../../utils/types"
import { toFullWidth, toHalfWidth } from "../../utils/utility_functions"
import { getSession } from "./session"

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

export type SpecialUnlockControlOptions = {
    type: number | [number, number]
    id: number | [number, number]
    param: number
    insertTime: number
}
const songReleaseInfoBackup = new Map<Type<IRbReleasedInfo>, IRbReleasedInfo[]>()
const itemReleaseInfoBackup = new Map<Type<IRbReleasedInfo>, IRbReleasedInfo[][]>()

export async function attachReleaseInfo<T extends IRbPlayer, TReleasedInfo extends IRbReleasedInfo>(version: RbVersion, player: T, releasedInfoType: Type<TReleasedInfo>, ctrlArray: number[], onAttachItems?: Function) {
    const rid = player.rid ?? player.pdata.account?.rid
    if (!rid) return
    const session = await getSession(rid, version)
    if (!session) return
    const unlockAllSongs: boolean = session.unlockSettings.unlockAllSongs
    const unlockAllItems: boolean = session.unlockSettings.unlockAllItems
    if (!unlockAllSongs && !unlockAllSongs) return

    if (unlockAllSongs) {
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
    if (unlockAllItems) {
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
}
export async function detachReleaseInfo<T extends IRbPlayer>(version: RbVersion, player: T, onDetachSongsOrItems?: (isUnlockSongs: boolean, isUnlockItems: boolean) => void | Promise<void>) {
    const rid = player.rid ?? player.pdata.account?.rid
    if (!rid) return
    const session = await getSession(rid, version)

    const unlockAllSongs: boolean = session?.unlockSettings.unlockAllSongs ?? true
    const unlockAllItems: boolean = session?.unlockSettings.unlockAllItems ?? true

    if (unlockAllSongs || unlockAllItems) await onDetachSongsOrItems?.(unlockAllItems, unlockAllSongs)

    if (!player.pdata.released.info) return

    if (unlockAllSongs && unlockAllItems) {
        player.pdata.released.info = undefined
        return
    }

    for (let i = player.pdata.released.info.length - 1; i >= 0; i--) {
        if ((unlockAllSongs && (player.pdata.released.info[i].type === 0)) || (unlockAllItems && (player.pdata.released.info[i].type !== 0))) player.pdata.released.info.splice(i, 1)
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