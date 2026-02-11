import { Injectable, inputBinding, isSignal, Signal } from "@angular/core"
import { BungPopupService } from "./popup.service"
import { BungInsertionContent, BungInsertionContentOrComputation, BungPopupOptions, BungPopupOptionsBase } from "../../utils/bung"
import { BungModalComponent } from "../../components/bung/modal/modal.component"

@Injectable({
    providedIn: "root"
})
export class BungModalService extends BungPopupService {
    protected override readonly defaultPopupOptions: BungPopupOptionsBase = {
        layer: "bung-modal",
        duration: Infinity,
        isManual: false
    }

    modal<TReturn = any>(header: BungInsertionContentOrComputation, body: BungInsertionContentOrComputation, headerContext: any | Signal<any>, bodyContext: any | Signal<any>, options?: BungPopupOptions<BungModalComponent<TReturn>, TReturn>): BungModalComponent<TReturn> {
        const bindings = options?.bindings ?? []
        if (typeof header === "function" && !header.toString().startsWith("class ")) bindings.push(inputBinding("header", header as () => BungInsertionContent))
        if (isSignal(headerContext)) bindings.push(inputBinding("headerContext", headerContext))
        if (bindings.length > 0) {
            options ??= {}
            options.bindings = bindings
        }
        
        if (typeof header !== "function" || header.toString().startsWith("class ") || !isSignal(headerContext)) {
            options ??= {}
            const setter = options.setter
            options.setter = popup => {
                if (typeof header !== "function" || header.toString().startsWith("class ")) popup.header.set(header as BungInsertionContent)
                if (!isSignal(headerContext)) popup.headerContext.set(headerContext)
                setter?.(popup)
            }
        }
        return super.popup(body, bodyContext, BungModalComponent, options)
    }
}
