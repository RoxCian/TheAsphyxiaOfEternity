import { AfterViewInit, Component, computed, ElementRef, inject, input, signal, viewChild, viewChildren } from "@angular/core"
import { RbVersionWithClasscheck, RbChartType, RbStageLogResponse } from "rbweb"
import { RbChartLampComponent } from "../../chart-lamp/rb-chart-lamp/rb-chart-lamp.component"
import { BungMarqueeComponent } from "../../../bung/marquee/marquee.component"
import { RbMusicTitleComponent } from "../../music-title/rb-music-title/rb-music-title.component"
import { BungPopupComponent } from "../../../bung/popup/popup.component"
import { BungBreakpointService } from "../../../../services/bung/breakpoint.service"
import { timeout } from "../../../../utils/functions"
import { toggleTransform } from "../../../../signals/transforms"

@Component({
    selector: "rb-course-popup",
    standalone: false,
    templateUrl: "./rb-course-popup.component.html",
    styleUrl: "./rb-course-popup.component.sass",
    host: {
        "[class.use-default-popup-leave-animation]": "true",
        "[style.--background-end-height]": "`${height()}px`",
    }
})
export class RbCoursePopupComponent<TVersion extends RbVersionWithClasscheck> extends BungPopupComponent implements AfterViewInit {
    readonly version = input.required<TVersion>()
    readonly stageLogs = input.required<RbStageLogResponse<TVersion, RbChartType<TVersion>>[]>()
    readonly isCleared = input.required<boolean>()
    readonly courseNameSub = input<string | undefined>()
    readonly courseNameMain = input<string | undefined>()
    readonly clearInfoSub = input<string | undefined>()
    readonly clearInfoMain = input<string | undefined>()
    readonly emphasisScore = input(false, { transform: toggleTransform })
    readonly totalScore = computed(() => this.stageLogs().reduce((total, curr) => total + curr.score, 0))
    readonly averageAchievementRate = input(0)
    readonly totalCompletionScore = input<number | undefined>()
    readonly averageCompletionRate = input<number | undefined>()
    readonly separateCompletionScore = input<number[] | undefined>()
    readonly separateCompletionRate = input<number[] | undefined>()
    readonly playCount = input(0)
    readonly update = input<Date>()
    readonly lastPlay = input<Date>()
    readonly chartType = input<RbChartType<TVersion> | undefined>()
    protected readonly breakpointService = inject(BungBreakpointService)
    protected readonly height = signal(0)
    protected readonly animationState = signal<"in" | "show">("in")
    private readonly musicTitles = viewChildren(RbMusicTitleComponent)
    private readonly artistMarquees = viewChildren("artistMarquee", { read: BungMarqueeComponent })
    private readonly chartLamps = viewChildren(RbChartLampComponent)
    private readonly background = viewChild<ElementRef<HTMLElement>>("background")

    async ngAfterViewInit() {
        await timeout() // breakpoint directive will be executed after view initiated, make sure animations start after directives all settled
        const backgroundRect = this.background()?.nativeElement.getBoundingClientRect() ?? new DOMRect()
        this.height.set(backgroundRect.height)
        this.animationState.set("show")
    }
    protected toChartType(value: unknown): RbChartType<TVersion> {
        if (typeof value === "number" && value >= 0 && value <= 3) return value as RbChartType<TVersion>
        return 0 as RbChartType<TVersion>
    }
    protected onBackgroundAnimationEnd(event: AnimationEvent | TransitionEvent) {
        // if (event.toState !== "show") return
        setTimeout(() => {
            for (const musicTitle of this.musicTitles()) musicTitle.isMarqueedisabled.set(false)
            for (const artistMarquee of this.artistMarquees()) artistMarquee.disabled.set(false)
        }, 200)
        setTimeout(() => {
            for (const chartLamp of this.chartLamps()) chartLamp?.isVisible.set(true)
        }, 200 + 200 * (this.stageLogs().length > 3 ? 4 : 3))
    }
}
