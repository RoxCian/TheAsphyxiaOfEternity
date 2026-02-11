import { RbByword, RbColor, RbVersion } from "../../models/shared/rb_types"
import { loadCsvAsync } from "../../utils/csv"

export const rbBywords = loadCsvAsync<RbByword>("rb_bywords")

export async function getRbByword<TVersion extends RbVersion>(version: TVersion, side: RbColor, id: number): Promise<RbByword> {
    const bywords = await rbBywords
    return bywords.find(b => b.version === version && b.id == /** WTF? Cannot use "===" here? */ id && ((version !== 2 && version !== 3) || b.side === side)) ?? {
        version, side, id,
        byword: "<Unknown byword>",
        bywordOriginal: "",
        rarity: -1
    }
}