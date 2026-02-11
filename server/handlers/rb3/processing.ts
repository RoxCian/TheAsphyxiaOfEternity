import { Rb3Player, Rb3PlayerReleasedInfo, Rb3Stamp } from "../../models/rb3/profile"
import { attachReleaseInfo, detachReleaseInfo, toFullWidthPlayerName, toHalfWidthPlayerName } from "../shared/player_processing"
// player.pdata.released.info.type == 0 -> song
// player.pdata.released.info.type == 6 -> character card
// player.pdata.released.info.type == 7 -> byword

export function readPlayerPostProcess(player: Rb3Player) {
    toFullWidthPlayerName(player)
    attachReleaseInfo(3, player, Rb3PlayerReleasedInfo, [550, 30, 30, 30, 30, 30, 200, 30])
}
export async function writePlayerPreProcess(player: Rb3Player) {
    toHalfWidthPlayerName(player)
    await detachReleaseInfo(3, player, async (isUnlockSongs, isUnlockItems) => {
        if (isUnlockSongs) {
            // Event progress should not be saved
            delete player.pdata.eventProgress
            delete player.pdata.seedPod
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