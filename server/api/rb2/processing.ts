import { Rb2Player, Rb2PlayerReleasedInfo } from "../../models/rb2/profile"
import { toFullWidthPlayerName, attachReleaseInfo, toHalfWidthPlayerName, detachReleaseInfo } from "../shared_game/player_processing"

export async function readPlayerPostProcess(player: Rb2Player) {
    toFullWidthPlayerName(player)
    await attachReleaseInfo(2, player, Rb2PlayerReleasedInfo, [400, 30, 30, 30, 30, 30, 200, 50, 50])
}
export async function writePlayerPreProcess(player: Rb2Player): Promise<void> {
    toHalfWidthPlayerName(player)
    await detachReleaseInfo(2, player, (_, isUnlockItems) => {
        if (isUnlockItems) player.pdata.glass.g = undefined
    })
}
