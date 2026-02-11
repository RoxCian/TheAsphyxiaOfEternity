import { Component, ElementRef, SecurityContext, ViewEncapsulation, computed, contentChildren, effect, inject, input, signal } from "@angular/core"
import { toggleTransform } from "../../../signals/transforms"
import { DomSanitizer } from "@angular/platform-browser"

@Component({
    selector: "bung-icon",
    templateUrl: "./icon.component.html",
    styleUrls: ["./icon.component.sass"],
    encapsulation: ViewEncapsulation.None,
    host: {
        "[class.icon-text]": "true",
        "[class.no-wrap]": "isNoWrap()",
        "[class.is-reversed]": "isLayoutReversed()"
    },
    standalone: false
})
export class BungIconComponent {
    readonly icon = input("")
    readonly iconUrl = input<string | undefined>()
    readonly iconSet = input<IconSet>("mdi")
    readonly isNoWrap = input(false, { transform: toggleTransform })
    readonly iconClass = computed(() => this.iconSet() === "fas" ? `fas fa-${this.icon()}` : `${this.iconSet()} ${this.iconSet()}-${this.icon()}`)
    readonly iconUrlSanitized = computed(() => this.iconUrl() ? this.sanitizer.bypassSecurityTrustUrl(this.sanitizer.sanitize(SecurityContext.RESOURCE_URL, this.iconUrl()!) ?? "") : undefined)
    readonly iconFetched = computed(async () => this.iconUrl() ? await iconUrlToSvg(this.iconUrl()!, this.sanitizer) : undefined)
    readonly isLayoutReversed = input(false, { transform: toggleTransform })
    private readonly sanitizer = inject(DomSanitizer)
}

type IconSet = "fas" | "mdi" | "ion"
const svgCollection: Record<string, string> = {}
async function iconUrlToSvg(url: string, sanitizer: DomSanitizer): Promise<SVGElement | undefined> {
    let iconText: string | undefined
    if (svgCollection[url]) iconText = svgCollection[url]
    else {
        const iconResponse = await fetch(url)
        iconText = (await iconResponse.text())?.match(/<svg(| [^>]+)>[\s\S]+<\/svg>/)?.[0]
        if (!iconText) return undefined
        svgCollection[url] = iconText
    }
    const el = document.createElement("div")
    el.innerHTML = iconText
    const result = el.querySelector("svg")
    if (result instanceof SVGElement) return result
    return undefined
}