import { ICollection } from "../utility/definitions"

export interface IRb6MiscSettings extends ICollection<"rb.rb6.player.misc"> {
    rankingQuestIndex: number
}
export function getRb6MiscSettings(): IRb6MiscSettings {
    return {
        collection: "rb.rb6.player.misc",
        rankingQuestIndex: 0
    }
}