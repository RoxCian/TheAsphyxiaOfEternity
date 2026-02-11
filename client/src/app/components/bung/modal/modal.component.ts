import { Component, input, isSignal, model, ViewEncapsulation } from "@angular/core"
import { toggleTransform } from "../../../signals/transforms"
import { BungPopupComponent } from "../popup/popup.component"
import { BungInsertionContent, BungInsertionContentOrComputation } from "../../../utils/bung"

@Component({
    selector: "bung-modal",
    templateUrl: "./modal.component.html",
    styleUrl: "./modal.component.sass",
    standalone: false,
    encapsulation: ViewEncapsulation.None,
    host: {
        "[class.modal]": "true",
        "[class.is-active]": "true",
        "[class.use-default-popup-animation]": "true",
        "[class.has-delete]": "isCard()",
    }
})
export class BungModalComponent<TReturn> extends BungPopupComponent<TReturn> {
    readonly header = model<BungInsertionContent>()
    readonly headerContext = model<any>()
    readonly isCard = input(false, { transform: toggleTransform })

    protected isSignal(value: BungInsertionContentOrComputation): value is (() => BungInsertionContent) {
        return isSignal(value)
    }
}
