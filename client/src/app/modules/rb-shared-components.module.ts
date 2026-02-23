import { CommonModule } from "@angular/common"
import { NgModule } from "@angular/core"
import { BungModule } from "./bung.module"
import { LetsPlayComponent } from "../components/misc/lets-play/lets-play.component"
import { Rb1BadgeComponent } from "../components/specific/badges/rb1-badge/rb1-badge.component"
import { Rb2BadgeComponent } from "../components/specific/badges/rb2-badge/rb2-badge.component"
import { Rb3BadgeComponent } from "../components/specific/badges/rb3-badge/rb3-badge.component"
import { Rb4BadgeComponent } from "../components/specific/badges/rb4-badge/rb4-badge.component"
import { Rb5BadgeComponent } from "../components/specific/badges/rb5-badge/rb5-badge.component"
import { Rb6BadgeComponent } from "../components/specific/badges/rb6-badge/rb6-badge.component";

@NgModule({
    declarations: [
        Rb1BadgeComponent,
        Rb2BadgeComponent,
        Rb3BadgeComponent,
        Rb4BadgeComponent,
        Rb5BadgeComponent,
        Rb6BadgeComponent,
        LetsPlayComponent,
    ],
    imports: [
        CommonModule,
        BungModule,
    ],
    exports: [
        Rb1BadgeComponent,
        Rb2BadgeComponent,
        Rb3BadgeComponent,
        Rb4BadgeComponent,
        Rb5BadgeComponent,
        Rb6BadgeComponent,
        LetsPlayComponent,
    ],
})
export class RbSharedComponentsModule { }
