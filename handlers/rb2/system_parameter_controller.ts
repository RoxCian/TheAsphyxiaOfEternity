import { IRb2Player, IRb2PlayerBase } from "../../models/rb2/profile"
import { KITEM2 } from "../../utility/mapping"
// player.pdata.released.info.type == 0 -> song
// player.pdata.released.info.type == 1 -> sfx
// player.pdata.released.info.type == 2 -> bgm
// player.pdata.released.info.type == 3 -> frame
// player.pdata.released.info.type == 4 -> explode fx
// player.pdata.released.info.type == 5 -> bg
// player.pdata.released.info.type == 6 -> icon (11: FLOWER)

export function readPlayerPostTask(player: KITEM2<IRb2Player>): KITEM2<IRb2Player> {
    let isUnlockSongs: boolean = U.GetConfig("unlock_all_songs")
    if (isUnlockSongs) player = appendSongsUnlockingData(player)

    return player
}
export async function writePlayerPredecessor(player: KITEM2<IRb2Player>): Promise<KITEM2<IRb2Player>> {
    let isUnlockSongs: boolean = U.GetConfig("unlock_all_songs")
    if (isUnlockSongs) {
        let rid = player.rid["@content"]
        let base = await DB.FindOne<IRb2PlayerBase>(rid, { collection: "rb.rb2.player.base" })

        player.pdata.released.info = null
        /** @ts-ignore */
        player.pdata.base.lv["@content"] = [(base == null) ? 0 : base.level]
        /** @ts-ignore */
        player.pdata.base.mg["@content"] = [(base == null) ? 0 : base.matchingGrade]
    }

    return player
}

let songsUnlockingData: any[]
function appendSongsUnlockingData(player: KITEM2<IRb2Player>): KITEM2<IRb2Player> {
    if (songsUnlockingData == null) {
        songsUnlockingData = []
        let ctrl = [1000, 200, 200, 200, 200, 200, 200, 200, 200, 33, 33, 33, 33]
        for (let i = 0; i < ctrl.length; i++) {
            for (let j = 0; j <= ctrl[i]; j++) {
                songsUnlockingData.push({
                    type: K.ITEM("u8", i),
                    id: K.ITEM("u16", j),
                    param: K.ITEM("u16", 15)
                })
            }
        }
    }
    player.pdata.released = <any>{ info: songsUnlockingData }
    return player
}