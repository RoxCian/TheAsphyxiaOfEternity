import { RbByword, RbColor, RbVersion } from "../../models/shared/rb_types"
import { loadCsv } from "../../utils/csv"

export const rbBywords = loadCsv<RbByword>("rb_bywords")

export function getRbByword<TVersion extends RbVersion>(version: TVersion, side: RbColor, id: number): RbByword {
    return rbBywords.find(b => b.version === version && b.id == /** WTF? Cannot use "===" here? */ id && ((version !== 2 && version !== 3) || b.side === side)) ?? {
        version, side, id,
        byword: "<Unknown byword>",
        bywordOrig: "",
        rarity: -1
    }
}