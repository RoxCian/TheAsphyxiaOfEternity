import { ICollection } from "../../utils/db/db_types"

export interface IPluginVersion<TMajor extends number = number, TMinor extends number = number, TRevision extends number = number> extends ICollection<"rb.pluginVersion"> {
    version: `${TMajor}.${TMinor}.${TRevision}`
}