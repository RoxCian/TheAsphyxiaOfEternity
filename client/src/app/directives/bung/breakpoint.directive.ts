import { Directive, ElementRef, effect, inject, input } from "@angular/core"
import { BungBreakpoint, BungBreakpointService } from "../../services/bung/breakpoint.service"

@Directive({
    selector: "[bungBreakpoint]",
    standalone: false
})
export class BungBreakpointDirective {
    readonly breakpoint = input<BungBreakpoint | undefined | "">(undefined, { alias: "bungBreakpoint" })

    private readonly element = inject<ElementRef<HTMLElement>>(ElementRef)
    private readonly breakpointService = inject(BungBreakpointService)
    
    #breakpointBackup?: BungBreakpoint
    
    constructor() { 
        effect(() => {
            const listeningBreakpoint = this.breakpoint()
            if (listeningBreakpoint == undefined) return
            const currentBreakpoint = this.breakpointService.breakpoint()
            const cl = this.element.nativeElement.classList
            if (listeningBreakpoint == "") {
                if (this.#breakpointBackup) cl.remove(`is-${this.#breakpointBackup}`)
                cl.add(`is-${currentBreakpoint}`)
            } else if (listeningBreakpoint === currentBreakpoint) cl.add(`is-${currentBreakpoint}`)
            else cl.remove(`is-${listeningBreakpoint}`)
            this.#breakpointBackup = currentBreakpoint
        })
    }
}
