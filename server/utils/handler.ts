import { initialize } from "../system/initialize"
import { X } from "./x"

export namespace H {
    export type HandlerResultSuccess = {
        type: "success"
        options?: EamuseSendOption
    }
    export type HandlerResultDeny = {
        type: "deny"
        options?: EamuseSendOption
    }
    export type HandlerResultStatus = {
        type: "status"
        code: number
        options?: EamuseSendOption
    }
    export type HandlerResultObject = {
        type: "object"
        res: any
        options?: EamuseSendOption
    }
    export type HandlerResultTemplate = {
        type: "xml" | "pug"
        res: string
        data?: any
        options?: EamuseSendOption
    }
    export type HandlerResultTemplateFile = {
        type: "xmlFile" | "pugFile"
        file: string
        data?: any
        options?: EamuseSendOption
    }
    export const success: HandlerResultSuccess = {
        type: "success"
    }
    export const deny: HandlerResultDeny = {
        type: "deny"
    }
    export type HandlerResult = HandlerResultSuccess | HandlerResultDeny | HandlerResultStatus | HandlerResultObject | HandlerResultTemplate | HandlerResultTemplateFile
    export type Handler<TData = unknown> = (data: X<TData>, req: EamuseInfo) => Promise<HandlerResult | object> | HandlerResult | object
    export type H<TData = unknown> = Handler<TData>

    function isHandlerResult(value: unknown): value is HandlerResult {
        const type = (value as HandlerResult)?.type
        return type && (type === "deny" || type === "object" || type === "pug" || type === "pugFile" || type === "status" || type === "success" || type === "xml" || type === "xmlFile")
    }

    // export function route(method: string, fn: EPR) {
    //     R.Route(method, fn)
    //     HS.routes[method] = fn
    // }
    export function route<TData = unknown>(method: string, h: Handler<TData>) {
        const fn: EPR = async (req, data, send) => {
            initialize()
            const res = await h(data, req)
            if (!res) return send.success()
            else if (isHandlerResult(res)) {
                switch (res.type) {
                    case "success": return await send.success(res.options)
                    case "deny": return await send.deny(res.options)
                    case "status": return await send.status(res.code, res.options)
                    case "object": return await send.object(res.res, res.options)
                    case "xml": return await send.xml(res.res, res.data, res.options)
                    case "pug": return await send.pug(res.res, res.data, res.options)
                    case "xmlFile": return await send.xmlFile(res.file, res.data, res.options)
                    case "pugFile": return await send.pugFile(res.file, res.data, res.options)
                }
            } else {
                try {
                    return await send.object(res)
                } catch (ex) {
                    throw ex
                }
            }
        }
        R.Route(method, fn)
        HS.routes[method] = h
    }
    export function redirect<T>(method: string, data: X<T>, req: EamuseInfo): Promise<HandlerResult | object> | HandlerResult | object {
        return HS.routes[method]?.(data, req)
    }
}
namespace HS {
    export const routes: Record<string, H.H> = {}
}