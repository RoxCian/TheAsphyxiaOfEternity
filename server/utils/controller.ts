export namespace C {
    export type ControllerResultText = {
        type: "text"
        data: string
    }
    export type ControllerResultJson = {
        type: "json"
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
    export type ControllerResult = ControllerResultText | ControllerResultJson | ControllerResultFile | ControllerResultBuffer | ControllerResultRedirect | ControllerResultError
    export type Controller<TRequest = unknown, TResponse extends ControllerResult | string | object | Buffer = object> = (data: TRequest) => TResponse | Promise<TResponse>
    export type C<TRequest = unknown, TResponse extends ControllerResult | string | object | Buffer = object> = Controller<TRequest, TResponse>

    function isControllerResult(value: unknown): value is ControllerResult {
        const type = (value as ControllerResult)?.type
        return type && (type === "text" || type === "json" || type === "file" || type === "buffer" || type === "redirect" || type === "error")
    }

    export function route<T>(method: string, c: Controller<T>) {
        const cb: WebUIEventHandler = async (data: T, send: WebUISend) => {
            const res = await c(data)
            if (!res) send.text("")
            else if (typeof res === "string") return send.text(res)
            else if (res instanceof Buffer) return send.buffer(res)
            else if (isControllerResult(res)) {
                switch (res.type) {
                    case "buffer": return send.buffer(res.buffer)
                    case "error": return send.error(res.code, res.message)
                    case "file": return send.file(res.path)
                    case "json": return send.json(res.data)
                    case "redirect": return send.redirect(res.url)
                    case "text": return send.text(res.data)
                }
            } else return send.json(res)
        }
        R.WebUIEvent(method, cb)
        CS.routes[method] = c
    }
    export function redirect<T>(method: string, data: T): ControllerResult | string | object | Buffer | Promise<ControllerResult | string | object | Buffer> {
        return CS.routes[method]?.(data)
    }
}
namespace CS {
    export const routes: Record<string, C.C> = {}
}