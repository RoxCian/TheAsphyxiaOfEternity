import { DBH } from "../utils/db/dbh"
import { IBatchResult } from "../models/system/batch"
import { isHigherVersion } from "../utils/utility_functions"

export namespace Batch {
    const registeredBatch: { id: string, version: string, batch: () => Promise<any> }[] = []

    export async function execute(version: string): Promise<void> {
        for (const b of registeredBatch) {
            if (!await DBH.findOne<IBatchResult>({ collection: "rb.batchResult", batchId: b.id })) if (!isHigherVersion(version, b.version)) {
                await b.batch()
                await DBH.insert<IBatchResult>(undefined, { collection: "rb.batchResult", batchId: b.id })
                console.log(`Batch task "${b.id}" was executed.`)
            }
        }
    }
    export function register(id: string, version: string, batch: () => Promise<any>) {
        registeredBatch.push({ id: id, version: version, batch: batch })
    }
}