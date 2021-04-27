import { IRb2Player } from "../../models/rb2/profile"
import { KITEM2 } from "../../utility/mapping"
import { toFullWidth, toHalfWidth } from "../../utility/utility_functions"
// player.pdata.released.info.type == 0 -> song
// player.pdata.released.info.type == 1 -> sfx
// player.pdata.released.info.type == 2 -> bgm
// player.pdata.released.info.type == 3 -> frame
// player.pdata.released.info.type == 4 -> explode fx
// player.pdata.released.info.type == 5 -> bg
// player.pdata.released.info.type == 6 -> icon (11: FLOWER)
// player.pdata.released.info.type == 7 -> byword left part
// player.pdata.released.info.type == 8 -> byword right part

export function readPlayerPostProcess(player: KITEM2<IRb2Player>): KITEM2<IRb2Player> {
    if (player.pdata.base?.name != null) player.pdata.base.name["@content"] = toFullWidth(player.pdata.base.name["@content"].toUpperCase())
    let isUnlockSongs: boolean = U.GetConfig("unlock_all_songs")
    let isUnlockItems: boolean = U.GetConfig("unlock_all_items")
    if (!isUnlockSongs && !isUnlockSongs) return player

    if (isUnlockSongs) player = appendSongsUnlockingData(player)
    if (isUnlockItems) player = appendItemsUnlockingData(player)

    return player
}
export async function writePlayerPreProcess(player: KITEM2<IRb2Player>): Promise<KITEM2<IRb2Player>> {
    if (player.pdata.base?.name != null) player.pdata.base.name["@content"] = toHalfWidth(player.pdata.base.name["@content"])
    if (!player.pdata.released?.info) {
        let isUnlockSongs: boolean = U.GetConfig("unlock_all_songs")
        let isUnlockItems: boolean = U.GetConfig("unlock_all_items")
        if (!isUnlockSongs && !isUnlockItems) return player
        // Process fields specifically
        if (isUnlockSongs) player.pdata.glass == null // Glass data should not be saved if unlock all songs checked
        // General
        if (isUnlockSongs && isUnlockItems) {
            player.pdata.released = null
            return player
        }

        let removeList: number[] = []
        for (let i = 0; i < player.pdata.released.info.length; i++) if ((isUnlockSongs && (player.pdata.released.info[i].type == 0)) || (isUnlockItems && (player.pdata.released.info[i].type == 0))) removeList.push(i)
        for (let r of removeList) player.pdata.released.info.splice(r)
    }
    return player
}

let songsUnlockingData: any[]
function appendSongsUnlockingData(player: KITEM2<IRb2Player>): KITEM2<IRb2Player> {
    if (songsUnlockingData == null) {
        songsUnlockingData = []
        for (let j = 0; j <= 999; j++) {
            songsUnlockingData.push({
                type: K.ITEM("u8", 0),
                id: K.ITEM("u16", j),
                param: K.ITEM("u16", 15),
                insert_time: K.ITEM("s32", 1581368499)
            })
        }
    }
    if (player.pdata.released?.info == null) player.pdata.released = <any>{ info: songsUnlockingData }
    else player.pdata.released.info.push(...songsUnlockingData)
    return player
}

let itemsUnlockingData: any[]
function appendItemsUnlockingData(player: KITEM2<IRb2Player>): KITEM2<IRb2Player> {
    if (itemsUnlockingData == null) {
        itemsUnlockingData = []
        let ctrl = [-1, 30, 30, 30, 30, 30, 200, 50, 50]
        for (let i = 0; i < ctrl.length; i++) {
            for (let j = 0; j <= ctrl[i]; j++) {
                itemsUnlockingData.push({
                    type: K.ITEM("u8", i),
                    id: K.ITEM("u16", j),
                    param: K.ITEM("u16", 15),
                    insert_time: K.ITEM("s32", 1581368499)
                })
            }
        }
    }
    if (player.pdata.released?.info == null) player.pdata.released = <any>{ info: itemsUnlockingData }
    else player.pdata.released.info.push(...itemsUnlockingData)
    return player
}