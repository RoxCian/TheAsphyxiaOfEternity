import { Component, computed, inject, input } from "@angular/core"
import { DomSanitizer } from "@angular/platform-browser"
import { iconUrlToSvg } from "../../../../utils/bung-svg-util"
import { Rb2GlassResponse } from "rbweb"
import { Rb2GlassesService } from "../../../../services/specified/rb2-glasses.service"

@Component({
    selector: "rb2-glass",
    standalone: false,
    templateUrl: "./rb2-glass.component.html",
    styleUrls: ["./rb2-glass.component.sass", "./rb2-glass-svg-styles.sass"],
})
export class Rb2GlassComponent {
    private readonly sanitizer = inject(DomSanitizer)
    readonly glass = input.required<Rb2GlassResponse>()
    protected readonly iconElement = computed(() => this.glass().glass ? iconUrlToSvg(`static/assets/images/glass/${this.glass().glass!.imageId}.svg`, this.sanitizer) : undefined)
    protected readonly layer = computed(() => this.glass().glass?.layer)
    protected readonly progress = computed(() => this.glass().glass ? Math.min(Math.max(this.glass().experiences / this.glass().glass!.experiences, 0), 1) : 0)

    protected readonly service = inject(Rb2GlassesService)

    processSvg(el?: SVGElement | null): SVGElement | undefined {
        if (!el || !this.glass().glass) return el ?? undefined
        const mask = el.querySelector("mask")
        const fluids = el.querySelector(".fluids")
        mask!.id += `-${this.glass().glass!.id}`
        fluids!.setAttribute("mask", `url(#${mask!.id})`)
        return el
    }
}
