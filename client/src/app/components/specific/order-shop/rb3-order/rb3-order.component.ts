import { Component, computed, effect, inject, input, viewChild } from "@angular/core"
import { Rb3OrderResponse } from "rbweb"
import { toggleTransform } from "../../../../signals/transforms"
import { BungBreakpointService } from "../../../../services/bung/breakpoint.service"
import { Rb3OrderDetailsParamFlag } from "rbweb"
import { Rb3OrderShopService } from "../../../../services/specified/rb3-order-shop.service"
import { hasFlag, timeout } from "../../../../utils/functions"
import { BungMarqueeComponent } from "../../../bung/marquee/marquee.component"
import { RbLanguageService } from "../../../../services/specified/rb-language.service"

@Component({
    selector: "rb3-order",
    standalone: false,
    templateUrl: "./rb3-order.component.html",
    styleUrl: "./rb3-order.component.sass",
})
export class Rb3OrderComponent {
    readonly order = input.required<Rb3OrderResponse | undefined>()
    readonly isSlot = input(false, { transform: toggleTransform })
    readonly slotId = input<number>(-1)
    readonly isPremiumSlot = input(false, { transform: toggleTransform })
    readonly isLocked = computed(() => hasFlag(this.order()?.param ?? Rb3OrderDetailsParamFlag.none, Rb3OrderDetailsParamFlag.lockedToSlot))
    protected readonly breakpointService = inject(BungBreakpointService)
    protected readonly service = inject(Rb3OrderShopService)
    private readonly langService = inject(RbLanguageService)
    private readonly titleMarquee = viewChild(BungMarqueeComponent)
    private langBackup?: "en" | "orig"

    constructor() {
        effect(() => {
            const lang = this.langService.currentLanguage()
            if (this.langBackup !== lang) {
                this.langBackup = lang
                if (this.langBackup != undefined) this.titleMarquee()?.markContentUpdated()
            }
        })
    }
}
