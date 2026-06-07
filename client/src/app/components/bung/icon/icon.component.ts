import { Component, SecurityContext, ViewEncapsulation, computed, inject, input } from "@angular/core"
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
    readonly isLayoutReversed = input(false, { transform: toggleTransform })
    protected readonly iconClass = computed(() => this.iconSet() === "fas" ? `fas fa-${this.icon()}` : `${this.iconSet()} ${this.iconSet()}-${this.icon()}`)
    protected readonly iconUrlSanitized = computed(() => this.iconUrl() ? this.sanitizer.bypassSecurityTrustUrl(this.sanitizer.sanitize(SecurityContext.RESOURCE_URL, this.iconUrl()!) ?? "") : undefined)
    protected readonly iconFetched = computed(async () => this.iconUrl() ? await iconUrlToSvg(this.iconUrl()!, this.sanitizer) : undefined)
    private readonly sanitizer = inject(DomSanitizer)
}

type IconSet = "fas" | "mdi" | "ion"
const svgCollection: Record<string, string> = {}
async function iconUrlToSvg(url: string, sanitizer: DomSanitizer): Promise<SVGElement | undefined> {
    let iconText: string | undefined
    if (svgCollection[url]) iconText = svgCollection[url]
    else {
        const sanitized = sanitizer.sanitize(SecurityContext.URL, url)
        if (!sanitized) return undefined
        const iconResponse = await fetch(sanitized)
        iconText = (await iconResponse.text())?.match(/<svg(| [^>]+)>[\s\S]+<\/svg>/)?.[0]
        if (iconText) sanitizer.sanitize(SecurityContext.HTML, iconText)
        if (!iconText) return undefined
        svgCollection[url] = iconText
    }
    const el = document.createElement("div")
    el.innerHTML = iconText
    const result = el.querySelector("svg")
    if (result instanceof SVGElement) return result
    return undefined
}