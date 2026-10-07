import { Range, RbVersion } from "../../models/shared/rb_types"
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

function countCtrlElements(ctrl: number | Range[]): number {
    if (!Array.isArray(ctrl)) return ctrl
    return ctrl.reduce<number>((prev, next) => {
        return prev + (Array.isArray(next) ? next[1] - next[0] : 1)
    }, 0)
}
export async function attachReleaseInfo<T extends IRbPlayer, TReleasedInfo extends IRbReleasedInfo>(version: RbVersion, player: T, releasedInfoType: Type<TReleasedInfo>, ctrlArray: (number | Range[])[], onAttachItems?: Function) {
    const rid = player.rid ?? player.pdata.account?.rid
    if (!rid) return
    const session = await getSession(rid, version)
    if (!session) return
    const unlockAllSongs = session.unlockSettings.unlockAllSongs
    const unlockAllItems = session.unlockSettings.unlockAllItems
    if (!unlockAllSongs && !unlockAllItems) return

    if (unlockAllSongs) {
        let songReleaseInfoArray = songReleaseInfoBackup.get(releasedInfoType)
        if (!songReleaseInfoArray) {
            songReleaseInfoArray = []
            songReleaseInfoBackup.set(releasedInfoType, songReleaseInfoArray)
        }
        const count = countCtrlElements(ctrlArray[0])
        if (songReleaseInfoArray.length !== count) setReleaseInfo(releasedInfoType, songReleaseInfoArray, 0, ctrlArray[0])
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
            const count = countCtrlElements(ctrlArray[0])
            if (subArray.length !== count) setReleaseInfo(releasedInfoType, subArray, i, ctrlArray[i])
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

    if (unlockAllSongs || unlockAllItems) await onDetachSongsOrItems?.(unlockAllSongs, unlockAllItems)

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

function setReleaseInfo<TReleaseInfo extends IRbReleasedInfo>(releaseInfoType: Type<TReleaseInfo>, releaseInfoArray: TReleaseInfo[], typeId: number, count: number | Range[]) {
    releaseInfoArray.splice(0, releaseInfoArray.length)
    if (!Array.isArray(count)) for (let i = 0; i < count; i++) {
        const ri = new releaseInfoType()
        ri.type = typeId
        ri.id = i
        ri.param = 31
        ri.insertTime = Date.parse("April 30, 2010")
        releaseInfoArray.push(ri)
    } else {
        for (const el of count) {
            const left = Array.isArray(el) ? el[0] : el
            const right = Array.isArray(el) ? el[1] : el + 1
            for (let i = left; i < right; i++) {
                const ri = new releaseInfoType()
                ri.type = typeId
                ri.id = i
                ri.param = 31
                ri.insertTime = Date.parse("April 30, 2010")
                releaseInfoArray.push(ri)
            }
        }
    }
}