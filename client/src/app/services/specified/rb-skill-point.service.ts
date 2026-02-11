import { computed, inject, Injectable, signal } from "@angular/core"
import { RbChartInfo, RbChartType, RbMusicInfo, RbMusicRecordResponse, RbScoreResponse, RbVersion } from "server/models/shared/web"
import { RbMusicRecordService } from "./rb-music-record.service"

export type RbSkillPointEntry<TVersion extends RbVersion> = {
    record: RbMusicRecordResponse<TVersion>
    chartType: RbChartType<TVersion>
    music: RbMusicInfo
    chart: RbChartInfo<TVersion, RbChartType<TVersion>>
    score: RbScoreResponse<TVersion>
    skillPoint: number
} | undefined

@Injectable({
    providedIn: "root"
})
export class RbSkillPointService {
    readonly entries = computed(() => {
        const version = this.recordService.dataVersion()
        if (version !== 5 && version !== 6 || !this.recordService.data.hasValue()) return {
            total: 0,
            newTop: [],
            oldTop: [],
            newPotential: [],
            oldPotential: []
        }
        const data = this.recordService.data.value()
        const newOldMusicCounts = {
            new: version === 5 ? 10 : 20,
            old: version === 5 ? 40 : 30
        }
        const spa: RbSkillPointEntry<5 | 6>[] = data.map(r => Object.keys(r.scores).map(k => ({
            record: r as RbMusicRecordResponse<5 | 6>,
            chartType: parseInt(k),
            music: r.music!,
            /** @ts-ignore */
            chart: r.charts[k]!,
            /** @ts-ignore */
            score: r.scores[k]!,
            /** @ts-ignore */
            skillPoint: r.scores[k]!.skillPoint ?? -1,
        }))).flat()
        const newSongsEntry = spa.filter(el => el!.music?.musicUid.startsWith(`${version}`)).sort((l, r) => r!.skillPoint - l!.skillPoint)
        const oldSongsEntry = spa.filter(el => !el!.music?.musicUid.startsWith(`${version}`)).sort((l, r) => r!.skillPoint - l!.skillPoint)
        const topNewSongsEntry = newSongsEntry.slice(0, newOldMusicCounts.new)
        const topOldSongsEntry = oldSongsEntry.slice(0, newOldMusicCounts.old)
        const lastTopNew = topNewSongsEntry.length === 0 ? undefined : topNewSongsEntry[topNewSongsEntry.length - 1]
        const lastTopOld = topOldSongsEntry.length === 0 ? undefined : topOldSongsEntry[topOldSongsEntry.length - 1]
        if (topNewSongsEntry.length < newOldMusicCounts.new) for (let i = topNewSongsEntry.length; i < newOldMusicCounts.new; i++) topNewSongsEntry.push(undefined)
        if (topOldSongsEntry.length < newOldMusicCounts.old) for (let i = topOldSongsEntry.length; i < newOldMusicCounts.old; i++) topOldSongsEntry.push(undefined)
        const skillPointMultiplier = version === 5 ? 100 : 2
        const potentialNewSongsEntry = newSongsEntry.slice(newOldMusicCounts.new).filter(e => e!.chart && lastTopNew && (e!.chart.skillRate * skillPointMultiplier >= lastTopNew.skillPoint)).slice(0, 10)
        const potentialOldSongsEntry = oldSongsEntry.slice(newOldMusicCounts.old).filter(e => e!.chart && lastTopOld && (e!.chart.skillRate * skillPointMultiplier >= lastTopOld.skillPoint)).slice(0, 10)
        return {
            total: topNewSongsEntry.reduce((prev, next) => prev + (next?.skillPoint ?? 0), 0) + topOldSongsEntry.reduce((prev, next) => prev + (next?.skillPoint ?? 0), 0),
            newTop: topNewSongsEntry,
            oldTop: topOldSongsEntry,
            newPotential: potentialNewSongsEntry,
            oldPotential: potentialOldSongsEntry
        }
    })
    private readonly recordService = inject(RbMusicRecordService)
}
