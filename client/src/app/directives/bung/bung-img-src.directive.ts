import { Directive, effect, ElementRef, inject, input, SecurityContext } from "@angular/core"
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser"
import { BungIntersectionService } from "../../services/bung/intersection.service"

@Directive({
    selector: "img[bungImgSrc]",
    standalone: false,
})
export class BungImgSrcDirective {
    readonly src = input.required<SafeResourceUrl>({ alias: "bungImgSrc" })
    readonly placeholderSrc = input<SafeResourceUrl | undefined>()
    readonly sharedIntersectionGroup = input<string | undefined>()

    readonly element = inject<ElementRef<HTMLImageElement>>(ElementRef)
    private readonly sanitizer = inject(DomSanitizer)

    private readonly intersectionService = inject(BungIntersectionService)
    
    #intersectionGroupBackup?: string

    constructor() {
        effect(() => {
            const g = this.sharedIntersectionGroup()
            if (g != this.#intersectionGroupBackup) {
                if (this.#intersectionGroupBackup != undefined) this.disposeObserver()
                if (g != undefined) {
                    this.#intersectionGroupBackup = g
                    this.connectToObserver()
                    return
                }
            } else if (g != undefined) return
        })
    }
    on() {
        this.element.nativeElement.src = this.src() as string
    }
    off() {
        this.element.nativeElement.src = this.placeholderSrc() as string
    }
    onIntersectingChanged(intersecting: boolean) {
        if (intersecting) this.on()
        else this.off()
    }
    private disposeObserver() {
        this.intersectionService.unsubscribe(this, this.#intersectionGroupBackup)
        this.#intersectionGroupBackup = undefined
        return
    }
    private connectToObserver() {
        if (this.#intersectionGroupBackup) this.intersectionService.subscribe(this, this.#intersectionGroupBackup)
    }

}
