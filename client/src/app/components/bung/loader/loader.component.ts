import { Component, ViewEncapsulation, input, ChangeDetectionStrategy } from "@angular/core"
import { size, sizeTransform } from "../../../signals/transforms"

@Component({
    selector: "bung-loader",
    template: "",
    styleUrls: ["./loader.component.sass"],
    encapsulation: ViewEncapsulation.None,
    host: { "[style.--size]": "size()" },
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class BungLoaderComponent {
    readonly size = input<size, size>("1em", { transform: sizeTransform })
}
