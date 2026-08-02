import { Component, inject, viewChild } from "@angular/core"
import { ReturnToTopService } from "../../../services/misc/return-to-top.service"
import { BungBreakpointService } from "../../../services/bung/breakpoint.service"
import { BungFloatButtonComponent } from "../../bung/float-button/float-button.component"

@Component({
    selector: "return-to-top-button",
    standalone: false,
    templateUrl: "./return-to-top-button.component.html",
    styleUrl: "./return-to-top-button.component.sass",
})
export class ReturnToTopButtonComponent {
    protected readonly service = inject(ReturnToTopService)
    private readonly breakpointService = inject(BungBreakpointService)
    
    protected readonly isMobile = this.breakpointService.breakpointsToggled.mobile

    private readonly button = viewChild(BungFloatButtonComponent)

    ngOnDestroy(): void {
        this.button()?.destroy()
    }

}
