import { ICollection } from "../../models/utility/definitions"

export namespace DBM {
    export interface IDBCollectionName extends ICollection<"dbManager.collectionName"> {
        name: string
    }
    export interface IDBOperation<T = any, TOperation extends "insert" | "update" | "upsert" | "remove" = "insert" | "update" | "upsert" | "remove"> {
        refid?: string
        query: TOperation extends "insert" ? null : Query<T>
        operation: TOperation
        doc: TOperation extends "remove" ? null : T | Doc<T>
        isPublicDoc?: boolean
    }
    export class DBOperationManager {
        public collection: IDBOperation[] = []

        public push(...op: IDBOperation[]): void {
            this.collection.push(...op)
        }
        public update<T extends ICollection<any>>(refid: string | null, query: Query<T>, data: Doc<T>, isPublicDoc: boolean = true): void {
            this.collection.push({ refid: refid, query: query, operation: "update", doc: data, isPublicDoc: isPublicDoc })
        }
        public upsert<T extends ICollection<any>>(refid: string | null, query: Query<T>, data: Doc<T>, isPublicDoc: boolean = true): void {
            this.collection.push({ refid: refid, query: query, operation: "upsert", doc: data, isPublicDoc: isPublicDoc })
        }
        public insert<T extends ICollection<any>>(refid: string | null, data: Doc<T>, isPublicDoc: boolean = true): void {
            this.collection.push({ refid: refid, operation: "insert", query: null, doc: data, isPublicDoc: isPublicDoc })
        }
        public remove<T extends ICollection<any>>(refid: string | null, query: Query<T>, isPublicDoc: boolean = true): void {
            this.collection.push({ refid: refid, query: query, operation: "remove", doc: null, isPublicDoc: isPublicDoc })
        }
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
    export async function update<T extends ICollection<any>>(refid: string | null, query: Query<T>, data: Doc<T>, isPublicDoc: boolean = true) {
        checkData(data)
        if (refid == null) return isPublicDoc ? await DB.Update(query, data) : await DB.Update(null, query, data)
        else return await DB.Update(refid, query, data)
    }
    export async function upsert<T extends ICollection<any>>(refid: string | null, query: Query<T>, data: Doc<T>, isPublicDoc: boolean = true) {
        checkData(data)
        if (refid == null) return isPublicDoc ? await DB.Upsert(query, data) : await DB.Upsert(null, query, data)
        else return await DB.Upsert(refid, query, data)
    }
    export async function insert<T extends ICollection<any>>(refid: string | null, data: Doc<T>, isPublicDoc: boolean = true) {
        checkData(data)
        if (refid == null) return isPublicDoc ? await DB.Insert(data) : await DB.Insert(null, data)
        else return await DB.Insert(refid, data)
    }
    export async function remove<T extends ICollection<any>>(refid: string | null, query: Query<T>, isPublicDoc: boolean = true) {
        if (refid == null) return isPublicDoc ? await DB.Remove(query) : await DB.Remove(null, query)
        else return await DB.Remove(refid, query)
    }

    export async function operate(operations: DBOperationManager) {
        let result = []
        for (let o of operations.collection) {
            switch (o.operation) {
                case "insert":
                    result.push(await insert(o.refid, o.doc, o.isPublicDoc))
                    break
                case "update":
                    result.push(await update(o.refid, o.query, o.doc, o.isPublicDoc))
                    break
                case "upsert":
                    result.push(await upsert(o.refid, o.query, o.doc, o.isPublicDoc))
                    break
                case "remove":
                    result.push(await remove(o.refid, o.query, o.isPublicDoc))
                    break
            }
        }
        return result
    }

    export async function removeAllData(refid?: string, filter?: string) {
        for (let c of await getCollectionNames(filter)) remove(refid, { collection: c.name })

        if ((refid == null) && (filter == null)) remove(null, { collection: "dbManager.collectionName" })
    }
    export async function overall(refid: string, userId: number, filter: string, operation: "delete" | "export" | "override", data?: any) {
        if (refid == null) return
        try {
            let collections = await DBM.getCollectionNames(filter)
            let traverse = async (f: (rid: string | null, query: Query<ICollection<any>>) => Promise<any>) => {
                let result = []
                for (let c of collections) {
                    if (c.name.includes("#userId") && (userId != null)) result.concat(...await f(null, { collection: c.name, userId: userId }))
                    else result.concat(...await f(refid, { collection: c.name }))
                }
                return result
            }
            switch (operation) {
                case "delete":
                    await traverse((rid, query) => DBM.remove(rid, query))
                    break
                case "export":
                    let result = await traverse((rid, query) => DB.Find(rid, query))
                    return JSON.stringify(result)
                case "override":
                    if (!Array.isArray(data)) return "The data may not be an Asphyxia CORE savedata."
                    await traverse((rid, query) => DBM.remove(rid, query))
                    for (let d of data) if ((typeof (d?.collection) == "string") && (!d.collection.includes(filter))) DB.Insert(d)
                    break
            }
        } catch (e) {
            return e.message
        }
        return null

    }
}