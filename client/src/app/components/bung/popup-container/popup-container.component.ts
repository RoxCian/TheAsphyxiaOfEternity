import { ChangeDetectorRef, Component, Inject, ViewContainerRef, ViewRef, ChangeDetectionStrategy } from "@angular/core"

@Component({
    selector: "bung-popup-container", template: "<ng-content />",
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class BungPopupContainerComponent {
    constructor(readonly container: ViewContainerRef, @Inject(ChangeDetectorRef) readonly view: ViewRef) { }
}
