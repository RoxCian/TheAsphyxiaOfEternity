import { ICollection } from "../../utils/db/db_types"

export class Rb6MiscSettings implements ICollection<"rb.rb6.player.misc"> {
    readonly collection = "rb.rb6.player.misc"
    rankingQuestIndex = 0
}
