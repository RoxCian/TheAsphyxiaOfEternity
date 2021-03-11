import { ICollection } from "./definitions"

export interface IBatchResult extends ICollection<"rb.batchResult"> {
    batchId: string
}