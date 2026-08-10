import { Rb6CharacterCard } from "../../models/rb6/character_card"
import { Rb6Player, Rb6PlayerReleasedInfo } from "../../models/rb6/profile"
import { attachReleaseInfo, detachReleaseInfo, toFullWidthPlayerName, toHalfWidthPlayerName } from "../shared_game/player_processing"

export async function readPlayerPostProcess(player: Rb6Player) {
    toFullWidthPlayerName(player)
    await attachReleaseInfo(6, player, Rb6PlayerReleasedInfo, [999, 200, 200, 200, 200, 200, 100, 200, 200, 33, 33, 33, 33], () => {
        player.pdata.characterCards.list = []
        for (let i = 0; i <= 99; i++) {
            const card = new Rb6CharacterCard(i)
            card.level = 9
            card.experience = 14000
            player.pdata.characterCards.list.push(card)
        }
    })
}
export async function writePlayerPreProcess(player: Rb6Player) {
    toHalfWidthPlayerName(player)
    await detachReleaseInfo(6, player, (_, isUnlockItems) => {
        if (isUnlockItems) player.pdata.characterCards.list = undefined
    })
}