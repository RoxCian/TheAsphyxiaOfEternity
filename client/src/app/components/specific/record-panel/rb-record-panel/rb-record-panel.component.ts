import { Component, computed, ElementRef, inject, input, SecurityContext, viewChild } from "@angular/core"
import { RbMusicRecordResponse, RbChartType, RbVersion, RbChartResponse } from "rbweb"
import { BungPopupService } from "../../../../services/bung/popup.service"
import { RbRecordPopupComponent } from "../../record-popup/rb-record-popup/rb-record-popup.component"
import { RbLogService } from "../../../../services/specified/rb-log.service"
import { DomSanitizer } from "@angular/platform-browser"

function hasChart<TVersion extends RbVersion, TChart extends RbChartType<TVersion>>(chart?: RbChartResponse<TVersion, TChart>) {
    return chart && chart.level > 0
}

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
        if (!this.record().music || this.record().music.musicUid === "----") {
            const musicIdStr = this.sanitizer.sanitize(SecurityContext.HTML, `${this.record().musicId}`)
            this.logService.log(`No music info found for <Music ID: ${musicIdStr}>`)
            return `No music info found for <b><i>Music ID: ${musicIdStr}</i></b>`
        } else if (!hasChart(this.record().charts[0 as RbChartType<TVersion>]) || !hasChart(this.record().charts[1 as RbChartType<TVersion>]) || !hasChart(this.record().charts[2 as RbChartType<TVersion>])) {
            const chartsLost: string[] = []
            if (!hasChart(this.record().charts[0 as RbChartType<TVersion>])) chartsLost.push("BASIC")
            if (!hasChart(this.record().charts[1 as RbChartType<TVersion>])) chartsLost.push("MEDIUM")
            if (!hasChart(this.record().charts[2 as RbChartType<TVersion>])) chartsLost.push("HARD")
            const title = this.sanitizer.sanitize(SecurityContext.HTML, this.record().music.title)
            this.logService.log(`No chart info found for "${title}" (${chartsLost.join(", ")})`)
            return `No chart info found for <b lang="jp"><i>${title} (${chartsLost.join(", ")})</i></b>`
        } else if (!hasChart(this.record().charts[3 as RbChartType<TVersion>]) && 3 in this.record().scores && this.record().version >= 5) {
            const title = this.sanitizer.sanitize(SecurityContext.HTML, this.record().music.title)
            const chartName = this.record().version === 5 ? "SPECIAL" : "WHITEHARD"
            this.logService.log(`No chart info found for "${title}" (${chartName}), but play data found`)
            return `No chart info found for <b lang="jp"><i>${title} (${chartName})</i></b>, but play data found`
        }
        return undefined
    })

    private readonly contentElement = viewChild<ElementRef<HTMLElement>>("contentElement")
    private readonly popupService = inject(BungPopupService)
    private readonly logService = inject(RbLogService)
    private readonly sanitizer = inject(DomSanitizer)

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
