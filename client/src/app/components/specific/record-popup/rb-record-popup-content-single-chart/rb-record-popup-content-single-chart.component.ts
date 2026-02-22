import { AfterViewInit, Component, ElementRef, computed, inject, model, signal, viewChild } from "@angular/core"
import { RbMusicRecordResponse, RbChartType, RbVersion } from "rbweb"
import { BungMarqueeComponent } from "../../../bung/marquee/marquee.component"
import { RbChartLightComponent } from "../../chart-light/rb-chart-light/rb-chart-light.component"
import { RbMusicTitleComponent } from "../../music-title/rb-music-title/rb-music-title.component"
import { RbRankBadgeComponent } from "../../rank-badge/rb-rank-badge/rb-rank-badge.component"
import { BungBreakpointService } from "../../../../services/bung/breakpoint.service"
import { timeout } from "../../../../utils/functions"

type RbRecordPopupZoomInAnimationParams = { startX: number, startY: number, startWidth: number, endWidth: number }
const DefaultZoomInAnimationParams: RbRecordPopupZoomInAnimationParams = { startX: 0, startY: 0, startWidth: 0, endWidth: 1 }
type RbRecordPopupSwipeAnimationParams = { startWidth: number | string, startHeight: number | string, endWidth: number | string, endHeight: number | string }
const VSwipeAnimationParams: RbRecordPopupSwipeAnimationParams = { startWidth: "auto", startHeight: "0", endWidth: "auto", endHeight: "auto" }
const HSwipeAnimationParams: RbRecordPopupSwipeAnimationParams = { startWidth: "0", startHeight: "auto", endWidth: "auto", endHeight: "auto" }

@Component({
    selector: "rb-record-popup-content-single-chart",
    templateUrl: "./rb-record-popup-content-single-chart.component.html",
    styleUrl: "./rb-record-popup-content-single-chart.component.sass",
    host: {
        "[style.--jacket-start-x]": "`${jacketAnimationParams().startX}px`",
        "[style.--jacket-start-y]": "`${jacketAnimationParams().startY}px`",
        "[style.--jacket-start-scale]": "`${jacketAnimationParams().startWidth / jacketAnimationParams().endWidth}`",
        "[style.--music-info-start-x]": "`${musicInfoAnimationParams().startX}px`",
        "[style.--music-info-start-y]": "`${musicInfoAnimationParams().startY}px`",
        "[style.--music-info-start-width]": "`${musicInfoAnimationParams().startWidth}px`",
        "[style.--music-info-end-width]": "`${musicInfoAnimationParams().endWidth}px`",
        "[style.--background-start-width]": "backgroundSwipeAnimationParams().startWidth",
        "[style.--background-start-height]": "backgroundSwipeAnimationParams().startHeight",
        "[style.--background-end-width]": "backgroundSwipeAnimationParams().endWidth",
        "[style.--background-end-height]": "backgroundSwipeAnimationParams().endHeight",
        "[style.--score-info-start-width]": "scoreInfoSwipeAnimationParams().startWidth",
        "[style.--score-info-start-height]": "scoreInfoSwipeAnimationParams().startHeight",
        "[style.--score-info-end-width]": "scoreInfoSwipeAnimationParams().endWidth",
        "[style.--score-info-end-height]": "scoreInfoSwipeAnimationParams().endHeight",
    },
    standalone: false
})
export class RbRecordPopupContentSingleChartComponent<TVersion extends RbVersion> implements AfterViewInit {
    readonly record = model.required<RbMusicRecordResponse<TVersion>>()
    readonly chartType = model.required<RbChartType<TVersion>>()
    readonly recordPanelElement = model.required<ElementRef<HTMLElement> | undefined>()

    protected readonly animationState = signal<"in" | "show">("in")

    private readonly breakpointService = inject(BungBreakpointService)
    readonly isMobile = this.breakpointService.breakpointsToggled.mobile

    private readonly jacketElement = viewChild<ElementRef<HTMLElement>>("jacket")
    private readonly musicInfoElement = viewChild<ElementRef<HTMLElement>>("musicInfo")

    protected readonly jacketAnimationParams = signal(DefaultZoomInAnimationParams)
    protected readonly musicInfoAnimationParams = signal(DefaultZoomInAnimationParams)
    protected readonly backgroundSwipeAnimationParams = signal(this.breakpointService.breakpointsToggled.mobile() ? VSwipeAnimationParams : HSwipeAnimationParams)
    protected readonly scoreInfoSwipeAnimationParams = signal(this.breakpointService.breakpointsToggled.mobile() ? VSwipeAnimationParams : HSwipeAnimationParams)

    private readonly musicTitle = viewChild(RbMusicTitleComponent)
    private readonly artistMarquee = viewChild("artistMarquee", { read: BungMarqueeComponent })
    private readonly scoreInfo = viewChild<ElementRef<HTMLElement>>("scoreInfo")
    private readonly background = viewChild<ElementRef<HTMLElement>>("background")
    private readonly chartLight = viewChild(RbChartLightComponent)
    private readonly rankBadge = viewChild("rankBadge", { read: RbRankBadgeComponent })

    async ngAfterViewInit() {
        await timeout() // breakpoint directive will be executed after view initiated, make sure animations start after directives all settled
        const jacketRect = this.jacketElement()?.nativeElement.getBoundingClientRect() ?? new DOMRect()
        const musicInfoRect = this.musicInfoElement()?.nativeElement.getBoundingClientRect() ?? new DOMRect()
        const jacketRectStart = this.recordPanelElement()?.nativeElement.querySelector(".jacket img")?.getBoundingClientRect() ?? new DOMRect()
        const musicInfoRectStart = this.recordPanelElement()?.nativeElement.querySelector(".music-info")?.getBoundingClientRect() ?? new DOMRect()
        const scoreInfoRect = this.scoreInfo()?.nativeElement.getBoundingClientRect() ?? new DOMRect()
        const backgroundRect = this.background()?.nativeElement.getBoundingClientRect() ?? new DOMRect()

        this.jacketAnimationParams.set({
            startX: jacketRectStart.x - jacketRect.x,
            startY: jacketRectStart.y - jacketRect.y,
            startWidth: jacketRectStart.width,
            endWidth: jacketRect.width
        })
        this.musicInfoAnimationParams.set({
            startX: musicInfoRectStart.x - musicInfoRect.x,
            startY: musicInfoRectStart.y - musicInfoRect.y,
            startWidth: musicInfoRectStart.width,
            endWidth: musicInfoRect.width
        })
        this.scoreInfoSwipeAnimationParams.update(v => {
            return {
                startWidth: v.startWidth,
                startHeight: v.startHeight,
                endWidth: `${scoreInfoRect.width}px`,
                endHeight: `${scoreInfoRect.height}px`
            }
        })
        this.backgroundSwipeAnimationParams.update(v => {
            return {
                startWidth: v.startWidth,
                startHeight: v.startHeight,
                endWidth: `${backgroundRect.width}px`,
                endHeight: `${backgroundRect.height}px`
            }
        })
        this.scoreInfo()?.nativeElement.classList.add("delayed")
        this.animationState.set("show")
    }

    protected onBodyInDone(event: AnimationEvent) {
        // if (event.toState !== "show") return
        setTimeout(() => {
            this.musicTitle()?.isMarqueedisabled.toggle()
            this.artistMarquee()?.disabled.toggle()
        }, 200)
        setTimeout(() => {
            this.chartLight()?.isVisible.toggle()
            this.rankBadge()?.isVisible.toggle()
        }, 1000)
    }
}
