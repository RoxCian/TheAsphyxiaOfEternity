import { IRb6Player } from "../../models/rb6/profile"
import { KITEM2 } from "../../utility/mapping"
import { toFullWidth, toHalfWidth } from "../../utility/utility_functions"
// player.pdata.released.info.type == 0 -> song
// player.pdata.released.info.type == 6 -> character card
// player.pdata.released.info.type == 7 -> byword
// player.pdata.released.info.type == 9 -> head equip
// player.pdata.released.info.type == 10 -> body equip
// player.pdata.released.info.type == 11 -> leg equip
// player.pdata.released.info.type == 12 -> arms
// player.pdata.released.info.type == 13 -> music fragment

export function readPlayerPostProcess(player: KITEM2<IRb6Player>): KITEM2<IRb6Player> {
    if (player.pdata.base?.name != null) player.pdata.base.name["@content"] = toFullWidth(player.pdata.base.name["@content"])
    let isUnlockSongs: boolean = U.GetConfig("unlock_all_songs")
    let isUnlockItems: boolean = U.GetConfig("unlock_all_items")
    if (!isUnlockSongs && !isUnlockSongs) return player

    if (isUnlockSongs) player = appendSongsUnlockingData(player)
    if (isUnlockItems) player = appendItemsUnlockingData(player)

    return player
}
export function writePlayerPreProcess(player: KITEM2<IRb6Player>): KITEM2<IRb6Player> {
    if (player.pdata.base?.name != null) player.pdata.base.name["@content"] = toHalfWidth(player.pdata.base.name["@content"])
    if (!player.pdata.released?.info) {
        let isUnlockSongs: boolean = U.GetConfig("unlock_all_songs")
        let isUnlockItems: boolean = U.GetConfig("unlock_all_items")
        if (!isUnlockSongs && !isUnlockItems) return player
        // Process fields specifically
        if (isUnlockItems) player.pdata.characterCards = null
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
function appendSongsUnlockingData(player: KITEM2<IRb6Player>): KITEM2<IRb6Player> {
    if (songsUnlockingData == null) {
        songsUnlockingData = []
        for (let j = 0; j <= 944; j++) {
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
let characterCardsData: any[]
function appendItemsUnlockingData(player: KITEM2<IRb6Player>): KITEM2<IRb6Player> {
    if (itemsUnlockingData == null) {
        itemsUnlockingData = []
        let ctrl = [-1, 200, 200, 200, 200, 200, 100, 200, 200, 33, 33, 33, 33]
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
    if (characterCardsData == null) {
        characterCardsData = []
        for (let i = 0; i <= 99; i++) {
            characterCardsData.push({
                chara_card_id: K.ITEM("s32", i),
                lv: K.ITEM("s32", 9),
                exp: K.ITEM("s32", 14000)
            })
        }
    }
    (<any>player.pdata).chara_card = <any>{ list: characterCardsData }
    return player
}