import { Component, ViewEncapsulation, input } from "@angular/core"
import { size, sizeTransform } from "../../../signals/transforms"

@Component({
    selector: "bung-loader",
    template: "",
    styleUrls: ["./loader.component.sass"],
    encapsulation: ViewEncapsulation.None,
    host: { "[style.--size]": "size()" },
    standalone: false
})
export class BungLoaderComponent {
    readonly size = input<size, size>("1em", { transform: sizeTransform })
}
