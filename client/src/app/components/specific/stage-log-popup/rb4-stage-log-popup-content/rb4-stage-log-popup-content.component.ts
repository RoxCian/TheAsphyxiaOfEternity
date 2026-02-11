import { Component, input } from "@angular/core"
import { RbStageLogResponse, Rb4ChartType } from "server/models/shared/web"

@Component({
    selector: "rb4-stage-log-popup-content",
    templateUrl: "./rb4-stage-log-popup-content.component.html",
    styleUrl: "./rb4-stage-log-popup-content.component.sass",
    standalone: false
})
export class Rb4StageLogPopupContentComponent<TChart extends Rb4ChartType> {
    readonly stageLog = input.required<RbStageLogResponse<4, TChart>>()
}
