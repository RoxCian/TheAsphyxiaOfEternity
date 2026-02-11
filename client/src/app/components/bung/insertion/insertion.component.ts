import { AfterViewInit, Component, ElementRef, OnDestroy, TemplateRef, Type, ViewEncapsulation, computed, contentChildren, effect, inject, input, model, output, signal } from "@angular/core"
import { BungInsertionContent } from "../../../utils/bung"
import { toggleTransform } from "../../../signals/transforms"
import { BungIntersectionService } from "../../../services/bung/intersection.service"
import { BungImgSrcDirective } from "../../../directives/bung/bung-img-src.directive"

@Component({
    selector: "bung-insertion",
    templateUrl: "./insertion.component.html",
    styles: ["bung-insertion\r\n display: grid \r\n > *\r\n  grid-area: 1/1"],
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class BungInsertionComponent implements AfterViewInit, OnDestroy {
    readonly content = model<BungInsertionContent>()
    readonly textContentTag = model<"div" | "p" | "span">("p")
    readonly context = model<any>()
    readonly isEmpty = computed(() => this.content() == undefined)
    readonly isVirtualized = input(false, { transform: toggleTransform })
    readonly virtualizedParam = input<IntersectionObserverInit | undefined>(undefined)
    readonly placeholder = input<BungInsertionContent | undefined>()
    readonly sharedIntersectionGroup = input<string | undefined>()
    readonly viewInited = output()

    private readonly isIntersectedInternal = signal(false)
    readonly isIntersected = this.isIntersectedInternal.asReadonly()
    readonly element: ElementRef<HTMLElement> = inject(ElementRef)

    private readonly intersectionService = inject(BungIntersectionService)

    #observer?: IntersectionObserver
    #intersectionGroupBackup?: string
    #isSharedIntersectionObserver = false

    constructor() {
        effect(() => {
            const content = this.content()
            if (content instanceof HTMLElement || content instanceof SVGElement) this.element.nativeElement.replaceChildren(content)
        })
        effect(() => {
            const g = this.sharedIntersectionGroup()
            this.#isSharedIntersectionObserver = g != undefined
            if (g != this.#intersectionGroupBackup) {
                if (this.#intersectionGroupBackup != undefined) this.disposeObserver()
                if (g != undefined) {
                    this.#intersectionGroupBackup = g
                    this.connectToObserver()
                    return
                }
            } else if (g != undefined) return
            const v = this.isVirtualized()
            const p = this.virtualizedParam()

            this.disposeObserver()
            if (!v) return
            this.createObserver(p)
        })
    }

    ngAfterViewInit() {
        this.viewInited.emit()
    }
    ngOnDestroy() {
        this.disposeObserver()
    }

    protected isTemplateRef(content: BungInsertionContent): content is TemplateRef<any> {
        return content instanceof TemplateRef
    }
    protected isComponentType(content: BungInsertionContent): content is Type<any> {
        return !!content && !(content instanceof TemplateRef) && !(content instanceof HTMLElement || content instanceof SVGElement) && typeof content !== "string"
    }
    protected isString(content: BungInsertionContent): content is string {
        return typeof content === "string"
    }
    onIntersectingChanged(intersecting: boolean) {
        this.isIntersectedInternal.set(intersecting)
    }
    private disposeObserver() {
        if (this.#isSharedIntersectionObserver) {
            this.#isSharedIntersectionObserver = false
            this.intersectionService.unsubscribe(this, this.#intersectionGroupBackup)
            this.#intersectionGroupBackup = undefined
            return
        }
        this.#observer?.unobserve(this.element.nativeElement)
        this.#observer?.disconnect()
        this.#observer = undefined
    }
    private createObserver(params: IntersectionObserverInit | undefined) {
        this.#observer = new IntersectionObserver(e => this.onIntersectingChanged(e[0]?.isIntersecting ?? false), params)
        this.#observer!.observe(this.element.nativeElement)
    }
    private connectToObserver() {
        if (this.#isSharedIntersectionObserver && this.#intersectionGroupBackup) {
            this.intersectionService.subscribe(this, this.#intersectionGroupBackup)
        }
    }
}