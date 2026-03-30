import { Rb2Player, Rb2PlayerReleasedInfo } from "../../models/rb2/profile"
import { toFullWidthPlayerName, attachReleaseInfo, toHalfWidthPlayerName, detachReleaseInfo } from "../shared_game/player_processing"
// player.pdata.released.info.type == 0 -> song
// player.pdata.released.info.type == 1 -> sfx
// player.pdata.released.info.type == 2 -> bgm
// player.pdata.released.info.type == 3 -> frame
// player.pdata.released.info.type == 4 -> explode fx
// player.pdata.released.info.type == 5 -> bg
// player.pdata.released.info.type == 6 -> icon
// player.pdata.released.info.type == 7 -> byword left part
// player.pdata.released.info.type == 8 -> byword right part

export async function readPlayerPostProcess(player: Rb2Player) {
    toFullWidthPlayerName(player)
    await attachReleaseInfo(2, player, Rb2PlayerReleasedInfo, [400, 30, 30, 30, 30, 30, 200, 50, 50])
}
export async function writePlayerPreProcess(player: Rb2Player): Promise<void> {
    toHalfWidthPlayerName(player)
    await detachReleaseInfo(2, player, (_, isUnlockItems) => {
        if (isUnlockItems) player.pdata.glass = undefined
    })
}
