import { HttpHeaders, httpResource, HttpResourceRef } from "@angular/common/http"
import { isSignal, Signal } from "@angular/core"
import { RbRequest } from "server/models/shared/web"

const headers = new HttpHeaders({
    "content-type": "application/json"
})
export function rbData<TResponse = unknown, TRequest = RbRequest>(name: string | (() => string | undefined) | undefined, request: TRequest | Signal<TRequest>): HttpResourceRef<TResponse | undefined> {
    if (name == undefined) return httpResource<TResponse>(() => undefined)
    else if (typeof name === "string") return httpResource<TResponse>(
        () => ({
            url: `/emit/${name}`,
            method: "post",
            body: isSignal(request) ? JSON.stringify(request()) : JSON.stringify(request),
            headers: headers
        })
    )
    return httpResource<TResponse>(
        () => {
            const n = name()
            if (n === undefined) return undefined
            return {
                url: `/emit/${n}`,
                method: "post",
                body: isSignal(request) ? JSON.stringify(request()) : JSON.stringify(request),
                headers: headers
            }
        }, {
            
        }
    )
}
export function rbDataText<TRequest = RbRequest>(name: string | (() => string | undefined) | undefined, data: TRequest | Signal<TRequest>): HttpResourceRef<string | undefined> {
    if (name === undefined) return httpResource.text(() => undefined)
    else if (typeof name === "string") return httpResource.text(
        () => ({
            url: `/emit/${name}`,
            method: "post",
            body: isSignal(data) ? JSON.stringify(data()) : JSON.stringify(data),
            headers: headers
        })
    )
    return httpResource.text(
        () => {
            const n = name()
            if (name === undefined) return undefined
            return {
                url: `/emit/${n}`,
                method: "post",
                body: isSignal(data) ? JSON.stringify(data()) : JSON.stringify(data),
                headers: headers
            }
        }
    )
}