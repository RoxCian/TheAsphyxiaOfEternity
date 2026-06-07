import { Component, inject } from "@angular/core"
import { RbVersionService } from "../../../../services/specified/rb-version.service"
import { BungBreakpointService } from "../../../../services/bung/breakpoint.service"
import { RbProfileService } from "../../../../services/specified/rb-profile.service"

@Component({
    selector: "rb-version",
    templateUrl: "./rb-version-navigator.component.html",
    styleUrl: "./rb-version-navigator.component.sass",
    standalone: false
})
export class RbVersionNavigatorComponent {
    protected readonly breakpointService = inject(BungBreakpointService)
    protected readonly versionService = inject(RbVersionService)
    protected readonly profileService = inject(RbProfileService)

    protected asNumber<T>(value: T): Extract<T, number> | undefined {
        return typeof value === "number" ? value as Extract<T, number> : undefined
    }
}
