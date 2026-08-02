import { Component, inject, viewChild } from "@angular/core"
import { RbProfileService } from "../../../services/specified/rb-profile.service"
import { RbVersionService } from "../../../services/specified/rb-version.service"
import { BungTabsComponent } from "../../../components/bung/tabs/tabs.component"
import { Rb3OrderShopService } from "../../../services/specified/rb3-order-shop.service"
import { Rb3VerdetDesKriegesService } from "../../../services/specified/rb3-verdet-des-krieges.service"
import { Rb5YurukomeService } from "../../../services/specified/rb5-yurukome.service"
import { RbPlayDataServiceBase } from "../../../services/specified/rb.service"
import { BungWaitableEvent } from "../../../utils/bung"
import { Rb2GlassesService } from "../../../services/specified/rb2-glasses.service"
import { Rb6ReflesiaService } from "../../../services/specified/rb6-reflesia.service"

@Component({
    selector: "rb-progress",
    standalone: false,
    templateUrl: "./progress.component.html",
    styleUrl: "./progress.component.sass",
})
export class RbProgressSubpage {
    protected readonly versionService = inject(RbVersionService)
    protected readonly profileService = inject(RbProfileService)
    protected readonly rb3Tabs = viewChild("rb3Tabs", { read: BungTabsComponent })
    readonly services = {
        rb2Glasses: inject(Rb2GlassesService),
        rb3OrderShop: inject(Rb3OrderShopService),
        rb3Verdet: inject(Rb3VerdetDesKriegesService),
        rb5Yurukome: inject(Rb5YurukomeService),
        rb6Reflesia: inject(Rb6ReflesiaService)
    }
    #lastActivated?: keyof this["services"]
    #deactivateTimeout: Partial<Record<keyof this["services"], number>> = {}
    protected onActivate(key?: keyof this["services"], e?: BungWaitableEvent) {
        const lastActivated = this.#lastActivated
        if (lastActivated === key) return
        if (key && this.#deactivateTimeout[key] != undefined) {
            clearTimeout(this.#deactivateTimeout[key])
            delete this.#deactivateTimeout[key]
        }
        if (lastActivated) this.#deactivateTimeout[lastActivated] = setTimeout(() => {
            if (this.#deactivateTimeout[lastActivated] == undefined) return
            {
                (this.services as unknown as Record<keyof this["services"], RbPlayDataServiceBase<unknown>>)[lastActivated].deactivate()
            }
            delete this.#deactivateTimeout[lastActivated]
        }, 400)
        if (!key) {
            this.#lastActivated = undefined
            return
        }
        if (e) e.resource = (this.services as unknown as Record<keyof this["services"], RbPlayDataServiceBase<unknown>>)[key].activate()
        this.#lastActivated = key
    }
}
