import { ElementRef, Service } from "@angular/core"
import { BungPopupService } from "./popup.service"
import { BungPopupOptions, BungPopupOptionsBase } from "../../utils/bung"
import { BungDropdownComponent } from "../../components/bung/dropdown/dropdown.component"
import { BungMenuDef, BungMenuDefOrComputation } from "../../components/bung/menu-def/menu-def.component"

@Service()
export class BungDropdownService extends BungPopupService {
    protected override readonly defaultPopupOptions: BungPopupOptionsBase = {
        layer: "bung-dropdown",
        duration: Infinity,
        backdropOptions: {
            hasBackdrop: true,
            backdropOpacity: 0
        },
        isManual: false
    }

    constructor() {
        super()
        this.addLayer("bung-dropdown", 999)
    }

    dropdown(def: BungMenuDefOrComputation, host: ElementRef<HTMLElement> | MouseEvent, options?: BungPopupOptions<BungDropdownComponent>): BungDropdownComponent {
        options = Object.assign({}, options)
        const setter = options?.setter
        const bindings = Object.assign({}, options?.bindings)
        let bindingsHasAdded = false
        if (typeof def === "function" && !def.toString().startsWith("class ")) {
            bindingsHasAdded = true
            bindings["def"] = def
        }
        if (bindingsHasAdded) {
            options.bindings = bindings
        }
        options.setter = popup => {
            if (typeof def !== "function" || def.toString().startsWith("class ")) popup.def.set(def as BungMenuDef)
            popup.host.set(host)
            if (setter) setter(popup)
        }
        return super.popup(undefined, undefined, BungDropdownComponent, options)
    }
}
