import { Directive, ElementRef, inject, input, inputBinding, output, OutputRefSubscription } from "@angular/core"
import { BungInsertionContent, BungPopupOptions } from "../../utils/bung"
import { BungModalComponent } from "../../components/bung/modal/modal.component"
import { BungModalService } from "../../services/bung/modal.service"
import { toggleTransform } from "../../signals/transforms"

@Directive({
    selector: "[bungModal], [bungModalTrigger]",
    standalone: false
})
export class BungModalDirective<TReturn> {
    readonly header = input<BungInsertionContent>()
    readonly headerContext = input<any>()
    readonly body = input<BungInsertionContent>()
    readonly bodyContext = input<any>()
    readonly options = input<BungPopupOptions<BungModalComponent<TReturn>>>()
    readonly isCard = input(false, { transform: toggleTransform })
    readonly returned = output<TReturn>()

    readonly hostElement = inject<ElementRef<HTMLElement>>(ElementRef)

    private readonly modalService = inject(BungModalService)
    private readonly clickEventHandler = (e: MouseEvent) => e.button === 0 ? this.open() : undefined
    private readonly cleanEventHandler = () => {
        this.#componentCloseHandle?.unsubscribe()
        this.#componentCloseHandle = undefined
        this.#componentReturnedHandle?.unsubscribe()
        this.#componentReturnedHandle = undefined
        this.#component = undefined
    }

    #component?: BungModalComponent<TReturn>
    #componentCloseHandle?: OutputRefSubscription
    #componentReturnedHandle?: OutputRefSubscription

    constructor() {
        this.hostElement.nativeElement.addEventListener("click", this.clickEventHandler)
    }
    ngOnDestroy() {
        this.dispose()
    }
    open() {
        if (this.#component) return
        const options = this.options() ?? {}
        const bindings = options.bindings ?? []
        bindings.push(inputBinding("isCard", this.isCard))
        options.bindings = bindings
        this.#component = this.modalService.modal(this.header, this.body, this.headerContext, this.bodyContext, options)
        this.#componentCloseHandle = this.#component.closed.subscribe(this.cleanEventHandler)
        this.#componentReturnedHandle = this.#component.returned.subscribe(v => this.returned.emit(v))
    }
    close() {
        if (!this.#component) return
        if (this.#component.state() !== "show") {
            // open event not happened
            const ref = this.#component.opening.subscribe(ev => {
                ev.isCanceled = true
                ref.unsubscribe()
            })
        }
        this.#component.close()
    }
    dispose() {
        this.hostElement.nativeElement.removeEventListener("click", this.clickEventHandler)
        this.close()
        this.cleanEventHandler()
    }
}
