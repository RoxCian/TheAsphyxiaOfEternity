import { Component, Signal, ViewEncapsulation, computed, isSignal, model } from "@angular/core"
import { BungPopupComponent } from "../popup/popup.component"

export type BungNotificationFloat = "left" | "top-left" | "top" | "top-right" | "right" | "bottom-right" | "bottom" | "bottom-left" | "none"

@Component({
    selector: "bung-notification",
    templateUrl: "./notification.component.html",
    styleUrls: ["./notification.component.sass"],
    encapsulation: ViewEncapsulation.None,
    host: {
        "[class]": "`popup-${ float() }-${ state() }`",
        "[attr.float]": "float()",
        "[class.notification]": "true",
        "[class.use-default-popup-animation]": "true",
        "[class.is-single-line]": "isSingleLine()",
        "[class.has-delete]": "hasDelete()",
    },
    standalone: false
})
export class BungNotificationComponent<T = any> extends BungPopupComponent<T> {
    readonly isSingleLine = model(false)
    readonly hasDelete = model(false)
    readonly float = model<BungNotificationFloat>("top-right")

    protected isSignal(value: unknown): value is Signal<unknown> {
        return isSignal(value)
    }
}
