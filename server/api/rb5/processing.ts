import { Rb5Player, Rb5PlayerReleasedInfo } from "../../models/rb5/profile"
import { toFullWidthPlayerName, attachReleaseInfo, toHalfWidthPlayerName, detachReleaseInfo } from "../shared_game/player_processing"

export async function readPlayerPostProcess(player: Rb5Player) {
    toFullWidthPlayerName(player)
    await attachReleaseInfo(5, player, Rb5PlayerReleasedInfo, [999, 30, 30, 30, 30, 30, 400, 134, 30])
}
export async function writePlayerPreProcess(player: Rb5Player) {
    toHalfWidthPlayerName(player)
    await detachReleaseInfo(5, player)
}
