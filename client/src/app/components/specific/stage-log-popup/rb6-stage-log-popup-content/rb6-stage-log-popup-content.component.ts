import { Component, input } from "@angular/core"
import { RbStageLogResponse, Rb6ChartType } from "server/models/shared/web"

@Component({
    selector: "rb6-stage-log-popup-content",
    templateUrl: "./rb6-stage-log-popup-content.component.html",
    styleUrl: "./rb6-stage-log-popup-content.component.sass",
    standalone: false
})
export class Rb6StageLogPopupContentComponent<TChart extends Rb6ChartType> {
    readonly stageLog = input.required<RbStageLogResponse<6, TChart>>()
}
