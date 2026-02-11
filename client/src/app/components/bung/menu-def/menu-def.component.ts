import { Component, contentChildren, input, ViewEncapsulation } from "@angular/core"
import { BungMenuItemComponent } from "../menu-item/menu-item.component"

export type BungMenuDef = BungMenuDefComponent | BungMenuItemComponent[] | readonly BungMenuItemComponent[]
export type BungMenuDefOrComputation = BungMenuDef | (() => BungMenuDef)

@Component({
    selector: "bung-menu-def",
    template: "<ng-content />",
    styleUrls: ["./menu-def.component.sass"],
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class BungMenuDefComponent {
    readonly items = contentChildren(BungMenuItemComponent)
    readonly class = input("")
}
