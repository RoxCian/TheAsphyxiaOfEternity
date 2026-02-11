import { Injectable, computed, inject, output } from "@angular/core"
import { Router } from "@angular/router"
import { RbVersion } from "server/models/shared/web"
import { RbProfileService } from "./rb-profile.service"
import { initiatedSignal } from "../../signals/initiated-signal"

@Injectable({ providedIn: "root" })
export class RbVersionService {
    private readonly profileService = inject(RbProfileService)
    readonly validVersions = computed<Record<RbVersion, boolean>>(() => ({
        1: this.profileService.rb1Profile.hasValue() && !!this.profileService.rb1Profile.value(),
        2: this.profileService.rb2Profile.hasValue() && !!this.profileService.rb2Profile.value(),
        3: this.profileService.rb3Profile.hasValue() && !!this.profileService.rb3Profile.value(),
        4: this.profileService.rb4Profile.hasValue() && !!this.profileService.rb4Profile.value(),
        5: this.profileService.rb5Profile.hasValue() && !!this.profileService.rb5Profile.value(),
        6: this.profileService.rb6Profile.hasValue() && !!this.profileService.rb6Profile.value(),
    }))
    readonly isLoading = computed(() => {
        return this.profileService.rb1Profile.isLoading() || 
            this.profileService.rb2Profile.isLoading() || 
            this.profileService.rb3Profile.isLoading() || 
            this.profileService.rb4Profile.isLoading() || 
            this.profileService.rb5Profile.isLoading() || 
            this.profileService.rb6Profile.isLoading()
    })
    readonly defaultVersion = computed<RbVersion>(() => {
        if (this.isLoading()) return 6
        for (const v of [6, 5, 4, 3, 2, 1] as RbVersion[]) if (this.validVersions()[v]) return v
        return 6
    })
    private readonly versionInternal = initiatedSignal(this.defaultVersion)
    readonly version = this.versionInternal.asReadonly()
    private readonly router = inject(Router)

    constructor() {
        const updateVersionFromRoute = () => {
            const p: string = this.router.parseUrl(this.router.url).queryParams["v"]
            if (!p) {
                this.versionInternal.reset()
                return
            }
            const v = parseInt(p) as RbVersion
            if (!(v >= 1 && v <= 6)) return
            this.updateVersion(v)
        }
        this.router.events.subscribe(updateVersionFromRoute)
        updateVersionFromRoute()
    }

    changeVersion(version?: RbVersion) {
        const urlTree = this.router.parseUrl(this.router.url)
        if (!version) delete urlTree.queryParams["v"]
        else urlTree.queryParams["v"] = version
        this.router.navigateByUrl(urlTree)
    }

    private updateVersion(version: RbVersion) {
        this.versionInternal.set(version)
    }
}
