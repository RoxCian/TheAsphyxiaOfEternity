import { IRb4Player, IRb4PlayerBase } from "../../models/rb4/profile"
import { KITEM2 } from "../../utility/mapping"
import { toFullWidth, toHalfWidth } from "../../utility/utility_functions"
// player.pdata.released.info.type == 0 -> song
// player.pdata.released.info.type == 1 -> sfx
// player.pdata.released.info.type == 2 -> bgm (2: Qrispy)
// player.pdata.released.info.type == 3 -> frame
// player.pdata.released.info.type == 4 -> explode fx
// player.pdata.released.info.type == 5 -> bg
// player.pdata.released.info.type == 6 -> icon
// player.pdata.released.info.type == 7 -> byword

export function readPlayerPostProcess(player: KITEM2<IRb4Player>): KITEM2<IRb4Player> {
    if (player.pdata.base?.name != null) player.pdata.base.name["@content"] = toFullWidth(player.pdata.base.name["@content"])
    let isUnlockSongs: boolean = U.GetConfig("unlock_all_songs")
    let isUnlockItems: boolean = U.GetConfig("unlock_all_items")
    if (!isUnlockSongs && !isUnlockSongs) return player

    if (isUnlockSongs) player = appendSongsUnlockingData(player)
    if (isUnlockItems) player = appendItemsUnlockingData(player)

    return player
}
export async function writePlayerPreProcess(player: KITEM2<IRb4Player>): Promise<KITEM2<IRb4Player>> {
    if (player.pdata.base?.name != null) player.pdata.base.name["@content"] = toHalfWidth(player.pdata.base.name["@content"])
    if (!player.pdata.released?.info) {
        let isUnlockSongs: boolean = U.GetConfig("unlock_all_songs")
        let isUnlockItems: boolean = U.GetConfig("unlock_all_items")
        if (!isUnlockSongs && !isUnlockItems) return player
        // Process fields specifically
        if (isUnlockSongs || isUnlockItems) {
            let oldBase = await DB.FindOne<IRb4PlayerBase>(player.pdata.account.rid["@content"], { collection: "rb.rb4.player.base" })
            player.pdata.base.level["@content"] = [oldBase.level]
        }
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
function appendSongsUnlockingData(player: KITEM2<IRb4Player>): KITEM2<IRb4Player> {
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
function appendItemsUnlockingData(player: KITEM2<IRb4Player>): KITEM2<IRb4Player> {
    if (itemsUnlockingData == null) {
        itemsUnlockingData = []
        let ctrl = [-1, 30, 30, 30, 30, 30, 200, 30]
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