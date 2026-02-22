import { Component, input, linkedSignal } from "@angular/core"
import { RbStageLogResponse, RbChartType, RbVersion } from "rbweb"
import { BungPopupComponent } from "../../../bung/popup/popup.component"

@Component({
    selector: "rb-stage-log-popup",
    standalone: false,
    templateUrl: "./rb-stage-log-popup.component.html",
    styleUrl: "./rb-stage-log-popup.component.sass",
    host: {
        "[class.use-default-popup-animation]": "true"
    }
})
export class RbStageLogPopupComponent<TVersion extends RbVersion, TChart extends RbChartType<TVersion>> extends BungPopupComponent<void> {
    readonly stageLogInput = input.required<RbStageLogResponse<TVersion, TChart>>({ alias: "stageLog" })
    readonly stageLog = linkedSignal(this.stageLogInput)

    protected castStageLog<TVersionCast extends RbVersion, TChartCast extends RbChartType<TVersionCast>>(_: TVersionCast, stageLog: RbStageLogResponse<TVersion, TChart>): RbStageLogResponse<TVersionCast, TChartCast> | undefined {
        return stageLog as unknown as RbStageLogResponse<TVersionCast, TChartCast>
    }
}
