import { Component, input } from "@angular/core"
import { RbStageLogResponse, Rb1ChartType } from "rbweb"

@Component({
    selector: "rb2-stage-log-popup-content",
    templateUrl: "./rb2-stage-log-popup-content.component.html",
    styleUrl: "./rb2-stage-log-popup-content.component.sass",
    standalone: false
})
export class Rb2StageLogPopupContentComponent<TChart extends Rb1ChartType> {
    readonly stageLog = input.required<RbStageLogResponse<2, TChart>>()
}
