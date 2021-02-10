import { getCollectionMappingElement, KObjectMappingRecord } from "../../utility/mapping";
import { ICollection } from "../../utility/definitions";

export interface IRb6CharactorCard extends ICollection<"rb.rb6.player.charactorCard"> {
    charactorCardId: number
    level: number
    experience: number
}
export const Rb6CharactorCardMappingRecord: KObjectMappingRecord<IRb6CharactorCard> = {
    collection: getCollectionMappingElement<IRb6CharactorCard>("rb.rb6.player.charactorCard"),
    charactorCardId: { $type: "s32", $targetKey: "chara_card_id" },
    level: { $type: "s32", $targetKey: "lv" },
    experience: { $type: "s32", $targetKey: "exp" }
}
export function generateRb6CharactorCard(charactorCardId: number): IRb6CharactorCard {
    return {
        collection: "rb.rb6.player.charactorCard",
        charactorCardId: charactorCardId,
        level: 0,
        experience: 0
    }
}