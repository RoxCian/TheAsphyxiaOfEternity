import { Component, inject } from "@angular/core"
import { Rb3OrderShopService } from "../../../../services/specified/rb3-order-shop.service"

@Component({
    selector: "rb3-order-shop",
    standalone: false,
    templateUrl: "./rb3-order-shop.component.html",
    styleUrl: "./rb3-order-shop.component.sass",
})
export class Rb3OrderShopComponent {
    protected readonly service = inject(Rb3OrderShopService)
}
