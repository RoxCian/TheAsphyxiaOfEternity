import { effect, inject, Injectable, Signal, signal } from "@angular/core"
import { RbVersionService } from "./rb-version.service"
import { RbVersion } from "rbweb"
import { rbData } from "../../signals/rb-data"
import { RbProfileService } from "./rb-profile.service"
import { HttpResourceRef } from "@angular/common/http"

@Injectable({
    providedIn: "root"
})
export abstract class RbPlayDataService<T> {
    private readonly isActivatedInternal = signal(false)
    private readonly profileService = inject(RbProfileService)
    private readonly versionService = inject(RbVersionService)
    private readonly dataVersionInternal = signal<RbVersion | undefined>(undefined)

    readonly isActivated = this.isActivatedInternal.asReadonly()
    readonly dataVersion = this.dataVersionInternal.asReadonly()
    readonly data!: HttpResourceRef<T[] | undefined>

    constructor(protected readonly dataRequestRoute: Signal<string | undefined>) {
        this.data = rbData<T[]>(dataRequestRoute, this.profileService.ridRequest)
        effect(() => {
            if (this.isActivated()) this.dataVersionInternal.set(this.versionService.version())
        })
    }
    activate() {
        this.isActivatedInternal.set(true)
        this.dataVersionInternal.set(this.versionService.version())
    }
    deactivate() {
        this.isActivatedInternal.set(false)
    }
}
