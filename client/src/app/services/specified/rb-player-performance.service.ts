import { inject, Injectable } from "@angular/core"
import { RbVersionService } from "./rb-version.service"
import { RbPlayerPerformanceResponse, RbVersion } from "rbweb"
import { rbData } from "../../signals/rb-data"
import { RbProfileService } from "./rb-profile.service"

@Injectable({
    providedIn: "root"
})
export abstract class RbPlayerPerformanceService {
    private readonly versionService = inject(RbVersionService)
    private readonly profileService = inject(RbProfileService)
    readonly playerPerformance = rbData<RbPlayerPerformanceResponse<RbVersion>>(() => `rb${this.versionService.version()}ReadPlayerPerformance`, this.profileService.ridRequest)
}
