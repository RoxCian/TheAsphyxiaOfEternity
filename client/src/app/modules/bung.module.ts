import { CommonModule } from "@angular/common"
import { NgModule } from "@angular/core"
import { BungCardComponent } from "../components/bung/card/card.component"
import { BungDividerComponent } from "../components/bung/divider/divider.component"
import { BungIconComponent } from "../components/bung/icon/icon.component"
import { BungInsertionComponent } from "../components/bung/insertion/insertion.component"
import { BungLoaderComponent } from "../components/bung/loader/loader.component"
import { BungMarqueeComponent } from "../components/bung/marquee/marquee.component"
import { BungNotificationComponent } from "../components/bung/notification/notification.component"
import { BungPopupContainerComponent } from "../components/bung/popup-container/popup-container.component"
import { BungTabComponent } from "../components/bung/tab/tab.component"
import { BungTabsComponent } from "../components/bung/tabs/tabs.component"
import { BungBreakpointDirective } from "../directives/bung/breakpoint.directive"
import { BungReturnDirective } from "../directives/bung/return.directive"
import { BungKeyPipe } from "../pipes/bung/key.pipe"
import { BungAsImplicitPipe } from "../pipes/bung/as-implicit.pipe"
import { BungTooltipComponent } from "../components/bung/tooltip/tooltip.component"
import { BungSelectComponent } from "../components/bung/select/select.component"
import { BungOptionComponent } from "../components/bung/option/option.component"
import { BungTooltipDirective } from "../directives/bung/tooltip.directive"
import { BungMenuDefComponent } from "../components/bung/menu-def/menu-def.component"
import { BungMenuItemComponent } from "../components/bung/menu-item/menu-item.component"
import { BungDropdownComponent } from "../components/bung/dropdown/dropdown.component"
import { BungDropdownDirective } from "../directives/bung/dropdown.directive"
import { BungFieldComponent } from "../components/bung/field/field.component"
import { FormField } from "@angular/forms/signals"
import { BungToggleComponent } from "../components/bung/toggle/toggle.component"
import { BungNumberInputComponent } from "../components/bung/number-input/number-input.component"
import { BungModalComponent } from "../components/bung/modal/modal.component"
import { BungModalDirective } from "../directives/bung/modal.directive";
import { BungImgSrcDirective } from '../directives/bung/bung-img-src.directive';
import { ReactiveFormsModule } from "@angular/forms"

@NgModule({
    declarations: [
        BungCardComponent,
        BungTabsComponent,
        BungTabComponent,
        BungInsertionComponent,
        BungMarqueeComponent,
        BungBreakpointDirective,
        BungTooltipDirective,
        BungPopupContainerComponent,
        BungReturnDirective,
        BungNotificationComponent,
        BungModalComponent,
        BungTooltipComponent,
        BungLoaderComponent,
        BungKeyPipe,
        BungAsImplicitPipe,
        BungIconComponent,
        BungDividerComponent,
        BungSelectComponent,
        BungOptionComponent,
        BungMenuDefComponent,
        BungMenuItemComponent,
        BungDropdownComponent,
        BungDropdownDirective,
        BungModalDirective,
        BungFieldComponent,
        BungToggleComponent,
        BungNumberInputComponent,
        BungImgSrcDirective,
    ],
    imports: [
        CommonModule,
        FormField
    ],
    exports: [
        BungCardComponent,
        BungTabsComponent,
        BungTabComponent,
        BungInsertionComponent,
        BungMarqueeComponent,
        BungBreakpointDirective,
        BungTooltipDirective,
        BungPopupContainerComponent,
        BungReturnDirective,
        BungModalDirective,
        BungLoaderComponent,
        BungKeyPipe,
        BungAsImplicitPipe,
        BungIconComponent,
        BungDividerComponent,
        BungSelectComponent,
        BungOptionComponent,
        BungMenuDefComponent,
        BungMenuItemComponent,
        BungDropdownDirective,
        BungFieldComponent,
        BungToggleComponent,
        BungNumberInputComponent,
        BungImgSrcDirective,
    ],
})
export class BungModule { }
