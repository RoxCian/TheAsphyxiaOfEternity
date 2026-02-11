import { computed, Injectable, signal } from "@angular/core"
import { Router } from "@angular/router"
import { RbPlayerResponse, RbRequest, RbVersion } from "server/models/shared/web"
import { rbData } from "../../signals/rb-data"
import { env } from "../../../env/env"

@Injectable({ providedIn: "root" })
export class RbProfileService {
    readonly rid = signal("")
    readonly ridRequest = computed<RbRequest>(() => ({ rid: this.rid() }))
    readonly rb1Profile = rbData<RbPlayerResponse>(computed(() => this.rid() ? "rb1ReadPlayer" : undefined), this.ridRequest)
    readonly rb2Profile = rbData<RbPlayerResponse>(computed(() => this.rid() ? "rb2ReadPlayer" : undefined), this.ridRequest)
    readonly rb3Profile = rbData<RbPlayerResponse>(computed(() => this.rid() ? "rb3ReadPlayer" : undefined), this.ridRequest)
    readonly rb4Profile = rbData<RbPlayerResponse>(computed(() => this.rid() ? "rb4ReadPlayer" : undefined), this.ridRequest)
    readonly rb5Profile = rbData<RbPlayerResponse>(computed(() => this.rid() ? "rb5ReadPlayer" : undefined), this.ridRequest)
    readonly rb6Profile = rbData<RbPlayerResponse>(computed(() => this.rid() ? "rb6ReadPlayer" : undefined), this.ridRequest)
    readonly rbProfiles = computed<Record<RbVersion, RbPlayerResponse | undefined>>(() => ({
        1: this.rb1Profile.hasValue() ? this.rb1Profile.value() : undefined,
        2: this.rb2Profile.hasValue() ? this.rb2Profile.value() : undefined,
        3: this.rb3Profile.hasValue() ? this.rb3Profile.value() : undefined,
        4: this.rb4Profile.hasValue() ? this.rb4Profile.value() : undefined,
        5: this.rb5Profile.hasValue() ? this.rb5Profile.value() : undefined,
        6: this.rb6Profile.hasValue() ? this.rb6Profile.value() : undefined
    }))
    readonly isLoading = computed(() => {
        return !this.rid() ||
            this.rb1Profile.isLoading() ||
            this.rb2Profile.isLoading() ||
            this.rb3Profile.isLoading() ||
            this.rb4Profile.isLoading() ||
            this.rb5Profile.isLoading() ||
            this.rb6Profile.isLoading()
    })
    readonly error = computed<Record<RbVersion, Error | undefined>>(() => {
        return {
            1: this.rb1Profile.error(),
            2: this.rb2Profile.error(),
            3: this.rb3Profile.error(),
            4: this.rb4Profile.error(),
            5: this.rb5Profile.error(),
            6: this.rb6Profile.error()
        }
    })
    private devInitialized = false
    constructor(router: Router) {
        const updateRid = async () => {
            if (!env.production && !this.devInitialized) {
                this.rid.set(await (await fetch("./dev/debug-rid")).text())
                this.devInitialized = true
            }
            const currentRid = router.parseUrl(router.url).queryParams["refid"]
            if (currentRid !== this.rid() && typeof currentRid === "string") {
                this.rid.set(currentRid)
            }
        }
        router.events.subscribe(updateRid)
        updateRid()
    }
}