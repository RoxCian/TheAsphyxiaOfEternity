import { Component, computed, inject, input } from "@angular/core"
import { Rb3OrderResponse } from "rbweb"
import { toggleTransform } from "../../../../signals/transforms"
import { BungBreakpointService } from "../../../../services/bung/breakpoint.service"
import { Rb3OrderDetailsParamFlag } from "rbweb"
import { Rb3OrderShopService } from "../../../../services/specified/rb3-order-shop.service"
import { hasFlag } from "../../../../utils/functions"

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
}
