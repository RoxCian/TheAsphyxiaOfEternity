import { ApplicationRef, ComponentRef, computed, createComponent, EnvironmentInjector, inject, Injector, inputBinding, OutputRefSubscription, Service } from "@angular/core"
import { BungFloatButtonComponent } from "../../components/bung/float-button/float-button.component"
import { BungPopupContainerComponent } from "../../components/bung/popup-container/popup-container.component"
import { BungInsertionComponent } from "../../components/bung/insertion/insertion.component"

type ButtonRecord = {
    button: BungFloatButtonComponent
    element: HTMLButtonElement
    key?: string
    insertionRef: ComponentRef<BungInsertionComponent>
}

@Service()
export class BungFloatButtonService {
    private static buttonLayerTop = document.createElement("div")
    private static buttonContainer: ComponentRef<BungPopupContainerComponent>
    private buttonList: ButtonRecord[] = []

    private readonly envInjector = inject(EnvironmentInjector)
    private readonly injector = inject(Injector)
    private readonly application = inject(ApplicationRef)

    private readonly pendingButtons = new Set<BungFloatButtonComponent>()

    private animatingPromise?: Promise<void>

    // static {
    //     const buttonLayerTop = document.createElement("div")
    //     buttonLayerTop.classList.add("bung-float-button-layer-top")
    //     buttonLayerTop.appendChild(this.floatButtonLayer)
    //     this.floatButtonLayer.classList.add("bung-float-button-layer")
    //     document.body.appendChild(buttonLayerTop)
    // }
    private static initContainer(envInjector: EnvironmentInjector, injector: Injector, application: ApplicationRef) {
        if (this.buttonContainer) return
        this.buttonLayerTop.classList.add("bung-float-button-layer-top")
        document.body.appendChild(this.buttonLayerTop)
        const layerElement: HTMLElement = document.createElement("div")
        layerElement.classList.add("bung-float-button-layer")
        this.buttonLayerTop.appendChild(layerElement)
        const placeholderElement: HTMLElement = document.createElement("div")
        layerElement.appendChild(placeholderElement)
        this.buttonContainer = createComponent(BungPopupContainerComponent, { environmentInjector: envInjector, elementInjector: injector, hostElement: placeholderElement })
        application.attachView(this.buttonContainer.hostView)
    }

    constructor() {
        BungFloatButtonService.initContainer(this.envInjector, this.injector, this.application)
    }

    async register(button: BungFloatButtonComponent, key?: string): Promise<void> {
        if (this.animatingPromise) {
            this.pendingButtons.add(button)
            await this.animatingPromise
            if (!this.pendingButtons.has(button)) return
            this.pendingButtons.delete(button)
        }
        if (key != undefined && this.buttonList.find(r => r.key === key)) {
            button.element.nativeElement.classList.add("hide")
            return
        }
        const element = button.element.nativeElement as HTMLButtonElement
        element.classList.add("float-button-enter")
        let resolver = () => { }
        const animating = new Promise<void>(res => resolver = res)
        this.animatingPromise = animating
        const onAnimationEnd = (e: AnimationEvent) => {
            element.classList.remove("float-button-enter")
            element.removeEventListener("animationend", onAnimationEnd)
            element.removeEventListener("animationcancel", onAnimationEnd)
            resolver()
            clearTimeout(timeout)
            if (this.animatingPromise === animating) this.animatingPromise = undefined
        }
        const timeout = setTimeout(onAnimationEnd, 2000)
        element.addEventListener("animationend", onAnimationEnd)
        element.addEventListener("animationcancel", onAnimationEnd)
        
        const insertionRef = this.createInsertionRef(button)
        this.buttonList.push({ button, element, key, insertionRef })
        await animating
    }
    async unregister(button: BungFloatButtonComponent): Promise<void> {
        if (this.pendingButtons.has(button)) {
            // unregister before register happened
            this.pendingButtons.delete(button)
            return
        }
        for (let i = 0; i < this.buttonList.length; i++) {
            const record = this.buttonList[i]
            if (record.button !== button) continue
            if (this.animatingPromise) await this.animatingPromise
            let resolver = () => { }
            const animating = new Promise<void>(res => resolver = res)
            this.animatingPromise = animating
            record.element.classList.add("float-button-leave")
            this.buttonList.splice(i, 1)
            const vMoveDistance = record.element.getBoundingClientRect().height
            this.setMoveDownDistance(vMoveDistance)
            for (let j = i; j < this.buttonList.length; j++) this.buttonList[j].element.classList.add("float-button-move-down")
            const onAnimationEnd = (e: AnimationEvent) => {
                for (let j = i; j < this.buttonList.length; j++) this.buttonList[j].element.classList.remove("float-button-move-down")
                record.element.removeEventListener("animationend", onAnimationEnd)
                record.element.removeEventListener("animationcancel", onAnimationEnd)
                this.setMoveDownDistance(undefined)
                record.insertionRef.destroy()
                resolver()
                clearTimeout(timeout)
                if (this.animatingPromise === animating) this.animatingPromise = undefined
            }
            const timeout = setTimeout(onAnimationEnd, 2000)
            record.element.addEventListener("animationend", onAnimationEnd)
            record.element.addEventListener("animationcancel", onAnimationEnd)
            await animating
        }
    }

    private setMoveDownDistance(distance: number | undefined) {
        if (distance === undefined) BungFloatButtonService.buttonLayerTop.style.removeProperty("--bung-float-button-move-down")
        else BungFloatButtonService.buttonLayerTop.style.setProperty("--bung-float-button-move-down", `${distance}px`)
    }
    private createInsertionRef(button: BungFloatButtonComponent): ComponentRef<BungInsertionComponent> {
        return BungFloatButtonService.createInsertionRef(button, this.envInjector, this.injector)
    }
    private static createInsertionRef(button: BungFloatButtonComponent, envInjector: EnvironmentInjector, injector: Injector): ComponentRef<BungInsertionComponent> {
        const result = this.buttonContainer.instance.container.createComponent(BungInsertionComponent, { injector, environmentInjector: envInjector })
        result.instance.content.set(button.element.nativeElement)
        return result
    }

}
