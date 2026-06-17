import { Service, Signal } from "@angular/core"
import { BungPopupService } from "./popup.service"
import { BulmaColor, BungInsertionContentOrComputation, BungPopupOptions, BungPopupOptionsBase } from "../../utils/bung"
import { BungNotificationComponent } from "../../components/bung/notification/notification.component"

@Service()
export class BungNotificationService extends BungPopupService {
    protected override readonly defaultPopupOptions: BungPopupOptionsBase = {
        layer: "bung-notification",
        duration: 5000,
        backdropOptions: {
            hasBackdrop: false
        },
        isManual: false
    }

    notify<TReturn = any>(data: BungInsertionContentOrComputation, color?: BulmaColor, context?: any | Signal<any>, options?: BungPopupOptions<BungNotificationComponent<TReturn>, TReturn>): BungNotificationComponent<TReturn> {
        if (color) {
            options = Object.assign({}, options)
            const setter = options.setter
            options.setter = popup => {
                popup.color.set(color)
                setter?.(popup)
            }
        }
        return super.popup(data, context, BungNotificationComponent, options)
    }
}
