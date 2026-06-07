import { computed, Service } from "@angular/core"
import { RbClasscheckResponse, RbVersionWithClasscheck } from "rbweb"
import { RbPlayDataServiceBase } from "./rb-play-data.service"

@Service()
export class RbClasscheckService extends RbPlayDataServiceBase<RbClasscheckResponse<RbVersionWithClasscheck>> {
    constructor() {
        super(computed(() => (this.dataVersion() ?? 0) >= 4 ? `rb${this.dataVersion()}ReadClasschecks` : undefined))
    }
}
