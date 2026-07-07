import { Component, computed, inject } from "@angular/core"
import { RbVersionService } from "../../../../services/specified/rb-version.service"
import { BungBreakpointService } from "../../../../services/bung/breakpoint.service"
import { RbProfileService } from "../../../../services/specified/rb-profile.service"
import { BungSelectComponent } from "../../../bung/select/select.component"

@Component({
    selector: "rb-version",
    templateUrl: "./rb-version-navigator.component.html",
    styleUrl: "./rb-version-navigator.component.sass",
    standalone: false,
    host: {
        "[class.is-loading]": "isLoadingComputed()"
    }
})
export class RbVersionNavigatorComponent extends BungSelectComponent<void> {
    protected readonly breakpointService = inject(BungBreakpointService)
    protected readonly versionService = inject(RbVersionService)
    protected readonly profileService = inject(RbProfileService)
    protected readonly isLoadingComputed = computed(() => this.profileService.isLoading() || this.profileService.isLoading())

    protected asNumber<T>(value: T): Extract<T, number> | undefined {
        return typeof value === "number" ? value as Extract<T, number> : undefined
    }
}
