import { ApplicationRef, ComponentFactory, ComponentFactoryResolver, ComponentRef, inject, Injectable, Injector, input, inputBinding, isSignal, Signal, Type, ViewContainerRef } from "@angular/core"
import { BungPopupContainerComponent } from "../../components/bung/popup-container/popup-container.component"
import { BungBackdropOptions, BungInsertionContent, BungInsertionContentOrComputation, BungPopupOptions, BungPopupOptionsBase, BungReturnContext, DefaultBackdropOptions } from "../../utils/bung"
import { BungPopupComponent } from "../../components/bung/popup/popup.component"
import { timeout, tryAction } from "../../utils/functions"

type PopupLayer = {
    zIndex: number
    element: HTMLElement
    container: ComponentRef<BungPopupContainerComponent>
}

const popupZIndexOffset = 5000
let currentZIndex = 0

@Injectable({
    providedIn: "root"
})
export class BungPopupService {
    private static readonly layers: { [K in string]: PopupLayer } = {}
    private static popupContainerFactory: ComponentFactory<BungPopupContainerComponent>
    private static readonly popupLayerTop: HTMLElement = document.createElement("div")
    private static initialized = false

    private readonly resolver = inject(ComponentFactoryResolver)
    private readonly injector = inject(Injector)
    private readonly application = inject(ApplicationRef)

    protected readonly defaultPopupOptions: BungPopupOptionsBase = {
        layer: "bung-popup",
        duration: 5000,
        backdropOptions: DefaultBackdropOptions,
        isManual: false
    }

    private static init() {
        if (this.initialized) return
        this.initialized = true
        this.popupLayerTop.classList.add("bung-popup-layer-top")
        document.body.appendChild(this.popupLayerTop)
    }

    constructor() {
        BungPopupService.init()
        BungPopupService.popupContainerFactory ??= this.resolver.resolveComponentFactory(BungPopupContainerComponent)
        BungPopupService.addLayer("bung-popup")
    }
    popup<T extends BungPopupComponent<TReturn>, TReturn = any>(data: BungInsertionContentOrComputation, context: any | Signal<any>, popupType: Type<T>, options?: BungPopupOptions<T, TReturn>): T {
        const o: BungPopupOptions<T, TReturn> = Object.assign(this.defaultPopupOptions, options)
        const backdrop = this.addBackdrop(o.layer ?? "bung-popup", o.backdropOptions)
        const bindings = options?.bindings ?? []
        if (typeof o.duration === "function") bindings.push(inputBinding("duration", o.duration))
        if (typeof data === "function" && !data.toString().startsWith("class ")) bindings.push(inputBinding("content", data as (() => BungInsertionContent)))
        if (isSignal(context)) bindings.push(inputBinding("context", context))
        if (typeof o.values === "function" && !o.values.toString().startsWith("class ")) bindings.push(inputBinding("returnContext", o.values))
        const ref = this.getLayerContainer(o.layer ?? "bung-popup").createComponent(popupType, { injector: this.injector, bindings: options?.bindings })

        const result = ref.instance
        const hostViewAdded = !tryAction(() => this.application.attachView(ref.hostView)).hasError
        if (typeof o.duration === "number") result.duration.set(o.duration)
        if (typeof data !== "function" || data.toString().startsWith("class ")) result.content.set(data as BungInsertionContent)
        if (!isSignal(context)) result.context.set(context)
        if (typeof o.values !== "function" || o.values.toString().startsWith("class ")) result.returnContext.set(o.values as BungReturnContext<TReturn>)
        const closedSubscription = result.closed.subscribe(async () => {
            await timeout()
            ref.destroy()
            if (!hostViewAdded) this.application.detachView(ref.hostView)
            openedSubscription?.unsubscribe()
            closingSubscription.unsubscribe()
            resettingSubscription.unsubscribe()
            closedSubscription.unsubscribe()
        })
        const openedSubscription = backdrop ? result.opened.subscribe(() => this.openBackdrop(backdrop, o.backdropOptions)) : undefined
        const resettingSubscription = result.resetting.subscribe(() => {
            if (backdrop) this.closeBackdrop(backdrop)
        })
        const closingSubscription = result.closing.subscribe(() => {
            if (backdrop) this.closeBackdrop(backdrop)
        })
        if (backdrop && (o.backdropOptions?.clickBackdropToClose ?? true)) {
            function backdropClickHandler(ev: MouseEvent) {
                if (ev.button == 0) {
                    backdrop?.removeEventListener("click", backdropClickHandler)
                    result.close()
                }
            }
            backdrop.addEventListener("click", backdropClickHandler)
        }
        if (o.setter) {
            o.setter(result)
            ref.changeDetectorRef.detectChanges()
        }

        if (!o.isManual) setTimeout(() => {
            result.open()
        }, 0)
        return result
    }
    protected addLayer(layer: string, zIndex?: number) {
        BungPopupService.addLayer(layer, zIndex)
    }
    protected getLayerContainer(layer: string): ViewContainerRef {
        return BungPopupService.getLayerContainer(layer)
    }
    protected addBackdrop(layer: string, options?: BungBackdropOptions): HTMLElement | undefined {
        return BungPopupService.addBackdrop(layer, options)
    }
    protected openBackdrop(backdrop: HTMLElement, options?: BungBackdropOptions) {
        BungPopupService.openBackdrop(backdrop, options)
    }
    protected closeBackdrop(backdrop: HTMLElement) {
        BungPopupService.closeBackdrop(backdrop)
    }
    protected static addLayer(layer: string, zIndex?: number) {
        if (layer in this.layers) return
        if (zIndex == undefined) {
            while (Object.keys(this.layers).some(k => this.layers[k].zIndex === currentZIndex + popupZIndexOffset)) currentZIndex++
            zIndex = currentZIndex
            currentZIndex++
        }
        const layerElement: HTMLElement = document.createElement("div")
        layerElement.classList.add("bung-popup-layer", layer)
        layerElement.style.zIndex = `${zIndex + popupZIndexOffset}`
        this.popupLayerTop.appendChild(layerElement)
        const placeholderElement: HTMLElement = document.createElement("div")
        layerElement.appendChild(placeholderElement)
        const container = this.popupContainerFactory.create(Injector.create({ providers: [] }), undefined, placeholderElement)
        this.layers[layer] = { zIndex, element: layerElement, container }
    }
    protected static getLayerContainer(layer: string): ViewContainerRef {
        if (!(layer in this.layers)) this.addLayer(layer)
        return this.layers[layer]!.container.instance.container
    }
    protected static addBackdrop(layer: string, options?: BungBackdropOptions): HTMLElement | undefined {
        options ??= DefaultBackdropOptions
        if (!(options?.hasBackdrop ?? true)) return undefined
        if (!(layer in this.layers)) this.addLayer(layer)
        const containerElement = this.layers[layer]!.element
        const backdrop = document.createElement("div")
        backdrop.classList.add("bung-backdrop", options.backdropClass!)
        backdrop.style.position = "absolute"
        backdrop.style.inset = "0"
        backdrop.style.background = "#0005"
        backdrop.style.opacity = "0"
        backdrop.style.display = "none"
        if ((options.backdropBlur ?? 5) > 0) backdrop.style.backdropFilter = `blur(${options.backdropBlur}px)`
        backdrop.addEventListener("contextmenu", e => {
            e.preventDefault()
            e.stopImmediatePropagation()
        })

        containerElement.appendChild(backdrop)
        return backdrop
    }
    protected static openBackdrop(backdrop: HTMLElement, options?: BungBackdropOptions) {
        backdrop.style.display = "block"
        const a = backdrop.animate([
            { opacity: "0" },
            { opacity: `${options?.backdropOpacity ?? 1}` }
        ], { duration: 200, fill: "forwards" })
        a.addEventListener("finish", () => {
            if (backdrop) backdrop.style.opacity = `${options?.backdropOpacity ?? 1}`
        })
    }
    protected static closeBackdrop(backdrop: HTMLElement) {
        if (window.getComputedStyle(backdrop).opacity === "0") {
            backdrop.remove()
            return
        }
        const a = backdrop.animate([
            { opacity: `${backdrop.style.opacity ?? 1}` },
            { opacity: "0" }
        ], { duration: 200, fill: "forwards" })
        a.addEventListener("finish", () => {
            if (backdrop) backdrop.remove()
        })
    }
}
