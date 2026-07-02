import { computed, inject, Service, signal } from "@angular/core"
import { Rb2GlassResponse, Rb2GlassSettings } from "rbweb"
import { RbPlayDataServiceBase } from "./rb-play-data.service"
import { rbData } from "../../signals/rb-data"
import { rbEmitJSON } from "../../utils/rb-functions"
import { BungNotificationService } from "../bung/notification.service"

@Service()
export class Rb2GlassesService extends RbPlayDataServiceBase<Rb2GlassResponse> {
    readonly grouped = computed(() => this.data.value()?.reduce((prev, next) => {
        if (!prev[next.category]) prev[next.category] = []
        prev[next.category].push(next)
        return prev
    }, {} as Record<string, Rb2GlassResponse[]>) ?? {})
    readonly settings = rbData<Rb2GlassSettings>(() => this.isActivated() && this.dataVersion() === 2 ? `rb2ReadGlassSettings` : undefined, this.profileService.ridRequest)
    private readonly loadingGlassInternal = signal(-1)
    readonly loadingGlass = computed(() => this.settings.isLoading() ? this.loadingGlassInternal() : -1)

    private readonly notificationService = inject(BungNotificationService)
    
    constructor() {
        super(computed(() => this.dataVersion() === 2 ? `rb2ReadGlasses` : undefined))
    }
    async select(selected: number) {
        if (!this.isActivated()) return
        try {
            this.loadingGlassInternal.set(selected)
            const result = await rbEmitJSON<{ modified: boolean }>("rb2WriteGlassSettings", { 
                rid: this.profileService.rid(),
                selected
            })
            if (result.modified) this.settings.reload()
        } catch (ex) {
            if (ex instanceof Error) this.notificationService.notify(ex.message, "danger")
        }
        // this.loadingGlassInternal.set(-1) × do not set to -1
    }
}
