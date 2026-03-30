import { Rb4Player, Rb4PlayerBase, Rb4PlayerReleasedInfo } from "../../models/rb4/profile"
import { toFullWidth, toHalfWidth } from "../../utils/utility_functions"
import { attachReleaseInfo, detachReleaseInfo, toFullWidthPlayerName, toHalfWidthPlayerName } from "../shared_game/player_processing"
// player.pdata.released.info.type == 0 -> song
// player.pdata.released.info.type == 1 -> sfx
// player.pdata.released.info.type == 2 -> bgm (2: Qrispy)
// player.pdata.released.info.type == 3 -> frame
// player.pdata.released.info.type == 4 -> explode fx
// player.pdata.released.info.type == 5 -> bg
// player.pdata.released.info.type == 6 -> icon
// player.pdata.released.info.type == 7 -> byword

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
