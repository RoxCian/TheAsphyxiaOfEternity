import { Rb5Player, Rb5PlayerReleasedInfo } from "../../models/rb5/profile"
import { toFullWidthPlayerName, attachReleaseInfo, toHalfWidthPlayerName, detachReleaseInfo } from "../shared_game/player_processing"
// player.pdata.released.info.type == 0 -> song
// player.pdata.released.info.type == 1 -> sfx
// player.pdata.released.info.type == 2 -> bgm (2: Qrispy)
// player.pdata.released.info.type == 3 -> frame
// player.pdata.released.info.type == 4 -> explode fx
// player.pdata.released.info.type == 5 -> bg
// player.pdata.released.info.type == 6 -> icon
// player.pdata.released.info.type == 7 -> byword
// player.pdata.released.info.type == 8 -> voice chat
export function readPlayerPostProcess(player: Rb5Player) {
    toFullWidthPlayerName(player)
    attachReleaseInfo(5, player, Rb5PlayerReleasedInfo, [999, 30, 30, 30, 30, 30, 200, 30, 30])
}
export async function writePlayerPreProcess(player: Rb5Player) {
    toHalfWidthPlayerName(player)
    await detachReleaseInfo(5, player)
}
