import { Component, ElementRef, contentChildren, effect, inject, input, model, output, signal, viewChildren } from "@angular/core"
import { BungInsertionContent, BungPopupState, BungReturnContext } from "../../../utils/bung"
import { BungReturnDirective } from "../../../directives/bung/return.directive"
import { toggle, toggleTransform } from "../../../signals/transforms"

export type PopupEvent = {
    isCanceled: boolean
}

@Component({
    template: "",
    host: {
        "[class]": "`popup-${ state() } ${ state() }`",
    },
    standalone: false
})
export abstract class BungPopupComponent<T = any> {
    readonly duration = model(5000)
    readonly returnContext = model<BungReturnContext<T>>()
    readonly content = model<BungInsertionContent>()
    readonly context = model<any>()
    readonly noExitAnimation = input<boolean, toggle>(false, { transform: toggleTransform })

    readonly result = signal<T | undefined>(undefined)
    readonly state = signal<BungPopupState>("in")
    readonly isReturned = signal(false)

    get classList(): DOMTokenList {
        return this.element.nativeElement.classList
    }

    readonly opening = output<PopupEvent>()
    readonly opened = output()
    readonly resetting = output()
    readonly closing = output<PopupEvent>()
    readonly closed = output<this>()
    readonly returned = output<T>()
    readonly returnRejected = output<{ reason: any, ref: BungReturnDirective<T> }>()

    protected readonly returnContentRefs = contentChildren(BungReturnDirective, { descendants: true })
    protected readonly returnViewRefs = viewChildren(BungReturnDirective)

    readonly element: ElementRef<HTMLElement> = inject(ElementRef)

    #closeTimeoutIndex?: number
    #taskFlag = false // prevent timeout index be changed while a task processing
    #closed = false

    constructor() {
        this.element.nativeElement.style.opacity = "0"
        this.element.nativeElement.addEventListener("animationend", e => this.onAnimationFinished(e))
        effect(() => this.returnContentRefs().forEach(r => r.element.nativeElement.addEventListener("click", () => this.onReturnRefClick(r))))
        effect(() => this.returnViewRefs().forEach(r => r.element.nativeElement.addEventListener("click", () => this.onReturnRefClick(r))))
        effect(() => this.generateTimeout(this.duration()))
    }

    open() {
        if (this.#closed || this.state() === "out") return
        const event: PopupEvent = { isCanceled: false }
        this.opening.emit(event)
        if (event.isCanceled) return
        this.element.nativeElement.style.opacity = ""
        this.state.set("show")
        if (this.duration() != Infinity) {
            if (this.#closeTimeoutIndex) window.clearTimeout(this.#closeTimeoutIndex)
            this.#closeTimeoutIndex = this.#taskFlag ? undefined : window.setTimeout(() => this.close(), this.duration())
        }
        this.opened.emit()
    }
    close() {
        const event: PopupEvent = { isCanceled: false }
        this.closing.emit(event)
        if (event.isCanceled) return
        this.isReturned.set(true)
        window.clearTimeout(this.#closeTimeoutIndex)
        this.#closeTimeoutIndex = undefined
        this.state.set("out")
        this.element.nativeElement.getAnimations().forEach(a => !a.id.startsWith("bung-hide-") ? a.finish() : undefined)
        if (this.noExitAnimation()) this.dispose()
        else window.setTimeout(() => {
            if (!this.#closed) this.dispose()
        }, 5000)
    }
    reset() {
        this.state.set("in")
        this.isReturned.set(false)
        this.result.set(undefined)
        window.clearTimeout(this.#closeTimeoutIndex)
        this.#closeTimeoutIndex = undefined
        this.#taskFlag = false
        this.resetting.emit()
    }
    waitResult(): Promise<T> {
        return new Promise<T>(resolve => this.returned.subscribe(v => resolve(v)))
    }
    protected onAnimationFinished(event: AnimationEvent) {
        if (event.animationName.startsWith("bung-hide-")) this.dispose()
    }
    private dispose() {
        if (this.#closed) return
        this.element.nativeElement.remove()
        this.closed.emit(this)
        this.#closed = true
    }
    private generateTimeout(timeout: number) {
        if (this.#closeTimeoutIndex) {
            window.clearTimeout(this.#closeTimeoutIndex)
            this.#closeTimeoutIndex = window.setTimeout(() => this.close(), timeout)
        }
    }
    private async onReturnRefClick(ref: BungReturnDirective<T>) {
        if (ref.disabled() || this.isReturned()) return
        window.clearTimeout(this.#closeTimeoutIndex)
        this.#closeTimeoutIndex = undefined
        if (!ref.isWaitable()) {
            this.isReturned.set(true)
            this.result.set(ref.returnValue() as T)
            ref.returned.emit()
            this.returned.emit(ref.returnValue() as T)
            this.close()
            return
        }
        ref.isLoading.set(true)
        this.disableAllReturnRefs()
        const task = ref.asPromise()
        this.#taskFlag = true
        try {
            const result = await task
            if (!this.isReturned() && this.#taskFlag) {
                this.result.set(result)
                this.returned.emit(result)
            }
            this.close()
        } catch (ex) {
            if (ex instanceof Error) {
                this.returnRejected.emit({ reason: ex.message, ref })
                if (this.duration() != Infinity) this.#closeTimeoutIndex = window.setTimeout(() => this.close(), this.duration())
            }
        } finally {
            ref.isLoading.set(false)
            this.restoreAllReturnRefs()
            this.#taskFlag = false
        }
    }
    private disableAllReturnRefs(except?: BungReturnDirective<T>) {
        for (const ref of this.returnContentRefs()) if (ref !== except) ref.start()
        for (const ref of this.returnViewRefs()) if (ref !== except) ref.start()
    }
    private restoreAllReturnRefs(except?: BungReturnDirective<T>) {
        for (const ref of this.returnContentRefs()) if (ref !== except) ref.end()
        for (const ref of this.returnViewRefs()) if (ref !== except) ref.end()
    }
}
