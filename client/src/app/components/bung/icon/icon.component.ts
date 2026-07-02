import { Component, SecurityContext, ViewEncapsulation, computed, inject, input } from "@angular/core"
import { toggleTransform } from "../../../signals/transforms"
import { DomSanitizer } from "@angular/platform-browser"
import { iconUrlToSvg } from "../../../utils/bung-svg-util"

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
