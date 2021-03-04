import { IRb3Player } from "../../models/rb3/profile"
import { KITEM2 } from "../../utility/mapping"
import { toFullWidth, toHalfWidth } from "../../utility/utility_functions"
// player.pdata.released.info.type == 0 -> song
// player.pdata.released.info.type == 6 -> character card
// player.pdata.released.info.type == 7 -> byword

export function readPlayerPostTask(player: KITEM2<IRb3Player>): KITEM2<IRb3Player> {
    if (player.pdata.base?.name != null) player.pdata.base.name["@content"] = toFullWidth(player.pdata.base.name["@content"])
    let isUnlockSongs: boolean = U.GetConfig("unlock_all_songs")
    if (!isUnlockSongs && !isUnlockSongs) return player

    if (isUnlockSongs) player = appendSongsUnlockingData(player)

    return player
}
export function writePlayerPredecessor(player: KITEM2<IRb3Player>): KITEM2<IRb3Player> {
    if (player.pdata.base?.name != null) player.pdata.base.name["@content"] = toHalfWidth(player.pdata.base.name["@content"])
    let isUnlockSongs: boolean = U.GetConfig("unlock_all_songs")
    let isUnlockCharacterCards: boolean = U.GetConfig("unlock_all_character_cards")
    if (!isUnlockSongs && !isUnlockCharacterCards) return player
    if (isUnlockSongs && isUnlockCharacterCards) {
        player.pdata.released = null
        return player
    }

    if (isUnlockSongs) {
        let removeList: number[] = []
        for (let i = 0; i < player.pdata.released.info.length; i++) if (player.pdata.released.info[i].type != 6) removeList.push(i)
        for (let r of removeList) player.pdata.released.info.splice(r)
    } else if (isUnlockCharacterCards) {
        let removeList: number[] = []
        for (let i = 0; i < player.pdata.released.info.length; i++) if (player.pdata.released.info[i].type == 6) removeList.push(i)
        for (let r of removeList) player.pdata.released.info.splice(r)
    }


    return player
}

let songsUnlockingData: any[]
function appendSongsUnlockingData(player: KITEM2<IRb3Player>): KITEM2<IRb3Player> {
    if (songsUnlockingData == null) {
        songsUnlockingData = []
        let ctrl = [944, 200, 200, 200, 200, 200, -1, 200, 200, 33, 33, 33, 33]
        for (let i = 0; i < ctrl.length; i++) {
            for (let j = 0; j <= ctrl[i]; j++) {
                songsUnlockingData.push({
                    type: K.ITEM("u8", i),
                    id: K.ITEM("u16", j),
                    param: K.ITEM("u16", 15),
                    insert_time: K.ITEM("s32", 1581368499)
                })
            }
        }
    }
    player.pdata.released = <any>{ info: songsUnlockingData }
    return player
}