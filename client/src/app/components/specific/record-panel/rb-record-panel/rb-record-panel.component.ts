import { Component, computed, ElementRef, inject, input, viewChild } from "@angular/core"
import { RbMusicRecordResponse, RbChartType, RbVersion } from "rbweb"
import { BungPopupService } from "../../../../services/bung/popup.service"
import { RbRecordPopupComponent } from "../../record-popup/rb-record-popup/rb-record-popup.component"
import { RbLogService } from "../../../../services/specified/rb-log.service"
import { toRbChartTypeLiteral } from "../../../../utils/rb-functions"

@Component({
    selector: "rb-record",
    templateUrl: "./rb-record-panel.component.html",
    styleUrls: ["./rb-record-panel.component.sass"],
    standalone: false
})
export class RbRecordPanelComponent<TVersion extends RbVersion> {
    readonly record = input.required<RbMusicRecordResponse<TVersion>>()

    readonly chartSlots = computed(() => (this.record().version < 4 ? [0, 1, 2] : [0, 1, 2, 3]) as RbChartType<TVersion>[])
    readonly isPlayed = computed(() => this.chartSlots().map(chart => !!this.record().scores[chart]))
    readonly hasChart = computed(() => this.chartSlots().map(chart => (this.record().charts[chart]?.level ?? -1) > 0))
    readonly scores = computed(() => this.record().scores)
    readonly isJustCollectFulfilled = computed(() => this.chartSlots().map(chart => this.record().version === 6 && this.scores()[chart]?.justCollectRate?.blue == 100 && this.scores()[chart]?.justCollectRate?.red == 100))
    readonly errorInfoHTML = computed(() => {
        if (!this.record()) return undefined
        if (!this.record().music) {
            this.logService.log(`No music info found for <Music ID: ${this.record().musicId}>`)
            return `No music info found for <b><i>Music ID: ${this.record().musicId}</i></b>`
        } else if (!(0 in this.record().charts && 1 in this.record().charts && 2 in this.record().charts)) {
            const chartsLost: string[] = []
            if (!(0 in this.record().charts)) chartsLost.push("BASIC")
            if (!(1 in this.record().charts)) chartsLost.push("MEDIUM")
            if (!(2 in this.record().charts)) chartsLost.push("HARD")
            this.logService.log(`No chart info found for "${this.record().music.title}" (${chartsLost.join(", ")})`)
            return `No chart info found for <b lang="jp"><i>${this.record().music.title} (${chartsLost.join(", ")})</i></b>`
        } else if (!(3 in this.record().charts) && 3 in this.record().scores) {
            this.logService.log(`No chart info found for "${this.record().music.title}" (${toRbChartTypeLiteral(3 as RbChartType<TVersion>, this.record().version)}), but play data found`)
            return `No chart info found for <b lang="jp"><i>${this.record().music.title} (${toRbChartTypeLiteral(3 as RbChartType<TVersion>, this.record().version)})</i></b>, but play data found`
        }
        return undefined
    })

    private readonly contentElement = viewChild<ElementRef<HTMLElement>>("contentElement")
    private readonly popupService = inject(BungPopupService)
    private readonly logService = inject(RbLogService)

    protected onShowPopup(chart?: RbChartType<TVersion>) {
        if (chart == undefined || this.scores()[chart]) {
            this.popupService.popup(undefined, undefined, RbRecordPopupComponent, {
                layer: "rb-music-score",
                duration: Infinity,
                setter: popup => {
                    popup.chartType.set(chart)
                    popup.record.set(this.record())
                    popup.recordPanelElement.set(this.contentElement())
                }
            })
        }
    }
}
