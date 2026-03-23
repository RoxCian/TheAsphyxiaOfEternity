import { Rb1Player, Rb1PlayerBase, Rb1PlayerReleasedInfo } from "../../models/rb1/profile"
import { attachReleaseInfo, detachReleaseInfo, toFullWidthPlayerName, toHalfWidthPlayerName } from "../shared_game/player_processing"
// player.pdata.released.info.type == 0 -> song
// player.pdata.released.info.type == 1 -> sfx
// player.pdata.released.info.type == 2 -> bgm
// player.pdata.released.info.type == 3 -> frame
// player.pdata.released.info.type == 4 -> explode fx
// player.pdata.released.info.type == 5 -> bg

export function readPlayerPostProcess(player: Rb1Player) {
    toFullWidthPlayerName(player)
    attachReleaseInfo(1, player, Rb1PlayerReleasedInfo, [200, 30, 30, 30, 30, 30, 30, 30])
}
export async function writePlayerPreProcess(player: Rb1Player): Promise<void> {
    toHalfWidthPlayerName(player)
    detachReleaseInfo(1, player, async (_, isUnlockItems) => {
        const baseSaved = await DB.FindOne<Rb1PlayerBase>(player.rid, { collection: "rb.rb1.player.base" })
        // If you had turned on any of unlock switches, some rewards you should obtained when your level or matching grade increased
        // should not save into database. So let's rollback your level and matching grade at here.
        player.pdata.base.level = baseSaved?.level ?? 0
        if (isUnlockItems) player.pdata.base.matchingGrade = baseSaved?.matchingGrade ?? 0
    })
}
