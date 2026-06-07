import { Component, input } from "@angular/core"
import { RbStageLogResponse, Rb4ChartType } from "rbweb"

@Component({
    selector: "rb5-stage-log-popup-content",
    templateUrl: "./rb5-stage-log-popup-content.component.html",
    styleUrl: "./rb5-stage-log-popup-content.component.sass",
    standalone: false
})
export class Rb5StageLogPopupContentComponent<TChart extends Rb4ChartType> {
    readonly stageLog = input.required<RbStageLogResponse<5, TChart>>()
}
