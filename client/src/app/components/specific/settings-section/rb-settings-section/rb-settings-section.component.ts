import { Component, input, ChangeDetectionStrategy } from "@angular/core"

@Component({
    selector: "rb-settings-section",
    templateUrl: "./rb-settings-section.component.html",
    styleUrl: "./rb-settings-section.component.sass",
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
})
export class RbSettingsSectionComponent {
    readonly name = input.required<string>()
}
