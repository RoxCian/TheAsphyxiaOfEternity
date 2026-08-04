import { Component, inject, viewChild } from "@angular/core"
import { BungBreakpointService } from "../../../../services/bung/breakpoint.service"
import { BungFloatButtonComponent } from "../../../bung/float-button/float-button.component"
import { RbLanguageService } from "../../../../services/specified/rb-language.service"

@Component({
  selector: "rb-lang-switch",
  standalone: false,
  templateUrl: "./rb-lang-switch.component.html",
  styleUrl: "./rb-lang-switch.component.sass",
})
export class RbLangSwitchComponent {
    protected readonly service = inject(RbLanguageService)
    private readonly breakpointService = inject(BungBreakpointService)

    protected readonly isMobile = this.breakpointService.breakpointsToggled.mobile

    private readonly button = viewChild(BungFloatButtonComponent)

    ngOnDestroy() {
        this.button()?.destroy()
    }
}
