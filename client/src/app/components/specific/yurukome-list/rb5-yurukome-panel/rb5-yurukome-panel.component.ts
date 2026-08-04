import { Component, effect, inject, input, viewChild } from "@angular/core"
import { Rb5YurukomeResponse } from "rbweb"
import { RbLanguageService } from "../../../../services/specified/rb-language.service"
import { BungMarqueeComponent } from "../../../bung/marquee/marquee.component"

@Component({
    selector: "rb5-yurukome-panel",
    standalone: false,
    templateUrl: "./rb5-yurukome-panel.component.html",
    styleUrl: "./rb5-yurukome-panel.component.sass",
})
export class Rb5YurukomePanelComponent {
    readonly yurukome = input.required<Rb5YurukomeResponse>()
    private readonly langService = inject(RbLanguageService)
    private readonly titleMarquee = viewChild(BungMarqueeComponent)
    private langBackup?: "en" | "orig"

    constructor() {
        effect(() => {
            const lang = this.langService.currentLanguage()
            if (this.langBackup !== lang) {
                this.langBackup = lang
                if (this.langBackup != undefined) this.titleMarquee()?.markContentUpdated()
            }
        })
    }
}
