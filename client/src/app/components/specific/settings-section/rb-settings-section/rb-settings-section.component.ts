import { Component, input } from "@angular/core"

@Component({
    selector: "rb-settings-section",
    templateUrl: "./rb-settings-section.component.html",
    styleUrl: "./rb-settings-section.component.sass",
    standalone: false,
})
export class RbSettingsSectionComponent {
    readonly name = input.required<string>()
}
