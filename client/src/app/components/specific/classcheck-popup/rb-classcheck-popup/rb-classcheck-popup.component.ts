import { AfterViewInit, Component, computed, ElementRef, inject, input, signal, viewChild, viewChildren, ChangeDetectionStrategy } from "@angular/core"
import { Rb5ClasscheckIndex, Rb4DojoIndex, Rb6ClasscheckIndex, RbClasscheckResponse, RbVersionWithClasscheck, RbChartType } from "rbweb"
import { RbChartLampComponent } from "../../chart-lamp/rb-chart-lamp/rb-chart-lamp.component"
import { BungMarqueeComponent } from "../../../bung/marquee/marquee.component"
import { RbMusicTitleComponent } from "../../music-title/rb-music-title/rb-music-title.component"
import { BungPopupComponent } from "../../../bung/popup/popup.component"
import { BungBreakpointService } from "../../../../services/bung/breakpoint.service"
import { timeout } from "../../../../utils/functions"

@Component({
    selector: "rb-classcheck-popup",
    standalone: false,
    templateUrl: "./rb-classcheck-popup.component.html",
    styleUrl: "./rb-classcheck-popup.component.sass",
    changeDetection: ChangeDetectionStrategy.Eager,
    host: {
        "[class.use-default-popup-leave-animation]": "true",
        "[style.--background-end-height]": "`${height()}px`",
    }
})
export class RbClasscheckPopupComponent<TVersion extends RbVersionWithClasscheck> extends BungPopupComponent implements AfterViewInit {
    readonly classcheck = input.required<RbClasscheckResponse<TVersion>>()
    readonly realIndex = computed(() => {
        const classcheck = this.classcheck()
        if (isVersion(classcheck, 5)) {
            switch (classcheck.class) {
                case Rb5ClasscheckIndex.class11:
                case Rb5ClasscheckIndex.class12:
                case Rb5ClasscheckIndex.class13: return classcheck.class - 12
                default: return classcheck.class + 3
            }
        }
        return classcheck.class
    })
    readonly classcheckNameSub = computed(() => {
        const classcheck = this.classcheck()
        if (isVersion(classcheck, 4)) {
            switch (classcheck.class) {
                case Rb4DojoIndex.kyu5: return "5 Kyu"
                case Rb4DojoIndex.kyu4: return "4 Kyu"
                case Rb4DojoIndex.kyu3: return "3 Kyu"
                case Rb4DojoIndex.kyu2: return "2 Kyu"
                case Rb4DojoIndex.kyu1: return "1 Kyu"
                case Rb4DojoIndex.dan1: return "1 Dan"
                case Rb4DojoIndex.dan2: return "2 Dan"
                case Rb4DojoIndex.dan3: return "3 Dan"
                case Rb4DojoIndex.dan4: return "4 Dan"
                case Rb4DojoIndex.dan5: return "5 Dan"
                case Rb4DojoIndex.dan6: return "6 Dan"
                case Rb4DojoIndex.dan7: return "7 Dan"
                case Rb4DojoIndex.dan8: return "8 Dan"
                case Rb4DojoIndex.shihandai: return "Assistant Master"
                case Rb4DojoIndex.shihan: return "Master"
                case Rb4DojoIndex.meiyoshihan: return "Honorary Master"
                case Rb4DojoIndex.saikoshihan: return "Legendary Master"
                default: return classcheck.examination?.name
            }
        } else if (isVersion(classcheck, 5)) {
            switch (classcheck.class) {
                case Rb5ClasscheckIndex.class0: return "CLASS 0"
                case Rb5ClasscheckIndex.kiwami: return "EXTREME"
                default: return undefined
            }
        } else {
            switch (classcheck.class) {
                case Rb6ClasscheckIndex.class0: return "CLASS 0"
                case Rb6ClasscheckIndex.kiwami: return "EXTREME"
                default: return undefined
            }
        }
    })
    readonly classcheckNameMain = computed(() => {
        const classcheck = this.classcheck()
        if (isVersion(classcheck, 4)) {
            switch (classcheck.class) {
                case Rb4DojoIndex.kyu5: return "五級"
                case Rb4DojoIndex.kyu4: return "四級"
                case Rb4DojoIndex.kyu3: return "三級"
                case Rb4DojoIndex.kyu2: return "二級"
                case Rb4DojoIndex.kyu1: return "一級"
                case Rb4DojoIndex.dan1: return "一段"
                case Rb4DojoIndex.dan2: return "二段"
                case Rb4DojoIndex.dan3: return "三段"
                case Rb4DojoIndex.dan4: return "四段"
                case Rb4DojoIndex.dan5: return "五段"
                case Rb4DojoIndex.dan6: return "六段"
                case Rb4DojoIndex.dan7: return "七段"
                case Rb4DojoIndex.dan8: return "八段"
                case Rb4DojoIndex.shihandai: return "師範代"
                case Rb4DojoIndex.shihan: return "師範"
                case Rb4DojoIndex.meiyoshihan: return "名誉師範"
                case Rb4DojoIndex.saikoshihan: return "最高師範"
                default: return classcheck.examination?.nameOrig
            }
        } else if (isVersion(classcheck, 5)) {
            switch (classcheck.class) {
                case Rb5ClasscheckIndex.class0: return "CLASS 零"
                case Rb5ClasscheckIndex.kiwami: return "極"
                case Rb5ClasscheckIndex.class11:
                case Rb5ClasscheckIndex.class12:
                case Rb5ClasscheckIndex.class13: return `CLASS ${25 - classcheck.class}`
                default: return `CLASS ${Rb5ClasscheckIndex.class0 - classcheck.class}`
            }
        } else {
            switch (classcheck.class) {
                case Rb6ClasscheckIndex.class0: return "CLASS 零"
                case Rb6ClasscheckIndex.kiwami: return "極"
                default: return `CLASS ${Rb6ClasscheckIndex.class0 - classcheck.class}`
            }
        }
    })
    readonly clearInfoSub = computed(() => {
        const classcheck = this.classcheck()
        if (!isVersion(classcheck, 4)) return undefined
        if (classcheck.class < Rb4DojoIndex.examination) {
            if (classcheck.clearType > 1) return "CLASSCHECK CLEAR"
            return "CLASSCHECK FAILED"
        }
        if (!classcheck.examination) return undefined
        const examination = classcheck.examination
        const score = classcheck.totalScore
        if (score >= examination.scoreBorderA) return "EXAMINATION RANK A"
        else if (score >= examination.scoreBorderB) return "EXAMINATION RANK B"
        else if (score >= examination.scoreBorderC) return "EXAMINATION RANK C"
        else if (score >= examination.scoreBorderD) return "EXAMINATION RANK D"
        return "Rank F"
    })
    readonly clearInfoMain = computed(() => {
        const classcheck = this.classcheck()
        if (isVersion(classcheck, 4)) {
            if (classcheck.class < Rb4DojoIndex.examination || !classcheck.examination) {
                if (classcheck.clearType > 1) return "認定試験　合格"
                return "認定試験　不合格"
            }
            const examination = classcheck.examination
            const score = classcheck.totalScore
            if (score >= examination.scoreBorderA) return "検定試験　秀"
            else if (score >= examination.scoreBorderB) return "検定試験　優"
            else if (score >= examination.scoreBorderC) return "検定試験　良"
            else if (score >= examination.scoreBorderD) return "検定試験　可"
            return "検定試験　不可"
        } else {
            if (classcheck.clearType > 1) return "CLASSCHECK CLEAR"
            return "CLASSCHECK FAILED"
        }
    })
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
        }, 200 + 200 * ((this.classcheck().stageLogs?.length ?? 0) > 3 ? 4 : 3))
    }    
}

function isVersion<T extends RbVersionWithClasscheck>(classcheck: RbClasscheckResponse<RbVersionWithClasscheck>, version: T): classcheck is RbClasscheckResponse<T> {
    return classcheck.version === version
}
