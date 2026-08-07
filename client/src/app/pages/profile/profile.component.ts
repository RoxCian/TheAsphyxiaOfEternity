import { Component, computed, inject, model, viewChild } from "@angular/core"
import { ProfileDetailModule } from "../../modules/profile-detail.module"
import { RbProfileService } from "../../services/specified/rb-profile.service"
import { BungModule } from "../../modules/bung.module"
import { RbVersionService } from "../../services/specified/rb-version.service"
import { RbSubpageService } from "../../services/specified/rb-subpage.service"
import { RbPlayDataSubpage } from "./play-data/play-data.component"
import { CommonModule, NgComponentOutlet } from "@angular/common"

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
        this.subpageOutlet()?.componentInstance?.deactivate()
    }
}
