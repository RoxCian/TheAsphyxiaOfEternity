import { IRb5Player } from "../../models/rb5/profile"

export function initializePlayer(player: IRb5Player) {
    let init = (v, i) => (v == null) ? i : v

    player.pdata.account.playCount = 0
    player.pdata.config.randomEntryWork = init(player.pdata.config.randomEntryWork, BigInt(Math.trunc(Math.random() * 99999999)))
    player.pdata.config.customFolderWork = init(player.pdata.config.randomEntryWork, BigInt(Math.trunc(Math.random() * 9999999999999)))
    player.pdata.mylist = {
        list: {
            collection: "rb.rb5.player.mylist",
            index: 0,
            mylist: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
        }
    }
}