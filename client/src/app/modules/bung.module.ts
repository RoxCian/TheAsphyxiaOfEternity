import { CommonModule } from "@angular/common"
import { NgModule } from "@angular/core"
import { FormField } from "@angular/forms/signals"

import { BungCardComponent } from "../components/bung/card/card.component"
import { BungDividerComponent } from "../components/bung/divider/divider.component"
import { BungDropdownComponent } from "../components/bung/dropdown/dropdown.component"
import { BungFieldComponent } from "../components/bung/field/field.component"
import { BungFloatButtonComponent } from "../components/bung/float-button/float-button.component"
import { BungIconComponent } from "../components/bung/icon/icon.component"
import { BungInsertionComponent } from "../components/bung/insertion/insertion.component"
import { BungMarqueeComponent } from "../components/bung/marquee/marquee.component"
import { BungMenuDefComponent } from "../components/bung/menu-def/menu-def.component"
import { BungMenuItemComponent } from "../components/bung/menu-item/menu-item.component"
import { BungModalComponent } from "../components/bung/modal/modal.component"
import { BungNotificationComponent } from "../components/bung/notification/notification.component"
import { BungNumberInputComponent } from "../components/bung/number-input/number-input.component"
import { BungPopupContainerComponent } from "../components/bung/popup-container/popup-container.component"
import { BungSelectComponent } from "../components/bung/select/select.component"
import { BungTabComponent } from "../components/bung/tab/tab.component"
import { BungTabsComponent } from "../components/bung/tabs/tabs.component"
import { BungToggleComponent } from "../components/bung/toggle/toggle.component"
import { BungTooltipComponent } from "../components/bung/tooltip/tooltip.component"
import { BungOptionComponent } from "../components/bung/option/option.component"

import { BungBreakpointDirective } from "../directives/bung/breakpoint.directive"
import { BungDropdownDirective } from "../directives/bung/dropdown.directive"
import { BungImgSrcDirective } from "../directives/bung/img-src.directive"
import { BungModalDirective } from "../directives/bung/modal.directive"
import { BungReturnDirective } from "../directives/bung/return.directive"
import { BungTooltipDirective } from "../directives/bung/tooltip.directive"

import { BungAsImplicitPipe } from "../pipes/bung/as-implicit.pipe"
import { BungKeyPipe } from "../pipes/bung/key.pipe"

@NgModule({
    declarations: [
        BungCardComponent,
        BungDividerComponent,
        BungDropdownComponent,
        BungFieldComponent,
        BungFloatButtonComponent,
        BungIconComponent,
        BungInsertionComponent,
        BungMarqueeComponent,
        BungMenuDefComponent,
        BungMenuItemComponent,
        BungModalComponent,
        BungNotificationComponent,
        BungNumberInputComponent,
        BungOptionComponent,
        BungPopupContainerComponent,
        BungSelectComponent,
        BungTabsComponent,
        BungTabComponent,
        BungToggleComponent,
        BungTooltipComponent,
        BungBreakpointDirective,
        BungDropdownDirective,
        BungModalDirective,
        BungImgSrcDirective,
        BungReturnDirective,
        BungTooltipDirective,
        BungAsImplicitPipe,
        BungKeyPipe,
    ],
    imports: [
        CommonModule,
        FormField
    ],
    exports: [
        BungCardComponent,
        BungDividerComponent,
        BungFieldComponent,
        BungFloatButtonComponent,
        BungIconComponent,
        BungInsertionComponent,
        BungMarqueeComponent,
        BungMenuDefComponent,
        BungMenuItemComponent,
        BungModalDirective,
        BungNumberInputComponent,
        BungOptionComponent,
        BungSelectComponent,
        BungTabsComponent,
        BungTabComponent,
        BungToggleComponent,
        BungBreakpointDirective,
        BungDropdownDirective,
        BungImgSrcDirective,
        BungReturnDirective,
        BungTooltipDirective,
        BungAsImplicitPipe,
        BungKeyPipe,
    ],
})
export class BungModule { }
