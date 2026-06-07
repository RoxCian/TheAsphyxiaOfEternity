import { Component, computed, inject, input } from "@angular/core"
import { toRbChartTypeLiteral } from "../../../../utils/rb-functions"
import { RbLogService } from "../../../../services/specified/rb-log.service"
import { RbSkillPointEntry } from "../../../../services/specified/rb-skill-point.service"

@Component({
    selector: "rb-skill-point-panel",
    templateUrl: "./rb-skill-point-panel.component.html",
    styleUrl: "./rb-skill-point-panel.component.sass",
    standalone: false
})
export class RbSkillPointPanelComponent<TVersion extends 5 | 6> {
    readonly entry = input.required<RbSkillPointEntry<TVersion> | undefined>()
    readonly rank = input.required<number | undefined>()
    readonly errorInfoHTML = computed(() => {
        const entry = this.entry()
        if (!entry) return undefined
        if (!entry.music) {
            this.logService.log(`No music info found for <Music ID: ${entry.record.musicId}>`)
            return `No music info found for <b><i>Music ID: ${entry.record.musicId}</i></b>`
        } else if (!entry.chart) {
            const chartType = toRbChartTypeLiteral(entry.chartType, entry.record.version)
            this.logService.log(`Some chart info(s) are missing for "${entry.music.title}" (${chartType})`)
            return `Some chart info(s) are missing forr <b lang="jp"><i>${entry.music.title} (${chartType})</i></b>`
        }
        return undefined
    })

    private readonly logService = inject(RbLogService)
}
