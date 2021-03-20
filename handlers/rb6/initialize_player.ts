import { IRb6Player } from "../../models/rb6/profile"

export function initializePlayer(player: IRb6Player) {
    let init = (v, i) => (v == null) ? i : v

    player.pdata.account.playCount = 0
    player.pdata.base.rankQuestScore = init(player.pdata.base.rankQuestScore, [0, 0, 0])
    player.pdata.base.rankQuestRank = init(player.pdata.base.rankQuestRank, [0, 0, 0])
    player.pdata.base.mLog = init(player.pdata.base.mLog, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    player.pdata.base.ghostWinCount = init(player.pdata.base.ghostWinCount, 0)
    player.pdata.config.randomEntryWork = init(player.pdata.config.randomEntryWork, BigInt(Math.trunc(Math.random() * 99999999)))
    player.pdata.config.customFolderWork = init(player.pdata.config.randomEntryWork, BigInt(Math.trunc(Math.random() * 9999999999999)))
    player.pdata.mylist = {
        list: {
            collection: "rb.rb6.player.mylist",
            index: 0,
            mylist: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
        }
    }
}