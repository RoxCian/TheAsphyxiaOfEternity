import { ICollection } from "../../utils/db/db_types"
import { XD } from "../../utils/x"

export class Rb6CharacterCard implements ICollection<"rb.rb6.player.characterCard"> {
    readonly collection = "rb.rb6.player.characterCard"
    @XD.s32("chara_card_id") characterCardId: number
    @XD.s32("lv") level = 0
    @XD.s32("exp") experience = 0

    constructor(charactorCardId: number) {
        this.characterCardId = charactorCardId
    }
}