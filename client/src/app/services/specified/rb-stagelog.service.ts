import { computed, Service } from "@angular/core"
import { RbChartType, RbStageLogResponse, RbVersion } from "rbweb"
import { RbPlayDataServiceBase } from "./rb.service"

@Service()
export class RbStageLogService extends RbPlayDataServiceBase<RbStageLogResponse<RbVersion, RbChartType<RbVersion>>> {
    readonly needsUpdate = computed(() => this.dataVersion() !== this.versionService.version())

    constructor() {
        super(computed(() => this.dataVersion() ? `rb${this.dataVersion()}ReadStageLogs` : undefined))
    }
}
