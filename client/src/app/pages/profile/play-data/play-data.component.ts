import { AfterViewInit, Component, computed, effect, inject, signal, viewChild, ChangeDetectionStrategy } from "@angular/core"
import { RbVersion, RbChartType, RbVersionWithClasscheck, Rb4DojoIndex, RbMusicRecordResponse, RbStageLogResponse, RbClasscheckResponse } from "rbweb"
import { AutoLoadPanelComponent, AutoLoadEvent } from "../../../components/misc/auto-load-panel/auto-load-panel.component"
import { BungIntersectionService } from "../../../services/bung/intersection.service"
import { RbClasscheckService } from "../../../services/specified/rb-classcheck.service"
import { RbMusicRecordService } from "../../../services/specified/rb-music-record.service"
import { RbPlayerPerformanceService } from "../../../services/specified/rb-player-performance.service"
import { RbProfileService } from "../../../services/specified/rb-profile.service"
import { RbStageLogService } from "../../../services/specified/rb-stagelog.service"
import { RbVersionService } from "../../../services/specified/rb-version.service"
import { PaginatedSignal, paginated } from "../../../signals/paginated"
import { BungTabsComponent } from "../../../components/bung/tabs/tabs.component"
import { RbSkillPointService } from "../../../services/specified/rb-skill-point.service"
import { BungWaitableEvent } from "../../../utils/bung"
import { BungBreakpointService } from "../../../services/bung/breakpoint.service"
import { timeout } from "../../../utils/functions"

@Component({
    selector: "rb-play-data-subpage",
    templateUrl: "./play-data.component.html",
    styleUrl: "./play-data.component.sass",
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class RbPlayDataSubpage implements AfterViewInit {
    protected readonly musicRecordPaginated: PaginatedSignal<RbMusicRecordResponse<RbVersion>>
    protected readonly stageLogPaginated: PaginatedSignal<RbStageLogResponse<RbVersion, RbChartType<RbVersion>>>
    protected readonly stageLogPanel = viewChild("stageLogPanel", { read: AutoLoadPanelComponent })
    protected readonly recordPanel = viewChild("recordPanel", { read: AutoLoadPanelComponent })
    protected readonly versionService = inject(RbVersionService)
    protected readonly profileService = inject(RbProfileService)
    protected readonly playerPerformanceService = inject(RbPlayerPerformanceService)
    protected readonly musicRecordService = inject(RbMusicRecordService)
    protected readonly classcheckService = inject(RbClasscheckService)
    protected readonly stageLogService = inject(RbStageLogService)
    protected readonly skillPointService = inject(RbSkillPointService)
    protected readonly isLevelDisplaySwitchVisible = signal(false)
    protected readonly skillPointTier = computed(() => {
        let tiersThreshold: number[]
        let sp: number | undefined
        if (this.versionService.version() === 5) {
            sp = this.profileService.rb5Profile.value()?.skillPoint
            tiersThreshold = [60000, 90000, 120000, 150000, 180000, 220000, 260000, 290000, 330000, 370000]
        } else if (this.versionService.version() === 6) {
            sp = this.profileService.rb6Profile.value()?.skillPoint
            tiersThreshold = [1000, 2000, 3000, 4000, 5000, 5500]
        } else return -1
        if (sp == undefined) return -1
        for (let i = 0; i < tiersThreshold.length; i++) if (sp < tiersThreshold[i]) return i
        return tiersThreshold.length
    })
    protected readonly viewInited = signal(false)
    protected readonly minTabHeight = computed(() => {
        if (!this.viewInited() || !this.mainTabs()) return 0
        this.breakpointService.breakpointsToggled.mobile()
        const tabInsertion = document.querySelector("bung-insertion[tab-index]") as HTMLElement
        const footer = document.querySelector("footer.footer") as HTMLElement
        const tabTop = tabInsertion?.offsetTop ?? 0
        const footerHeight = footer?.clientHeight ?? 0
        return (window.visualViewport?.height ?? 0) - tabTop - footerHeight
    })

    private readonly mainTabs = viewChild("mainTabs", { read: BungTabsComponent })
    private readonly breakpointService = inject(BungBreakpointService)
    private readonly intersectionService = inject(BungIntersectionService)

    #versionBackup: RbVersion = 6

    constructor() {
        this.musicRecordPaginated = paginated(this.musicRecordService.data.value, 30)
        this.stageLogPaginated = paginated(this.stageLogService.data.value, 30)
        this.intersectionService.createGroup("rb-panel", {
            rootMargin: "100% 0%"
        })
        effect(() => {
            if (this.versionService.version() === this.#versionBackup) return
            this.#versionBackup = this.versionService.version()
            this.stageLogPanel()?.reset()
            this.recordPanel()?.reset()
            this.checkLevelDisplaySwitchVisible()
        })
    }
    async ngAfterViewInit() {
        this.viewInited.set(true)
    }
    protected onActivateMusicRecordTab(e: BungWaitableEvent) {
        this.musicRecordService.activate()
        this.classcheckService.deactivate()
        this.stageLogService.deactivate()
        e.resource = this.musicRecordService.data
    }
    protected onActivateClasscheckTab(e: BungWaitableEvent) {
        this.musicRecordService.deactivate()
        this.classcheckService.activate()
        this.stageLogService.deactivate()
        e.resource = this.classcheckService.data
    }
    protected onActivateStageLogTab(e: BungWaitableEvent) {
        this.musicRecordService.deactivate()
        this.classcheckService.deactivate()
        this.stageLogService.activate()
        e.resource = this.stageLogService.data
    }
    protected onActivateTab() {
        this.musicRecordService.deactivate()
        this.classcheckService.deactivate()
        this.stageLogService.deactivate()
    }
    protected loadMusicRecord() {
        this.musicRecordPaginated.load()
    }
    protected loadStageLog(event: AutoLoadEvent) {
        event.result = (async () => {
            if (!this.stageLogService.data.hasValue()) return undefined
            this.stageLogPaginated.load()
            if (this.stageLogPaginated.isFinished()) return "finished"
            return undefined
        })()
    }
    protected loadRecord(event: AutoLoadEvent) {
        event.result = (async () => {
            if (!this.musicRecordService.data.hasValue()) return undefined
            this.musicRecordPaginated.load()
            if (this.musicRecordPaginated.isFinished()) return "finished"
            return undefined
        })()
    }
    protected rb4DojoFilter(dojoRecords: RbClasscheckResponse<RbVersionWithClasscheck>[]): { classcheck: RbClasscheckResponse<RbVersionWithClasscheck>[], examination: RbClasscheckResponse<RbVersionWithClasscheck>[] } {
        return {
            classcheck: dojoRecords.filter(d => d.class < Rb4DojoIndex.examination),
            examination: dojoRecords.filter(d => d.class >= Rb4DojoIndex.examination)
        }
    }
    protected msg(m: string) {
        alert(m)
    }
    protected checkLevelDisplaySwitchVisible() {
        const version = this.versionService.version()
        if (version !== 5 && version !== 6) {
            this.isLevelDisplaySwitchVisible.set(false)
            return
        }
        const tabIndex = this.mainTabs()?.activated()
        this.isLevelDisplaySwitchVisible.set(tabIndex === "record" || tabIndex === "stglog" || tabIndex === "skillpoint")
    }
}
