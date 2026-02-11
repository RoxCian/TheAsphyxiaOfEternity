import { computed, Injectable } from "@angular/core"
import { RbMusicRecordResponse, RbVersion } from "server/models/shared/web"
import { RbPlayDataService } from "./rb-play-data.service"

@Injectable({
    providedIn: "root"
})
export class RbMusicRecordService extends RbPlayDataService<RbMusicRecordResponse<RbVersion>> {
    constructor() {
        super(computed(() => this.dataVersion() ? `rb${this.dataVersion()}ReadRecords` : undefined))
    }
}
