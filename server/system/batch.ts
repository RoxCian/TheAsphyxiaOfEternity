import { DBH } from "../utils/db/dbh"
import { IBatchResult } from "../models/system/batch"
import { isHigherVersion } from "../utils/utility_functions"

export namespace Batch {
    const registeredBatch: { id: string, version: string, batch: () => Promise<any> }[] = []

    export async function execute(version: string): Promise<void> {
        for (const b of registeredBatch) {
            if ((await DB.Find<IBatchResult>({ collection: "rb.batchResult", batchId: b.id })).length === 0) if (!isHigherVersion(version, b.version)) {
                await b.batch()
                await DBH.insert<IBatchResult>(undefined, { collection: "rb.batchResult", batchId: b.id })
            }
        }
    }
    export function register(id: string, version: string, batch: () => Promise<any>) {
        registeredBatch.push({ id: id, version: version, batch: batch })
    }
}