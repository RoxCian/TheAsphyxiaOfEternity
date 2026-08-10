import { Rb3Player, Rb3PlayerReleasedInfo, Rb3Stamp } from "../../models/rb3/profile"
import { attachReleaseInfo, detachReleaseInfo, toFullWidthPlayerName, toHalfWidthPlayerName } from "../shared_game/player_processing"

export async function readPlayerPostProcess(player: Rb3Player) {
    toFullWidthPlayerName(player)
    await attachReleaseInfo(3, player, Rb3PlayerReleasedInfo, [550, 30, 30, 30, 30, 30, 200, 80])
}
export async function writePlayerPreProcess(player: Rb3Player) {
    toHalfWidthPlayerName(player)
    await detachReleaseInfo(3, player, async (isUnlockSongs, isUnlockItems) => {
        if (isUnlockSongs) {
            // Event progress should not be saved
            delete player.pdata.eventProgress.data
            delete player.pdata.seedPod.data
        }
        if (isUnlockItems) {
            const stampsSaved = await DB.FindOne<Rb3Stamp>(player.pdata.account.rid, { collection: "rb.rb3.player.stamp" }) ?? new Rb3Stamp()
            for (let i = 0; i <= 4; i++) {
                const addStampCount = player.pdata.stamp.stampCount[i] - stampsSaved.stampCount[i]
                player.pdata.stamp.ticketCount[i] += addStampCount * 10 // 1 stamp == 10 tickets
            }
        }
    })
}