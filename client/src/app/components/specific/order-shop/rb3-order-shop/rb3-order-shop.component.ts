import { Component, inject, OnDestroy, signal, viewChild } from "@angular/core"
import { Rb3OrderType } from "rbweb"
import { BungBreakpointService } from "../../../../services/bung/breakpoint.service"
import { Rb3OrderShopService } from "../../../../services/specified/rb3-order-shop.service"
import { BungFloatButtonComponent } from "../../../bung/float-button/float-button.component"

@Component({
    selector: "rb3-order-shop",
    standalone: false,
    templateUrl: "./rb3-order-shop.component.html",
    styleUrl: "./rb3-order-shop.component.sass",
})
export class Rb3OrderShopComponent implements OnDestroy {
    protected readonly service = inject(Rb3OrderShopService)
    protected readonly filter = signal<Rb3OrderType | -1>(-1)
    private readonly breakpointService = inject(BungBreakpointService)
    protected readonly isMobile = this.breakpointService.breakpointsToggled.mobile

    private readonly filterButton = viewChild(BungFloatButtonComponent)

    ngOnDestroy() {
        this.filterButton()?.destroy()
    }
}
