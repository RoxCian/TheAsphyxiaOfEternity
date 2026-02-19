import { rbItems } from "../../data/tables/rb_items"
import { RbAvailableItemResponse, RbVersion } from "../../models/shared/web"

export type IReleasedInfo = {
    type: number
    id: number
}
export type AdditionalReleasedInfoType = {
    type: number
    id: number[]
}
export async function readAvailableItemsShared<TReleased extends IReleasedInfo>(version: RbVersion, released: TReleased[], additionalTypesToCheck: AdditionalReleasedInfoType[]): Promise<RbAvailableItemResponse[]> {
    const result = (await rbItems).filter(i => i.version === version && (i.isUnlockedByDefault || released.some(r => r.type === i.typeId && r.id === i.value))).map(i => ({ typeId: i.typeId, value: i.value }))
    const additional = released.filter(r => additionalTypesToCheck.find(t => t.type === r.type)).map(r => ({ typeId: r.type, value: r.id }))
    for (let i = 0; i < additionalTypesToCheck.length; i++) {
        const t = additionalTypesToCheck[i]
        for (const u of t.id) {
            if (!additional.some(a => a.typeId === t.type && a.value === u)) {
                additional.push({ typeId: t.type, value: u })
            }
        }
    }
    return [...result, ...additional]
}