import { Component, computed, inject, input } from "@angular/core"
import { RbStageLogResponse, RbChartType, RbVersion } from "rbweb"
import { BungPopupService } from "../../../../services/bung/popup.service"
import { RbStageLogPopupComponent } from "../../stage-log-popup/rb-stage-log-popup/rb-stage-log-popup.component"
import { toRbChartTypeLiteral } from "../../../../utils/rb-functions"
import { RbLogService } from "../../../../services/specified/rb-log.service"

@Component({
    selector: "rb-stage-log-panel",
    templateUrl: "./rb-stage-log-panel.component.html",
    styleUrls: ["./rb-stage-log-panel.component.sass",],
    host: {
        "(click)": "onShowPopup()"
    },
    standalone: false
})
export class RbStageLogPanelComponent<T extends RbVersion, TChart extends RbChartType<T>> {
    readonly stageLog = input.required<RbStageLogResponse<T, TChart>>()
    readonly matchingResult = computed(() => this.stageLog().score > this.stageLog().rivalScore ? "win" : this.stageLog().score == this.stageLog().rivalScore ? "draw" : "lose")
    readonly isReflecMeijin = computed(() => this.stageLog().version === 4 && (this.stageLog().rivalCpuId ?? 0) >= 20 && (this.stageLog().rivalCpuId ?? 0) <= 25)
    readonly errorInfoHTML = computed(() => {
        if (!this.stageLog()) return undefined
        if (!this.stageLog().music) {
            this.logService.log(`No music info found for <Music ID: ${this.stageLog().musicId}>`)
            return `No music info found for <b lang="jp"><i>Music ID: ${this.stageLog().musicId}</i></b>`
        } else if (!this.stageLog().chart) {
            this.logService.log(`No chart info found for "${this.stageLog().music.title}" (${toRbChartTypeLiteral(this.stageLog().chartType, this.stageLog().version)})`, this.stageLog().chartType)
            return `No chart info found for <b lang="jp"><i>${this.stageLog().music.title} (${toRbChartTypeLiteral(this.stageLog().chartType, this.stageLog().version)})</i></b>`
        }
        return undefined
    })
    private readonly popupService = inject(BungPopupService)
    private readonly logService = inject(RbLogService)

    protected onShowPopup() {
        if (!this.stageLog().music || !this.stageLog().chart) return
        this.popupService.popup(undefined, undefined, RbStageLogPopupComponent, {
            layer: "rb-music-score",
            duration: Infinity,
            setter: popup => {
                popup.stageLog.set(this.stageLog())
            }
        })
    }
}
