import { ICollection } from "../models/utility/definitions"

export namespace DBM {
    export interface IDBCollectionName extends ICollection<"dbManager.collectionName"> {
        name: string
    }
    export async function getCollectionNames(filter?: string): Promise<IDBCollectionName[]> {
        let result = await DB.Find<IDBCollectionName>({ collection: "dbManager.collectionName" })
        if (filter != null) {
            let filters = filter.split(",")
            for (let i = 0; i < filter.length; i++) filters[i] = filters[i].trim()
            let i = 0
            while (i < result.length) {
                let removeFlag = false
                for (let f of filters) if (f.startsWith("!") ? !result[i].name.includes(f) : result[i].name.includes(f)) {
                    result.splice(i, 1)
                    removeFlag = true
                    break
                }
                if (!removeFlag) i++
            }
        }

        return result
    }

    async function checkData<T extends ICollection<any>>(data: T): Promise<void> {
        if (await DB.FindOne<IDBCollectionName>({ collection: "dbManager.collectionName", name: data.collection }) == null) {
            await DB.Insert<IDBCollectionName>({ collection: "dbManager.collectionName", name: data.collection })
        }
    }
    export async function update<T extends ICollection<any>>(refid: string | null, query: Query<T>, data: T) {
        checkData(data)
        if (refid == null) return await DB.Update(query, data)
        else return await DB.Update(refid, query, data)
    }
    export async function upsert<T extends ICollection<any>>(refid: string | null, query: Query<T>, data: T) {
        checkData(data)
        if (refid == null) return await DB.Upsert(query, data)
        else return await DB.Upsert(refid, query, data)
    }
    export async function insert<T extends ICollection<any>>(refid: string | null, data: T) {
        checkData(data)
        if (refid == null) return await DB.Insert(data)
        else return await DB.Insert(refid, data)
    }
    export async function remove<T extends ICollection<any>>(refid: string | null, query: Query<T>) {
        if (refid == null) return await DB.Remove(query)
        else return await DB.Remove(refid, query)
    }

    export async function removeAllData(refid?: string, filter?: string) {
        for (let c of await getCollectionNames(filter)) remove(refid, { collection: c.name })

        if ((refid == null) && (filter == null)) remove(null, { collection: "dbManager.collectionName" })
    }
}