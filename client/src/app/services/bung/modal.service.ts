import { Service, inputBinding, isSignal, Signal } from "@angular/core"
import { BungPopupService } from "./popup.service"
import { BungInsertionContent, BungInsertionContentOrComputation, BungPopupOptions, BungPopupOptionsBase } from "../../utils/bung"
import { BungModalComponent } from "../../components/bung/modal/modal.component"

@Service()
export class BungModalService extends BungPopupService {
    protected override readonly defaultPopupOptions: BungPopupOptionsBase = {
        layer: "bung-modal",
        duration: Infinity,
        isManual: false
    }

    modal<TReturn = any>(header: BungInsertionContentOrComputation, body: BungInsertionContentOrComputation, headerContext: any | Signal<any>, bodyContext: any | Signal<any>, options?: BungPopupOptions<BungModalComponent<TReturn>, TReturn>): BungModalComponent<TReturn> {
        options = Object.assign({}, options)
        const bindings = Object.assign({}, options?.bindings)
        let bindingsHasAdded = false
        if (typeof header === "function" && !header.toString().startsWith("class ")) {
            bindingsHasAdded = true
            bindings["header"] = header as () => BungInsertionContent
        }
        if (isSignal(headerContext)) {
            bindingsHasAdded = true
            bindings["headerContext"] = headerContext
        }
        if (bindingsHasAdded) {
            options.bindings = bindings
        }

        if (typeof header !== "function" || header.toString().startsWith("class ") || !isSignal(headerContext)) {
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
