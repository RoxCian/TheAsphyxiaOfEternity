import { computed, Service } from "@angular/core"
import { RbMusicRecordResponse, RbVersion } from "rbweb"
import { RbPlayDataServiceBase } from "./rb.service"

@Service()
export class RbMusicRecordService extends RbPlayDataServiceBase<RbMusicRecordResponse<RbVersion>> {
    readonly needsUpdate = computed(() => this.dataVersion() !== this.versionService.version())

    constructor() {
        super(computed(() => this.dataVersion() ? `rb${this.dataVersion()}ReadRecords` : undefined))
    }
}
