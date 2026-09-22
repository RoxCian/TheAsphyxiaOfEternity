import { CommonModule, NgComponentOutlet } from "@angular/common"
import { Component, computed, inject, viewChild } from "@angular/core"
import { BungModule } from "../../modules/bung.module"
import { ProfileDetailModule } from "../../modules/profile-detail.module"
import { RbProfileService } from "../../services/specified/rb-profile.service"
import { RbSubpageService } from "../../services/specified/rb-subpage.service"
import { RbVersionService } from "../../services/specified/rb-version.service"
import { RbPlayDataSubpage } from "./play-data/play-data.component"

@Component({
    selector: "profile-page",
    imports: [ProfileDetailModule, BungModule, CommonModule],
    templateUrl: "./profile.component.html",
    styleUrl: "./profile.component.sass",
})
export class ProfilePageComponent {
    protected readonly profileService = inject(RbProfileService)
    protected readonly versionService = inject(RbVersionService)
    protected readonly subpageService = inject(RbSubpageService)
    protected readonly fakeSubpageParams = computed(() => [{
        random: Math.random(),
        version: this.versionService.version(),
        subpage: this.subpageService.componentType()
    }])
    private readonly subpageOutlet = viewChild(NgComponentOutlet)

    constructor() {
        this.subpageService.componentType.set(RbPlayDataSubpage)
    }

    protected onNavVersion() {
        this.subpageOutlet()?.componentInstance?.deactivate?.()
    }
}
