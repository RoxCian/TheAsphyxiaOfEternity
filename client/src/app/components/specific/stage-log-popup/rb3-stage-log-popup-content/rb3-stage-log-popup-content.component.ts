import { Component, input } from "@angular/core"
import { RbStageLogResponse, Rb1ChartType } from "server/models/shared/web"

@Component({
    selector: "rb3-stage-log-popup-content",
    templateUrl: "./rb3-stage-log-popup-content.component.html",
    styleUrl: "./rb3-stage-log-popup-content.component.sass",
    standalone: false
})
export class Rb3StageLogPopupContentComponent<TChart extends Rb1ChartType> {
    readonly stageLog = input.required<RbStageLogResponse<3, TChart>>()
}
