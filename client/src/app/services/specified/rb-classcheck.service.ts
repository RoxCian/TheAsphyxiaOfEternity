import { computed, Injectable } from "@angular/core"
import { RbClasscheckResponse, RbVersionWithClasscheck } from "server/models/shared/web"
import { RbPlayDataService } from "./rb-play-data.service"

@Injectable({
    providedIn: "root"
})
export class RbClasscheckService extends RbPlayDataService<RbClasscheckResponse<RbVersionWithClasscheck>> {
    constructor() {
        super(computed(() => (this.dataVersion() ?? 0) >= 4 ? `rb${this.dataVersion()}ReadClasschecks` : undefined))
    }
}
