import { Component, computed, inject, model } from "@angular/core"
import { ProfileDetailModule } from "../../modules/profile-detail.module"
import { RbProfileService } from "../../services/specified/rb-profile.service"
import { BungModule } from "../../modules/bung.module"
import { RbVersionService } from "../../services/specified/rb-version.service"
import { RbSubpageService } from "../../services/specified/rb-subpage.service"
import { RbPlayDataSubpage } from "./play-data/play-data.component"
import { CommonModule } from "@angular/common"
import { BungNotificationService } from "../../services/bung/notification.service"

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

    constructor() {
        this.subpageService.componentType.set(RbPlayDataSubpage)
    }

    protected readonly notificationService = inject(BungNotificationService)
    protected readonly notifyModel = model("Notify button")
    notify() {
        this.notificationService.notify("Notification", undefined, {
            duration: Infinity,
            values: {
                button1: {
                    value: "ok",
                    content: this.notifyModel
                }
            },
            setter: popup => {
                popup.classList.add("is-warning")
                popup.isSingleLine.set(true)
                popup.float.set("bottom")
            }
        })
    }
}
