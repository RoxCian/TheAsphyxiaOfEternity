import { computed, effect, inject, Service, signal } from "@angular/core"
import { RbSession } from "rbweb"
import { RbVersionService } from "./rb-version.service"
import { RbProfileService } from "./rb-profile.service"
import { rbData } from "../../signals/rb-data"
import { rbEmitJSON } from "../../utils/rb-functions"

@Service()
export class RbSessionService {
    private readonly profileService = inject(RbProfileService)
    private readonly versionService = inject(RbVersionService)
    readonly session = rbData<RbSession>("rbReadSession", computed(() => ({ rid: this.profileService.rid(), version: this.versionService.version() })))
    private readonly sessionKillingInternal = signal(false)
    private readonly sessionKilledInternal = signal(false)
    readonly sessionKilling = this.sessionKillingInternal.asReadonly()
    readonly sessionKilled = this.sessionKilledInternal.asReadonly()

    constructor() {
        effect(() => {
            if (this.versionService.version() || this.profileService.rid()) {
                this.sessionKillingInternal.set(false)
                this.sessionKilledInternal.set(false)
            }
        })
    }
    
    async killSession() {
        if (this.sessionKilling() || this.sessionKilled() || !this.session.value() || !this.profileService.rid()) return
        this.sessionKillingInternal.set(true)
        const result: { succeeded: boolean } = await rbEmitJSON("rbKillSession", { rid: this.profileService.rid(), version: this.versionService.version() })
        if (!result.succeeded) {
            this.sessionKillingInternal.set(false)
        }
        this.session.reload()
        this.sessionKilledInternal.set(true)
        this.sessionKillingInternal.set(false)
    }
}