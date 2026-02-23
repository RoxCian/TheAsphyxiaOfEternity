import { CommonModule } from "@angular/common"
import { BungModule } from "../../modules/bung.module"
import { Component, computed, signal } from "@angular/core"
import { httpResource } from "@angular/common/http"
import { RouterLink } from "@angular/router"

@Component({
    selector: "dev-home",
    imports: [BungModule, CommonModule, RouterLink],
    templateUrl: "./dev-home.component.html",
    styleUrl: "./dev-home.component.sass",
})
export class DevHomePageComponent {
    protected readonly version = httpResource.text(() => "/dev/version")
    protected readonly debugRid = httpResource.text(() => "/dev/debug-rid")
    protected readonly rid = signal<string | undefined>(undefined)
    protected readonly isRidInputValid = computed(() => !this.rid() || this.rid()!.match(/^[a-fA-F0-9]{16}$/))
}
