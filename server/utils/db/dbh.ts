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
                    if (!(obj[k] instanceof conf.$one)) Object.setPrototypeOf(obj[k], conf.$one)
                    assignDoc(obj[k], conf.$one?.__dbConfig__)
                } else if (conf.$many) {
                    const a = obj[k]
                    if (Array.isArray(a)) {
                        for (const e of a) {
                            if (!(e instanceof conf.$many)) Object.setPrototypeOf(e, conf.$many)
                            assignDoc(e, conf.$many?.__dbConfig__)
                        }
                    } else throw new Error("Type not matched (DBH.many)")
                }
            }
        }
    }
    function docToObj<T extends ICollection<any>>(doc: Doc<T>, typeParam: Type<T> | GetType<T> | undefined): T & Doc<T> {
        if (typeParam) {
            const type: TypeWithDBConfig<T> = isType(typeParam) ? typeParam : typeParam(doc)
            if (!(doc instanceof type)) Object.setPrototypeOf(doc, type.prototype)
            assignDoc(doc, type?.__dbConfig__)
        }
        return doc
    }
    function docsToObjs<T extends ICollection<any>>(docs: Doc<T>[], typeParam: Type<T> | GetType<T> | undefined): (T & Doc<T>)[] {
        if (typeParam) return docs.map(doc => {
            const type: TypeWithDBConfig<T> = isType(typeParam) ? typeParam : typeParam(doc)
            if (!(doc instanceof type)) Object.setPrototypeOf(doc, type.prototype)
            assignDoc(doc, type?.__dbConfig__)
            return doc
        })
        return docs
    }
    function reorderParams<T>(refidOrQueryOrType: string | undefined | Type<T> | GetType<T> | Query<T>, queryOrType: Type<T> | GetType<T> | Query<T> | undefined, query: Query<T> | undefined): { refid?: string, query: Query<T>, type?: Type<T> | GetType<T>, isPublicDoc: boolean } {
        const isPublicDoc = !!refidOrQueryOrType && typeof refidOrQueryOrType !== "string"
        const refid = (typeof refidOrQueryOrType === "string" || refidOrQueryOrType == undefined) ? refidOrQueryOrType as string : undefined
        const type = isType(refidOrQueryOrType) || typeof refidOrQueryOrType === "function" ? refidOrQueryOrType : isType(queryOrType) || typeof queryOrType === "function" ? queryOrType : undefined
        query ??= refidOrQueryOrType && typeof refidOrQueryOrType !== "string" && !isType(refidOrQueryOrType) && typeof refidOrQueryOrType !== "function" ? refidOrQueryOrType : queryOrType && !isType(queryOrType) && typeof queryOrType !== "function" ? queryOrType : query
        return { refid, query, type, isPublicDoc }
    }

    // Serialized & typed DB query
    async function checkData<T extends ICollection<any>>(data: Partial<T>): Promise<void> {
        for (let k in data) if (k.startsWith("__")) delete data[k]
        if (!await enqueueTask(() => DB.FindOne<IDBCollectionName>({ collection: "dbManager.collectionName", name: data.collection }))) {
            await enqueueTask(() => DB.Insert<IDBCollectionName>({ collection: "dbManager.collectionName", name: data.collection }))
        }
    }
    export async function update<T extends ICollection<any>>(refid: string | undefined, query: Query<T>, data: Doc<T> | Update<T>, isPublicDoc: boolean = true) {
        checkData(data)
        if (refid == undefined) return isPublicDoc ? await enqueueTask(() => DB.Update(query, data)) : await enqueueTask(() => DB.Update(undefined, query, data))
        else return await enqueueTask(() => DB.Update(refid, query, data))
    }
    export async function upsert<T extends ICollection<any>>(refid: string | undefined, query: Query<T>, data: Doc<T>, isPublicDoc: boolean = true) {
        checkData(data)
        if (refid == undefined) return isPublicDoc ? await enqueueTask(() => DB.Upsert(query, data)) : await enqueueTask(() => DB.Upsert(undefined, query, data))
        else return await enqueueTask(() => DB.Upsert(refid, query, data))
    }
    export async function insert<T extends ICollection<any>>(refid: string | undefined, data: Doc<T>, isPublicDoc: boolean = true) {
        checkData(data)
        if (refid == undefined) return isPublicDoc ? await enqueueTask(() => DB.Insert(data)) : await enqueueTask(() => DB.Insert(undefined, data))
        else return await enqueueTask(() => DB.Insert(refid, data))
    }
    export async function remove<T extends ICollection<any>>(refid: string | undefined, query: Query<T>, isPublicDoc: boolean = true) {
        if (refid == undefined) return isPublicDoc ? await enqueueTask(() => DB.Remove(query)) : await enqueueTask(() => DB.Remove(undefined, query))
        else return await enqueueTask(() => DB.Remove(refid, query))
    }
    export async function findOne<T extends ICollection<any>>(query: Query<T>): Promise<Doc<T> | undefined>
    export async function findOne<T extends ICollection<any>>(type: Type<T>, query: Query<T>): Promise<Doc<T> | undefined>
    export async function findOne<T extends ICollection<any>>(refid: string | undefined, query: Query<T>): Promise<Doc<T> | undefined>
    export async function findOne<T extends ICollection<any>>(refid: string | undefined, type: Type<T>, query: Query<T>): Promise<Doc<T> | undefined>
    export async function findOne<T extends ICollection<any>>(refidOrQueryOrType: string | Type<T> | GetType<T> | Query<T> | undefined, queryOrType?: Type<T> | GetType<T> | Query<T> | undefined, queryParam?: Query<T> | undefined): Promise<Doc<T> | undefined> {
        const { refid, query, type, isPublicDoc } = reorderParams(refidOrQueryOrType, queryOrType, queryParam)
        const doc = ((refid == undefined) && isPublicDoc) ? await enqueueTask(() => DB.FindOne<T>(query)) : await enqueueTask(() => DB.FindOne<T>(refid, query))
        if (!doc) return undefined
        return docToObj(doc, type)
    }
    export async function find<T extends ICollection<any>>(query: Query<T>): Promise<Doc<T>[]>
    export async function find<T extends ICollection<any>>(type: Type<T>, query: Query<T>): Promise<Doc<T>[]>
    export async function find<T extends ICollection<any>>(refid: string | undefined, query: Query<T>): Promise<Doc<T>[]>
    export async function find<T extends ICollection<any>>(refid: string | undefined, type: Type<T>, query: Query<T>): Promise<Doc<T>[]>
    export async function find<T extends ICollection<any>>(refidOrQueryOrType: string | Type<T> | GetType<T> | Query<T> | undefined, queryOrType?: Type<T> | GetType<T> | Query<T> | undefined, queryParam?: Query<T> | undefined): Promise<Doc<T>[]> {
        const { refid, query, type, isPublicDoc } = reorderParams(refidOrQueryOrType, queryOrType, queryParam)
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
    export async function overall(refid: string, userId: number, filter: string, operation: "delete" | "export" | "override", data?: any) {
        if (refid == undefined) return
        try {
            const collections = await DBH.getCollectionNames(filter)
            const traverse = async (f: (rid: string | undefined, query: Query<ICollection<any>>) => Promise<any>) => {
                const result = []
                for (const c of collections) {
                    if (c.name.includes("#userId") && (userId != undefined)) result.concat(...await f(undefined, { collection: c.name, userId: userId }))
                    else result.concat(...await f(refid, { collection: c.name }))
                }
                return result
            }
            switch (operation) {
                case "delete":
                    await traverse((rid, query) => DBH.remove(rid, query))
                    break
                case "export":
                    const result = await traverse((rid, query) => enqueueTask(() => DB.Find(rid, query)))
                    return JSON.stringify(result)
                case "override":
                    if (!Array.isArray(data)) return "The data may not be an Asphyxia CORE savedata."
                    await traverse((rid, query) => DBH.remove(rid, query))
                    for (let d of data) if ((typeof (d?.collection) == "string") && (!d.collection.includes(filter))) await enqueueTask(() => DB.Insert(d))
                    break
            }
        } catch (e) {
            return e.message
        }
        return undefined
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
        update<T extends ICollection<any>>(refid: string | undefined, query: Query<T>, data: Doc<T>, isPublicDoc: boolean = true): void {
            for (const s of this.submissions) if (s.doc && Transaction.isMatch(s.doc, query)) s.operation = "skip"
            this.submissions.push({ refid: refid, query: query, operation: "update", doc: data, isPublicDoc: isPublicDoc })
        }
        upsert<T extends ICollection<any>>(refid: string | undefined, query: Query<T>, data: Doc<T>, isPublicDoc: boolean = true): void {
            for (const s of this.submissions) if (s.doc && Transaction.isMatch(s.doc, query)) s.operation = "skip"
            this.submissions.push({ refid: refid, query: query, operation: "upsert", doc: data, isPublicDoc: isPublicDoc })
        }
        insert<T extends ICollection<any>>(refid: string | undefined, data: Doc<T>, isPublicDoc: boolean = true): void {
            this.submissions.push({ refid: refid, operation: "insert", query: undefined, doc: data, isPublicDoc: isPublicDoc })
        }
        remove<T extends ICollection<any>>(refid: string | undefined, query: Query<T>, isPublicDoc: boolean = true): void {
            for (const s of this.submissions) if (s.doc && Transaction.isMatch(s.doc, query)) s.operation = "skip"
            this.submissions.push({ refid: refid, query: query, operation: "remove", doc: undefined, isPublicDoc: isPublicDoc })
        }
        async findOne<T extends ICollection<any>>(query: Query<T>): Promise<(T & Doc<T>) | undefined>
        async findOne<T extends ICollection<any>>(type: Type<T> | GetType<T>, query: Query<T>): Promise<(T & Doc<T>) | undefined>
        async findOne<T extends ICollection<any>>(refid: string | undefined, query: Query<T>): Promise<(T & Doc<T>) | undefined>
        async findOne<T extends ICollection<any>>(refid: string | undefined, type: Type<T> | GetType<T>, query: Query<T>): Promise<(T & Doc<T>) | undefined>
        async findOne<T extends ICollection<any>>(refidOrQueryOrType: string | Type<T> | GetType<T> | Query<T> | undefined, queryOrType?: Type<T> | GetType<T> | Query<T> | undefined, queryParam?: Query<T> | undefined): Promise<(T & Doc<T>) | undefined> {
            const { refid, query, type, isPublicDoc } = reorderParams(refidOrQueryOrType, queryOrType, queryParam)
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
            const { refid, query, type, isPublicDoc } = reorderParams(refidOrQueryOrType, queryOrType, queryParam)
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
                        result.push(await insert(s.refid, s.doc, s.isPublicDoc))
                        break
                    case "update":
                        result.push(await update(s.refid, s.query, s.doc, s.isPublicDoc))
                        break
                    case "upsert":
                        result.push(await upsert(s.refid, s.query, s.doc, s.isPublicDoc))
                        break
                    case "remove":
                        result.push(await remove(s.refid, s.query, s.isPublicDoc))
                        break
                }
            }
            return result
        }
    }
    export type T = Transaction
    export const T = Transaction
}