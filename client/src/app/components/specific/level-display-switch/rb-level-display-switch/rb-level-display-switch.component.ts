import { Component, inject, OnDestroy, viewChild } from '@angular/core'
import { RbLevelDisplayService } from '../../../../services/specified/rb-level-display.service'
import { BungBreakpointService } from '../../../../services/bung/breakpoint.service'
import { BungFloatButtonComponent } from '../../../bung/float-button/float-button.component'

@Component({
    selector: 'rb-level-display-switch',
    styleUrls: ["./rb-level-display-switch.component.sass"],
    templateUrl: './rb-level-display-switch.component.html',
    standalone: false
})
export class RbLevelDisplaySwitchComponent implements OnDestroy {
    private readonly levelDisplayService = inject(RbLevelDisplayService)
    private readonly breakpointService = inject(BungBreakpointService)
    protected readonly levelDisplay = this.levelDisplayService.levelDisplay
    protected readonly isMobile = this.breakpointService.breakpointsToggled.mobile

    private readonly button = viewChild(BungFloatButtonComponent)

    ngOnDestroy(): void {
        this.button()?.destroy()
    }
    protected onChangeLevelDisplay(event: Event, levelDisplay: "level" | "skillRate") {
        event.stopImmediatePropagation()
        event.preventDefault()
        this.levelDisplayService.set(levelDisplay)
    }
    protected onToggleLevelDisplay(event: Event) {
        event.stopImmediatePropagation()
        event.preventDefault()
        this.levelDisplay.update(disp => disp === "level" ? "skillRate" : "level")
    }
}
