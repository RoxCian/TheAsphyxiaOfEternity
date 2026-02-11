import { Component, ElementRef, ViewEncapsulation, computed, effect, input } from "@angular/core"
import { RbLevelDisplayService } from "../../../../services/specified/rb-level-display.service"
import { RbVersion } from "server/models/shared/web"

@Component({
    selector: "rb-level",
    templateUrl: "./rb-level-prompt.component.html",
    styleUrls: ["./rb-level-prompt.component.sass"],
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class RbLevelPromptComponent<TVersion extends RbVersion> {
    readonly version = input.required<TVersion>()
    readonly level = input.required<number>()
    readonly skillRate = input<number | undefined>()
    readonly design = input<"default" | "white" | "emphasized">("default")
    readonly hasSkillRate = computed(() => this.version() >= 5 && (this.skillRate() ?? -1) > 0)
    get levelDisplay() {
        return this.levelDisplayService.levelDisplay
    }

    constructor(private readonly levelDisplayService: RbLevelDisplayService, element: ElementRef<HTMLElement>) {
        let designClass: string | undefined
        let versionClass: string | undefined
        const cl = element.nativeElement.classList
        effect(() => {
            if (designClass) cl.remove(designClass)
            if (versionClass) cl.remove(versionClass)
            designClass = `is-${this.design()}`
            versionClass = `is-rb${this.version()}`
            cl.add(designClass)
            cl.add(versionClass)
        })
    }
}
