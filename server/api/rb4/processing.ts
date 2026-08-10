import { Rb4Player, Rb4PlayerBase, Rb4PlayerReleasedInfo } from "../../models/rb4/profile"
import { attachReleaseInfo, detachReleaseInfo, toFullWidthPlayerName, toHalfWidthPlayerName } from "../shared_game/player_processing"

export async function readPlayerPostProcess(player: Rb4Player) {
    toFullWidthPlayerName(player)
    await attachReleaseInfo(4, player, Rb4PlayerReleasedInfo, [750, 30, 30, 30, 30, 30, 200, 30])
}
export async function writePlayerPreProcess(player: Rb4Player) {
    toHalfWidthPlayerName(player)
    await detachReleaseInfo(4, player, async () => {
        // Rollback player level
        const baseSaved = await DB.FindOne<Rb4PlayerBase>(player.pdata.account.rid, { collection: "rb.rb4.player.base" })
        player.pdata.base.level = baseSaved.level
    })
}
