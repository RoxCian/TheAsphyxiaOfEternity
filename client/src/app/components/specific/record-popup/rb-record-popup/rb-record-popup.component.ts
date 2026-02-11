import { Component, ElementRef, model, signal } from "@angular/core"
import { BungPopupComponent } from "../../../bung/popup/popup.component"
import { RbVersion, RbMusicRecordResponse, RbChartType } from "server/models/shared/web"

@Component({
    selector: "rb-record-popup",
    templateUrl: "./rb-record-popup.component.html",
    styleUrls: ["./rb-record-popup.component.sass"],
    host: {
        "[class.use-default-popup-leave-animation]": "true"
    },
    standalone: false
})
export class RbRecordPopupComponent<TVersion extends RbVersion> extends BungPopupComponent<void> {
    readonly record = model<RbMusicRecordResponse<TVersion>>({} as RbMusicRecordResponse<TVersion>)
    readonly chartType = model<RbChartType<TVersion> | undefined>(0 as RbChartType<TVersion>)
    readonly recordPanelElement = signal<ElementRef<HTMLElement> | undefined>(undefined)
}
