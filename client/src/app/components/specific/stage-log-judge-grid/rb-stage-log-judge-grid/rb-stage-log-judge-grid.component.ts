import { Component, input } from "@angular/core"
import { RbStageLogResponse, RbChartType, RbVersion } from "rbweb"


@Component({
    selector: "rb-stage-log-judge-grid",
    standalone: false,
    templateUrl: "./rb-stage-log-judge-grid.component.html",
    styleUrl: "./rb-stage-log-judge-grid.component.sass"
})
export class RbStageLogJudgeGridComponent<TVersion extends RbVersion, TChart extends RbChartType<TVersion>> {
    readonly stageLog = input.required<RbStageLogResponse<TVersion, TChart>>()
    private static readonly formatter2 = new Intl.NumberFormat("en-US", {
        style: "decimal",
        minimumFractionDigits: 2,
        useGrouping: false
    })
    private static readonly formatter1 = new Intl.NumberFormat("en-US", {
        style: "decimal",
        minimumFractionDigits: 1,
        useGrouping: false
    })

    protected formatAr(ar: number, version: TVersion): string {
        if (version === 6) return RbStageLogJudgeGridComponent.formatter2.format(ar)
        return RbStageLogJudgeGridComponent.formatter1.format(ar)
    }
}
