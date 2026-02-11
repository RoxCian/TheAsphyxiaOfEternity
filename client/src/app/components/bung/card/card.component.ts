import { Component, ElementRef, ViewEncapsulation, computed, input, viewChild } from "@angular/core"
import { linkedToggle, toggleTransform } from "../../../signals/transforms"

@Component({
    selector: "bung-card",
    templateUrl: "./card.component.html",
    styleUrls: ["./card.component.sass"],
    encapsulation: ViewEncapsulation.None,
    host: {
        "[class.card]": "true"
    },
    standalone: false
})
export class BungCardComponent {
    readonly isFoldedInput = input(false, { alias: "isFolded", transform: toggleTransform })
    readonly isFolded = linkedToggle(this.isFoldedInput)
    readonly cardContentHeight = computed(() => document.defaultView?.getComputedStyle(this.cardContent()?.nativeElement ?? new HTMLElement()).height ?? "auto")    
    private readonly cardContent = viewChild<ElementRef<HTMLElement>>("cardContent")
}
