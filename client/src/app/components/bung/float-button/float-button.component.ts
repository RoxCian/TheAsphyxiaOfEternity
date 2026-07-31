import { AnimationCallbackEvent, Component, ElementRef, inject, OnDestroy, OnInit, output, signal, ViewEncapsulation } from "@angular/core"
import { BungFloatButtonService } from "../../../services/bung/float-button.service"
import { timeout } from "../../../utils/functions"

@Component({
    selector: "button[bungFloatButton]",
    standalone: false,
    templateUrl: "./float-button.component.html",
    styleUrl: "./float-button.component.sass",
    encapsulation: ViewEncapsulation.None,
    host: {
        "[class.button]": "true",
        "(animate.leave)": "onLeave($event)"
    }
})
export class BungFloatButtonComponent implements OnInit {
    private readonly attrsInternal = signal<Record<string, string | undefined>>({})
    readonly attrs = this.attrsInternal.asReadonly()
    readonly element = inject<ElementRef<HTMLElement>>(ElementRef)
    private readonly service = inject(BungFloatButtonService)
    private isLeaving = false
    ngOnInit() {
        this.service.register(this)
    }
    destroy() {
        if (this.isLeaving) return
        this.isLeaving = true
        this.service.unregister(this)
    }
    protected async onLeave(e: AnimationCallbackEvent) {
        if (this.isLeaving) return
        this.isLeaving = true
        await this.service.unregister(this)
        e.animationComplete()
    }
}
