import { IRb3Player } from "../../models/rb3/profile"

export function initializePlayer(player: IRb3Player) {
    let init = (v, i) => (v == null) ? i : v

    player.pdata.account.playCount = 0
    player.pdata.config.randomEntryWork = init(player.pdata.config.randomEntryWork, BigInt(Math.trunc(Math.random() * 99999999)))
    player.pdata.config.customFolderWork = init(player.pdata.config.randomEntryWork, BigInt(Math.trunc(Math.random() * 9999999999999)))
}