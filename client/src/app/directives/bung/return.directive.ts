import { Directive, ElementRef, computed, input, isSignal, output, signal } from "@angular/core"
import { toggleTransform } from "../../signals/transforms"
import { BungReturnValue } from "../../utils/bung"

@Directive({
    selector: "[bungReturn]",
    host: {
        "[attr.disabled]": "disabled() || isRunning() || undefined",
        "[class.is-loading]": "isLoading()"
    },
    standalone: false
})
export class BungReturnDirective<T> {
    readonly returnValue = input.required<BungReturnValue<T> | undefined>({ alias: "bungReturn" })
    readonly disabled = input(false, { alias: "disabled", transform: toggleTransform })
    readonly isRunning = signal(false)
    readonly isLoading = signal(false)
    readonly isWaitable = computed(() => {
        const returnValue = this.returnValue()
        return returnValue instanceof Promise || isSignal(returnValue) || returnValue instanceof Function
    })
    readonly returned = output()

    constructor(readonly element: ElementRef<HTMLElement>) { }

    asPromise(): Promise<T> {
        const returnValue = this.returnValue()
        if (returnValue instanceof Promise) return returnValue
        else if (isSignal(returnValue)) {
            const signalValue = returnValue()
            if (signalValue instanceof Promise) return signalValue
            return new Promise(res => res(signalValue))
        }
        else if (returnValue instanceof Function) return returnValue()
        return new Promise(res => res(<T>this.returnValue))
    }
    start() {
        this.isRunning.set(true)
    }
    end() {
        this.isRunning.set(false)
    }
}
