import { Injectable, Signal } from "@angular/core"
import { BungPopupService } from "./popup.service"
import { BungInsertionContentOrComputation, BungPopupOptions, BungPopupOptionsBase } from "../../utils/bung"
import { BungNotificationComponent } from "../../components/bung/notification/notification.component"

@Injectable({
    providedIn: "root"
})
export class BungNotificationService extends BungPopupService {
    protected override readonly defaultPopupOptions: BungPopupOptionsBase = {
        layer: "bung-notification",
        duration: 5000,
        backdropOptions: {
            hasBackdrop: false
        },
        isManual: false
    }

    notify<TReturn = any>(data: BungInsertionContentOrComputation, context: any | Signal<any>, options?: BungPopupOptions<BungNotificationComponent<TReturn>, TReturn>): BungNotificationComponent<TReturn> {
        return super.popup(data, context, BungNotificationComponent, options)
    }
}
