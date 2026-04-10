import { ICollection } from "./db_types"
import { GetType, isType, Type } from "../types"
import { getPropertyDescriptor } from "../utility_functions"

export namespace DBH {
    // DB operation serialization
    type DBTaskGenerator<T> = () => Promise<T>
    type DBTask<T> = {
        resolve: (result: T) => void
        reject: (reason?: any) => void
        generator: DBTaskGenerator<T>
    }
    const dbTaskQueue: DBTask<unknown>[] = []
    let taskExecutorRunning = false
    function enqueueTask<T>(taskGenerator: DBTaskGenerator<T>): Promise<T> {
        let resolve: (result: T) => void
        let reject: (reason?: any) => void
        const result = new Promise<T>((res, rej) => {
            resolve = res
            reject = rej
        })
        const task: DBTask<T> = {
            resolve, reject, generator: taskGenerator
        }
        dbTaskQueue.splice(0, 0, task)
        if (!taskExecutorRunning) executeTask()
        return result
    }
    async function executeTask() {
        taskExecutorRunning = true
        while (dbTaskQueue.length > 0) {
            const task = dbTaskQueue.pop()
            try {
                const result = await task.generator()
                task.resolve(result)
            } catch (ex) {
                task.reject(ex)
            }
        }
        taskExecutorRunning = false
    }

    // DB config
    type TypeWithDBConfig<T> = Type<T> & { __dbConfig__?: DBConfig<T> }
    type DBConfig<T> = {
        [K in keyof T]: {
            $one?: TypeWithDBConfig<T[K]>
            $many?: T[K] extends (infer TE)[] ? TypeWithDBConfig<TE> : never
            $ignore?: true
        }
    }
    // DB config typed fields decorators
    export function one(type: Type<unknown>) {
        return function (target: any, prop: string) {
            if (!target.constructor.__dbConfig__) {
                target.constructor.__dbConfig__ = {
                    [prop]: {}
                }
            } else if (!target.constructor.__dbConfig__[prop]) {
                target.constructor.__dbConfig__[prop] = {}
            }
            target.constructor.__dbConfig__[prop].$one = type
        }
    }
    export function many(type: Type<unknown>) {
        return function (target: any, prop: string) {
            if (!target.constructor.__dbConfig__) {
                target.constructor.__dbConfig__ = {
                    [prop]: {}
                }
            } else if (!target.constructor.__dbConfig__[prop]) {
                target.constructor.__dbConfig__[prop] = {}
            }
            target.constructor.__dbConfig__[prop].$many = type
        }
    }
    export function aw(key: string, elType: Type<unknown>) {
        return function (target: any, prop: string) {
            if (!target.__dbConfig__) {
                target.__dbConfig__ = {
                    [prop]: {}
                }
            } else if (!target.__dbConfig__[prop]) {
                target.__dbConfig__[prop] = {}
            }
            class __AW__ {
                static readonly __dbConfig__ = {
                    [key]: {
                        $many: elType
                    }
                }
            }
            target.__dbConfig__[prop].$one = __AW__
        }
    }

    // Typed query helpers
    function assignDoc<T>(obj: T, dbConfig?: DBConfig<T>) {
        if (!dbConfig) return
        for (const k in dbConfig) {
            const desc = getPropertyDescriptor(obj, k)
            if (!desc || desc.writable || desc.set) {
                const conf = dbConfig[k]
                if (conf.$one) {
                    if (!(obj[k] instanceof conf.$one)) {
                        obj[k] = Object.assign(new conf.$one(), obj[k])
                        Object.setPrototypeOf(obj[k], conf.$one.prototype)
                    }
                    assignDoc(obj[k], conf.$one?.__dbConfig__)
                } else if (conf.$many) {
                    const a = obj[k]
                    if (Array.isArray(a)) {
                        for (let i = 0; i < a.length; i++) {
                            if (!(a[i] instanceof conf.$many)) {
                                a[i] = Object.assign(new conf.$many(), a[i])
                                Object.setPrototypeOf(a[i], conf.$many.prototype)
                            }
                            assignDoc(a[i], conf.$many?.__dbConfig__)
                        }
                    } else throw new Error("Type not matched (DBH.many)")
                }
            }
        }
    }
    function docToObj<T extends ICollection<any>>(doc: Doc<T>, typeParam: Type<T> | GetType<T> | undefined): T & Doc<T> {
        if (typeParam) {
            const type: TypeWithDBConfig<T> = isType(typeParam) ? typeParam : typeParam(doc)
            if (!(doc instanceof type)) {
                doc = Object.assign(new type(), doc)
                Object.setPrototypeOf(doc, type.prototype)
            }
            assignDoc(doc, type?.__dbConfig__)
        }
        return doc
    }
    function docsToObjs<T extends ICollection<any>>(docs: Doc<T>[], typeParam: Type<T> | GetType<T> | undefined): (T & Doc<T>)[] {
        if (typeParam) return docs.map(doc => {
            const type: TypeWithDBConfig<T> = isType(typeParam) ? typeParam : typeParam(doc)
            if (!(doc instanceof type)) {
                doc = Object.assign(new type(), doc)
                Object.setPrototypeOf(doc, type.prototype)
            }
            assignDoc(doc, type?.__dbConfig__)
            return doc
        })
        return docs
    }
    function reorderReadParams<T>(refidOrQueryOrType: string | undefined | Type<T> | GetType<T> | Query<T>, queryOrType: Type<T> | GetType<T> | Query<T> | undefined, query: Query<T> | undefined): { refid: string | undefined, query: Query<T>, type?: Type<T> | GetType<T>, isPublicDoc: boolean } {
        const isPublicDoc = !!refidOrQueryOrType && typeof refidOrQueryOrType !== "string"
        const refid = (typeof refidOrQueryOrType === "string" || refidOrQueryOrType == undefined) ? refidOrQueryOrType as string | undefined : undefined
        const type = isType(refidOrQueryOrType) || typeof refidOrQueryOrType === "function" ? refidOrQueryOrType : isType(queryOrType) || typeof queryOrType === "function" ? queryOrType : undefined
        query ??= refidOrQueryOrType && typeof refidOrQueryOrType !== "string" && !isType(refidOrQueryOrType) && typeof refidOrQueryOrType !== "function" ? refidOrQueryOrType : queryOrType && !isType(queryOrType) && typeof queryOrType !== "function" ? queryOrType : query
        return { refid, query, type, isPublicDoc }
    }
    function reorderWriteParams<T>(refidOrQuery: string | undefined | Query<T>, queryOrData: Query<T> | Doc<T> | Update<T>, data?: Doc<T> | Update<T>): { refid: string | undefined, query: Query<T>, data: Doc<T> | Update<T>, isPublicDoc: boolean } {
        const isPublicDoc = !!refidOrQuery && typeof refidOrQuery !== "string"
        const refid = (typeof refidOrQuery === "string" || refidOrQuery == undefined) ? refidOrQuery as string | undefined : undefined
        const query = refidOrQuery && typeof refidOrQuery !== "string" ? refidOrQuery : queryOrData as Query<T>
        data ??= queryOrData as Doc<T> | Update<T>
        return { refid, query, data, isPublicDoc }
    }

    // Serialized & typed DB query
    async function checkData<T extends ICollection<any>>(data: Partial<T>, isUpdate: boolean): Promise<void> {
        if (isUpdate) {
            for (let k in data) if (k.startsWith("__")) delete data[k]
        }
        if (!await enqueueTask(() => DB.FindOne<IDBCollectionName>({ collection: "dbManager.collectionName", name: data.collection }))) {
            await enqueueTask(() => DB.Insert<IDBCollectionName>({ collection: "dbManager.collectionName", name: data.collection }))
        }
    }
    type DBUpdateResult<T> = {
        updated: number
        docs: Doc<T>[]
    }
    type DBUpdateProfileResult<T> = {
        updated: number
        docs: ProfileDoc<T>[]
    }
    type DBUpsertResult<T> = {
        updated: number
        docs: Doc<T>[]
        upsert: boolean
    }
    type DBUpsertProfileResult<T> = {
        updated: number
        docs: ProfileDoc<T>[]
        upsert: boolean
    }
    export async function update<T extends ICollection<any>>(query: Query<T>, data: Doc<T> | Update<T>): Promise<DBUpdateResult<T>>
    export async function update<T extends ICollection<any>>(refid: string | undefined, query: Query<T>, data: Doc<T> | Update<T>): Promise<DBUpdateProfileResult<T>>
    export async function update<T extends ICollection<any>>(refidOrQuery: string | undefined | Query<T>, queryOrData: Query<T> | Doc<T> | Update<T>, dataDocOrUpdate?: Doc<T> | Update<T>): Promise<DBUpdateResult<T> | DBUpdateProfileResult<T>> {
        const { refid, query, data, isPublicDoc } = reorderWriteParams(refidOrQuery, queryOrData, dataDocOrUpdate)
        checkData(data, true)
        if (refid == undefined) return isPublicDoc ? await enqueueTask(() => DB.Update(query, data)) : await enqueueTask(() => DB.Update(undefined, query, data))
        else return await enqueueTask(() => DB.Update(refid, query, data))
    }
    export async function upsert<T extends ICollection<any>>(query: Query<T>, data: Doc<T>): Promise<DBUpsertResult<T>>
    export async function upsert<T extends ICollection<any>>(refid: string | undefined, query: Query<T>, data: Doc<T>): Promise<DBUpsertProfileResult<T>>
    export async function upsert<T extends ICollection<any>>(refidOrQuery: string | undefined | Query<T>, queryOrData: Query<T> | Doc<T> | Update<T>, dataDocOrUpdate?: Doc<T>): Promise<DBUpsertResult<T> | DBUpsertProfileResult<T>> {
        const { refid, query, data, isPublicDoc } = reorderWriteParams(refidOrQuery, queryOrData, dataDocOrUpdate)
        checkData(data, false)
        if (refid == undefined) return isPublicDoc ? await enqueueTask(() => DB.Upsert(query, data)) : await enqueueTask(() => DB.Upsert(undefined, query, data))
        else return await enqueueTask(() => DB.Upsert(refid, query, data))
    }
    export async function insert<T extends ICollection<any>>(data: Doc<T>): Promise<Doc<T>>
    export async function insert<T extends ICollection<any>>(refid: string, data: Doc<T>): Promise<ProfileDoc<Doc<T>>>
    export async function insert<T extends ICollection<any>>(refidOrData: string | Doc<T>, data?: Doc<T>): Promise<Doc<T> | ProfileDoc<T>> {
        const refid = typeof refidOrData === "string" ? refidOrData : undefined
        checkData(data, false)
        if (refid == undefined) return await enqueueTask(() => DB.Insert(data))
        else return await enqueueTask(() => DB.Insert(refid, data))
    }
    export async function remove<T extends ICollection<any>>(query: Query<T>): Promise<number>
    export async function remove<T extends ICollection<any>>(refid: string | undefined, query: Query<T>): Promise<number>
    export async function remove<T extends ICollection<any>>(refidOrQuery: string | undefined | Query<T>, query?: Query<T>): Promise<number> {
        const isPublicDoc = typeof refidOrQuery === "string" || refidOrQuery == undefined
        const refid = isPublicDoc ? refidOrQuery as string | undefined : undefined
        query ??= refidOrQuery as Query<T>
        if (refid == undefined) return isPublicDoc ? await enqueueTask(() => DB.Remove(query)) : await enqueueTask(() => DB.Remove(undefined, query))
        else return await enqueueTask(() => DB.Remove(refid, query))
    }
    export async function findOne<T extends ICollection<any>>(query: Query<T>): Promise<Doc<T> | undefined>
    export async function findOne<T extends ICollection<any>>(type: Type<T>, query: Query<T>): Promise<Doc<T> | undefined>
    export async function findOne<T extends ICollection<any>>(refid: string | undefined, query: Query<T>): Promise<Doc<T> | undefined>
    export async function findOne<T extends ICollection<any>>(refid: string | undefined, type: Type<T>, query: Query<T>): Promise<Doc<T> | undefined>
    export async function findOne<T extends ICollection<any>>(refidOrQueryOrType: string | Type<T> | GetType<T> | Query<T> | undefined, queryOrType?: Type<T> | GetType<T> | Query<T> | undefined, queryParam?: Query<T> | undefined): Promise<Doc<T> | undefined> {
        const { refid, query, type, isPublicDoc } = reorderReadParams(refidOrQueryOrType, queryOrType, queryParam)
        const doc = ((refid == undefined) && isPublicDoc) ? await enqueueTask(() => DB.FindOne<T>(query)) : await enqueueTask(() => DB.FindOne<T>(refid, query))
        if (!doc) return undefined
        return docToObj(doc, type)
    }
    export async function find<T extends ICollection<any>>(query: Query<T>): Promise<Doc<T>[]>
    export async function find<T extends ICollection<any>>(type: Type<T>, query: Query<T>): Promise<Doc<T>[]>
    export async function find<T extends ICollection<any>>(refid: string | undefined, query: Query<T>): Promise<Doc<T>[]>
    export async function find<T extends ICollection<any>>(refid: string | undefined, type: Type<T>, query: Query<T>): Promise<Doc<T>[]>
    export async function find<T extends ICollection<any>>(refidOrQueryOrType: string | Type<T> | GetType<T> | Query<T> | undefined, queryOrType?: Type<T> | GetType<T> | Query<T> | undefined, queryParam?: Query<T> | undefined): Promise<Doc<T>[]> {
        const { refid, query, type, isPublicDoc } = reorderReadParams(refidOrQueryOrType, queryOrType, queryParam)
        return docsToObjs((((refid == undefined) && isPublicDoc) ? await enqueueTask(() => DB.Find<T>(query)) : await enqueueTask(() => DB.Find<T>(refid, query))), type)
    }

    export async function getCollectionNames(filter?: string): Promise<IDBCollectionName[]> {
        const result = await enqueueTask(() => DB.Find<IDBCollectionName>({ collection: "dbManager.collectionName" }))
        if (filter != undefined) {
            const filters = filter.split(",")
            let i = 0
            for (; i < filter.length; i++) filters[i] = filters[i].trim()
            i = 0
            while (i < result.length) {
                let removeFlag = false
                for (const f of filters) if (f.startsWith("!") ? !result[i].name.includes(f) : result[i].name.includes(f)) {
                    result.splice(i, 1)
                    removeFlag = true
                    break
                }
                if (!removeFlag) i++
            }
        }

        return result
    }
    export async function removeAllData(refid?: string, filter?: string) {
        for (const c of await getCollectionNames(filter)) remove(refid, { collection: c.name })

        if ((refid == undefined) && (filter == undefined)) remove(undefined, { collection: "dbManager.collectionName" })
    }
    export async function removeAll(refid: string, collectionFilter: RegExp) {
        await DBH.remove<ICollection<string>>(refid, { collection: { $regex: collectionFilter } })
    }
    export async function exportAll(refid: string, collectionFilter: RegExp): Promise<ProfileDoc<ICollection<string>>[]> {
        const result = await DBH.find<ICollection<string>>(refid, { collection: { $regex: collectionFilter } })
        for (const doc of result) {
            delete (doc as any).__a
            delete (doc as any).__s
            delete (doc as any).__refid
            delete doc._id
        }
        return result
    }
    export async function overrideAll(refid: string, collectionFilter: RegExp, data: ICollection<string>[]) {
        await removeAll(refid, collectionFilter)
        const t = new Transaction()
        for (const d of data) if (d.collection.match(collectionFilter)) t.insert(refid, d)
        await t.commit()
    }

    // Transaction
    export interface IDBCollectionName extends ICollection<"dbManager.collectionName"> {
        name: string
    }
    export interface IDBSubmission<T = any, TOperation extends "insert" | "update" | "upsert" | "remove" | "skip" = "insert" | "update" | "upsert" | "remove" | "skip"> {
        refid?: string
        query: TOperation extends "insert" ? undefined : Query<T>
        operation: TOperation
        doc: TOperation extends "remove" ? undefined : T | Doc<T>
        isPublicDoc?: boolean
    }
    export class Transaction {
        submissions: IDBSubmission[] = []
        private checkpointIndexes: number[] = []
        private checkpointAliases: (string | undefined)[] = []

        push(...s: IDBSubmission[]): void {
            this.submissions.push(...s)
        }
        update<T extends ICollection<any>>(query: Query<T>, data: Doc<T>): void
        update<T extends ICollection<any>>(refid: string | undefined, query: Query<T>, data: Doc<T>): void
        update<T extends ICollection<any>>(refidOrQuery: string | undefined | Query<T>, queryOrData: Query<T> | Doc<T>, dataDoc?: Doc<T>): void {
            const { refid, query, data, isPublicDoc } = reorderWriteParams(refidOrQuery, queryOrData, dataDoc)
            for (const s of this.submissions) if (s.doc && Transaction.isMatch(s.doc, query)) s.operation = "skip"
            this.submissions.push({ refid: refid, query: query, operation: "update", doc: data, isPublicDoc: isPublicDoc })
        }
        upsert<T extends ICollection<any>>(query: Query<T>, data: Doc<T>): void
        upsert<T extends ICollection<any>>(refid: string | undefined, query: Query<T>, data: Doc<T>): void
        upsert<T extends ICollection<any>>(refidOrQuery: string | undefined | Query<T>, queryOrData: Query<T> | Doc<T>, dataDoc?: Doc<T>): void {
            const { refid, query, data, isPublicDoc } = reorderWriteParams(refidOrQuery, queryOrData, dataDoc)
            for (const s of this.submissions) if (s.doc && Transaction.isMatch(s.doc, query)) s.operation = "skip"
            this.submissions.push({ refid: refid, query: query, operation: "upsert", doc: data, isPublicDoc: isPublicDoc })
        }
        insert<T extends ICollection<any>>(data: Doc<T>): void
        insert<T extends ICollection<any>>(refid: string, data: Doc<T>): void
        insert<T extends ICollection<any>>(refidOrData: string | Doc<T>, data?: Doc<T>): void {
            const isPublicDoc = typeof refidOrData !== "string"
            const refid = !isPublicDoc ? refidOrData as string : undefined
            data ??= refidOrData as Doc<T>
            this.submissions.push({ refid: refid, operation: "insert", query: undefined, doc: data, isPublicDoc: isPublicDoc })
        }
        remove<T extends ICollection<any>>(query: Query<T>): void
        remove<T extends ICollection<any>>(refid: string | undefined, query: Query<T>): void
        remove<T extends ICollection<any>>(refidOrQuery: string | undefined | Query<T>, query?: Query<T>): void {
            const isPublicDoc = refidOrQuery && typeof refidOrQuery !== "string"
            const refid = !isPublicDoc ? refidOrQuery as string : undefined
            query ??= refidOrQuery as Query<T>
            for (const s of this.submissions) if (s.doc && Transaction.isMatch(s.doc, query)) s.operation = "skip"
            this.submissions.push({ refid: refid, query: query, operation: "remove", doc: undefined, isPublicDoc: isPublicDoc })
        }
        async findOne<T extends ICollection<any>>(query: Query<T>): Promise<(T & Doc<T>) | undefined>
        async findOne<T extends ICollection<any>>(type: Type<T> | GetType<T>, query: Query<T>): Promise<(T & Doc<T>) | undefined>
        async findOne<T extends ICollection<any>>(refid: string | undefined, query: Query<T>): Promise<(T & Doc<T>) | undefined>
        async findOne<T extends ICollection<any>>(refid: string | undefined, type: Type<T> | GetType<T>, query: Query<T>): Promise<(T & Doc<T>) | undefined>
        async findOne<T extends ICollection<any>>(refidOrQueryOrType: string | Type<T> | GetType<T> | Query<T> | undefined, queryOrType?: Type<T> | GetType<T> | Query<T> | undefined, queryParam?: Query<T> | undefined): Promise<(T & Doc<T>) | undefined> {
            const { refid, query, type, isPublicDoc } = reorderReadParams(refidOrQueryOrType, queryOrType, queryParam)
            for (let i = this.submissions.length - 1; i >= 0; i--) {
                const s = this.submissions[i]
                if (s.doc == undefined) continue
                if (Transaction.isMatch(s.doc, query) && ((s.refid && refid) ? (s.refid === refid) : true)) return s.doc // TODO: not self-consistent
            }
            const doc = ((refid == undefined) && isPublicDoc) ? await enqueueTask(() => DB.FindOne<T>(query)) : await enqueueTask(() => DB.FindOne<T>(refid, query))
            if (!doc) return undefined
            return docToObj(doc, type)
        }
        async find<T extends ICollection<any>>(query: Query<T>): Promise<(T & Doc<T>)[]>
        async find<T extends ICollection<any>>(type: Type<T> | GetType<T>, query: Query<T>): Promise<(T & Doc<T>)[]>
        async find<T extends ICollection<any>>(refid: string | undefined, query: Query<T>): Promise<(T & Doc<T>)[]>
        async find<T extends ICollection<any>>(refid: string | undefined, type: Type<T> | GetType<T>, query: Query<T>): Promise<(T & Doc<T>)[]>
        async find<T extends ICollection<any>>(refidOrQueryOrType: string | Type<T> | GetType<T> | Query<T> | undefined, queryOrType?: Type<T> | GetType<T> | Query<T> | undefined, queryParam?: Query<T> | undefined): Promise<(T & Doc<T>)[]> {
            const { refid, query, type, isPublicDoc } = reorderReadParams(refidOrQueryOrType, queryOrType, queryParam)
            const result: (T | Doc<T>)[] = []
            for (const s of this.submissions) {
                if (s.doc == undefined) continue
                if (Transaction.isMatch(s.doc, query) && ((s.refid && refid) ? (s.refid == refid) : true)) result.push(s.doc)
            }
            return result.concat(docsToObjs(await (((refid == undefined) && isPublicDoc) ? enqueueTask(() => DB.Find<T>(query)) : enqueueTask(() => DB.Find<T>(refid, query))), type))
        }
        private static isMatch<T>(entry: T | Doc<T>, query: Query<T>): boolean {
            if (entry == undefined) return query == undefined
            if (query.$where && !query.$where.apply(entry)) return false
            let $orResult: boolean | undefined = undefined
            const skipKeys = ["$where", "_id"]
            for (let qk in query) {
                if (skipKeys.includes(qk)) continue
                switch (qk) {
                    case "$or": {
                        if ($orResult == undefined) $orResult = false
                        for (const or of query.$or) if (this.isMatch(entry, or)) $orResult = true
                        break
                    }
                    case "$and": {
                        for (const and of query.$and) if (!this.isMatch(entry, and)) return false
                        break
                    }
                    case "$not": {
                        if (this.isMatch(entry, query.$not)) return false
                        break
                    }
                    default: {
                        const value = entry[qk]
                        const q = query[qk]
                        if (value == q) continue
                        if ((typeof q !== "object") && (typeof q !== "function")) return false
                        if ((q.$exists != undefined)) if ((q.$exists && (value == undefined)) || (!q.$exists && (value != undefined))) return false
                        if (Array.isArray(value)) {
                            if (q.$elemMatch && !this.isMatch(value, q.$elemMatch)) return false
                            if (q.$size && (value.length !== q.$size)) return false
                            continue
                        } else if ((typeof value === "number") || (typeof value === "string")) {
                            if (q.$lt) if (value >= q.$lt) return false
                            if (q.$lte) if (value > q.$lte) return false
                            if (q.$gt) if (value <= q.$gt) return false
                            if (q.$gte) if (value < q.$gte) return false
                            if (q.$in) if (!value.toString().includes(q.$in)) return false
                            if (q.$nin) if (value.toString().includes(q.$nin)) return false
                            if (q.$ne) if (value === q.$ne) return false
                            if (q.$regex) if (value.toString().match(q.$regex).length == 0) return false
                            continue
                        } else if (typeof value === "object") {
                            if (!this.isMatch(value, q)) return false
                            continue
                        } else if (q != undefined) return false
                    }
                }
            }
            return !!$orResult
        }

        checkpoint(checkpointName?: string) {
            this.checkpointIndexes.push(this.submissions.length)
            this.checkpointAliases.push(checkpointName)
        }
        rollback(checkpointName?: string) {
            if (checkpointName && !this.checkpointAliases.includes(checkpointName)) return
            let popSize = checkpointName == undefined ? 1 : checkpointName === "*" ? this.checkpointAliases.length : this.checkpointAliases.length - this.checkpointAliases.indexOf(checkpointName) - 1
            for (let i = 0; i < popSize; i++) {
                for (let j = this.checkpointIndexes.length === 0 ? 0 : this.checkpointIndexes[this.submissions.length - 1]; j < this.submissions.length; j++) this.submissions.pop()
                this.checkpointIndexes.pop()
                this.checkpointAliases.pop()
            }
        }
        async commit(): Promise<any[]> {
            const result = []
            for (let s of this.submissions) {
                if (s.operation === "skip") continue
                if (s.doc) delete s.doc._id
                switch (s.operation) {
                    case "insert":
                        result.push(await insert(s.refid, s.doc))
                        break
                    case "update":
                        if (s.isPublicDoc) result.push(await update(s.query, s.doc))
                        else result.push(await update(s.refid, s.query, s.doc))
                        break
                    case "upsert":
                        if (s.isPublicDoc) result.push(await upsert(s.query, s.doc))
                        else result.push(await upsert(s.refid, s.query, s.doc))
                        break
                    case "remove":
                        if (s.isPublicDoc) result.push(await remove(s.query))
                        else result.push(await remove(s.refid, s.query))
                        break
                }
            }
            return result
        }
    }
    export type T = Transaction
    export const T = Transaction
}