import { Component, computed, inject, output } from "@angular/core"
import { RbVersionService } from "../../../../services/specified/rb-version.service"
import { RbProfileService } from "../../../../services/specified/rb-profile.service"
import { BungSelectComponent } from "../../../bung/select/select.component"
import { RbVersion } from "rbweb"

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
    readonly navigationStarted = output()

    protected readonly versionService = inject(RbVersionService)
    protected readonly profileService = inject(RbProfileService)
    protected readonly isLoadingComputed = computed(() => this.profileService.isLoading() || this.profileService.isLoading())

    protected asNumber<T>(value: T): Extract<T, number> | undefined {
        return typeof value === "number" ? value as Extract<T, number> : undefined
    }
    protected onNavigate(version?: RbVersion) {
        if ((version ?? this.versionService.defaultVersion()) === this.versionService.version()) return
        this.navigationStarted.emit()
        this.versionService.changeVersion(version)
    }
}
