import { RbWriteSettingsResponse } from "../../models/shared/web"
import { DBH } from "../../utils/db/dbh"
import { ICollection } from "../../utils/db/db_types"

type ContextQueryCreator<T, K extends keyof T> = (context: T) => Query<T[K]>
type RbSettingsContextQueryElementDetails<T, K extends keyof T> = {
    isContextQueryElement: true
    query: Query<T[K]> | ContextQueryCreator<T, K>
    docType?: "rid" | "non-rid" | "public"
    defaultValue?: (context: T) => T[K]
}
type RbSettingsContextQueryElement<T, K extends keyof T> = RbSettingsContextQueryElementDetails<T, K> | Query<T[K]>
type RbSettingsContextQuery<T extends Record<string, ICollection<string>>> = {
    [K in keyof T]: RbSettingsContextQueryElement<T, K>
}
export function contextQueryElement<T, K extends keyof T>(query: Query<T[K]> | ContextQueryCreator<T, K>, docType?: "rid" | "non-rid" | "public", defaultValue?: (context: T) => T[K]): RbSettingsContextQueryElement<T, K> {
    return {
        isContextQueryElement: true, query, docType, defaultValue
    }
}

type RbSettingsContextAccessor<T, TContext extends Record<string, ICollection<string>>> = {
    read: (ctx: TContext) => T
    write: (value: T, ctx: TContext, errs: string[]) => void
}
declare const RbSettingsContextPathEmpty: unique symbol
type PathAccessor<T, K extends keyof T & (string | number)> = `${K}` extends `${number}` ? T extends unknown[] ? `[${K}]` : `["${K}"]` | `.${K}` : `.${K}`
type RbSettingsContextPathTails<T, TContext> = TContext extends object ? ({
    [K in (string | number) & keyof TContext]: TContext[K] extends T ? PathAccessor<TContext, K> :
    RbSettingsContextPathTails<T, TContext[K]> extends infer TTails ? TTails extends string ?
    `${PathAccessor<TContext, K>}${TTails}` : typeof RbSettingsContextPathEmpty : never
}[(string | number) & keyof TContext]) : typeof RbSettingsContextPathEmpty
type RbSettingsContextPath<T, TContext> = {
    [K in (string | number) & keyof TContext]: TContext[K] extends T ? `${K}` :
    RbSettingsContextPathTails<T, TContext[K]> extends infer TTails ? TTails extends string ?
    `${K}${TTails}` : never : never
}[(string | number) & keyof TContext]

type RbSettingsFactoryElement<T, TContext extends Record<string, ICollection<string>>> = RbSettingsContextAccessor<T, TContext> | RbSettingsContextPath<T, TContext>
export type RbSettingsFactory<TSettings, TContext extends Record<string, ICollection<string>>> = {
    contextQuery: RbSettingsContextQuery<TContext>
    factory: {
        [K in keyof TSettings]: RbSettingsFactoryElement<TSettings[K], TContext>
    }
}
function isContextAccessor<T, TContext extends Record<string, ICollection<string>>>(el: RbSettingsFactoryElement<T, TContext>): el is RbSettingsContextAccessor<T, TContext> {
    return typeof el === "object"
}

function isContextQueryElement<T, K extends keyof T>(value: RbSettingsContextQueryElement<T, K> | Query<T[K]> | ((context: T) => Query<T[K]>)): value is RbSettingsContextQueryElement<T, K> {
    return typeof value === "object" && value.isContextQueryElement
}


type ContextQueryResult<TContext extends Record<string, ICollection<string>>> = {
    context: TContext
    existed: Record<keyof TContext, boolean>
}
async function queryContextUsingFactory<TSettings, TContext extends Record<string, ICollection<string>>>(rid: string, factory: RbSettingsFactory<TSettings, TContext>): Promise<ContextQueryResult<TContext>> {
    const result: ContextQueryResult<TContext> = {
        context: {} as TContext,
        existed: {} as Record<keyof TContext, boolean>
    }
    for (const k in factory.contextQuery) {
        const q: RbSettingsContextQueryElement<TContext, typeof k> = factory.contextQuery[k]
        let query: Query<TContext[Extract<keyof TContext, string>]>
        if (isContextQueryElement(q)) {
            query = q.query instanceof Function ? q.query(result.context) : q.query
            switch (q.docType ?? "rid") {
                case "rid":
                    result.context[k] = await DBH.findOne(rid, query)
                    break
                case "non-rid":
                    result.context[k] = await DBH.findOne(undefined, query)
                    break
                case "public":
                    result.context[k] = await DBH.findOne(query)
                    break
            }
            if (!result.context[k] && q.defaultValue) {
                result.existed[k] = false
                result.context[k] = q.defaultValue(result.context)
            } else result.existed[k] = true
        } else {
            query = q
            result.context[k] = await DBH.findOne(rid, query)
            result.existed[k] = !!result.context[k]
        }
    }
    return result
}
async function updateContextUsingFactory<TSettings, TContext extends Record<string, ICollection<string>>>(rid: string, contextQuery: ContextQueryResult<TContext>, factory: RbSettingsFactory<TSettings, TContext>) {
    const t = new DBH.T()
    const update = t.update.bind(t) as typeof t.update
    const upsert = t.upsert.bind(t) as typeof t.upsert
    for (const k in factory.contextQuery) {
        if (!contextQuery.context[k]) {
            console.log(`Context "${k}" was not found`)
            continue
        }
        const q: RbSettingsContextQueryElement<TContext, typeof k> = factory.contextQuery[k]
        const dbfn = contextQuery.existed[k] ? update : upsert
        if (isContextQueryElement(q)) {
            const query = q.query instanceof Function ? q.query(contextQuery.context) : q.query
            switch (q.docType ?? "rid") {
                case "rid":
                    dbfn(rid, query, contextQuery.context[k])
                    break
                case "non-rid":
                    dbfn(undefined, query, contextQuery.context[k])
                    break
                case "public":
                    dbfn(query, contextQuery.context[k])
                    break
            }
        } else dbfn(rid, q, contextQuery.context[k])
    }
    await t.commit()
}
function dequote(text: string): string {
    return text.startsWith("\"") && text.endsWith("\"") ? text.substring(1, text.length - 1) : text
}
function readContextByPath<T, TContext extends Record<string, ICollection<string>>>(context: TContext, path: RbSettingsContextPath<T, TContext>): T {
    const parts = path.replace(/\]/g, "").split(/\.|\[/)
    let current: any = context
    for (const part of parts) current = current[dequote(part)]
    return current
}
function writeContextByPath<T, TContext extends Record<string, ICollection<string>>>(value: T, context: TContext, path: RbSettingsContextPath<T, TContext>) {
    const parts = path.replace(/\]/g, "").split(/\.|\[/)
    let current: any = context
    for (let i = 0; i < parts.length - 1; i++) current = current[dequote(parts[i])]
    current[dequote(parts[parts.length - 1])] = value
}

export async function readSettingsUsingFactory<TSettings, TContext extends Record<string, ICollection<string>>>(rid: string, factory: RbSettingsFactory<TSettings, TContext>): Promise<TSettings> {
    const contextQuery = await queryContextUsingFactory(rid, factory)
    const result = {} as TSettings
    for (const k in factory.factory) {
        const f = factory.factory[k] as RbSettingsFactoryElement<TSettings[typeof k], TContext>
        if (isContextAccessor(f)) result[k] = f.read(contextQuery.context)
        else result[k] = readContextByPath(contextQuery.context, f)
    }
    return result
}
export async function writeSettingsUsingFactory<TSettings, TContext extends Record<string, ICollection<string>>>(rid: string, settings: TSettings, factory: RbSettingsFactory<TSettings, TContext>): Promise<RbWriteSettingsResponse> {
    if (!rid) return { state: "failed", reason: ["RID not privided."] }
    const contextQuery = await queryContextUsingFactory(rid, factory)
    const errors: string[] = []
    for (const k in factory.factory) {
        const f = factory.factory[k] as RbSettingsFactoryElement<TSettings[typeof k], TContext>
        if (isContextAccessor(f)) f.write(settings[k], contextQuery.context, errors)
        else writeContextByPath(settings[k], contextQuery.context, f)
    }
    if (errors.length > 0) return { state: "failed", reason: errors }
    try {
        await updateContextUsingFactory(rid, contextQuery, factory)
    } catch (ex) {
        if (ex instanceof Error) {
            console.log(ex.message)
            console.log(ex.stack)
            return { state: "failed", reason: [ex.message] }
        }
    }
    return { state: "succeeded" }
}