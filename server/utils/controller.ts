import { RbRequest } from "../models/shared/web"
import { initialize } from "../system/initialize"
import { PJ } from "./pj"

export namespace C {
    export type ControllerResultText = {
        type: "text"
        data: string
    }
    export type ControllerResultJson = {
        type: "json" | "pj"
        data: any
    }
    export type ControllerResultFile = {
        type: "file"
        path: string
    }
    export type ControllerResultBuffer = {
        type: "buffer"
        buffer: Buffer
    }
    export type ControllerResultRedirect = {
        type: "redirect"
        url: string
    }
    export type ControllerResultError = {
        type: "error"
        code: number
        message: string
    }

    export function error(code: number, message: string = ""): ControllerResultError {
        return {
            type: "error", code, message
        }
    }
    export function pj(data: unknown): ControllerResultJson {
        return {
            type: "pj", data
        }
    }

    export type ControllerResult = ControllerResultText | ControllerResultJson | ControllerResultFile | ControllerResultBuffer | ControllerResultRedirect | ControllerResultError
    export type Controller<TRequest = unknown, TResponse extends ControllerResult | string | object | Buffer = object> = (data: TRequest) => TResponse | Promise<TResponse | undefined> | undefined
    export type C<TRequest = unknown, TResponse extends ControllerResult | string | object | Buffer = object> = Controller<TRequest, TResponse | ControllerResultError>

    function isControllerResult(value: unknown): value is ControllerResult {
        const type = (value as ControllerResult)?.type
        return type && (type === "text" || type === "json" || type === "file" || type === "buffer" || type === "redirect" || type === "error")
    }
    export function route<T>(method: string, c: Controller<T>): void
    export function route<T extends RbRequest>(method: string, c: Controller<T>, checkRid: true): void
    export function route<T>(method: string, c: Controller<T>, checkRid?: boolean): void {
        const cb: WebUIEventHandler = async (data: T, send?: WebUISend) => {
            await initialize()
            if (!send) throw new Error("'send' is empty")
            if (checkRid && (typeof (data as RbRequest).rid !== "string" || !(data as RbRequest).rid.match(/^[a-fA-F0-9]{16}$/))) return send.error(401, "REFID not provided")
            console.log("Controller method:", method)
            const res = await c(PJ.convertFromPJ(data))
            if (!res) send.text("")
            else if (typeof res === "string") return send.text(res)
            else if (res instanceof Buffer) return send.buffer(res)
            else if (isControllerResult(res)) {
                switch (res.type) {
                    case "buffer": return send.buffer(res.buffer)
                    case "error": return send.error(res.code, res.message)
                    case "file": return send.file(res.path)
                    case "pj": return send.json(PJ.convertToPJ(res.data))
                    case "json": return send.json(res.data)
                    case "redirect": return send.redirect(res.url)
                    case "text": return send.text(res.data)
                }
            } else {
                return send.json(PJ.convertToPJ(res))
            }
        }
        R.WebUIEvent(method, cb)
        CS.routes[method] = c
    }
    export async function redirect<T>(method: string, data: T): Promise<ControllerResult | string | object | Buffer | Promise<ControllerResult | string | object | Buffer | undefined> | undefined> {
        await initialize()
        return await CS.routes[method]?.(data)
    }
}
namespace CS {
    export const routes: Record<string, C.C<any>> = {}
}