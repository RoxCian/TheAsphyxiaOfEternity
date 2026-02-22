import { Component, computed, inject, input, signal } from "@angular/core"
import { Rb4DojoIndex, Rb5ClasscheckIndex, Rb6ClasscheckIndex, RbPlayerResponse } from "rbweb"
import { BungBreakpointService } from "../../../../services/bung/breakpoint.service"
import { RbSubpageService } from "../../../../services/specified/rb-subpage.service"
import { RbPlayDataSubpage } from "../../../../pages/profile/play-data/play-data.component"
import { RbSettingsSubpage } from "../../../../pages/profile/settings/settings.component"

const profileSubpages = {
    playData: RbPlayDataSubpage,
    settings: RbSettingsSubpage
} as const

@Component({
    selector: "rb-player-card",
    templateUrl: "./rb-player-card.component.html",
    styleUrl: "./rb-player-card.component.sass",
    standalone: false
})
export class RbPlayerCardComponent {
    readonly profile = input.required<RbPlayerResponse | undefined>()
    readonly isLoading = input(true)
    readonly className = computed(() => {
        const profile = this.profile()
        if (profile?.version !== 4 && profile?.version !== 5 && profile?.version !== 6) return undefined
        if (profile.version === 4) {
            switch (profile.class) {
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
                default: return undefined
            }
        } else if (profile.version === 5) {
            switch (profile.class) {
                case Rb5ClasscheckIndex.none: case undefined: return undefined
                case Rb5ClasscheckIndex.class0: return "零"
                case Rb5ClasscheckIndex.kiwami: return "極"
                case Rb5ClasscheckIndex.class11:
                case Rb5ClasscheckIndex.class12:
                case Rb5ClasscheckIndex.class13: return `${25 - profile.class}`
                default: return `${Rb5ClasscheckIndex.class0 - profile.class}`
            }
        } else {
            switch (profile.class) {
                case Rb6ClasscheckIndex.none: case undefined: return undefined
                case Rb6ClasscheckIndex.class0: return "零"
                case Rb6ClasscheckIndex.kiwami: return "極"
                default: return `${Rb6ClasscheckIndex.class0 - profile.class}`
            }
        }
    })
    protected readonly isImageLoaded = signal(false)
    protected readonly breakpointService = inject(BungBreakpointService)

    private readonly subpageService = inject(RbSubpageService)
    protected readonly subpageIndex = computed(() => {
        const s = this.subpageService.componentType()
        return (Object.keys(profileSubpages) as (keyof typeof profileSubpages)[]).find(k => profileSubpages[k] === s)
    })

    protected readonly fakeVersionArray = computed(() => [{ version: this.profile()?.version }])

    protected toRb3PlayerEventLevel(value?: number) {
        if (value == undefined) return 0
        if ((value | 1) !== value) return 0
        if ((value | 2) !== value) return 1
        if ((value | 4) !== value) return 2
        if ((value | 8) !== value) return 3
        if ((value | 16) !== value) return 4
        return 5
    }
    protected onImgLoaded() {
        this.isImageLoaded.set(true)
    }
    protected onNavToSubpage(index: keyof typeof profileSubpages) {
        this.subpageService.componentType.set(profileSubpages[index])
    }
}
