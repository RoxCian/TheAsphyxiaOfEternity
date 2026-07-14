import { effect, inject, Signal, signal } from "@angular/core"
import { RbVersionService } from "./rb-version.service"
import { RbVersion } from "rbweb"
import { rbData } from "../../signals/rb-data"
import { RbProfileService } from "./rb-profile.service"
import { HttpResourceRef } from "@angular/common/http"

export abstract class RbActivatableServiceBase<T> {
    private readonly isActivatedInternal = signal(false)
    protected readonly profileService = inject(RbProfileService)
    protected readonly versionService = inject(RbVersionService)
    private readonly dataVersionInternal = signal<RbVersion | undefined>(undefined)

    readonly isActivated = this.isActivatedInternal.asReadonly()
    readonly dataVersion = this.dataVersionInternal.asReadonly()

    constructor() {
        effect(() => {
            if (this.isActivated()) this.dataVersionInternal.set(this.versionService.version())
        })
    }

    activate(): HttpResourceRef<T | undefined> {
        this.isActivatedInternal.set(true)
        this.dataVersionInternal.set(this.versionService.version())
        return this.onActivate()
    }
    deactivate() {
        this.isActivatedInternal.set(false)
        this.onDeactivate()
    }
    protected abstract onActivate(): HttpResourceRef<T | undefined>
    protected abstract onDeactivate(): void
}

export abstract class RbPlayDataServiceBase<T> extends RbActivatableServiceBase<T[]> {
    readonly data!: HttpResourceRef<T[] | undefined>

    constructor(protected readonly dataRequestRoute: Signal<string | undefined>) {
        super()
        this.data = rbData<T[]>(dataRequestRoute, this.profileService.ridRequest)
    }
    protected override onActivate(): HttpResourceRef<T[] | undefined> {
        return this.data
    }
    protected override onDeactivate() { }
}
