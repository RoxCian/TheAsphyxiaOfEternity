import { ChangeDetectorRef, Component, Inject, ViewContainerRef, ViewRef } from "@angular/core"

@Component({
    selector: "bung-popup-container", template: "<ng-content />",
    standalone: false
})
export class BungPopupContainerComponent {
    constructor(readonly container: ViewContainerRef, @Inject(ChangeDetectorRef) readonly view: ViewRef) { }
}
