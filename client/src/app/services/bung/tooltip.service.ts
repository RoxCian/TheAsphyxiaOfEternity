import { ElementRef, Injectable, Signal } from "@angular/core"
import { BungPopupService } from "./popup.service"
import { BungInsertionContentOrComputation, BungPopupOptions, BungPopupOptionsBase } from "../../utils/bung"
import { BungTooltipComponent } from "../../components/bung/tooltip/tooltip.component"

@Injectable({
    providedIn: "root"
})
export class BungTooltipService extends BungPopupService {
    protected override readonly defaultPopupOptions: BungPopupOptionsBase = {
        layer: "bung-tooltip",
        duration: Infinity,
        backdropOptions: {
            hasBackdrop: false
        },
        isManual: false
    }

    constructor() {
        super()
        this.addLayer("bung-tooltip", 1000)
    }

    tip<TReturn = any>(data: BungInsertionContentOrComputation, context: any | Signal<any>, hostElement: ElementRef<HTMLElement>, options?: BungPopupOptions<BungTooltipComponent<TReturn>>): BungTooltipComponent<TReturn> {
        const setter = options?.setter
        options = Object.assign({}, options ?? {}, {
            setter: popup => {
                popup.hostElement.set(hostElement)
                if (setter) setter(popup)
            }
        } as BungPopupOptions<BungTooltipComponent<TReturn>>)
        return super.popup(data, context, BungTooltipComponent, options)
    }
}
