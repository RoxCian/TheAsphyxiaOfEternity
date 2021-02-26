import { IRb1Player, IRb1PlayerBase } from "../../models/rb1/profile"
import { KITEM2 } from "../../utility/mapping"
// player.pdata.released.info.type == 0 -> song
// player.pdata.released.info.type == 6 -> character card
// player.pdata.released.info.type == 7 -> byword

export function readPlayerPostTask(player: KITEM2<IRb1Player>): KITEM2<IRb1Player> {
    let isUnlockSongs: boolean = U.GetConfig("unlock_all_songs")
    if (isUnlockSongs) player = appendSongsUnlockingData(player)

    return player
}
export async function writePlayerPredecessor(player: KITEM2<IRb1Player>): Promise<KITEM2<IRb1Player>> {
    let isUnlockSongs: boolean = U.GetConfig("unlock_all_songs")
    if (isUnlockSongs) {
        let rid = player.rid["@content"]
        let base = await DB.FindOne<IRb1PlayerBase>(rid, { collection: "rb.rb1.player.base" })

        player.pdata.released.info = null
        player.pdata.base.level["@content"] = [(base == null) ? 0 : base.level]
        player.pdata.base.matchingGrade["@content"] = [(base == null) ? 0 : base.matchingGrade]
    }

    return player
}

let songsUnlockingData: any[]
function appendSongsUnlockingData(player: KITEM2<IRb1Player>): KITEM2<IRb1Player> {
    if (songsUnlockingData == null) {
        songsUnlockingData = []
        let ctrl = [1000, 200, 200, 200, 200, 200, 200, 200, 200, 33, 33, 33, 33]
        for (let i = 0; i < ctrl.length; i++) {
            for (let j = 0; j <= ctrl[i]; j++) {
                songsUnlockingData.push({
                    type: K.ITEM("u8", i),
                    id: K.ITEM("u16", j)
                })
            }
        }
    }
    player.pdata.released = <any>{ info: songsUnlockingData }
    return player
}