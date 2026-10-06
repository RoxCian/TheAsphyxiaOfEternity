import { rb6CharacterCards } from "../../data/tables/rb6_characard"
import { Rb6CharacterCard } from "../../models/rb6/character_card"
import { Rb6Player, Rb6PlayerReleasedInfo } from "../../models/rb6/profile"
import { attachReleaseInfo, detachReleaseInfo, toFullWidthPlayerName, toHalfWidthPlayerName } from "../shared_game/player_processing"

export async function readPlayerPostProcess(player: Rb6Player) {
    toFullWidthPlayerName(player)
    await attachReleaseInfo(6, player, Rb6PlayerReleasedInfo, [999, 200, 200, 200, 200, 200, [[0, 8], [51, 86]], 200, 200, [[0, 13], [15, 26], [29, 31], [32, 34]], [[0, 13], [16, 26], [29, 32], 33], [[0, 13], 14, [16, 26], [29, 32], 33], [[0, 14], [16, 31], 33]], () => {
        player.pdata.characterCards.list = []
        const chara = rb6CharacterCards
        for (let i = 0; i < chara.length; i++) {
            if (!chara[i].isAccessable) continue
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