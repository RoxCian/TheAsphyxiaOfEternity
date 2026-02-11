import { ICollection } from "../../utils/db/db_types"

export interface IBatchResult extends ICollection<"rb.batchResult"> {
    batchId: string
}