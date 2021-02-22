import { getCollectionMappingElement, KObjectMappingRecord } from "../../utility/mapping"
import { ICollection } from "../utility/definitions"

export interface IRb6CharacterCard extends ICollection<"rb.rb6.player.characterCard"> {
    characterCardId: number
    level: number
    experience: number
}
export const Rb6CharacterCardMap: KObjectMappingRecord<IRb6CharacterCard> = {
    collection: getCollectionMappingElement<IRb6CharacterCard>("rb.rb6.player.characterCard"),
    characterCardId: { $type: "s32", $targetKey: "chara_card_id" },
    level: { $type: "s32", $targetKey: "lv" },
    experience: { $type: "s32", $targetKey: "exp" }
}
export function generateRb6CharactorCard(charactorCardId: number): IRb6CharacterCard {
    return {
        collection: "rb.rb6.player.characterCard",
        characterCardId: charactorCardId,
        level: 0,
        experience: 0
    }
}