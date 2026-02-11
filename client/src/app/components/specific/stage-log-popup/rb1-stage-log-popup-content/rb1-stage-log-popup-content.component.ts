import { Component, input } from "@angular/core"
import { RbStageLogResponse, Rb1ChartType } from "server/models/shared/web"

@Component({
    selector: "rb1-stage-log-popup-content",
    templateUrl: "./rb1-stage-log-popup-content.component.html",
    styleUrl: "./rb1-stage-log-popup-content.component.sass",
    standalone: false
})
export class Rb1StageLogPopupContentComponent<TChart extends Rb1ChartType> {
    readonly stageLog = input.required<RbStageLogResponse<1, TChart>>()
}
