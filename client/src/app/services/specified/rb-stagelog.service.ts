import { computed, Injectable } from "@angular/core"
import { RbChartType, RbStageLogResponse, RbVersion } from "server/models/shared/web"
import { RbPlayDataService } from "./rb-play-data.service"

@Injectable({
    providedIn: "root"
})
export class RbStageLogService extends RbPlayDataService<RbStageLogResponse<RbVersion, RbChartType<RbVersion>>> {
    constructor() {
        super(computed(() => this.dataVersion() ? `rb${this.dataVersion()}ReadStageLogs` : undefined))
    }
}
