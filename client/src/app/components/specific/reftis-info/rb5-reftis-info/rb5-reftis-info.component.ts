import { Component, computed, inject } from "@angular/core"
import { RbProfileService } from "../../../../services/specified/rb-profile.service"
import { RbVersionService } from "../../../../services/specified/rb-version.service"
import { rbData } from "../../../../signals/rb-data"
import { Rb5MinigameRecordUpdateResponse, Rb5MinigameType } from "rbweb"

@Component({
    selector: "rb5-reftis-info",
    standalone: false,
    templateUrl: "./rb5-reftis-info.component.html",
    styleUrl: "./rb5-reftis-info.component.sass",
})
export class Rb5ReftisInfoComponent {
    private readonly profileService = inject(RbProfileService)
    private readonly versionService = inject(RbVersionService)
    protected readonly reftis = rbData<Rb5MinigameType>(computed(() => this.versionService.version() === 5 ? "rb5ReadReftis" : undefined), this.profileService.ridRequest)
    protected readonly reftisRecordUpdate = rbData<Rb5MinigameRecordUpdateResponse[]>(computed(() => this.versionService.version() === 5 ? "rb5ReadReftisRecordUpdate" : undefined), this.profileService.ridRequest)
}
