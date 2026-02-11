import { Component, inject, input } from '@angular/core'
import { RbLevelDisplayService } from '../../../../services/specified/rb-level-display.service'
import { BungBreakpointService } from '../../../../services/bung/breakpoint.service'
import { toggleTransform } from '../../../../signals/transforms'

@Component({
    selector: 'rb-level-display-switch',
    styleUrls: ["./rb-level-display-switch.component.sass"],
    templateUrl: './rb-level-display-switch.component.html',
    host: {
        "[class.buttons]": "!isFloated()",
        "[class.has-addons]": "!isFloated()",
        "[class.is-floated]": "isFloated()"
    },
    standalone: false
})
export class RbLevelDisplaySwitchComponent {
    readonly isHidden = input(false, { transform: toggleTransform })
    readonly isFloated = input(false, { transform: toggleTransform })
    private readonly levelDisplayService = inject(RbLevelDisplayService)
    private readonly breakpointService = inject(BungBreakpointService)
    protected readonly levelDisplay = this.levelDisplayService.levelDisplay
    protected readonly isMobile = this.breakpointService.breakpointsToggled.mobile

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
