import { Observable } from "rxjs"
import { Signal, TemplateRef, Type } from "@angular/core"
import { HttpResourceRef } from "@angular/common/http"

export type BulmaColor = "primary" | "success" | "info" | "link" | "warning" | "danger" | undefined
export type BungPopupState = "in" | "out" | "show"
export type BungInsertionContent = TemplateRef<any> | Type<any> | HTMLElement | SVGElement | string | undefined | null
export type BungInsertionComponentContext = {
    inputs?: Record<string, unknown>
    content?: Node[][]
    ngModule?: Type<any>
}
export type BungInsertionContentOrComputation = BungInsertionContent | (() => BungInsertionContent)
export type BungPalette = string | {
    color: string
    invertColor: string
}
type PromiseCreator<T> = () => Promise<T>
export type BungReturnValue<T> = T | Promise<T> | Observable<T> | PromiseCreator<T> | Signal<T> | Signal<Promise<T>>
export type BungReturnContext<T> = {
    [K in string]: {
        value: BungReturnValue<T>
        content?: BungInsertionContentOrComputation
        context?: any
        isStatic?: boolean
        elementClass?: string
    }
}
export type BungBackdropOptions = {
    hasBackdrop?: boolean
    backdropClass?: string
    backdropBlur?: number
    backdropOpacity?: number
    clickBackdropToClose?: boolean
}
export const DefaultBackdropOptions: BungBackdropOptions = {
    hasBackdrop: true,
    backdropClass: "bung-backdrop",
    backdropBlur: 5,
    backdropOpacity: 1,
    clickBackdropToClose: true
}

export type BungPopupOptionsBase = {
    layer?: string
    duration?: number | (() => number)
    backdropOptions?: BungBackdropOptions
    isManual?: boolean
}
type InputBindingRecord = Record<string, (() => unknown) | unknown>
export type BungPopupOptions<T, TReturn = any> = {
    values?: BungReturnContext<TReturn> | (() => BungReturnContext<TReturn>)
    bindings?: InputBindingRecord
    setter?: (popup: T) => void
} & BungPopupOptionsBase

export type BungWaitableEvent = {
    canceled: boolean
    promise?: Promise<unknown>
    resource?: HttpResourceRef<unknown>
}